import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/marcas/${b.slug}`}
            className="group rounded-2xl border border-graphite-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <BrandLogo brand={b} className="h-28 !border-0 !p-0" />
            <h3 className="mt-4 text-lg font-bold text-graphite-900">{b.name}</h3>
            <p className="text-sm font-medium text-brand-600">{b.tagline}</p>
            <p className="mt-2 text-sm text-graphite-600">{b.description}</p>
            <span className="mt-3 inline-flex text-sm font-semibold text-brand-700 group-hover:underline">
              Ver marca →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
