// =========================================================================
// PRODUCTOS (DEMOSTRACIÓN) — Calzatodos Group
// -------------------------------------------------------------------------
// Productos de EJEMPLO para comprobar el funcionamiento del catálogo, filtros,
// búsqueda y página de producto. NO representan modelos, precios ni inventario
// reales de las marcas. Reemplaza este arreglo antes del lanzamiento.
//
// Reglas:
//  - "price" y "previousPrice" son OPCIONALES. Si no hay precio, el sitio
//    muestra "Consulta el precio" y oculta el filtro/orden por precio.
//  - "images" es OPCIONAL. Si está vacío, se muestra un placeholder elegante.
//    Para usar fotos reales, coloca archivos en /public/products/ y referencia
//    p. ej. "/products/mi-foto.jpg".
//  - NO se muestra stock numérico. Disponibilidad sujeta a confirmación.
// =========================================================================

import type { Audience } from "./categories";

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string; // slug de la marca (ver data/brands.ts)
  audience: Audience;
  category: string; // slug de categoría (ver data/categories.ts)
  style: string; // slug de estilo
  description: string;
  features: string[];
  materials: string[];
  availableSizes: number[];
  colors: string[];
  price?: number; // USD, opcional
  previousPrice?: number; // USD, opcional (para mostrar ahorro)
  images: string[]; // rutas en /public (vacío = placeholder)
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isExclusive?: boolean;
  warrantyInformation: string;
  careInstructions: string;
  tags: string[]; // palabras relacionadas para búsqueda
}

const DEFAULT_WARRANTY =
  "Garantía por defectos de fabricación, sujeta a las condiciones de cada categoría. Consulta los detalles en tienda.";

export const products: Product[] = [
  {
    id: "p001",
    slug: "sneaker-urbano-mujer-nova",
    sku: "CG-MUJ-SNK-001",
    name: "Sneaker Urbano Nova",
    brand: "north-star",
    audience: "mujer",
    category: "sneakers",
    style: "sneakers",
    description:
      "Zapatilla urbana ligera con diseño moderno, ideal para el día a día. Suela flexible y plantilla acolchada para mayor comodidad.",
    features: ["Suela flexible antideslizante", "Plantilla acolchada", "Peso ligero"],
    materials: ["Textil transpirable", "Sintético"],
    availableSizes: [35, 36, 37, 38, 39, 40],
    colors: ["Blanco", "Negro", "Rosa"],
    price: 39.9,
    images: [],
    isNew: true,
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo. Evitar lavadora y secadora.",
    tags: ["zapatilla", "urbano", "casual", "mujer", "deportivo"],
  },
  {
    id: "p002",
    slug: "sandalia-confort-mujer-brisa",
    sku: "CG-MUJ-SAN-002",
    name: "Sandalia Confort Brisa",
    brand: "kaloa",
    audience: "mujer",
    category: "sandalias",
    style: "sandalias",
    description:
      "Sandalia fresca y cómoda con tiras ajustables. Perfecta para climas cálidos y uso diario.",
    features: ["Tiras ajustables", "Plantilla suave", "Diseño ligero"],
    materials: ["Sintético", "EVA"],
    availableSizes: [35, 36, 37, 38, 39],
    colors: ["Beige", "Negro"],
    price: 24.5,
    images: [],
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo. Secar a la sombra.",
    tags: ["sandalia", "verano", "playa", "mujer", "confort"],
  },
  {
    id: "p003",
    slug: "tacon-elegante-mujer-gala",
    sku: "CG-MUJ-TAC-003",
    name: "Tacón Elegante Gala",
    brand: "cotti",
    audience: "mujer",
    category: "tacones",
    style: "formal",
    description:
      "Tacón de altura media con acabado elegante, ideal para eventos y ocasiones especiales.",
    features: ["Tacón de altura media", "Acabado elegante", "Sujeción firme"],
    materials: ["Sintético premium"],
    availableSizes: [35, 36, 37, 38, 39],
    colors: ["Negro", "Nude"],
    images: [],
    isExclusive: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño seco. Guardar en lugar fresco.",
    tags: ["tacon", "elegante", "fiesta", "formal", "mujer"],
  },
  {
    id: "p004",
    slug: "bota-mujer-andes",
    sku: "CG-MUJ-BOT-004",
    name: "Botín Andes",
    brand: "cotti",
    audience: "mujer",
    category: "botas",
    style: "botas",
    description:
      "Botín versátil con cierre lateral y suela resistente. Combina con looks casuales y urbanos.",
    features: ["Cierre lateral", "Suela resistente", "Forro interior"],
    materials: ["Sintético", "Goma"],
    availableSizes: [35, 36, 37, 38, 39, 40],
    colors: ["Café", "Negro"],
    price: 45.0,
    previousPrice: 55.0,
    images: [],
    isOnSale: true,
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo. No sumergir.",
    tags: ["botin", "bota", "invierno", "urbano", "mujer"],
  },
  {
    id: "p005",
    slug: "baleta-mujer-lino",
    sku: "CG-MUJ-BAL-005",
    name: "Baleta Lino",
    brand: "kaloa",
    audience: "mujer",
    category: "baletas",
    style: "casual",
    description:
      "Baleta ligera y flexible para el uso diario. Comodidad sin renunciar al estilo.",
    features: ["Diseño flexible", "Peso ligero", "Plantilla acolchada"],
    materials: ["Textil", "Sintético"],
    availableSizes: [35, 36, 37, 38, 39],
    colors: ["Negro", "Rojo", "Azul"],
    price: 22.9,
    images: [],
    isNew: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo.",
    tags: ["baleta", "flat", "casual", "mujer", "comodo"],
  },
  {
    id: "p006",
    slug: "sneaker-hombre-metro",
    sku: "CG-HOM-SNK-006",
    name: "Sneaker Metro",
    brand: "north-star",
    audience: "hombre",
    category: "sneakers",
    style: "sneakers",
    description:
      "Sneaker urbano de líneas limpias, cómodo para caminar todo el día. Un básico versátil.",
    features: ["Suela de goma", "Cordones planos", "Diseño transpirable"],
    materials: ["Textil", "Sintético"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    colors: ["Blanco", "Gris", "Negro"],
    price: 42.0,
    images: [],
    isFeatured: true,
    isNew: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo. No usar lavadora.",
    tags: ["sneaker", "urbano", "hombre", "casual", "zapatilla"],
  },
  {
    id: "p007",
    slug: "zapato-formal-hombre-oxford",
    sku: "CG-HOM-FOR-007",
    name: "Zapato Formal Oxford",
    brand: "cotti",
    audience: "hombre",
    category: "formal",
    style: "formal",
    description:
      "Zapato formal estilo Oxford con acabado pulido. Ideal para oficina, eventos y ocasiones formales.",
    features: ["Estilo Oxford", "Acabado pulido", "Suela con tracción"],
    materials: ["Sintético premium"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    colors: ["Negro", "Café"],
    price: 49.9,
    images: [],
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Lustrar con crema para calzado. Guardar con hormas.",
    tags: ["formal", "oficina", "oxford", "hombre", "elegante"],
  },
  {
    id: "p008",
    slug: "bota-outdoor-hombre-sierra",
    sku: "CG-HOM-OUT-008",
    name: "Bota Outdoor Sierra",
    brand: "weinbrenner",
    audience: "hombre",
    category: "outdoor",
    style: "outdoor",
    description:
      "Bota outdoor resistente con suela de alta tracción, pensada para senderismo y trabajo exigente.",
    features: ["Suela de alta tracción", "Refuerzo en puntera", "Construcción resistente"],
    materials: ["Cuero sintético", "Goma"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    colors: ["Café", "Negro"],
    price: 65.0,
    images: [],
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con cepillo suave. Aplicar impermeabilizante.",
    tags: ["outdoor", "senderismo", "bota", "hombre", "aventura", "trabajo"],
  },
  {
    id: "p009",
    slug: "zapato-seguridad-hombre-industria",
    sku: "CG-HOM-SEG-009",
    name: "Zapato de Seguridad Industria",
    brand: "weinbrenner",
    audience: "hombre",
    category: "seguridad",
    style: "seguridad",
    description:
      "Calzado de seguridad con puntera de protección, orientado a entornos industriales. Nivel de protección según especificación del fabricante.",
    features: ["Puntera de protección", "Suela antideslizante", "Construcción reforzada"],
    materials: ["Cuero sintético", "Goma"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    colors: ["Negro"],
    images: [],
    warrantyInformation:
      "Garantía por defectos de fabricación. Las características de protección dependen de la especificación del fabricante; confírmalas en tienda.",
    careInstructions: "Limpiar con paño húmedo. Revisar periódicamente la puntera.",
    tags: ["seguridad", "industrial", "trabajo", "hombre", "puntera"],
  },
  {
    id: "p010",
    slug: "sandalia-hombre-costa",
    sku: "CG-HOM-SAN-010",
    name: "Sandalia Costa",
    brand: "kaloa",
    audience: "hombre",
    category: "sandalias",
    style: "sandalias",
    description:
      "Sandalia cómoda y resistente con tiras ajustables, ideal para clima cálido y uso diario.",
    features: ["Tiras ajustables", "Plantilla ergonómica", "Suela antideslizante"],
    materials: ["Sintético", "EVA"],
    availableSizes: [39, 40, 41, 42, 43],
    colors: ["Negro", "Café"],
    price: 27.9,
    images: [],
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Enjuagar con agua. Secar a la sombra.",
    tags: ["sandalia", "verano", "hombre", "playa", "confort"],
  },
  {
    id: "p011",
    slug: "sneaker-nino-cometa",
    sku: "CG-NIN-SNK-011",
    name: "Sneaker Cometa (Niño)",
    brand: "bubble-gummers",
    audience: "nino",
    category: "sneakers",
    style: "sneakers",
    description:
      "Zapatilla infantil resistente y flexible, con cierre de velcro para facilitar su uso.",
    features: ["Cierre de velcro", "Suela flexible", "Diseño resistente"],
    materials: ["Textil", "Sintético"],
    availableSizes: [28, 29, 30, 31, 32, 33, 34],
    colors: ["Azul", "Rojo"],
    price: 29.9,
    images: [],
    isNew: true,
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo.",
    tags: ["niño", "infantil", "sneaker", "velcro", "escuela"],
  },
  {
    id: "p012",
    slug: "zapato-escolar-nino-clase",
    sku: "CG-NIN-ESC-012",
    name: "Zapato Escolar Clase",
    brand: "bubble-gummers",
    audience: "nino",
    category: "escolar",
    style: "escolar",
    description:
      "Zapato escolar resistente pensado para el uso diario en clases, con suela duradera.",
    features: ["Suela duradera", "Refuerzo en puntera", "Fácil de limpiar"],
    materials: ["Sintético", "Goma"],
    availableSizes: [28, 29, 30, 31, 32, 33, 34, 35],
    colors: ["Negro"],
    price: 26.5,
    images: [],
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo. Lustrar según material.",
    tags: ["escolar", "colegio", "niño", "clases", "regreso a clases"],
  },
  {
    id: "p013",
    slug: "zapato-luces-nina-estrella",
    sku: "CG-NIN-LUZ-013",
    name: "Zapato con Luces Estrella (Niña)",
    brand: "bumixgumer",
    audience: "nina",
    category: "luces",
    style: "sneakers",
    description:
      "Zapatilla infantil con luces LED en la suela que se encienden al caminar. ¡Diversión en cada paso!",
    features: ["Luces LED en la suela", "Cierre de velcro", "Suela flexible"],
    materials: ["Sintético", "Textil"],
    availableSizes: [26, 27, 28, 29, 30, 31, 32],
    colors: ["Rosa", "Blanco"],
    price: 32.9,
    images: [],
    isNew: true,
    isFeatured: true,
    isExclusive: true,
    warrantyInformation:
      "Garantía por defectos de fabricación. El sistema de luces LED tiene una vida útil limitada; consulta condiciones en tienda.",
    careInstructions: "Limpiar con paño húmedo. No sumergir para proteger las luces.",
    tags: ["luces", "led", "niña", "infantil", "sneaker"],
  },
  {
    id: "p014",
    slug: "sandalia-nina-flor",
    sku: "CG-NIN-SAN-014",
    name: "Sandalia Flor (Niña)",
    brand: "bubble-gummers",
    audience: "nina",
    category: "sandalias",
    style: "sandalias",
    description:
      "Sandalia infantil cómoda con cierre ajustable, ideal para el verano y el juego diario.",
    features: ["Cierre ajustable", "Plantilla suave", "Diseño ligero"],
    materials: ["Sintético", "EVA"],
    availableSizes: [24, 25, 26, 27, 28, 29, 30],
    colors: ["Rosa", "Blanco"],
    price: 19.9,
    images: [],
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Enjuagar con agua. Secar a la sombra.",
    tags: ["sandalia", "niña", "infantil", "verano"],
  },
  {
    id: "p015",
    slug: "zapato-infantil-primeros-pasos",
    sku: "CG-INF-CAS-015",
    name: "Primeros Pasos Nube",
    brand: "bubble-gummers",
    audience: "infantil",
    category: "casual",
    style: "casual",
    description:
      "Calzado para primeros pasos, suave y flexible, diseñado para el cuidado de los pies en crecimiento.",
    features: ["Suela flexible", "Materiales suaves", "Cierre fácil"],
    materials: ["Textil suave", "Sintético"],
    availableSizes: [19, 20, 21, 22, 23, 24],
    colors: ["Celeste", "Rosa", "Blanco"],
    price: 21.5,
    images: [],
    isNew: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo.",
    tags: ["infantil", "bebé", "primeros pasos", "gateo"],
  },
  {
    id: "p016",
    slug: "deportivo-mujer-ritmo",
    sku: "CG-MUJ-DEP-016",
    name: "Deportivo Ritmo",
    brand: "power",
    audience: "mujer",
    category: "deportivo",
    style: "deportivo",
    description:
      "Calzado deportivo con amortiguación para entrenamiento y uso diario. Ligero y transpirable.",
    features: ["Amortiguación", "Malla transpirable", "Suela con agarre"],
    materials: ["Malla textil", "EVA", "Goma"],
    availableSizes: [35, 36, 37, 38, 39, 40],
    colors: ["Negro", "Rosa", "Gris"],
    price: 47.9,
    previousPrice: 57.9,
    images: [],
    isOnSale: true,
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Airear tras el uso. Limpiar con paño húmedo.",
    tags: ["deportivo", "running", "gimnasio", "mujer", "entrenamiento"],
  },
  {
    id: "p017",
    slug: "deportivo-hombre-impulso",
    sku: "CG-HOM-DEP-017",
    name: "Deportivo Impulso",
    brand: "power",
    audience: "hombre",
    category: "deportivo",
    style: "deportivo",
    description:
      "Zapatilla deportiva con buena amortiguación y sujeción, pensada para entrenar y correr.",
    features: ["Amortiguación", "Sujeción firme", "Suela con agarre"],
    materials: ["Malla textil", "EVA", "Goma"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    colors: ["Negro", "Azul"],
    price: 49.9,
    images: [],
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Airear tras el uso. Limpiar con paño húmedo.",
    tags: ["deportivo", "running", "gimnasio", "hombre", "entrenamiento"],
  },
  {
    id: "p018",
    slug: "mocasin-hombre-puerto",
    sku: "CG-HOM-MOC-018",
    name: "Mocasín Puerto",
    brand: "cotti",
    audience: "hombre",
    category: "mocasines",
    style: "casual",
    description:
      "Mocasín casual de diseño clásico, cómodo y fácil de usar. Versátil para el día a día.",
    features: ["Diseño sin cordones", "Plantilla acolchada", "Suela flexible"],
    materials: ["Sintético"],
    availableSizes: [39, 40, 41, 42, 43, 44],
    colors: ["Café", "Azul", "Negro"],
    price: 38.9,
    images: [],
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo.",
    tags: ["mocasin", "casual", "hombre", "comodo"],
  },
  {
    id: "p019",
    slug: "casual-mujer-city",
    sku: "CG-MUJ-CAS-019",
    name: "Casual City",
    brand: "north-star",
    audience: "mujer",
    category: "casual",
    style: "casual",
    description:
      "Zapato casual versátil que combina comodidad y estilo para el día a día urbano.",
    features: ["Plantilla acolchada", "Diseño versátil", "Peso ligero"],
    materials: ["Textil", "Sintético"],
    availableSizes: [35, 36, 37, 38, 39, 40],
    colors: ["Blanco", "Beige"],
    images: [],
    isNew: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo.",
    tags: ["casual", "urbano", "mujer", "comodo"],
  },
  {
    id: "p020",
    slug: "bota-nina-lluvia",
    sku: "CG-NIN-BOT-020",
    name: "Botín Lluvia (Niña)",
    brand: "bumixgumer",
    audience: "nina",
    category: "botas",
    style: "botas",
    description:
      "Botín infantil resistente al uso diario, con cierre práctico y suela con buen agarre.",
    features: ["Cierre práctico", "Suela con agarre", "Forro interior"],
    materials: ["Sintético", "Goma"],
    availableSizes: [26, 27, 28, 29, 30, 31, 32],
    colors: ["Rosa", "Morado"],
    price: 28.9,
    images: [],
    isFeatured: true,
    warrantyInformation: DEFAULT_WARRANTY,
    careInstructions: "Limpiar con paño húmedo.",
    tags: ["botin", "niña", "infantil", "invierno"],
  },
];

// -------------------- Helpers de acceso --------------------

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
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

// Productos relacionados (misma categoría o marca, excluyendo el actual).
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.brand === product.brand ||
          p.audience === product.audience)
    )
    .slice(0, limit);
}

// Todas las tallas y colores disponibles (para filtros).
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
