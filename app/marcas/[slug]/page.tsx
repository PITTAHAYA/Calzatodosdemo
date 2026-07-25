import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductGrid } from "@/components/ProductGrid";
import { WhatsAppIcon } from "@/components/Icons";
import { brands, getBrand } from "@/data/brands";
import { getProductsByBrand } from "@/data/products";
import { whatsappBrand } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
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

  const products = getProductsByBrand(brand.slug);

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

      <div className="container-page py-10">
        <h2 className="section-title mb-6">Productos de {brand.name}</h2>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-2xl border border-dashed border-graphite-200 bg-graphite-50 px-6 py-14 text-center">
            <p className="text-graphite-700">
              Estamos cargando los productos de {brand.name}. Escríbenos por WhatsApp para
              conocer la disponibilidad actual.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="btn-outline">Ver catálogo</Link>
              <a href={whatsappBrand(brand.name)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> Consultar
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
