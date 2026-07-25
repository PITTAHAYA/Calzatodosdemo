// =========================================================================
// PROMOCIONES / OFERTAS — Calzatodos Group
// -------------------------------------------------------------------------
// Contenido de DEMOSTRACIÓN claramente reemplazable. No representa descuentos
// reales. Antes del lanzamiento, reemplaza por promociones aprobadas.
//
// Las promociones vencidas (endDate < hoy) se marcan como "finalizadas"
// automáticamente mediante los helpers de abajo.
// =========================================================================

export interface Promotion {
  slug: string;
  name: string;
  description: string;
  // Descuento opcional (número, %). Omite si no aplica.
  discountPercent?: number;
  startDate: string; // ISO "YYYY-MM-DD"
  endDate: string; // ISO "YYYY-MM-DD"
  categories: string[]; // slugs de categorías asociadas
  brands: string[]; // slugs de marcas asociadas
  termsSummary: string;
  image?: string; // /public/promotions/...
  // "auto" oculta las vencidas; "keep" las muestra como finalizadas.
  expiredBehavior: "auto" | "keep";
  // DEMO: contenido de ejemplo, reemplazar antes de producción.
  demo?: boolean;
}

export const promotions: Promotion[] = [
  {
    slug: "regreso-a-clases",
    name: "Regreso a clases (ejemplo)",
    description:
      "Prepara la vuelta a clases con calzado escolar resistente para niños y niñas.",
    discountPercent: 20,
    startDate: "2026-07-01",
    endDate: "2026-09-30",
    categories: ["escolar"],
    brands: ["bubble-gummers"],
    termsSummary:
      "Promoción de demostración. Aplica a productos seleccionados. Consulta condiciones y disponibilidad en tienda.",
    expiredBehavior: "keep",
    demo: true,
  },
  {
    slug: "temporada-deportiva",
    name: "Temporada deportiva (ejemplo)",
    description:
      "Renueva tu calzado deportivo para entrenar con energía en toda la familia.",
    discountPercent: 15,
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    categories: ["deportivo", "sneakers"],
    brands: ["power", "north-star"],
    termsSummary:
      "Promoción de demostración. Aplica a modelos seleccionados mientras dure el inventario.",
    expiredBehavior: "keep",
    demo: true,
  },
  {
    slug: "liquidacion-temporada",
    name: "Liquidación de temporada (ejemplo)",
    description:
      "Aprovecha precios especiales en modelos seleccionados de temporadas anteriores.",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    categories: ["casual", "botas"],
    brands: [],
    termsSummary:
      "Promoción de demostración ya finalizada, mostrada como ejemplo de estado 'finalizada'.",
    expiredBehavior: "keep",
    demo: true,
  },
];

export function isPromotionActive(promo: Promotion, now: Date = new Date()): boolean {
  const start = new Date(promo.startDate + "T00:00:00");
  const end = new Date(promo.endDate + "T23:59:59");
  return now >= start && now <= end;
}

export function isPromotionExpired(promo: Promotion, now: Date = new Date()): boolean {
  const end = new Date(promo.endDate + "T23:59:59");
  return now > end;
}

// Promociones visibles según su comportamiento al vencer.
export function getVisiblePromotions(now: Date = new Date()): Promotion[] {
  return promotions.filter((p) => {
    if (isPromotionExpired(p, now) && p.expiredBehavior === "auto") return false;
    return true;
  });
}

export function getPromotion(slug: string): Promotion | undefined {
  return promotions.find((p) => p.slug === slug);
}
