"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { bulkAction } from "../actions";

// Lista de productos fuera del catálogo, con restauración individual o
// en lote.
export function HiddenList({ items }: { items: Product[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  function restore(ids: string[]) {
    const fd = new FormData();
    fd.set("op", "restore");
    ids.forEach((id) => fd.append("ids", id));
    startTransition(() => bulkAction(fd));
  }

  return (
    <section id="ocultos" className="border border-neutral-800 rounded-lg p-4 scroll-mt-20">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 className="font-semibold">Productos ocultos ({items.length})</h2>
        {selected.size > 0 && (
          <button
            type="button"
            disabled={pending}
            onClick={() => restore([...selected])}
            className="text-sm text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
          >
            {pending ? "Restaurando…" : `Restaurar ${selected.size} seleccionado${selected.size === 1 ? "" : "s"}`}
          </button>
        )}
      </div>
      <p className="text-xs text-neutral-500 mb-3">
        Están fuera del catálogo público pero conservan todos sus datos.
        Restáuralos cuando vuelva a haber stock.
      </p>
      <ul className="text-sm divide-y divide-neutral-800">
        {items.map((p) => (
          <li key={p.id} className="flex items-center py-2 gap-3">
            <input
              type="checkbox"
              className="accent-white"
              checked={selected.has(p.id)}
              aria-label={`Seleccionar ${p.name}`}
              onChange={() =>
                setSelected((prev) => {
                  const n = new Set(prev);
                  if (n.has(p.id)) n.delete(p.id);
                  else n.add(p.id);
                  return n;
                })
              }
            />
            <div className="relative h-9 w-9 shrink-0 rounded overflow-hidden bg-neutral-900 border border-neutral-800 opacity-60">
              <Image src={p.images[0]} alt="" fill sizes="36px" className="object-cover" unoptimized />
            </div>
            <span className="truncate flex-1">
              {p.name} <span className="text-neutral-500">({p.id})</span>
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={() => restore([p.id])}
              className="shrink-0 text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
            >
              Restaurar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
