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
      <h1 className="mt-4 text-3xl font-bold text-graphite-900">Catálogo</h1>
      <p className="mt-2 max-w-2xl text-graphite-600">
        Encuentra el modelo ideal y consúltalo por WhatsApp. La disponibilidad está
        sujeta a confirmación en tienda.
      </p>

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
