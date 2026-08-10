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
  nsUrban:
    "Sneaker urbano de North Star con diseño limpio y suela de goma. Versátil para el día a día, combina con todo.",
  nsSkate:
    "Sneaker de North Star con estilo skate: silueta robusta, refuerzos laterales y suela de goma con buen agarre.",
  powerRun:
    "Calzado deportivo Power con amortiguación y malla transpirable, pensado para entrenar, correr y el uso diario.",
  bgKids:
    "Sneaker infantil de Bubble Gummers con luces en la suela y cierre de velcro. Divertido, liviano y fácil de poner.",
  bgHigh:
    "Sneaker infantil de caña alta de Bubble Gummers, con buen soporte, cierre de velcro y diseño llamativo.",
};

interface Seed {
  name: string;
  audience: Audience;
  category: string;
  style: string;
  color: string;
  price: number;
  priceMax?: number;
  desc: string;
  isNew?: boolean;
  isFeatured?: boolean;
  // Marca (por defecto la casa) e imagen/slug propios para modelos de marca.
  brand?: string;
  slug?: string;
  sizes?: number[];
  extraColors?: string[];
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

  // =====================================================================
  // NORTH STAR — sneakers urbanos
  // =====================================================================
  { name: "New York", slug: "new-york", brand: "north-star", audience: "hombre", category: "sneakers", style: "sneakers", color: "Blanco", extraColors: ["Gris", "Azul"], price: 64.99, desc: DESC.nsUrban, isNew: true, isFeatured: true },
  { name: "NS 53", slug: "ns-53", brand: "north-star", audience: "hombre", category: "sneakers", style: "sneakers", color: "Blanco", extraColors: ["Gris"], price: 69.99, desc: DESC.nsUrban, isNew: true },
  { name: "Skater Chunk", slug: "skater-chunk", brand: "north-star", audience: "hombre", category: "sneakers", style: "sneakers", color: "Negro", price: 69.99, desc: DESC.nsSkate, isFeatured: true },

  // =====================================================================
  // POWER — deportivo / running
  // =====================================================================
  { name: "Fizz 500", slug: "fizz-500", brand: "power", audience: "hombre", category: "deportivo", style: "deportivo", color: "Gris", extraColors: ["Negro"], price: 64.99, desc: DESC.powerRun, isNew: true, isFeatured: true },
  { name: "Wave Vital 2", slug: "wave-vital-2", brand: "power", audience: "hombre", category: "deportivo", style: "deportivo", color: "Gris", price: 64.99, desc: DESC.powerRun },
  { name: "Energy Firefly 100", slug: "energy-firefly-100", brand: "power", audience: "mujer", category: "deportivo", style: "deportivo", color: "Blanco", price: 59.99, desc: DESC.powerRun, isNew: true, isFeatured: true },

  // =====================================================================
  // BUBBLE GUMMERS — infantil
  // =====================================================================
  { name: "Fabulous", slug: "fabulous", brand: "bubble-gummers", audience: "nino", category: "luces", style: "sneakers", color: "Negro", price: 49.99, desc: DESC.bgKids, sizes: [26, 27, 28, 29, 30, 31, 32], isNew: true, isFeatured: true },
  { name: "Eyad", slug: "eyad", brand: "bubble-gummers", audience: "nino", category: "luces", style: "sneakers", color: "Azul", extraColors: ["Rojo"], price: 49.99, desc: DESC.bgKids, sizes: [26, 27, 28, 29, 30, 31, 32], isFeatured: true },
  { name: "Dabble", slug: "dabble", brand: "bubble-gummers", audience: "nina", category: "luces", style: "sneakers", color: "Rosa", extraColors: ["Celeste", "Blanco"], price: 44.99, desc: DESC.bgKids, sizes: [25, 26, 27, 28, 29, 30, 31], isNew: true },
  { name: "Demian", slug: "demian", brand: "bubble-gummers", audience: "nina", category: "luces", style: "sneakers", color: "Azul", extraColors: ["Rosa"], price: 44.99, desc: DESC.bgKids, sizes: [25, 26, 27, 28, 29, 30, 31], isFeatured: true },
  { name: "Neon", slug: "neon", brand: "bubble-gummers", audience: "nina", category: "luces", style: "sneakers", color: "Rosa", extraColors: ["Blanco", "Morado"], price: 44.99, desc: DESC.bgKids, sizes: [25, 26, 27, 28, 29, 30, 31] },
  { name: "Centennial", slug: "centennial", brand: "bubble-gummers", audience: "nina", category: "sneakers", style: "sneakers", color: "Rosa", extraColors: ["Blanco"], price: 44.99, desc: DESC.bgHigh, sizes: [25, 26, 27, 28, 29, 30, 31], isNew: true },
];

function featuresFor(s: Seed): string[] {
  if (s.category === "luces")
    return ["Luces LED en la suela", "Cierre de velcro", "Suela flexible y liviana"];
  if (s.category === "deportivo")
    return ["Amortiguación", "Malla transpirable", "Suela con buen agarre"];
  if (s.category === "sneakers")
    return ["Suela flexible antideslizante", "Plantilla acolchada", "Diseño liviano y transpirable"];
  return ["Cuero sintético de fácil limpieza", "Suela antideslizante", "Diseño cómodo y resistente"];
}

function tagsFor(s: Seed): string[] {
  const base = [
    s.name.toLowerCase(),
    s.audience,
    s.category,
    s.color.toLowerCase(),
    ...(s.extraColors ?? []).map((c) => c.toLowerCase()),
  ];
  if (s.brand) base.push(s.brand.replace(/-/g, " "));
  if (s.category === "sneakers") base.push("sneaker", "urbano", "casual");
  if (s.category === "deportivo") base.push("deportivo", "running", "gimnasio", "entrenamiento");
  if (s.category === "luces") base.push("luces", "led", "infantil", "niños");
  if (s.category === "formal") base.push("formal", "colegial", "uniforme", "clasico");
  if (s.category === "escolar") base.push("escolar", "colegio", "clases", "uniforme", "regreso a clases");
  return base;
}

const slug = (n: string) =>
  n
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const products: Product[] = seeds.map((s, i) => {
  const sl = s.slug ?? slug(s.name);
  const brand = s.brand ?? HOUSE;
  const prefix = brand === HOUSE ? "CG" : brand.slice(0, 2).toUpperCase();
  return {
    id: `p${String(i + 1).padStart(3, "0")}`,
    slug: sl,
    sku: `${prefix}-${sl.toUpperCase()}`,
    name: s.name,
    brand,
    audience: s.audience,
    category: s.category,
    style: s.style,
    description: s.desc,
    features: featuresFor(s),
    materials:
      s.category === "formal" || s.category === "escolar"
        ? ["Cuero sintético", "Goma"]
        : ["Sintético", "Textil", "Goma"],
    availableSizes: s.sizes ?? SIZES[s.audience as keyof typeof SIZES] ?? SIZES.hombre,
    colors: [s.color, ...(s.extraColors ?? [])],
    price: s.price,
    priceMax: s.priceMax,
    images: [`/products/${sl}.jpg`],
    isNew: s.isNew,
    isFeatured: s.isFeatured,
    warrantyInformation: WARRANTY,
    careInstructions:
      s.category === "formal" || s.category === "escolar"
        ? "Limpiar con paño húmedo. Lustrar según el material."
        : "Limpiar con paño húmedo. Airear tras el uso. Evitar lavadora.",
    tags: tagsFor(s),
  };
});

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
