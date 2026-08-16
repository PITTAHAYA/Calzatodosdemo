import { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { products, allSizes, allColors, hasAnyPrices } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Catálogo de calzado",
  description:
    "Explora el catálogo completo de Calzatodos Group: calzado para mujer, hombre y niños. Filtra por marca, categoría, talla y color, y consulta por WhatsApp.",
  path: "/catalogo",
});

export default function CatalogoPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Catálogo", path: "/catalogo" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-600">Todo el calzado</p>
          <h1 className="mt-1 text-4xl font-black tracking-tight text-graphite-900 sm:text-5xl">
            Encuentra tu próximo par
          </h1>
        </div>
        <p className="max-w-xs text-sm text-graphite-500">
          Para mujer, hombre y niños. Consulta disponibilidad por WhatsApp.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<div className="text-sm text-graphite-500">Cargando catálogo…</div>}>
          <CatalogClient
            products={products}
            sizes={allSizes()}
            colors={allColors()}
            hasPrices={hasAnyPrices()}
          />
        </Suspense>
      </div>
    </div>
  );
}
