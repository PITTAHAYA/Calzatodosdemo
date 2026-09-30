import Link from "next/link";
import Image from "next/image";
import { getAllProducts, getSeedProducts } from "@/data/products";
import { getCategory } from "@/data/categories";
import { getOverrides } from "@/lib/products-store";
import {
  restoreProductAction,
  deleteProductAction,
  duplicateProductAction,
} from "../actions";
import { ConfirmSubmit } from "./confirm-submit";

export const dynamic = "force-dynamic";

const AUDIENCE_LABEL: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  nino: "Niño",
  nina: "Niña",
  infantil: "Infantil",
};

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    audience?: string;
    estado?: string;
    updated?: string;
    deleted?: string;
    restored?: string;
    duplicated?: string;
  }>;
}) {
  const sp = await searchParams;
  const products = await getAllProducts();

  const q = (sp.q ?? "").trim().toLowerCase();
  const audienceFilter = sp.audience ?? "";
  const estadoFilter = sp.estado ?? "";

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

      {sp.updated && <Flash color="green">Producto actualizado correctamente.</Flash>}
      {sp.deleted && (
        <Flash color="amber">
          Producto marcado como fuera de stock. Puedes restaurarlo abajo.
        </Flash>
      )}
      {sp.restored && <Flash color="green">Producto restaurado al catálogo.</Flash>}
      {sp.duplicated && (
        <Flash color="green">
          Producto duplicado. Edita el nombre, color y fotos de la copia.
        </Flash>
      )}

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
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Buscar por nombre, marca, slug o SKU…"
          className="flex-1 min-w-[220px] rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        />
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

      {/* ---------- Tabla (desktop) ---------- */}
      <div className="hidden md:block overflow-x-auto border border-neutral-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr className="text-left">
              <th className="px-3 py-2">Foto</th>
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
              <tr key={p.id} className="border-t border-neutral-800 align-top">
                <td className="px-3 py-2">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                    <Image
                      src={p.images[0]}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-neutral-500">
                    {p.id} · {p.slug}
                  </div>
                </td>
                <td className="px-3 py-2 capitalize">{p.brand}</td>
                <td className="px-3 py-2 capitalize">
                  {AUDIENCE_LABEL[p.audience] ?? p.audience} ·{" "}
                  {getCategory(p.category)?.name ?? p.category}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {typeof p.price === "number"
                    ? p.priceMax
                      ? `$${p.price}–$${p.priceMax}`
                      : `$${p.price}`
                    : <span className="text-amber-400">Sin precio</span>}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && <Chip>Destacado</Chip>}
                    {p.isNew && <Chip>Nuevo</Chip>}
                    {p.isOnSale && <Chip>Oferta</Chip>}
                  </div>
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap space-x-3">
                  <Link
                    href={`/admin/producto/${p.id}`}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Editar
                  </Link>
                  <form action={duplicateProductAction.bind(null, p.id)} className="inline">
                    <button
                      className="text-neutral-400 hover:text-white"
                      title="Crear una copia (útil para variantes de color)"
                    >
                      Duplicar
                    </button>
                  </form>
                  <form action={deleteProductAction.bind(null, p.id)} className="inline">
                    <ConfirmSubmit
                      message={`¿Quitar "${p.name}" del catálogo público? Podrás restaurarlo después.`}
                      className="text-red-400 hover:text-red-300"
                    >
                      Quitar
                    </ConfirmSubmit>
                  </form>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-neutral-500">
                  Sin resultados para estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- Tarjetas (móvil) ---------- */}
      <div className="md:hidden space-y-3">
        {list.map((p) => (
          <div key={p.id} className="border border-neutral-800 rounded-lg p-3 flex gap-3">
            <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
              <Image
                src={p.images[0]}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-xs text-neutral-500 capitalize">
                {AUDIENCE_LABEL[p.audience] ?? p.audience} ·{" "}
                {getCategory(p.category)?.name ?? p.category}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <span>
                  {typeof p.price === "number"
                    ? p.priceMax
                      ? `$${p.price}–$${p.priceMax}`
                      : `$${p.price}`
                    : <span className="text-amber-400">Sin precio</span>}
                </span>
                {p.isFeatured && <Chip>Destacado</Chip>}
                {p.isOnSale && <Chip>Oferta</Chip>}
              </div>
              <div className="mt-2 flex gap-4 text-sm">
                <Link href={`/admin/producto/${p.id}`} className="text-sky-400">
                  Editar
                </Link>
                <form action={duplicateProductAction.bind(null, p.id)}>
                  <button className="text-neutral-400">Duplicar</button>
                </form>
                <form action={deleteProductAction.bind(null, p.id)}>
                  <ConfirmSubmit
                    message={`¿Quitar "${p.name}" del catálogo público?`}
                    className="text-red-400"
                  >
                    Quitar
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            Sin resultados para estos filtros.
          </p>
        )}
      </div>

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
