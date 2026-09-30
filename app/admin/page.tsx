import Link from "next/link";
import { getAllProducts, getSeedProducts } from "@/data/products";
import { getOverrides } from "@/lib/products-store";
import { restoreProductAction, deleteProductAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    updated?: string;
    deleted?: string;
    restored?: string;
  }>;
}) {
  const sp = await searchParams;
  const products = await getAllProducts();
  const q = (sp.q ?? "").trim().toLowerCase();
  const list = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      )
    : products;

  const ov = await getOverrides();
  const seeds = getSeedProducts();
  const deletedItems = ov.deleted
    .map((id) => seeds.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Productos ({list.length})</h1>
          <p className="text-sm text-neutral-400">
            Edita título, precio, descripción o fotos. Elimina lo que esté fuera
            de stock. Los cambios se aplican de inmediato en el sitio.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/producto/nuevo"
            className="rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200"
          >
            + Nuevo producto
          </Link>
          <Link
            href="/admin/guia-fotos"
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
          >
            Guía de fotos
          </Link>
        </div>
      </div>

      {sp.updated && (
        <Flash color="green">Producto {sp.updated} actualizado.</Flash>
      )}
      {sp.deleted && (
        <Flash color="amber">
          Producto {sp.deleted} eliminado del catálogo.
        </Flash>
      )}
      {sp.restored && <Flash color="green">Producto {sp.restored} restaurado.</Flash>}

      <form className="flex gap-2" action="/admin" method="get">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Buscar por nombre, marca, slug o SKU…"
          className="flex-1 rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        />
        <button className="rounded-md border border-neutral-700 px-4 text-sm hover:bg-neutral-800">
          Buscar
        </button>
      </form>

      <div className="overflow-x-auto border border-neutral-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr className="text-left">
              <th className="px-3 py-2">Producto</th>
              <th className="px-3 py-2">Marca</th>
              <th className="px-3 py-2">Público / Categoría</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-neutral-800">
                <td className="px-3 py-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-neutral-500">
                    {p.id} · {p.slug}
                  </div>
                </td>
                <td className="px-3 py-2 capitalize">{p.brand}</td>
                <td className="px-3 py-2 capitalize">
                  {p.audience} · {p.category}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {typeof p.price === "number"
                    ? p.priceMax
                      ? `$${p.price}–$${p.priceMax}`
                      : `$${p.price}`
                    : "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && <Chip>Destacado</Chip>}
                    {p.isNew && <Chip>Nuevo</Chip>}
                    {p.isOnSale && <Chip>Oferta</Chip>}
                  </div>
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/producto/${p.id}`}
                    className="text-sky-400 hover:text-sky-300 mr-3"
                  >
                    Editar
                  </Link>
                  <form
                    action={deleteProductAction.bind(null, p.id)}
                    className="inline"
                  >
                    <button
                      className="text-red-400 hover:text-red-300"
                      formNoValidate
                    >
                      Quitar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-neutral-500">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deletedItems.length > 0 && (
        <section className="border border-neutral-800 rounded-lg p-4">
          <h2 className="font-semibold mb-2">
            Productos ocultos ({deletedItems.length})
          </h2>
          <p className="text-xs text-neutral-500 mb-3">
            Están fuera del catálogo público. Puedes restaurarlos cuando vuelva
            a haber stock.
          </p>
          <ul className="text-sm divide-y divide-neutral-800">
            {deletedItems.map((p) => (
              <li key={p.id} className="flex justify-between py-2">
                <span>
                  {p.name}{" "}
                  <span className="text-neutral-500">({p.id})</span>
                </span>
                <form
                  action={restoreProductAction.bind(null, p.id)}
                  className="inline"
                >
                  <button className="text-emerald-400 hover:text-emerald-300">
                    Restaurar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide">
      {children}
    </span>
  );
}

function Flash({
  color,
  children,
}: {
  color: "green" | "amber";
  children: React.ReactNode;
}) {
  const cls =
    color === "green"
      ? "border-emerald-800 bg-emerald-900/30 text-emerald-200"
      : "border-amber-800 bg-amber-900/30 text-amber-200";
  return (
    <div className={`rounded-md border px-4 py-2 text-sm ${cls}`}>{children}</div>
  );
}
