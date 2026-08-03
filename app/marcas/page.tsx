import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandLogo } from "@/components/BrandLogo";
import { internationalBrands, ownBrands } from "@/data/brands";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Marcas",
  description:
    "Marcas internacionales distribuidas y marcas propias de Calzatodos Group: Bubble Gummers, North Star, Power, Cotti, Bumixgumer, My Athletic y más.",
  path: "/marcas",
});

export default function MarcasPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Marcas", path: "/marcas" }]} />
      <h1 className="mt-4 text-3xl font-bold text-graphite-900">Nuestras marcas</h1>
      <p className="mt-2 max-w-2xl text-graphite-600">
        Marcas para cada estilo, etapa y ocasión. Trabajamos con marcas internacionales
        distribuidas y desarrollamos marcas propias pensadas para el mercado ecuatoriano.
      </p>

      <BrandSection title="Marcas internacionales" brands={internationalBrands} />
      <BrandSection title="Marcas propias de Calzatodos Group" brands={ownBrands} />
    </div>
  );
}

function BrandSection({
  title,
  brands,
}: {
  title: string;
  brands: typeof internationalBrands;
}) {
  return (
    <section className="mt-12">
      <h2 className="section-title">{title}</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const cover = b.gallery?.[0];
          return (
            <Link
              key={b.slug}
              href={`/marcas/${b.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-graphite-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
            >
              {/* Visual de identidad: foto de la marca o logo sobre fondo suave */}
              <div className="relative aspect-[16/10] overflow-hidden bg-graphite-50">
                {cover ? (
                  <>
                    <Image
                      src={cover}
                      alt={b.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    {b.logo && (
                      <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
                        <Image
                          src={b.logo}
                          alt={b.name}
                          width={120}
                          height={40}
                          unoptimized={b.logo.endsWith(".gif")}
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center p-6">
                    <BrandLogo brand={b} className="h-full w-full !border-0 !bg-transparent" />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-graphite-900">{b.name}</h3>
                <p className="text-sm font-medium text-brand-600">{b.tagline}</p>
                <p className="mt-2 line-clamp-2 text-sm text-graphite-600">{b.description}</p>
                <span className="mt-3 inline-flex text-sm font-semibold text-brand-700 group-hover:underline">
                  Ver marca →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
