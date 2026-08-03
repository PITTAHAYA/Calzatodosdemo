import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppIcon, StoreIcon } from "@/components/Icons";
import { visibleBrands, getBrand } from "@/data/brands";
import { whatsappBrand } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return visibleBrands.map((b) => ({ slug: b.slug }));
}

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

  return (
    <div>
      {/* ===== HERO image-forward ===== */}
      <section className="relative isolate overflow-hidden bg-graphite-950 text-white">
        {cover && (
          <>
            <Image
              src={cover}
              alt={brand.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          </>
        )}
        <div className="container-page relative flex min-h-[52vh] flex-col justify-end py-14">
          <div className="[&_a]:text-graphite-300 [&_a:hover]:text-white [&_span]:text-white/90">
            <Breadcrumbs
              items={[
                { name: "Marcas", path: "/marcas" },
                { name: brand.name, path: `/marcas/${brand.slug}` },
              ]}
            />
          </div>

          {/* Logo en chip limpio (sin cuadro grande) */}
          {brand.logo && (
            <div className="mt-6 inline-flex w-fit items-center rounded-xl bg-white/95 px-4 py-2.5 shadow-lg">
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

          <p className="eyebrow mt-4 text-brand-400">
            {brand.type === "internacional" ? "Marca internacional" : "Marca propia"}
          </p>
          <h1 className="mt-1 text-4xl font-black sm:text-6xl">{brand.name}</h1>
          <p className="mt-2 text-lg font-medium text-brand-300">{brand.tagline}</p>
          <p className="mt-3 max-w-xl text-graphite-100">{brand.description}</p>
          <a
            href={whatsappBrand(brand.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6 w-fit"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Consultar por {brand.name}
          </a>
        </div>
      </section>

      {/* ===== Galería ===== */}
      {rest.length > 0 && (
        <section className="section">
          <div className="container-page">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="eyebrow">Lo que ofrece {brand.name}</p>
              <h2 className="section-title mt-2">Descubre su estilo</h2>
              <p className="mt-3 text-graphite-600">
                Algunas de las líneas y modelos de {brand.name} que encuentras en nuestros
                locales. Consulta disponibilidad y precios por WhatsApp o en tienda.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((src, i) => (
                <div
                  key={src}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-graphite-100 bg-graphite-50"
                >
                  <Image
                    src={src}
                    alt={`${brand.name} — imagen ${i + 2}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
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
