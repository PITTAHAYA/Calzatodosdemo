// =========================================================================
// PRODUCTOS — Calzatodos Group
// -------------------------------------------------------------------------
// Catálogo real basado en la lista de precios oficial. Estos son los ÚNICOS
// productos con precio del sitio (calzado escolar/formal y sneakers), divididos
// por público: hombre, mujer, niño y niña.
//
// Las marcas (Bubble Gummers, North Star, Power, etc.) NO listan productos ni
// precios: se presentan como galerías en sus páginas de marca.
//
// Precios: pueden ser un valor único (price) o un rango (price = mínimo,
// priceMax = máximo, según talla). Las fotos se recortan de la lista oficial y
// viven en /public/products.
// =========================================================================

import type { Audience } from "./categories";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string; // slug de marca (ver data/brands.ts)
  audience: Audience;
  category: string; // slug de categoría
  style: string; // slug de estilo
  description: string;
  features: string[];
  materials: string[];
  availableSizes: number[];
  colors: string[];
  price?: number; // USD (mínimo si es rango)
  priceMax?: number; // USD (máximo del rango, opcional)
  previousPrice?: number; // opcional
  images: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isExclusive?: boolean;
  warrantyInformation: string;
  careInstructions: string;
  tags: string[];
}

const HOUSE = "calzatodos";
const WARRANTY =
  "Garantía por defectos de fabricación, sujeta a las condiciones de cada categoría. Consulta los detalles en tienda.";

const SIZES = {
  hombre: [38, 39, 40, 41, 42, 43, 44],
  mujer: [34, 35, 36, 37, 38, 39, 40],
  nino: [28, 29, 30, 31, 32, 33, 34, 35],
  nina: [27, 28, 29, 30, 31, 32, 33, 34],
};

// Descripciones base por tipo.
const DESC = {
  formalH:
    "Zapato clásico de cuero sintético para uniforme, trabajo y uso diario. Diseño cómodo, resistente y de acabado prolijo.",
  formalM:
    "Zapato escolar tipo colegial con hebilla, cómodo y resistente para el uso diario. Acabado prolijo y suela antideslizante.",
  sneakerH:
    "Sneaker blanco versátil y liviano, ideal para el uniforme deportivo y el día a día. Suela flexible y plantilla acolchada.",
  sneakerM:
    "Sneaker blanco cómodo y moderno, perfecto para el uniforme deportivo y el uso diario. Ligero y transpirable.",
  escolarNino:
    "Zapato escolar resistente pensado para el uso diario en clases. Suela duradera y fácil de limpiar.",
  escolarNina:
    "Zapato escolar tipo colegial con hebilla, cómodo y resistente para el día a día en clases.",
};

interface Seed {
  name: string;
  audience: Audience;
  category: string;
  style: string;
  color: "Negro" | "Blanco";
  price: number;
  priceMax?: number;
  desc: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

const seeds: Seed[] = [
  // ---------- HOMBRE NEGRO (formal) ----------
  { name: "Mario", audience: "hombre", category: "formal", style: "formal", color: "Negro", price: 35, priceMax: 39, desc: DESC.formalH, isFeatured: true },
  { name: "Danilo", audience: "hombre", category: "formal", style: "formal", color: "Negro", price: 35, priceMax: 39, desc: DESC.formalH },
  { name: "Gustavo", audience: "hombre", category: "formal", style: "formal", color: "Negro", price: 35, priceMax: 39, desc: DESC.formalH },
  { name: "Ignacio", audience: "hombre", category: "formal", style: "formal", color: "Negro", price: 35, priceMax: 39, desc: DESC.formalH, isFeatured: true },

  // ---------- HOMBRE BLANCO (sneakers) ----------
  { name: "Doha", audience: "hombre", category: "sneakers", style: "deportivo", color: "Blanco", price: 34, priceMax: 37, desc: DESC.sneakerH, isFeatured: true },
  { name: "Kepler", audience: "hombre", category: "sneakers", style: "deportivo", color: "Blanco", price: 38, priceMax: 42, desc: DESC.sneakerH, isFeatured: true },
  { name: "Memphis", audience: "hombre", category: "sneakers", style: "deportivo", color: "Blanco", price: 34, priceMax: 37, desc: DESC.sneakerH },
  { name: "Madrid", audience: "hombre", category: "sneakers", style: "deportivo", color: "Blanco", price: 38, priceMax: 42, desc: DESC.sneakerH },

  // ---------- NIÑO (escolar) ----------
  { name: "Rafael", audience: "nino", category: "escolar", style: "escolar", color: "Negro", price: 29, priceMax: 33, desc: DESC.escolarNino, isFeatured: true },
  { name: "Joaquin", audience: "nino", category: "escolar", style: "escolar", color: "Negro", price: 29, priceMax: 33, desc: DESC.escolarNino },
  { name: "Adrian", audience: "nino", category: "escolar", style: "escolar", color: "Negro", price: 29, priceMax: 33, desc: DESC.escolarNino },
  { name: "Tadeo", audience: "nino", category: "escolar", style: "escolar", color: "Negro", price: 29, priceMax: 33, desc: DESC.escolarNino },

  // ---------- MUJER NEGRO (formal / colegial) ----------
  { name: "Nancy", audience: "mujer", category: "formal", style: "formal", color: "Negro", price: 36, desc: DESC.formalM, isFeatured: true },
  { name: "Clara", audience: "mujer", category: "formal", style: "formal", color: "Negro", price: 30, desc: DESC.formalM },
  { name: "Andrea", audience: "mujer", category: "formal", style: "formal", color: "Negro", price: 30, desc: DESC.formalM },
  { name: "Linda", audience: "mujer", category: "formal", style: "formal", color: "Negro", price: 30, desc: DESC.formalM },

  // ---------- MUJER BLANCO (sneakers) ----------
  { name: "Roma", audience: "mujer", category: "sneakers", style: "deportivo", color: "Blanco", price: 34, priceMax: 37, desc: DESC.sneakerM, isFeatured: true },
  { name: "Valencia", audience: "mujer", category: "sneakers", style: "deportivo", color: "Blanco", price: 34, priceMax: 37, desc: DESC.sneakerM },
  { name: "Salem", audience: "mujer", category: "sneakers", style: "deportivo", color: "Blanco", price: 34, priceMax: 37, desc: DESC.sneakerM, isNew: true, isFeatured: true },
  { name: "Sidney", audience: "mujer", category: "sneakers", style: "deportivo", color: "Blanco", price: 34, priceMax: 37, desc: DESC.sneakerM, isNew: true, isFeatured: true },

  // ---------- NIÑA (escolar) ----------
  { name: "Maite", audience: "nina", category: "escolar", style: "escolar", color: "Negro", price: 26, priceMax: 30, desc: DESC.escolarNina, isFeatured: true },
  { name: "Claudia", audience: "nina", category: "escolar", style: "escolar", color: "Negro", price: 26, priceMax: 30, desc: DESC.escolarNina },
  { name: "Ana", audience: "nina", category: "escolar", style: "escolar", color: "Negro", price: 26, priceMax: 30, desc: DESC.escolarNina },
  { name: "Domenica", audience: "nina", category: "escolar", style: "escolar", color: "Negro", price: 26, priceMax: 30, desc: DESC.escolarNina },
];

function featuresFor(s: Seed): string[] {
  if (s.category === "sneakers")
    return ["Suela flexible antideslizante", "Plantilla acolchada", "Diseño liviano y transpirable"];
  return ["Cuero sintético de fácil limpieza", "Suela antideslizante", "Diseño cómodo y resistente"];
}

function tagsFor(s: Seed): string[] {
  const base = [s.name.toLowerCase(), s.audience, s.category, s.color.toLowerCase()];
  if (s.category === "sneakers") base.push("sneaker", "blanco", "deportivo", "uniforme");
  if (s.category === "formal") base.push("formal", "colegial", "uniforme", "clasico");
  if (s.category === "escolar") base.push("escolar", "colegio", "clases", "uniforme", "regreso a clases");
  return base;
}

const slug = (n: string) =>
  n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const products: Product[] = seeds.map((s, i) => ({
  id: `p${String(i + 1).padStart(3, "0")}`,
  slug: slug(s.name),
  sku: `CG-${slug(s.name).toUpperCase()}`,
  name: s.name,
  brand: HOUSE,
  audience: s.audience,
  category: s.category,
  style: s.style,
  description: s.desc,
  features: featuresFor(s),
  materials: s.category === "sneakers" ? ["Sintético", "Textil", "Goma"] : ["Cuero sintético", "Goma"],
  availableSizes: SIZES[s.audience as keyof typeof SIZES] ?? SIZES.hombre,
  colors: [s.color],
  price: s.price,
  priceMax: s.priceMax,
  images: [`/products/${slug(s.name)}.jpg`],
  isNew: s.isNew,
  isFeatured: s.isFeatured,
  warrantyInformation: WARRANTY,
  careInstructions:
    s.category === "sneakers"
      ? "Limpiar con paño húmedo. Airear tras el uso. Evitar lavadora."
      : "Limpiar con paño húmedo. Lustrar según el material.",
  tags: tagsFor(s),
}));

// -------------------- Helpers de acceso --------------------

export function getProduct(slugStr: string): Product | undefined {
  return products.find((p) => p.slug === slugStr);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export function getProductsByAudience(audience: Audience): Product[] {
  return products.filter((p) => p.audience === audience);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getProductsByStyle(styleSlug: string): Product[] {
  return products.filter((p) => p.style === styleSlug);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brand === brandSlug);
}

export function getSaleProducts(): Product[] {
  return products.filter((p) => p.isOnSale);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.audience === product.audience)
    )
    .slice(0, limit);
}

export function allSizes(): number[] {
  const set = new Set<number>();
  products.forEach((p) => p.availableSizes.forEach((s) => set.add(s)));
  return Array.from(set).sort((a, b) => a - b);
}

export function allColors(): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}

export function hasAnyPrices(): boolean {
  return products.some((p) => typeof p.price === "number");
}
