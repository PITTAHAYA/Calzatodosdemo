import Link from "next/link";
import { Suspense } from "react";
import { getAllProducts, getSeedProducts, type Product } from "@/data/products";
import { getAllBrands, getAllCategories } from "@/lib/taxonomy-store";
import { getHistory, getOverrides } from "@/lib/products-store";
import { auditProduct, sanitizeProduct, type ProductIssue } from "@/lib/product-validation";
import { undoAction } from "../actions";
import { HiddenList } from "./hidden-list";
import { ProductList } from "./product-list";
import { SearchBox } from "./search-box";

export const dynamic = "force-dynamic";

const ISSUE_LABEL: Record<string, string> = {
  "sin-foto": "Sin foto propia",
  "sin-precio": "Sin precio",
  "sin-tallas": "Sin tallas",
  "descripcion": "Descripción corta",
  "oferta-sin-anterior": "Oferta sin precio anterior",
  "oferta-falsa": "Precio anterior incorrecto",
  marca: "Marca inexistente",
  categoria: "Categoría inexistente",
};

function timeAgo(at: number): string {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return "hace unos segundos";
  const m = Math.round(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}

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
    if (field === "updated") return 0;
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
    categoria?: string;
    problema?: string;
    marca?: string;
  }>;
}) {
  const sp = await searchParams;
  const products = await getAllProducts();

  const q = (sp.q ?? "").trim().toLowerCase();
  const audienceFilter = sp.audience ?? "";
  const estadoFilter = sp.estado ?? "";
  const sort = sp.sort ?? "";
  const categoryFilter = sp.categoria ?? "";
  const issueFilter = sp.problema ?? "";
  const brandFilter = sp.marca ?? "";
  const [brands, categories] = await Promise.all([getAllBrands(), getAllCategories()]);
  const known = { brands: brands.map((b) => b.slug), categories: categories.map((c) => c.slug) };

  // Auditoría de calidad de cada producto (una sola pasada).
  const issuesById = new Map<string, ProductIssue[]>();
  const issueCounts: Record<string, number> = {};
  for (const p of products) {
    const issues = auditProduct(p, known);
    issuesById.set(p.id, issues);
    for (const i of issues) issueCounts[i.code] = (issueCounts[i.code] ?? 0) + 1;
  }
  const withProblems = products.filter((p) =>
    issuesById.get(p.id)!.some((i) => i.level === "error")
  ).length;

  let list = products;
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.id.toLowerCase() === q ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (brandFilter) list = list.filter((p) => p.brand === brandFilter);
  if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
  if (issueFilter)
    list = list.filter((p) => issuesById.get(p.id)!.some((i) => i.code === issueFilter));
  if (audienceFilter) {
    list = list.filter((p) => p.audience === audienceFilter);
  }
  if (estadoFilter === "destacado") list = list.filter((p) => p.isFeatured);
  else if (estadoFilter === "oferta") list = list.filter((p) => p.isOnSale);
  else if (estadoFilter === "nuevo") list = list.filter((p) => p.isNew);
  else if (estadoFilter === "sin-precio")
    list = list.filter((p) => typeof p.price !== "number");
  else if (estadoFilter === "problemas")
    list = list.filter((p) => issuesById.get(p.id)!.some((i) => i.level === "error"));

  list = sortProducts(list, sort);

  const [ov, history] = await Promise.all([getOverrides(), getHistory()]);
  const seeds = getSeedProducts();
  const deletedItems = ov.deleted
    .map((id) => {
      const base = seeds.find((p) => p.id === id) ?? ov.created.find((p) => p.id === id);
      return base ? sanitizeProduct({ ...base, ...(ov.patches[id] ?? {}) }) : null;
    })
    .filter((p): p is Product => Boolean(p));
  const lastChange = history[0];

  const stats = {
    total: products.length,
    destacados: products.filter((p) => p.isFeatured).length,
    ofertas: products.filter((p) => p.isOnSale).length,
    sinPrecio: products.filter((p) => typeof p.price !== "number").length,
    ocultos: deletedItems.length,
    problemas: withProblems,
  };

  const hasFilters = Boolean(q || audienceFilter || estadoFilter || categoryFilter || issueFilter || brandFilter);
  const issueEntries = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Edita título, precio, descripción o fotos. Los cambios se aplican
            de inmediato en el sitio.
          </p>
          {lastChange && (
            <form action={undoAction} className="mt-2 text-xs text-neutral-500 flex items-center gap-2 flex-wrap">
              <span>
                Último cambio: <span className="text-neutral-300">{lastChange.summary}</span>{" "}
                · {lastChange.user} · {timeAgo(lastChange.at)}
              </span>
              <button className="rounded border border-neutral-700 px-2 py-0.5 text-neutral-300 hover:bg-neutral-800">
                ↶ Deshacer
              </button>
              <Link href="/admin/actividad" className="text-sky-400 hover:text-sky-300">
                Ver historial
              </Link>
            </form>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/producto/nuevo"
            className="rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      {/* ---------- Resumen ---------- */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
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
          label="Con problemas"
          value={stats.problemas}
          href="/admin?estado=problemas"
          active={estadoFilter === "problemas"}
          warn={stats.problemas > 0}
        />
        <StatCard
          label="Ocultos"
          value={stats.ocultos}
          href="#ocultos"
          warn={stats.ocultos > 0}
        />
      </div>

      {/* ---------- Salud del catálogo ---------- */}
      {issueEntries.length > 0 && (
        <details className="rounded-lg border border-neutral-800 p-4 group" open={withProblems > 0}>
          <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold">
            <span>
              Salud del catálogo{" "}
              <span className="font-normal text-neutral-400">
                · {Math.round(((products.length - withProblems) / Math.max(1, products.length)) * 100)}% sin errores
              </span>
            </span>
            <span className="text-neutral-500 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <p className="text-xs text-neutral-500 mt-2">
            Toca un aviso para ver qué productos lo tienen y corregirlos.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {issueEntries.map(([code, n]) => {
              const isError = ["sin-foto", "marca", "categoria", "oferta-falsa"].includes(code);
              return (
                <Link
                  key={code}
                  href={issueFilter === code ? "/admin" : `/admin?problema=${code}`}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    issueFilter === code
                      ? "bg-white text-neutral-900 border-white"
                      : isError
                        ? "border-red-800 text-red-300 hover:bg-red-950/40"
                        : "border-amber-800/70 text-amber-300 hover:bg-amber-950/30"
                  }`}
                >
                  {ISSUE_LABEL[code] ?? code} · {n}
                </Link>
              );
            })}
          </div>
        </details>
      )}

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
          <option value="problemas">Con problemas</option>
        </select>
        <select
          name="categoria"
          defaultValue={categoryFilter}
          className="rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="marca"
          defaultValue={brandFilter}
          className="rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        {issueFilter && <input type="hidden" name="problema" value={issueFilter} />}
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
        <ProductList
          products={list}
          currentSort={sort}
          issues={Object.fromEntries(list.map((p) => [p.id, issuesById.get(p.id)!]))}
        />
      </Suspense>

      {deletedItems.length > 0 && <HiddenList items={deletedItems} />}
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
