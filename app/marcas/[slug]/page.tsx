import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandLogo } from "@/components/BrandLogo";
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

  return (
    <div>
      <section className="bg-graphite-950 text-white">
        <div className="container-page py-12 sm:py-16">
          <div className="[&_a]:text-graphite-400 [&_a:hover]:text-white [&_span]:text-graphite-200">
            <Breadcrumbs
              items={[
                { name: "Marcas", path: "/marcas" },
                { name: brand.name, path: `/marcas/${brand.slug}` },
              ]}
            />
          </div>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr,1.4fr]">
            <BrandLogo brand={brand} className="h-40 max-w-sm" />
            <div>
              <p className="eyebrow text-brand-400">
                {brand.type === "internacional" ? "Marca internacional" : "Marca propia"}
              </p>
              <h1 className="mt-2 text-4xl font-black sm:text-5xl">{brand.name}</h1>
              <p className="mt-2 text-lg font-medium text-brand-300">{brand.tagline}</p>
              <p className="mt-4 max-w-xl text-graphite-300">{brand.description}</p>
              <a
                href={whatsappBrand(brand.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp mt-6"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Consultar por {brand.name}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-12">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="eyebrow">Lo que ofrece {brand.name}</p>
          <h2 className="section-title mt-2">Descubre su estilo</h2>
          <p className="mt-3 text-graphite-600">
            Estas son algunas de las líneas y modelos de {brand.name} que encuentras en
            nuestros locales. Consulta disponibilidad y precios por WhatsApp o en tienda.
          </p>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl border border-graphite-100 bg-white ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-[4/3]" : "aspect-square"
                }`}
              >
                <Image
                  src={src}
                  alt={`${brand.name} — imagen ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-graphite-200 bg-graphite-50 px-6 py-14 text-center">
            <p className="text-graphite-700">
              Pronto agregaremos más fotos de {brand.name}. Escríbenos por WhatsApp para
              conocer los modelos disponibles.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={whatsappBrand(brand.name)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <WhatsAppIcon className="h-5 w-5" /> Consultar por {brand.name}
          </a>
          <Link href="/tiendas" className="btn-outline">
            <StoreIcon className="h-5 w-5" /> Encontrar una tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
