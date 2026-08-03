// =========================================================================
// CATEGORÍAS Y NAVEGACIÓN — Calzatodos Group
// -------------------------------------------------------------------------
// Define el público (audience), las categorías de producto, los estilos y la
// estructura de los mega menús. Editar aquí actualiza el catálogo, los filtros
// y la navegación.
// =========================================================================

export type Audience = "mujer" | "hombre" | "nino" | "nina" | "infantil";

export interface Category {
  slug: string;
  name: string;
  audience: Audience[]; // públicos a los que aplica
  description: string;
}

// Públicos usados en filtros del catálogo.
export const audiences: { value: Audience; label: string }[] = [
  { value: "mujer", label: "Mujer" },
  { value: "hombre", label: "Hombre" },
  { value: "nino", label: "Niño" },
  { value: "nina", label: "Niña" },
  { value: "infantil", label: "Infantil" },
];

// Categorías de producto (usadas por filtros y por productos).
export const categories: Category[] = [
  { slug: "sneakers", name: "Sneakers", audience: ["mujer", "hombre", "nino", "nina"], description: "Zapatillas urbanas para el día a día." },
  { slug: "casual", name: "Calzado casual", audience: ["mujer", "hombre"], description: "Comodidad y estilo para cualquier ocasión." },
  { slug: "formal", name: "Zapatos formales", audience: ["hombre", "mujer"], description: "Elegancia para el trabajo y eventos." },
  { slug: "deportivo", name: "Deportivo", audience: ["mujer", "hombre", "nino", "nina"], description: "Rendimiento y confort para entrenar." },
  { slug: "botas", name: "Botas y botines", audience: ["mujer", "hombre", "nino", "nina"], description: "Protección y estilo para toda estación." },
  { slug: "sandalias", name: "Sandalias", audience: ["mujer", "hombre", "nino", "nina"], description: "Frescura para climas cálidos." },
  { slug: "tacones", name: "Tacones", audience: ["mujer"], description: "Altura y elegancia para lucir." },
  { slug: "baletas", name: "Baletas", audience: ["mujer"], description: "Ligereza y comodidad diaria." },
  { slug: "mocasines", name: "Mocasines", audience: ["mujer", "hombre"], description: "Un clásico versátil y cómodo." },
  { slug: "outdoor", name: "Outdoor", audience: ["hombre", "mujer"], description: "Preparados para la aventura." },
  { slug: "seguridad", name: "Zapatos de seguridad", audience: ["hombre", "mujer"], description: "Protección industrial certificada según fabricante." },
  { slug: "escolar", name: "Escolar", audience: ["nino", "nina", "infantil"], description: "Resistencia para el regreso a clases." },
  { slug: "luces", name: "Zapatos con luces", audience: ["nino", "nina", "infantil"], description: "Diversión que ilumina cada paso." },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// Estilos transversales (sección "Explora por estilo").
export const styles: { slug: string; name: string; description: string }[] = [
  { slug: "sneakers", name: "Sneakers", description: "Lo urbano que no pasa de moda." },
  { slug: "formal", name: "Formal", description: "Para lucir impecable." },
  { slug: "deportivo", name: "Deportivo", description: "Energía en cada paso." },
  { slug: "outdoor", name: "Outdoor", description: "Listos para explorar." },
  { slug: "sandalias", name: "Sandalias", description: "Comodidad para el calor." },
  { slug: "botas", name: "Botas y botines", description: "Estilo con carácter." },
  { slug: "escolar", name: "Escolar", description: "De vuelta a clases." },
  { slug: "seguridad", name: "Seguridad industrial", description: "Protección para el trabajo." },
];

// -------------------------------------------------------------------------
// Estructura de MEGA MENÚS por público.
// Cada enlace apunta al catálogo con filtros preaplicados o a rutas dedicadas.
// -------------------------------------------------------------------------
export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  audience: Audience;
  title: string;
  links: MegaMenuLink[];
}

export const megaMenus: Record<"mujer" | "hombre" | "ninos", MegaMenuColumn> = {
  mujer: {
    audience: "mujer",
    title: "Mujer",
    links: [
      { label: "Sneakers", href: "/catalogo?audience=mujer&categoria=sneakers" },
      { label: "Zapatos formales", href: "/catalogo?audience=mujer&categoria=formal" },
      { label: "Deportivo", href: "/deportivo" },
      { label: "Ver todo", href: "/mujer" },
    ],
  },
  hombre: {
    audience: "hombre",
    title: "Hombre",
    links: [
      { label: "Sneakers", href: "/catalogo?audience=hombre&categoria=sneakers" },
      { label: "Zapatos formales", href: "/catalogo?audience=hombre&categoria=formal" },
      { label: "Deportivo", href: "/deportivo" },
      { label: "Ver todo", href: "/hombre" },
    ],
  },
  ninos: {
    audience: "nino",
    title: "Niños",
    links: [
      { label: "Niño", href: "/catalogo?audience=nino" },
      { label: "Niña", href: "/catalogo?audience=nina" },
      { label: "Escolar", href: "/escolar" },
      { label: "Ver todo", href: "/ninos" },
    ],
  },
};
