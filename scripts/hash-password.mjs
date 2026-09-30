#!/usr/bin/env node
// Genera un hash pbkdf2 para ADMIN_PASSWORD_HASH.
// Uso:  node scripts/hash-password.mjs "MiClaveSegura"
import { pbkdf2Sync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/hash-password.mjs "tuContraseña"');
  process.exit(1);
}

const iterations = 200_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");

const b64url = (buf) =>
  buf.toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

const out = `pbkdf2$${iterations}$${b64url(salt)}$${b64url(hash)}`;
console.log("\nAgrega esto a tu archivo .env:\n");
console.log(`ADMIN_PASSWORD_HASH=${out}`);
console.log("\nY también, si aún no lo has hecho:");
console.log(`ADMIN_USER=admin`);
console.log(`ADMIN_SESSION_SECRET=${b64url(randomBytes(32))}`);
console.log("");
