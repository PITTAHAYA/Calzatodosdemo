import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppIcon, StoreIcon } from "@/components/Icons";
import { visibleBrands, getBrand } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { ProductRail } from "@/components/ProductRail";
import { whatsappBrand } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return visibleBrands.map((b) => ({ slug: b.slug }));
}

// Encuadre (object-position) por imagen cuando el centro recorta un logo.
const FOCAL: Record<string, string> = {
  "/brand-gallery/north-star-2.jpg": "center bottom",
  "/lifestyle/zapatos-5.jpg": "center top",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Marca no encontrada" };
  return pageMetadata({
    title: `${brand.name} en Ecuador`,
    description: `${brand.description} Descubre ${brand.name} en Calzatodos Group y consulta por WhatsApp.`,
    path: `/marcas/${brand.slug}`,
  });
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const gallery = brand.gallery ?? [];
  const cover = gallery[0];
  const rest = gallery.slice(1);
  const brandProducts = getProductsByBrand(brand.slug);

  return (
    <div>
      {/* ===== HERO editorial ===== */}
      <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-graphite-950 text-white sm:min-h-[70vh]">
        {cover && (
          <>
            <ParallaxImage src={cover} alt={brand.name} priority />
            {/* Doble degradado: base para legibilidad + viñeta lateral */}
            <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-graphite-950/55 to-graphite-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-graphite-950/80 via-transparent to-transparent" />
          </>
        )}
        <div className="container-page relative w-full py-12 sm:py-16">
          <div className="[&_a]:text-graphite-300 [&_a:hover]:text-white [&_span]:text-white/90">
            <Breadcrumbs
              items={[
                { name: "Marcas", path: "/marcas" },
                { name: brand.name, path: `/marcas/${brand.slug}` },
              ]}
            />
          </div>

          <div className="mt-7 max-w-2xl">
            {/* Logo en chip limpio */}
            {brand.logo && (
              <div className="inline-flex w-fit items-center rounded-2xl bg-white/95 px-4 py-2.5 shadow-xl ring-1 ring-black/5">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={160}
                  height={48}
                  unoptimized={brand.logo.endsWith(".gif")}
                  className="h-8 w-auto object-contain"
                />
              </div>
            )}

            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl">
              {brand.name}
            </h1>
            <p className="mt-3 text-lg font-semibold text-brand-300 sm:text-xl">
              {brand.tagline}
            </p>
            <p className="mt-4 max-w-xl text-graphite-100">{brand.description}</p>

            {/* Chips de detalle */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 uppercase tracking-wider text-white/85">
                {brand.type === "internacional" ? "Marca internacional" : "Marca propia"}
              </span>
              {brand.type === "internacional" && (
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 uppercase tracking-wider text-white/85">
                  Distribución autorizada
                </span>
              )}
              {brandProducts.length > 0 && (
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 uppercase tracking-wider text-white/85">
                  {brandProducts.length} modelo{brandProducts.length === 1 ? "" : "s"} disponibles
                </span>
              )}
            </div>

            <a
              href={whatsappBrand(brand.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-7 w-fit"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Consultar por {brand.name}
            </a>
          </div>
        </div>
      </section>

      {/* ===== Modelos de la marca ===== */}
      {brandProducts.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="eyebrow">Modelos</p>
              <h2 className="section-title mt-2">Disponibles de {brand.name}</h2>
              <p className="mt-3 text-graphite-600">
                Consulta tallas y disponibilidad por WhatsApp o en tu local más cercano.
              </p>
            </div>
            <ProductRail products={brandProducts} />
          </div>
        </section>
      )}

      {/* ===== Lookbook editorial ===== */}
      {rest.length > 0 && (
        <section className="section bg-graphite-50">
          <div className="container-page mx-auto max-w-5xl">
            {/* Encabezado editorial (alineado a la izquierda) */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="eyebrow text-brand-600">Lookbook · {brand.name}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-graphite-900 sm:text-4xl">
                  {brand.tagline}
                </h2>
              </div>
              <p className="max-w-sm text-sm text-graphite-500">
                Una muestra del estilo de {brand.name}. Consulta modelos, tallas y precios
                por WhatsApp o en tienda.
              </p>
            </div>

            {/* Grilla premium moderada (hasta 3 por fila) */}
            <div
              className={cn(
                "grid gap-5",
                rest.length === 1 && "max-w-md",
                rest.length === 2 && "sm:grid-cols-2",
                rest.length >= 3 && "grid-cols-2 lg:grid-cols-3"
              )}
            >
              {rest.map((src, i) => (
                <figure
                  key={src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-graphite-100 shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg"
                >
                  <Image
                    src={src}
                    alt={`${brand.name} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    style={{ objectPosition: FOCAL[src] ?? "center" }}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <figcaption className="absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/95 opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-100">
                    {brand.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="section pt-0">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-graphite-50 px-8 py-12 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-bold text-graphite-900">
                ¿Te interesa {brand.name}?
              </h2>
              <p className="mt-2 text-graphite-600">
                Escríbenos y te ayudamos a encontrar el modelo, la talla y el local ideal.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappBrand(brand.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp !px-6 !py-3"
              >
                <WhatsAppIcon className="h-5 w-5" /> Consultar
              </a>
              <Link href="/tiendas" className="btn-outline !px-6 !py-3">
                <StoreIcon className="h-5 w-5" /> Encontrar una tienda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
