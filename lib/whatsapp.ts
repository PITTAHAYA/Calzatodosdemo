// =========================================================================
// Constructores de enlaces de WhatsApp
// -------------------------------------------------------------------------
// Todos los enlaces usan https://wa.me/<number> con el mensaje codificado.
// =========================================================================

import { site, whatsappMessages } from "@/data/site-content";
import type { Product } from "@/data/products";
import { getBrandByName, getBrand } from "@/data/brands";

const BASE = `https://wa.me/${site.whatsapp.number}`;

function buildUrl(message: string): string {
  return `${BASE}?text=${encodeURIComponent(message)}`;
}

// Mensaje general.
export function whatsappGeneral(): string {
  return buildUrl(whatsappMessages.general);
}

// Mensaje personalizado libre.
export function whatsappCustom(message: string): string {
  return buildUrl(message);
}

// Mensaje desde un producto (versión básica).
export function whatsappProduct(product: Pick<Product, "name" | "sku">): string {
  const msg = `Hola Calzatodos Group, estoy interesado en ${product.name}, código ${product.sku}. Quisiera consultar disponibilidad, tallas, colores y el local donde puedo encontrarlo.`;
  return buildUrl(msg);
}

// Mensaje desde un producto con talla/color seleccionados y URL.
export function whatsappProductDetailed(opts: {
  name: string;
  sku: string;
  size?: number | null;
  color?: string | null;
  url?: string;
}): string {
  const parts = [
    `Hola Calzatodos Group, estoy interesado en ${opts.name}, código ${opts.sku}.`,
  ];
  if (opts.size) parts.push(`Talla: ${opts.size}.`);
  if (opts.color) parts.push(`Color: ${opts.color}.`);
  parts.push(
    "Quisiera consultar disponibilidad y el local donde puedo encontrarlo."
  );
  if (opts.url) parts.push(`Producto: ${opts.url}`);
  return buildUrl(parts.join(" "));
}

// Mensaje mayorista.
export function whatsappWholesale(city?: string): string {
  const cityText = city && city.trim() ? city.trim() : "[CIUDAD]";
  const msg = `Hola Calzatodos Group, estoy interesado en realizar compras al por mayor. Mi negocio se encuentra en ${cityText} y quisiera conocer sus marcas, condiciones y catálogo mayorista.`;
  return buildUrl(msg);
}

// Mensaje sobre una tienda específica.
export function whatsappStore(storeName: string): string {
  const msg = `Hola Calzatodos Group, quisiera información sobre su local de ${storeName} (disponibilidad, horarios y productos).`;
  return buildUrl(msg);
}

// Mensaje sobre una marca.
export function whatsappBrand(brandName: string): string {
  const msg = `Hola Calzatodos Group, quisiera conocer los productos disponibles de la marca ${brandName}.`;
  return buildUrl(msg);
}

// Utilidad: dado el slug de marca de un producto, devolver nombre legible.
export function brandDisplayName(slug: string): string {
  return getBrand(slug)?.name ?? slug;
}

export { getBrandByName };
