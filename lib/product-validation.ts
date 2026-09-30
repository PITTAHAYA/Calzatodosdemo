// =========================================================================
// VALIDACIÓN Y SANEAMIENTO DE PRODUCTOS
// -------------------------------------------------------------------------
// Dos responsabilidades:
//   1. validateProductInput(): reglas que el panel exige ANTES de guardar.
//      Devuelve errores por campo en lugar de lanzar excepciones.
//   2. sanitizeProduct(): red de seguridad al LEER. Cualquier dato raro que
//      llegue desde KV/JSON (editado a mano, versión vieja, etc.) se repara
//      o se descarta para que el sitio público nunca se caiga.
//   3. auditProduct(): avisos de calidad (no bloquean) para el panel.
// =========================================================================

import type { Product } from "@/data/products";
import { audiences, categories, styles } from "@/data/categories";
import { brands } from "@/data/brands";

export const AUDIENCE_VALUES = audiences.map((a) => a.value);
export const CATEGORY_VALUES = categories.map((c) => c.slug);
export const STYLE_VALUES = Array.from(
  new Set([...styles.map((s) => s.slug), "formal", "escolar", "deportivo", "urbano", "casual"])
);
export const BRAND_VALUES = brands.map((b) => b.slug);

export const FALLBACK_IMAGE = "/logo/calzatodos-group.png";

export type FieldErrors = Partial<Record<keyof Product | "form", string>>;

const MIN_SIZE = 15;
const MAX_SIZE = 50;
const MAX_PRICE = 10_000;

function isImageUrl(s: string): boolean {
  return s.startsWith("/") || /^https:\/\/[^\s]+$/.test(s);
}

export function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/** Reglas duras: si hay errores, NO se guarda. */
export function validateProductInput(p: Partial<Product>): FieldErrors {
  const e: FieldErrors = {};
  const name = (p.name ?? "").trim();
  if (name.length < 2) e.name = "El nombre es obligatorio (mínimo 2 letras).";
  else if (name.length > 120) e.name = "El nombre es demasiado largo (máx. 120).";

  if (p.audience && !AUDIENCE_VALUES.includes(p.audience))
    e.audience = "Público no válido.";
  if (p.category && !CATEGORY_VALUES.includes(p.category))
    e.category = "Esa categoría no existe en el sitio.";
  if (p.brand && !BRAND_VALUES.includes(p.brand))
    e.brand = "Esa marca no existe en el sitio.";

  const checkPrice = (v: number | undefined, key: "price" | "priceMax" | "previousPrice") => {
    if (v === undefined) return;
    if (!Number.isFinite(v) || v <= 0) e[key] = "Debe ser un número mayor a 0.";
    else if (v > MAX_PRICE) e[key] = `Parece un error: máximo $${MAX_PRICE}.`;
  };
  checkPrice(p.price, "price");
  checkPrice(p.priceMax, "priceMax");
  checkPrice(p.previousPrice, "previousPrice");

  if (p.priceMax !== undefined && p.price === undefined && !e.priceMax)
    e.priceMax = "Pon primero el precio base.";
  if (p.priceMax !== undefined && p.price !== undefined && !e.priceMax && p.priceMax <= p.price)
    e.priceMax = "El precio máximo debe ser mayor que el precio base.";
  if (p.previousPrice !== undefined && p.price !== undefined && !e.previousPrice && p.previousPrice <= p.price)
    e.previousPrice = "El precio anterior debe ser mayor que el actual (si no, la oferta no es real).";

  const images = p.images ?? [];
  if (images.length === 0) e.images = "Agrega al menos una foto.";
  else if (images.some((s) => !isImageUrl(s))) e.images = "Hay una foto con dirección inválida.";
  else if (images.length > 12) e.images = "Máximo 12 fotos por producto.";

  const sizes = p.availableSizes ?? [];
  if (sizes.some((s) => s < MIN_SIZE || s > MAX_SIZE))
    e.availableSizes = `Las tallas deben estar entre ${MIN_SIZE} y ${MAX_SIZE}.`;

  if ((p.description ?? "").length > 2000) e.description = "Descripción demasiado larga (máx. 2000).";
  return e;
}

// -------------------- Saneamiento al leer --------------------

const str = (v: unknown, fb = "") => (typeof v === "string" ? v : fb);
const strArr = (v: unknown) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];
const num = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? v : undefined;
const bool = (v: unknown) => (v === true ? true : undefined);

/**
 * Repara un producto venido del almacenamiento. Devuelve null si ni siquiera
 * tiene id/slug/nombre (no se puede mostrar sin romper rutas).
 */
export function sanitizeProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = str(r.id).trim();
  const name = str(r.name).trim();
  const slug = slugify(str(r.slug) || name);
  if (!id || !name || !slug) return null;

  const audience = AUDIENCE_VALUES.includes(r.audience as Product["audience"])
    ? (r.audience as Product["audience"])
    : "hombre";
  let images = strArr(r.images).filter(isImageUrl);
  if (images.length === 0) images = [FALLBACK_IMAGE];

  const price = num(r.price);
  let priceMax = num(r.priceMax);
  if (priceMax !== undefined && (price === undefined || priceMax <= price)) priceMax = undefined;

  return {
    id,
    slug,
    sku: str(r.sku) || `CG-${slug.toUpperCase()}`,
    name,
    brand: str(r.brand) || "calzatodos",
    audience,
    category: str(r.category) || "casual",
    style: str(r.style) || "casual",
    description: str(r.description),
    features: strArr(r.features),
    materials: strArr(r.materials),
    availableSizes: Array.isArray(r.availableSizes)
      ? (r.availableSizes as unknown[])
          .map(Number)
          .filter((n) => Number.isFinite(n) && n >= MIN_SIZE && n <= MAX_SIZE)
      : [],
    colors: strArr(r.colors),
    price,
    priceMax,
    previousPrice: num(r.previousPrice),
    images,
    isNew: bool(r.isNew),
    isFeatured: bool(r.isFeatured),
    isOnSale: bool(r.isOnSale),
    isExclusive: bool(r.isExclusive),
    warrantyInformation: str(r.warrantyInformation),
    careInstructions: str(r.careInstructions),
    tags: strArr(r.tags),
  };
}

// -------------------- Auditoría de calidad --------------------

export type IssueLevel = "error" | "warn";
export interface ProductIssue {
  level: IssueLevel;
  code: string;
  message: string;
}

export function isPlaceholderImage(src: string | undefined): boolean {
  return !src || src === FALLBACK_IMAGE;
}

/** Avisos que no impiden guardar pero afectan ventas o SEO. */
export function auditProduct(p: Product): ProductIssue[] {
  const out: ProductIssue[] = [];
  if (typeof p.price !== "number")
    out.push({ level: "warn", code: "sin-precio", message: "Sin precio: el cliente tendrá que preguntar." });
  if (isPlaceholderImage(p.images[0]))
    out.push({ level: "error", code: "sin-foto", message: "Sin foto propia." });
  if (!BRAND_VALUES.includes(p.brand))
    out.push({ level: "error", code: "marca", message: `La marca "${p.brand}" no existe; su página de marca no lo mostrará.` });
  if (!CATEGORY_VALUES.includes(p.category))
    out.push({ level: "error", code: "categoria", message: `La categoría "${p.category}" no existe; no aparecerá en los filtros.` });
  if (p.availableSizes.length === 0)
    out.push({ level: "warn", code: "sin-tallas", message: "No tiene tallas marcadas." });
  if (p.isOnSale && !p.previousPrice)
    out.push({ level: "warn", code: "oferta-sin-anterior", message: "Marcado en oferta pero sin precio anterior tachado." });
  if (p.previousPrice && p.price && p.previousPrice <= p.price)
    out.push({ level: "error", code: "oferta-falsa", message: "El precio anterior no es mayor que el actual." });
  if (p.description.trim().length < 20)
    out.push({ level: "warn", code: "descripcion", message: "Descripción muy corta (ayuda a vender y al SEO)." });
  return out;
}
