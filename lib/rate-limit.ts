// Limitador de solicitudes simple en memoria (protección básica anti-spam).
// Nota: en despliegues serverless con múltiples instancias, este límite es por
// instancia. Para producción a gran escala, usa un store compartido (KV/Redis).

const buckets = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  key: string;
  limit?: number; // solicitudes permitidas por ventana
  windowMs?: number; // duración de la ventana
}

export function rateLimit({
  key,
  limit = 5,
  windowMs = 60_000,
}: RateLimitOptions): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}
