"use client";

import { useMemo, useState } from "react";
import type { Store } from "@/data/stores";
import { storeMapsEmbedUrl } from "@/data/stores";
import { StoreCard } from "@/components/StoreCard";
import { SearchIcon, MapPinIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export function StoresClient({ stores }: { stores: Store[] }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"lista" | "mapa">("lista");
  const [activeStore, setActiveStore] = useState<Store>(stores[0]);

  const cities = useMemo(
    () => Array.from(new Set(stores.map((s) => s.city))),
    [stores]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stores;
    return stores.filter(
      (s) =>
        s.city.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [stores, query]);

  return (
    <div>
      {/* Controles */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por ciudad o dirección…"
            className="w-full rounded-full border border-graphite-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-500"
            aria-label="Buscar tienda por ciudad"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Chips de ciudad */}
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => setQuery("")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                !query ? "bg-brand-600 text-white" : "bg-graphite-100 text-graphite-700 hover:bg-graphite-200"
              )}
            >
              Todas
            </button>
            {cities.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setQuery(c)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  query === c ? "bg-brand-600 text-white" : "bg-graphite-100 text-graphite-700 hover:bg-graphite-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Toggle vista */}
          <div className="flex rounded-full border border-graphite-200 p-0.5">
            {(["lista", "mapa"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition",
                  view === v ? "bg-graphite-900 text-white" : "text-graphite-600"
                )}
                aria-pressed={view === v}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "lista" ? (
        filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((s) => (
              <StoreCard key={s.slug} store={s} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-graphite-50 px-4 py-10 text-center text-sm text-graphite-500">
            No encontramos tiendas con ese criterio. Prueba con otra ciudad.
          </p>
        )
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr,1.3fr]">
          {/* Lista lateral */}
          <div className="space-y-3">
            {filtered.map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActiveStore(s)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition",
                  activeStore.slug === s.slug
                    ? "border-brand-500 bg-brand-50"
                    : "border-graphite-100 bg-white hover:border-graphite-300"
                )}
              >
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span>
                  <span className="block text-sm font-bold text-graphite-900">{s.name}</span>
                  <span className="mt-0.5 block text-xs text-graphite-500">{s.address}</span>
                  <span className="mt-1 block text-xs text-graphite-400">{s.hoursLabel}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Mapa (carga diferida vía iframe) */}
          <div className="min-h-[320px] overflow-hidden rounded-2xl border border-graphite-100">
            <iframe
              key={activeStore.slug}
              title={`Mapa de ${activeStore.name}`}
              src={storeMapsEmbedUrl(activeStore)}
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </div>
  );
}
