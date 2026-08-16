import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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
  heroImage,
}: {
  title: string;
  eyebrow: string;
  description: string;
  products: Product[];
  crumbs: Crumb[];
  hideAudience?: boolean;
  hideCategory?: boolean;
  heroImage?: string;
}) {
  const hasPrices = products.some((p) => typeof p.price === "number");

  return (
    <div>
      {/* Hero de categoría (con fotografía de fondo) */}
      <section className="relative isolate overflow-hidden bg-graphite-950 text-white">
        {heroImage && (
          <>
            <Image
              src={heroImage}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          </>
        )}
        <div className="container-page relative py-16 sm:py-24">
          <div className="[&_a]:text-graphite-300 [&_a:hover]:text-white [&_span]:text-white/90">
            <Breadcrumbs items={crumbs} />
          </div>
          <p className="eyebrow mt-6 text-brand-400">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-black sm:text-6xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-graphite-100">{description}</p>
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
          <div className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl text-center">
            <Image
              src="/lifestyle/ppl-friends.jpg"
              alt="Calzatodos Group"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40" />
            <div className="relative px-6 py-14 text-white">
              <p className="eyebrow text-brand-400">Muy pronto</p>
              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Estamos preparando esta selección
              </h2>
              <p className="mx-auto mt-3 max-w-md text-graphite-100">
                Escríbenos por WhatsApp y te decimos qué modelos tenemos disponibles hoy,
                o explora todo el catálogo.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-6 !py-3">
                  <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
                </a>
                <Link href="/catalogo" className="btn-outline !border-white/50 !bg-transparent !text-white hover:!bg-white/10 !px-6 !py-3">
                  Ver catálogo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
