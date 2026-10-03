import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreCard } from "@/components/StoreCard";
import { getAllProducts, getProduct, getRelatedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { brandDisplayName } from "@/lib/whatsapp";
import { getStores } from "@/lib/store-hours-store";
import { pageMetadata, JsonLd, productJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };
  // Para la marca de la casa no se repite "Calzatodos Group" (ya va al final
  // del título por la plantilla del layout); se usa la categoría.
  const qualifier =
    product.brand === "calzatodos"
      ? product.categoryName ?? getCategory(product.category)?.name ?? product.category
      : product.brandName ?? brandDisplayName(product.brand);
  // Descripción para Google y vista previa al compartir (WhatsApp, Facebook):
  // si el producto no tiene descripción, se arma una con sus datos.
  const category = product.categoryName ?? getCategory(product.category)?.name ?? "";
  const price = typeof product.price === "number" ? ` Desde $${product.price}.` : "";
  const description = (
    product.description.trim().length >= 40
      ? product.description
      : `${product.name}: ${category.toLowerCase()} ${qualifier !== category ? qualifier : ""} en Calzatodos Group.${price} Consulta tallas y disponibilidad por WhatsApp.`
  )
    .replace(/\s+/g, " ")
    .slice(0, 300);
  const mainImage = product.images.find((src) => !src.startsWith("/logo/"));
  return pageMetadata({
    title: `${product.name} — ${qualifier}`,
    description,
    path: `/productos/${product.slug}`,
    images: mainImage ? [mainImage] : undefined,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const brandName = product.brandName ?? brandDisplayName(product.brand);
  const categoryName =
    product.categoryName ?? getCategory(product.category)?.name ?? product.category;
  const [related, stores] = await Promise.all([getRelatedProducts(product, 4), getStores()]);

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
