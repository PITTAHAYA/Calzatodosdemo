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
  },
  {
    slug: "north-star",
    name: "North Star",
    type: "internacional",
    tagline: "Estilo juvenil y urbano",
    description:
      "Sneakers y casuales con actitud, ideales para el día a día de jóvenes y adultos.",
    logo: "/brands/north-star.png",
  },
  {
    slug: "power",
    name: "Power",
    type: "internacional",
    tagline: "Energía deportiva",
    description:
      "Calzado deportivo diseñado para el rendimiento, el entrenamiento y el movimiento.",
    logo: "/brands/power.png",
  },
  {
    slug: "weinbrenner",
    name: "Weinbrenner",
    type: "internacional",
    tagline: "Resistencia y outdoor",
    description:
      "Botas y calzado outdoor construidos para durar y acompañar la aventura y el trabajo.",
    // Logo pendiente de entrega por el cliente.
  },
  {
    slug: "bumixgumer",
    name: "Bumixgumer",
    type: "propia",
    tagline: "Diseñado para niños",
    description:
      "Marca propia de Calzatodos Group, con diseños coloridos y resistentes pensados para los niños.",
    logo: "/brands/bumixgumer.jpg",
  },
  {
    slug: "cotti",
    name: "Cotti",
    type: "propia",
    tagline: "Lux Man Shoes",
    description:
      "Marca propia de Calzatodos Group enfocada en calzado masculino elegante, con estilo y comodidad.",
    logo: "/brands/cotti.jpg",
  },
  {
    slug: "my-athletic",
    name: "My Athletic",
    type: "propia",
    tagline: "Energía deportiva propia",
    description:
      "Marca propia de Calzatodos Group orientada al calzado deportivo y de rendimiento para toda la familia.",
    logo: "/brands/my-athletic.png",
  },
  {
    slug: "kaloa",
    name: "Kaloa",
    type: "propia",
    tagline: "Marca propia de Calzatodos Group",
    description:
      "Diseños frescos y versátiles para acompañar cada etapa de la familia.",
    // Logo pendiente de entrega por el cliente.
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getBrandByName(name: string): Brand | undefined {
  return brands.find((b) => b.name === name);
}

export const internationalBrands = brands.filter((b) => b.type === "internacional");
export const ownBrands = brands.filter((b) => b.type === "propia");
