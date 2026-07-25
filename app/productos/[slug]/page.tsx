import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreCard } from "@/components/StoreCard";
import { products, getProduct, getRelatedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { brandDisplayName } from "@/lib/whatsapp";
import { stores } from "@/data/stores";
import { pageMetadata, JsonLd, productJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  return pageMetadata({
    title: `${product.name} — ${brandDisplayName(product.brand)}`,
    description: product.description,
    path: `/productos/${product.slug}`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const brandName = brandDisplayName(product.brand);
  const categoryName = getCategory(product.category)?.name ?? product.category;
  const related = getRelatedProducts(product, 4);

  return (
    <div className="container-page py-8">
      <JsonLd data={productJsonLd(product)} />
      <Breadcrumbs
        items={[
          { name: "Catálogo", path: "/catalogo" },
          { name: categoryName, path: `/catalogo?categoria=${product.category}` },
          { name: product.name, path: `/productos/${product.slug}` },
        ]}
      />

      <div className="mt-6">
        <ProductDetail
          product={product}
          brandName={brandName}
          categoryName={categoryName}
        />
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">También te puede interesar</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Locales */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="section-title">Encuéntralo en nuestros locales</h2>
          <Link href="/tiendas" className="hidden text-sm font-semibold text-brand-700 hover:underline sm:inline">
            Ver todas las tiendas →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stores.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
