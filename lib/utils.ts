// Utilidades generales.

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value?: number): string {
  if (typeof value !== "number") return "Consulta el precio";
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

// Etiqueta de precio: valor único, rango ("$34,00 – $37,00") o "Consulta el precio".
export function priceLabel(p: { price?: number; priceMax?: number }): string {
  if (typeof p.price !== "number") return "Consulta el precio";
  if (typeof p.priceMax === "number" && p.priceMax !== p.price) {
    return `${formatPrice(p.price)} – ${formatPrice(p.priceMax)}`;
  }
  return formatPrice(p.price);
}

// Color de muestra (swatch) a partir del nombre en español.
const COLOR_HEX: Record<string, string> = {
  negro: "#141414",
  blanco: "#ffffff",
  gris: "#9ca3af",
  rosa: "#f7a8c4",
  azul: "#2563eb",
  celeste: "#7dd3fc",
  café: "#7c4a1e",
  cafe: "#7c4a1e",
  beige: "#e3d5b8",
  nude: "#e6c8b5",
  rojo: "#dc2626",
  verde: "#16a34a",
  morado: "#7c3aed",
  naranja: "#f97316",
  amarillo: "#facc15",
};
export function colorHex(name: string): string {
  return COLOR_HEX[name.trim().toLowerCase()] ?? "#9ca3af";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.calzatodos.com"
  );
}

export function absoluteUrl(path: string): string {
  const base = siteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
