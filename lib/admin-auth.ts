// =========================================================================
// ADMIN AUTH — sesión firmada con cookie HTTP-only
// -------------------------------------------------------------------------
// Variables de entorno requeridas (en .env):
//
//   ADMIN_USER              usuario
//   ADMIN_PASSWORD_HASH     hash pbkdf2 generado con `node scripts/hash-password.mjs`
//                           formato: pbkdf2$<iter>$<saltB64>$<hashB64>
//   ADMIN_SESSION_SECRET    cadena larga y aleatoria (mín. 32 chars)
//
// El token es "<payloadB64>.<hmacB64>" y expira en 8 horas. Se guarda en la
// cookie `admin_session` con flags HttpOnly / Secure (en prod) / SameSite=Lax.
// =========================================================================

import "server-only";
import { cookies } from "next/headers";
import { createHmac, pbkdf2Sync, timingSafeEqual, randomBytes } from "node:crypto";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 horas

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "Falta ADMIN_SESSION_SECRET (mínimo 16 chars). Configúralo en tu .env."
    );
  }
  return s;
}

function b64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", getSecret()).update(payload).digest());
}

interface SessionPayload {
  u: string;
  exp: number;
}

export function createSessionToken(username: string): {
  token: string;
  maxAge: number;
} {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payloadStr = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = sign(payloadStr);
  return { token: `${payloadStr}.${sig}`, maxAge: SESSION_TTL_SECONDS };
}

export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadStr, sig] = parts;
  const expected = sign(payloadStr);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(payloadStr).toString("utf8")) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
    if (typeof payload.u !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

// -------------------- Verificación de contraseña --------------------

export function hashPassword(password: string, iterations = 200_000): string {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  return `pbkdf2$${iterations}$${b64url(salt)}$${b64url(hash)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 1000) return false;
  const salt = fromB64url(parts[2]);
  const expected = fromB64url(parts[3]);
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, "sha256");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USER;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !expectedHash) return false;
  // Comparación de usuario en tiempo constante para evitar filtrar existencia.
  const a = Buffer.from(username);
  const b = Buffer.from(expectedUser);
  const userOk = a.length === b.length && timingSafeEqual(a, b);
  const passOk = verifyPassword(password, expectedHash);
  return userOk && passOk;
}

// -------------------- Helpers de sesión en request --------------------

export async function getCurrentAdmin(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  return session?.u ?? null;
}

export async function setSessionCookie(username: string): Promise<void> {
  const { token, maxAge } = createSessionToken(username);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
