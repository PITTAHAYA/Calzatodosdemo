// Verificación de Cloudflare Turnstile ("No soy un robot") en el servidor.
// Si TURNSTILE_SECRET_KEY no está definido, la verificación se omite para
// que los formularios sigan funcionando (desarrollo o antes de configurarlo).

import "server-only";

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
    if (ip && ip !== "anon") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    // Si Cloudflare no responde, no bloqueamos al cliente: quedan el
    // honeypot y el límite de envíos como protección.
    console.error("[turnstile] verificación falló:", err);
    return true;
  }
}
