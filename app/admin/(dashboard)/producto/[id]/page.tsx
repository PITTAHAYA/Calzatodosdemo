import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/data/products";
import {
  updateProductAction,
  deleteProductAction,
  duplicateProductAction,
} from "../../../actions";
import { ProductForm } from "../form-client";
import { getAllBrands, getAllCategories } from "@/lib/taxonomy-store";
import { auditProduct } from "@/lib/product-validation";
import { ConfirmSubmit } from "../../confirm-submit";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getAllProducts();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const action = updateProductAction.bind(null, id);
  const [brands, categories] = await Promise.all([getAllBrands(), getAllCategories()]);
  const issues = auditProduct(product, {
    brands: brands.map((b) => b.slug),
    categories: categories.map((c) => c.slug),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide">
            {product.id} · {product.sku}
          </p>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <Link
            href={`/productos/${product.slug}`}
            target="_blank"
            className="text-sm text-sky-400 hover:text-sky-300"
          >
            Ver en el sitio ↗
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <form action={duplicateProductAction.bind(null, id)}>
            <button
              className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
              title="Crear una copia (útil para variantes de color)"
            >
              Duplicar
            </button>
          </form>
          <Link
            href="/admin"
            className="text-sm text-neutral-400 hover:text-white"
          >
            ← Volver
          </Link>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="rounded-lg border border-amber-900/60 bg-amber-950/20 px-4 py-3 text-sm">
          <p className="font-medium text-amber-200 mb-1">
            Para que este producto venda mejor:
          </p>
          <ul className="space-y-0.5 text-amber-100/80">
            {issues.map((i) => (
              <li key={i.code}>
                <span className={i.level === "error" ? "text-red-400" : "text-amber-400"}>
                  {i.level === "error" ? "✕" : "•"}
                </span>{" "}
                {i.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ProductForm key={JSON.stringify(product)} product={product} action={action} brands={brands} categories={categories} />

      <form
        action={deleteProductAction.bind(null, id)}
        className="border border-red-900 bg-red-950/40 rounded-lg p-4"
      >
        <h2 className="font-semibold text-red-200">Fuera de stock</h2>
        <p className="text-sm text-red-300/80 mt-1">
          Quita este producto del catálogo público. Podrás restaurarlo después
          desde la lista de productos ocultos.
        </p>
        <ConfirmSubmit
          message={`¿Quitar "${product.name}" del catálogo público? Podrás restaurarlo después.`}
          className="mt-3 rounded-md bg-red-700 hover:bg-red-600 text-white px-4 py-2 text-sm"
        >
          Quitar del catálogo
        </ConfirmSubmit>
      </form>
    </div>
  );
}
