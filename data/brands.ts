// =========================================================================
// MARCAS — Calzatodos Group
// -------------------------------------------------------------------------
// Marcas internacionales distribuidas y marcas propias. Para agregar una
// nueva marca, añade un objeto a este arreglo. El campo "logo" es opcional;
// mientras no exista un logotipo autorizado se muestra un placeholder con el
// nombre. NO descargues logotipos de terceros sin autorización.
// =========================================================================

export type BrandType = "internacional" | "propia";

export interface Brand {
  slug: string;
  name: string;
  type: BrandType;
  tagline: string;
  description: string;
  // Ruta a un logo local en /public/brands/... (opcional).
  logo?: string;
  // Imagen destacada opcional para la cabecera de la página de marca.
  cover?: string;
  // Galería de fotos (lo que vende la marca). Sin precios ni listado de modelos.
  gallery?: string[];
  // Marca interna (casa): no se muestra en la vitrina de marcas ni en menús.
  hidden?: boolean;
}

export const brands: Brand[] = [
  {
    slug: "bubble-gummers",
    name: "Bubble Gummers",
    type: "internacional",
    tagline: "Diversión para los más pequeños",
    description:
      "Calzado infantil pensado para el juego, el confort y el crecimiento sano de los niños.",
    logo: "/brands/bubble-gummers.gif",
    gallery: [
      "/brand-gallery/bubble-gummers-2.jpg",
      "/brand-gallery/bubble-gummers-3.jpg",
      "/brand-gallery/bubble-gummers-1.jpg",
      "/brand-gallery/bubble-gummers-4.jpg",
      "/brand-gallery/bubble-gummers-muneco.png",
    ],
  },
  {
    slug: "north-star",
    name: "North Star",
    type: "internacional",
    tagline: "Estilo juvenil y urbano",
    description:
      "Sneakers y casuales con actitud, ideales para el día a día de jóvenes y adultos.",
    logo: "/brands/north-star.png",
    gallery: ["/brand-gallery/north-star-1.jpg", "/brand-gallery/north-star-2.jpg"],
  },
  {
    slug: "power",
    name: "Power",
    type: "internacional",
    tagline: "Energía deportiva",
    description:
      "Calzado deportivo diseñado para el rendimiento, el entrenamiento y el movimiento.",
    logo: "/brands/power.png",
    gallery: ["/brand-gallery/power-1.jpg"],
  },
  {
    slug: "weinbrenner",
    name: "Weinbrenner",
    type: "internacional",
    tagline: "Resistencia y outdoor",
    description:
      "Botas y calzado outdoor construidos para durar y acompañar la aventura y el trabajo.",
    gallery: ["/brand-gallery/weinbrenner-1.jpg"],
  },
  {
    slug: "bumixgumer",
    name: "Bumixgumer",
    type: "propia",
    tagline: "Diseñado para niños",
    description:
      "Marca propia de Calzatodos Group, con diseños coloridos y resistentes pensados para los niños.",
    logo: "/brands/bumixgumer.jpg",
    gallery: ["/brand-gallery/bumixgumer-1.jpg", "/brand-gallery/bumixgumer-2.jpg"],
  },
  {
    slug: "cotti",
    name: "Cotti",
    type: "propia",
    tagline: "Lux Man Shoes",
    description:
      "Marca propia de Calzatodos Group enfocada en calzado masculino elegante, con estilo y comodidad.",
    logo: "/brands/cotti.jpg",
    gallery: [
      "/brand-gallery/cotti-mood.jpg",
      "/lifestyle/zapatos-5.jpg",
      "/lifestyle/botas-2.jpg",
    ],
  },
  {
    slug: "my-athletic",
    name: "My Athletic",
    type: "propia",
    tagline: "Energía deportiva propia",
    description:
      "Marca propia de Calzatodos Group orientada al calzado deportivo y de rendimiento para toda la familia.",
    logo: "/brands/my-athletic.png",
    gallery: [
      "/brand-gallery/my-athletic-1.jpg",
      "/lifestyle/zapatos-1.jpg",
      "/lifestyle/zapatos-4.jpg",
    ],
  },
  {
    slug: "kaloa",
    name: "Kaloa",
    type: "propia",
    tagline: "Frescura para toda la familia",
    description:
      "Diseños frescos y versátiles para acompañar cada etapa de la familia, con estilo y comodidad.",
    gallery: [
      "/lifestyle/zapatos-2.jpg",
      "/lifestyle/zapatos-1.jpg",
      "/lifestyle/zapatos-3.jpg",
    ],
  },
  {
    // Marca de la casa: agrupa el catálogo con precios. No se muestra en la
    // vitrina de marcas ni en los menús (hidden), pero sí como sello en los
    // productos.
    slug: "calzatodos",
    name: "Calzatodos Group",
    type: "propia",
    tagline: "Calzado para toda la familia",
    description:
      "El calzado de la casa: modelos escolares, formales y sneakers para toda la familia, disponibles en nuestros locales.",
    logo: "/logo/calzatodos-group.png",
    hidden: true,
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getBrandByName(name: string): Brand | undefined {
  return brands.find((b) => b.name === name);
}

// Marcas visibles en vitrina/menús (excluye la marca de la casa).
export const visibleBrands = brands.filter((b) => !b.hidden);
export const internationalBrands = visibleBrands.filter((b) => b.type === "internacional");
export const ownBrands = visibleBrands.filter((b) => b.type === "propia");
