"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import {
  deleteProductAction,
  duplicateProductAction,
  bulkHideAction,
} from "../actions";
import { ConfirmSubmit } from "./confirm-submit";

const AUDIENCE_LABEL: Record<string, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  nino: "Niño",
  nina: "Niña",
  infantil: "Infantil",
};

function priceLabel(p: Product) {
  if (typeof p.price !== "number") return null;
  return p.priceMax ? `$${p.price}–$${p.priceMax}` : `$${p.price}`;
}

export function ProductList({
  products,
  currentSort,
}: {
  products: Product[];
  currentSort: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const allSelected = products.length > 0 && selected.size === products.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  }

  function runBulkHide() {
    if (selected.size === 0) return;
    if (
      !window.confirm(
        `¿Quitar ${selected.size} producto${selected.size === 1 ? "" : "s"} del catálogo? Podrás restaurarlos después.`
      )
    )
      return;
    const fd = new FormData();
    selected.forEach((id) => fd.append("ids", id));
    startTransition(() => {
      bulkHideAction(fd);
      setSelected(new Set());
    });
  }

  if (products.length === 0) {
    return (
      <p className="border border-neutral-800 rounded-lg py-10 text-center text-neutral-500">
        Sin resultados para estos filtros.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="sticky top-[61px] z-10 flex items-center justify-between gap-3 rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-2.5 text-sm shadow-lg">
          <span>
            <strong>{selected.size}</strong> seleccionado{selected.size === 1 ? "" : "s"}
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={runBulkHide}
              disabled={pending}
              className="text-red-400 hover:text-red-300 font-medium disabled:opacity-50"
            >
              {pending ? "Aplicando…" : "Quitar del catálogo"}
            </button>
          </div>
        </div>
      )}

      {/* ---------- Tabla (desktop) ---------- */}
      <div className="hidden md:block overflow-x-auto border border-neutral-800 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr className="text-left">
              <th className="px-3 py-2 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-white"
                  aria-label="Seleccionar todos"
                />
              </th>
              <th className="px-3 py-2">Foto</th>
              <SortableHeader field="name" label="Producto" currentSort={currentSort} />
              <th className="px-3 py-2">Marca</th>
              <th className="px-3 py-2">Público / Categoría</th>
              <SortableHeader field="price" label="Precio" currentSort={currentSort} />
              <th className="px-3 py-2">Estado</th>
              <th className="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className={`border-t border-neutral-800 align-top ${
                  selected.has(p.id) ? "bg-white/5" : ""
                }`}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.has(p.id)}
                    onChange={() => toggle(p.id)}
                    className="accent-white"
                    aria-label={`Seleccionar ${p.name}`}
                  />
                </td>
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
                  {priceLabel(p) ?? <span className="text-amber-400">Sin precio</span>}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && <Chip>Destacado</Chip>}
                    {p.isNew && <Chip>Nuevo</Chip>}
                    {p.isOnSale && <Chip>Oferta</Chip>}
                  </div>
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap space-x-3">
                  <Link href={`/admin/producto/${p.id}`} className="text-sky-400 hover:text-sky-300">
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
          </tbody>
        </table>
      </div>

      {/* ---------- Tarjetas (móvil) ---------- */}
      <div className="md:hidden space-y-3">
        {products.map((p) => (
          <div
            key={p.id}
            className={`border rounded-lg p-3 flex gap-3 ${
              selected.has(p.id) ? "border-neutral-500 bg-white/5" : "border-neutral-800"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(p.id)}
              onChange={() => toggle(p.id)}
              className="accent-white mt-1 shrink-0"
              aria-label={`Seleccionar ${p.name}`}
            />
            <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
              <Image src={p.images[0]} alt="" fill sizes="64px" className="object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-xs text-neutral-500 capitalize">
                {AUDIENCE_LABEL[p.audience] ?? p.audience} · {getCategory(p.category)?.name ?? p.category}
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm flex-wrap">
                <span>{priceLabel(p) ?? <span className="text-amber-400">Sin precio</span>}</span>
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
                  <ConfirmSubmit message={`¿Quitar "${p.name}" del catálogo público?`} className="text-red-400">
                    Quitar
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SortableHeader({
  field,
  label,
  currentSort,
}: {
  field: "name" | "price";
  label: string;
  currentSort: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isActive = currentSort === field || currentSort === `-${field}`;
  const nextSort = currentSort === field ? `-${field}` : field;

  const params = new URLSearchParams(searchParams.toString());
  params.set("sort", nextSort);

  return (
    <th className="px-3 py-2">
      <Link
        href={`${pathname}?${params.toString()}`}
        className="hover:text-white inline-flex items-center gap-1"
      >
        {label}
        {isActive && <span>{currentSort.startsWith("-") ? "↓" : "↑"}</span>}
      </Link>
    </th>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] uppercase tracking-wide">
      {children}
    </span>
  );
}
