import Link from "next/link";
import Image from "next/image";
import { getAllProducts } from "@/data/products";
import { audiences } from "@/data/categories";
import {
  getAllBrands,
  getAllCategories,
  isBaseBrand,
  isBaseCategory,
} from "@/lib/taxonomy-store";
import { deleteBrandAction, deleteCategoryAction } from "../../taxonomy-actions";
import { ConfirmSubmit } from "../confirm-submit";
import { BrandForm, CategoryForm } from "./forms";

export const dynamic = "force-dynamic";

const AUDIENCE_LABEL = Object.fromEntries(audiences.map((a) => [a.value, a.label]));

export default async function TaxonomyPage({
  searchParams,
}: {
  searchParams: Promise<{ editarMarca?: string; editarCategoria?: string }>;
}) {
  const sp = await searchParams;
  const [brands, categories, products] = await Promise.all([
    getAllBrands(),
    getAllCategories(),
    getAllProducts(),
  ]);
  const countBy = (key: "brand" | "category", slug: string) =>
    products.filter((p) => p[key] === slug).length;

  const editingBrand = brands.find((b) => b.slug === sp.editarMarca && !isBaseBrand(b.slug));
  const editingCategory = categories.find(
    (c) => c.slug === sp.editarCategoria && !isBaseCategory(c.slug)
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Marcas y categorías</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Cuando llegue una marca nueva o quieras abrir una nueva sección,
          créala aquí. Luego podrás elegirla al crear o editar productos.
        </p>
      </div>

      {/* ================= MARCAS ================= */}
      <section id="marcas" className="space-y-4 scroll-mt-20">
        <h2 className="text-lg font-semibold">Marcas ({brands.length})</h2>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="font-medium mb-3">
            {editingBrand ? `Editar marca: ${editingBrand.name}` : "＋ Agregar marca nueva"}
          </h3>
          <BrandForm key={editingBrand?.slug ?? "new"} brand={editingBrand} />
          {editingBrand && (
            <Link href="/admin/marcas-categorias" className="inline-block mt-3 text-sm text-neutral-400 hover:text-white">
              Cancelar edición
            </Link>
          )}
        </div>

        <ul className="border border-neutral-800 rounded-lg divide-y divide-neutral-800">
          {brands.map((b) => {
            const n = countBy("brand", b.slug);
            const base = isBaseBrand(b.slug);
            return (
              <li key={b.slug} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="relative h-10 w-16 shrink-0 rounded bg-white flex items-center justify-center overflow-hidden">
                  {b.logo ? (
                    <Image src={b.logo} alt="" fill sizes="64px" className="object-contain p-1" unoptimized />
                  ) : (
                    <span className="text-[9px] font-black uppercase text-neutral-900 text-center leading-tight px-1">
                      {b.name}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {b.name}{" "}
                    {base ? (
                      <span className="text-[10px] uppercase tracking-wide text-neutral-500">· original</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-emerald-400">· nueva</span>
                    )}
                    {b.hidden && <span className="text-[10px] uppercase tracking-wide text-neutral-500"> · oculta</span>}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {b.type === "propia" ? "Marca propia" : "Internacional"} ·{" "}
                    <Link href={`/admin?marca=${b.slug}`} className="hover:text-white underline-offset-2 hover:underline">
                      {n} producto{n === 1 ? "" : "s"}
                    </Link>
                  </div>
                </div>
                {!base && (
                  <div className="flex gap-3 shrink-0">
                    <Link href={`/admin/marcas-categorias?editarMarca=${b.slug}#marcas`} className="text-sky-400 hover:text-sky-300">
                      Editar
                    </Link>
                    {n === 0 ? (
                      <form action={deleteBrandAction.bind(null, b.slug)}>
                        <ConfirmSubmit message={`¿Eliminar la marca "${b.name}"?`} className="text-red-400 hover:text-red-300">
                          Eliminar
                        </ConfirmSubmit>
                      </form>
                    ) : (
                      <span className="text-neutral-600" title="Primero cambia la marca de sus productos">
                        En uso
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ================= CATEGORÍAS ================= */}
      <section id="categorias" className="space-y-4 scroll-mt-20">
        <h2 className="text-lg font-semibold">Categorías ({categories.length})</h2>

        <div className="border border-neutral-800 rounded-lg p-4">
          <h3 className="font-medium mb-3">
            {editingCategory ? `Editar categoría: ${editingCategory.name}` : "＋ Agregar categoría nueva"}
          </h3>
          <CategoryForm key={editingCategory?.slug ?? "new"} category={editingCategory} />
          {editingCategory && (
            <Link href="/admin/marcas-categorias#categorias" className="inline-block mt-3 text-sm text-neutral-400 hover:text-white">
              Cancelar edición
            </Link>
          )}
        </div>

        <ul className="border border-neutral-800 rounded-lg divide-y divide-neutral-800">
          {categories.map((c) => {
            const n = countBy("category", c.slug);
            const base = isBaseCategory(c.slug);
            return (
              <li key={c.slug} className="flex items-center gap-3 px-4 py-3 text-sm">
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {c.name}{" "}
                    {base ? (
                      <span className="text-[10px] uppercase tracking-wide text-neutral-500">· original</span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wide text-emerald-400">· nueva</span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {c.audience.map((a) => AUDIENCE_LABEL[a] ?? a).join(", ")} ·{" "}
                    <Link href={`/admin?categoria=${c.slug}`} className="hover:text-white hover:underline">
                      {n} producto{n === 1 ? "" : "s"}
                    </Link>{" "}
                    ·{" "}
                    <Link href={`/catalogo?categoria=${c.slug}`} target="_blank" className="hover:text-white hover:underline">
                      ver en el sitio ↗
                    </Link>
                  </div>
                </div>
                {!base && (
                  <div className="flex gap-3 shrink-0">
                    <Link href={`/admin/marcas-categorias?editarCategoria=${c.slug}#categorias`} className="text-sky-400 hover:text-sky-300">
                      Editar
                    </Link>
                    {n === 0 ? (
                      <form action={deleteCategoryAction.bind(null, c.slug)}>
                        <ConfirmSubmit message={`¿Eliminar la categoría "${c.name}"?`} className="text-red-400 hover:text-red-300">
                          Eliminar
                        </ConfirmSubmit>
                      </form>
                    ) : (
                      <span className="text-neutral-600" title="Primero cambia la categoría de sus productos">
                        En uso
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-neutral-600">
          Las marcas y categorías “originales” forman parte del diseño del sitio
          y no se editan aquí. Las nuevas se pueden editar, y eliminar cuando
          ningún producto las usa.
        </p>
      </section>
    </div>
  );
}
