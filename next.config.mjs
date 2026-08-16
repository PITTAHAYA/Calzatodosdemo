/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// -------------------------------------------------------------------------
// Content Security Policy
// -------------------------------------------------------------------------
// Restringe de dónde puede cargar recursos el sitio. Se permiten:
//  - Recursos propios ('self') e imágenes locales / https.
//  - iframes de Instagram y Google Maps (embeds usados en el sitio).
//  - Estilos y scripts en línea que Next.js y Framer Motion necesitan.
// En desarrollo se añaden 'unsafe-eval' y websockets para el HMR.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src 'self' https://www.instagram.com https://maps.google.com https://www.google.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Cabeceras de seguridad aplicadas a todas las rutas.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HSTS solo en producción (evita forzar https en localhost durante el dev).
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

const nextConfig = {
  reactStrictMode: true,
  // No revelar la versión de Next.js en la cabecera de respuesta.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Los productos de demostración usan imágenes locales en /public.
      // Agrega aquí los dominios de tu CDN cuando cargues fotografías reales.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
