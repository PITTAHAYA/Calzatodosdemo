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
