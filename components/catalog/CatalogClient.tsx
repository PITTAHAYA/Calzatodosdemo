"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { categories, audiences, styles } from "@/data/categories";
import { brands } from "@/data/brands";
import { SearchIcon, CloseIcon, WhatsAppIcon } from "@/components/Icons";
import { whatsappGeneral } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type SortKey = "recomendados" | "recientes" | "nombre" | "precio-asc" | "precio-desc";

interface Props {
  products: Product[];
  sizes: number[];
  colors: string[];
  hasPrices: boolean;
  // En páginas de categoría/público, los productos ya vienen pre-filtrados;
  // ocultamos el grupo de filtro correspondiente para evitar redundancia.
  hideAudience?: boolean;
  hideCategory?: boolean;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function CatalogClient({
  products,
  sizes,
  colors,
  hasPrices,
  hideAudience,
  hideCategory,
}: Props) {
  const params = useSearchParams();

  // --- Estado de filtros (inicializado desde la URL) ---
  const [query, setQuery] = useState("");
  const [selAudiences, setSelAudiences] = useState<string[]>([]);
  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [selSizes, setSelSizes] = useState<number[]>([]);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [selStyles, setSelStyles] = useState<string[]>([]);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlySale, setOnlySale] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("recomendados");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inicializar desde los search params una sola vez.
  useEffect(() => {
    setQuery(params.get("q") ?? "");
    const a = params.get("audience");
    setSelAudiences(a ? [a] : []);
    const c = params.get("categoria");
    setSelCategories(c ? [c] : []);
    const b = params.get("marca");
    setSelBrands(b ? [b] : []);
    const st = params.get("estilo");
    setSelStyles(st ? [st] : []);
    setOnlyNew(params.get("nuevos") === "1");
    setOnlySale(params.get("ofertas") === "1");
    // Pequeño skeleton inicial para percepción de velocidad.
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const priceCeiling = useMemo(() => {
    const prices = products
      .map((p) => p.price)
      .filter((p): p is number => typeof p === "number");
    return prices.length ? Math.ceil(Math.max(...prices)) : 0;
  }, [products]);

  const toggle = <T,>(arr: T[], value: T, setter: (v: T[]) => void) => {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  // --- Filtrado ---
  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    let result = products.filter((p) => {
      if (selAudiences.length && !selAudiences.includes(p.audience)) return false;
      if (selCategories.length && !selCategories.includes(p.category)) return false;
      if (selBrands.length && !selBrands.includes(p.brand)) return false;
      if (selStyles.length && !selStyles.includes(p.style)) return false;
      if (selSizes.length && !selSizes.some((s) => p.availableSizes.includes(s)))
        return false;
      if (selColors.length && !selColors.some((c) => p.colors.includes(c)))
        return false;
      if (onlyNew && !p.isNew) return false;
      if (onlySale && !p.isOnSale) return false;
      if (maxPrice !== null && typeof p.price === "number" && p.price > maxPrice)
        return false;
      if (q) {
        const haystack = normalize(
          [
            p.name,
            p.sku,
            p.brand,
            p.category,
            p.style,
            p.audience,
            ...p.colors,
            ...p.tags,
          ].join(" ")
        );
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    // --- Ordenamiento ---
    result = [...result];
    switch (sort) {
      case "recientes":
        result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "nombre":
        result.sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      case "precio-asc":
        result.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "precio-desc":
        result.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
        break;
      default:
        result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
    return result;
  }, [
    products,
    query,
    selAudiences,
    selCategories,
    selBrands,
    selStyles,
    selSizes,
    selColors,
    onlyNew,
    onlySale,
    maxPrice,
    sort,
  ]);

  const activeFilterCount =
    selAudiences.length +
    selCategories.length +
    selBrands.length +
    selSizes.length +
    selColors.length +
    selStyles.length +
    (onlyNew ? 1 : 0) +
    (onlySale ? 1 : 0) +
    (maxPrice !== null ? 1 : 0);

  const clearAll = () => {
    setSelAudiences([]);
    setSelCategories([]);
    setSelBrands([]);
    setSelSizes([]);
    setSelColors([]);
    setSelStyles([]);
    setOnlyNew(false);
    setOnlySale(false);
    setMaxPrice(null);
    setQuery("");
  };

  // --- Panel de filtros (compartido desktop/móvil) ---
  const FiltersPanel = (
    <div className="space-y-6">
      {!hideAudience && (
        <FilterGroup title="Público">
          {audiences.map((a) => (
            <CheckRow
              key={a.value}
              label={a.label}
              checked={selAudiences.includes(a.value)}
              onChange={() => toggle(selAudiences, a.value, setSelAudiences)}
            />
          ))}
        </FilterGroup>
      )}

      {!hideCategory && (
        <FilterGroup title="Categoría">
          {categories.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              checked={selCategories.includes(c.slug)}
              onChange={() => toggle(selCategories, c.slug, setSelCategories)}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Marca">
        {brands.map((b) => (
          <CheckRow
            key={b.slug}
            label={b.name}
            checked={selBrands.includes(b.slug)}
            onChange={() => toggle(selBrands, b.slug, setSelBrands)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Estilo">
        {styles.map((s) => (
          <CheckRow
            key={s.slug}
            label={s.name}
            checked={selStyles.includes(s.slug)}
            onChange={() => toggle(selStyles, s.slug, setSelStyles)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Talla">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(selSizes, s, setSelSizes)}
              className={cn(
                "h-9 w-9 rounded-lg border text-sm font-medium transition",
                selSizes.includes(s)
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-graphite-200 text-graphite-700 hover:border-graphite-400"
              )}
              aria-pressed={selSizes.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        {colors.map((c) => (
          <CheckRow
            key={c}
            label={c}
            checked={selColors.includes(c)}
            onChange={() => toggle(selColors, c, setSelColors)}
          />
        ))}
      </FilterGroup>

      {/* El filtro de precio solo aparece si hay precios cargados. */}
      {hasPrices && priceCeiling > 0 && (
        <FilterGroup title="Precio máximo">
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={1}
            value={maxPrice ?? priceCeiling}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand-600"
            aria-label="Precio máximo"
          />
          <div className="mt-1 flex justify-between text-xs text-graphite-500">
            <span>$0</span>
            <span>
              {maxPrice !== null ? `Hasta $${maxPrice}` : `Hasta $${priceCeiling}`}
            </span>
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Destacados">
        <CheckRow label="Productos nuevos" checked={onlyNew} onChange={() => setOnlyNew(!onlyNew)} />
        <CheckRow label="En promoción" checked={onlySale} onChange={() => setOnlySale(!onlySale)} />
      </FilterGroup>
    </div>
  );

  return (
    <div>
      {/* Barra superior: búsqueda + orden + contador */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, marca, código, color…"
            className="w-full rounded-full border border-graphite-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-500"
            aria-label="Buscar en el catálogo"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="btn-outline !py-2 lg:hidden"
          >
            Filtros{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
          <label htmlFor="sort" className="sr-only">
            Ordenar
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-graphite-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="recomendados">Recomendados</option>
            <option value="recientes">Más recientes</option>
            <option value="nombre">Nombre A-Z</option>
            {hasPrices && <option value="precio-asc">Precio: menor a mayor</option>}
            {hasPrices && <option value="precio-desc">Precio: mayor a menor</option>}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-graphite-900">
              Filtros
            </h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-brand-700 hover:underline"
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="mt-4">{FiltersPanel}</div>
        </aside>

        {/* Resultados */}
        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-graphite-500">
            {loading
              ? "Cargando…"
              : `${filtered.length} ${filtered.length === 1 ? "producto" : "productos"}`}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-graphite-100" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-graphite-100" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-graphite-100" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <NoResults onClear={clearAll} />
          )}
        </div>
      </div>

      {/* Drawer de filtros móvil */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-graphite-900/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-graphite-100 px-4 py-3">
              <h2 className="text-base font-bold">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-ghost !px-2"
                aria-label="Cerrar filtros"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{FiltersPanel}</div>
            <div className="flex gap-2 border-t border-graphite-100 p-4">
              <button type="button" onClick={clearAll} className="btn-outline flex-1">
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary flex-1"
              >
                Ver {filtered.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Subcomponentes ----
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-graphite-900">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-graphite-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-graphite-300 text-brand-600 accent-brand-600"
      />
      {label}
    </label>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-graphite-200 bg-graphite-50 px-6 py-16 text-center">
      <h3 className="text-lg font-bold text-graphite-900">
        No encontramos productos con esos filtros
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-graphite-600">
        Prueba a quitar algún filtro o buscar con otras palabras. También puedes
        escribirnos por WhatsApp y te ayudamos a encontrar lo que buscas.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onClear} className="btn-outline">
          Limpiar filtros
        </button>
        <a
          href={whatsappGeneral()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
