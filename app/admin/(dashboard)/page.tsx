import Link from "next/link";
import { Suspense } from "react";
import { getAllProducts, getSeedProducts } from "@/data/products";
import { getOverrides } from "@/lib/products-store";
import { restoreProductAction } from "../actions";
import { ProductList } from "./product-list";
import { SearchBox } from "./search-box";

export const dynamic = "force-dynamic";

const AUDIENCE_LABEL: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  nino: "Niño",
  nina: "Niña",
  infantil: "Infantil",
};

function sortProducts<T extends { name: string; price?: number }>(
  list: T[],
  sort: string
): T[] {
  if (!sort) return list;
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  const sorted = [...list].sort((a, b) => {
    if (field === "price") {
      const pa = a.price ?? Infinity;
      const pb = b.price ?? Infinity;
      return pa - pb;
    }
    return a.name.localeCompare(b.name, "es");
  });
  return desc ? sorted.reverse() : sorted;
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    audience?: string;
    estado?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  const products = await getAllProducts();

  const q = (sp.q ?? "").trim().toLowerCase();
  const audienceFilter = sp.audience ?? "";
  const estadoFilter = sp.estado ?? "";
  const sort = sp.sort ?? "";

  let list = products;
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }
  if (audienceFilter) {
    list = list.filter((p) => p.audience === audienceFilter);
  }
  if (estadoFilter === "destacado") list = list.filter((p) => p.isFeatured);
  else if (estadoFilter === "oferta") list = list.filter((p) => p.isOnSale);
  else if (estadoFilter === "nuevo") list = list.filter((p) => p.isNew);
  else if (estadoFilter === "sin-precio")
    list = list.filter((p) => typeof p.price !== "number");
  else if (estadoFilter === "sin-foto")
    list = list.filter(
      (p) => p.images.length === 0 || p.images[0].includes("/products/")
    );

  list = sortProducts(list, sort);

  const ov = await getOverrides();
  const seeds = getSeedProducts();
  const deletedItems = ov.deleted
    .map((id) => seeds.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const stats = {
    total: products.length,
    destacados: products.filter((p) => p.isFeatured).length,
    ofertas: products.filter((p) => p.isOnSale).length,
    sinPrecio: products.filter((p) => typeof p.price !== "number").length,
    ocultos: deletedItems.length,
  };

  const hasFilters = Boolean(q || audienceFilter || estadoFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Edita título, precio, descripción o fotos. Los cambios se aplican
            de inmediato en el sitio.
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

      {/* ---------- Resumen ---------- */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Productos" value={stats.total} href="/admin" active={!hasFilters} />
        <StatCard
          label="Destacados"
          value={stats.destacados}
          href="/admin?estado=destacado"
          active={estadoFilter === "destacado"}
        />
        <StatCard
          label="En oferta"
          value={stats.ofertas}
          href="/admin?estado=oferta"
          active={estadoFilter === "oferta"}
        />
        <StatCard
          label="Sin precio"
          value={stats.sinPrecio}
          href="/admin?estado=sin-precio"
          active={estadoFilter === "sin-precio"}
          warn={stats.sinPrecio > 0}
        />
        <StatCard
          label="Ocultos"
          value={stats.ocultos}
          href="#ocultos"
          warn={stats.ocultos > 0}
        />
      </div>

      {/* ---------- Filtros ---------- */}
      <form className="flex flex-wrap gap-2" action="/admin" method="get">
        <SearchBox defaultValue={sp.q ?? ""} />
        <select
          name="audience"
          defaultValue={audienceFilter}
          className="rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        >
          <option value="">Todos los públicos</option>
          {Object.entries(AUDIENCE_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <select
          name="estado"
          defaultValue={estadoFilter}
          className="rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        >
          <option value="">Cualquier estado</option>
          <option value="destacado">Destacados</option>
          <option value="oferta">En oferta</option>
          <option value="nuevo">Nuevos</option>
          <option value="sin-precio">Sin precio</option>
          <option value="sin-foto">Sin foto propia</option>
        </select>
        <button className="rounded-md border border-neutral-700 px-4 text-sm hover:bg-neutral-800">
          Filtrar
        </button>
        {hasFilters && (
          <Link
            href="/admin"
            className="rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-white"
          >
            Limpiar
          </Link>
        )}
      </form>

      <p className="text-xs text-neutral-500">
        Mostrando {list.length} de {products.length} productos.
      </p>

      <Suspense fallback={<div className="text-sm text-neutral-500">Cargando…</div>}>
        <ProductList products={list} currentSort={sort} />
      </Suspense>

      {deletedItems.length > 0 && (
        <section id="ocultos" className="border border-neutral-800 rounded-lg p-4 scroll-mt-4">
          <h2 className="font-semibold mb-2">
            Productos ocultos ({deletedItems.length})
          </h2>
          <p className="text-xs text-neutral-500 mb-3">
            Están fuera del catálogo público. Restáuralos cuando vuelva a haber
            stock.
          </p>
          <ul className="text-sm divide-y divide-neutral-800">
            {deletedItems.map((p) => (
              <li key={p.id} className="flex justify-between items-center py-2 gap-3">
                <span className="truncate">
                  {p.name}{" "}
                  <span className="text-neutral-500">({p.id})</span>
                </span>
                <form action={restoreProductAction.bind(null, p.id)} className="shrink-0">
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

function StatCard({
  label,
  value,
  href,
  active,
  warn,
}: {
  label: string;
  value: number;
  href: string;
  active?: boolean;
  warn?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg border p-3 transition ${
        active
          ? "border-white bg-white/5"
          : "border-neutral-800 hover:border-neutral-600"
      }`}
    >
      <div
        className={`text-2xl font-bold ${warn && value > 0 ? "text-amber-400" : ""}`}
      >
        {value}
      </div>
      <div className="text-xs text-neutral-400 mt-0.5">{label}</div>
    </Link>
  );
}
