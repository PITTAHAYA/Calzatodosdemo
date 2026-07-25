import { Suspense } from "react";
import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { CatalogClient } from "./CatalogClient";
import type { Product } from "@/data/products";
import { allSizes, allColors } from "@/data/products";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappGeneral } from "@/lib/whatsapp";

// Landing reutilizable para páginas de público/categoría/estilo.
export function CategoryLanding({
  title,
  eyebrow,
  description,
  products,
  crumbs,
  hideAudience,
  hideCategory,
}: {
  title: string;
  eyebrow: string;
  description: string;
  products: Product[];
  crumbs: Crumb[];
  hideAudience?: boolean;
  hideCategory?: boolean;
}) {
  const hasPrices = products.some((p) => typeof p.price === "number");

  return (
    <div>
      {/* Hero de categoría */}
      <section className="bg-graphite-950 text-white">
        <div className="container-page py-12 sm:py-16">
          <div className="[&_a]:text-graphite-400 [&_a:hover]:text-white [&_span]:text-graphite-200">
            <Breadcrumbs items={crumbs} />
          </div>
          <p className="eyebrow mt-6 text-brand-400">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-graphite-300">{description}</p>
        </div>
      </section>

      <div className="container-page py-8">
        {products.length > 0 ? (
          <Suspense fallback={<div className="text-sm text-graphite-500">Cargando…</div>}>
            <CatalogClient
              products={products}
              sizes={allSizes()}
              colors={allColors()}
              hasPrices={hasPrices}
              hideAudience={hideAudience}
              hideCategory={hideCategory}
            />
          </Suspense>
        ) : (
          <div className="rounded-2xl border border-dashed border-graphite-200 bg-graphite-50 px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-graphite-900">
              Estamos actualizando esta sección
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-graphite-600">
              Pronto encontrarás más modelos aquí. Mientras tanto, escríbenos por
              WhatsApp o explora el catálogo completo.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="btn-outline">Ver catálogo</Link>
              <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
