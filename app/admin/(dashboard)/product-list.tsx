"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/data/products";
import { getCategory } from "@/data/categories";
import { getBrand } from "@/data/brands";
import type { ProductIssue } from "@/lib/product-validation";
import {
  deleteProductAction,
  duplicateProductAction,
  bulkAction,
  quickUpdateAction,
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

type BulkOp = "hide" | "feature" | "unfeature" | "sale" | "unsale" | "new" | "unnew";

const BULK_OPTIONS: [BulkOp, string][] = [
  ["feature", "★ Destacar en portada"],
  ["unfeature", "Quitar de destacados"],
  ["sale", "Marcar en oferta"],
  ["unsale", "Quitar oferta"],
  ["new", "Marcar como nuevo"],
  ["unnew", "Quitar “nuevo”"],
  ["hide", "Quitar del catálogo"],
];

export function ProductList({
  products,
  currentSort,
  issues = {},
}: {
  products: Product[];
  currentSort: string;
  issues?: Record<string, ProductIssue[]>;
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

  function runBulk(op: BulkOp) {
    if (selected.size === 0) return;
    if (
      op === "hide" &&
      !window.confirm(
        `¿Quitar ${selected.size} producto${selected.size === 1 ? "" : "s"} del catálogo? Podrás restaurarlos después.`
      )
    )
      return;
    const fd = new FormData();
    fd.set("op", op);
    selected.forEach((id) => fd.append("ids", id));
    startTransition(() => {
      bulkAction(fd);
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
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <select
              value=""
              disabled={pending}
              onChange={(e) => e.target.value && runBulk(e.target.value as BulkOp)}
              className="rounded-md bg-neutral-800 border border-neutral-600 px-2 py-1 text-sm disabled:opacity-50"
              aria-label="Acción en lote"
            >
              <option value="">{pending ? "Aplicando…" : "Elegir acción…"}</option>
              {BULK_OPTIONS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
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
                  <Link href={`/admin/producto/${p.id}`} className="font-medium hover:text-sky-300">
                    {p.name}
                  </Link>
                  <div className="text-xs text-neutral-500">
                    {p.id} · {p.slug}
                  </div>
                  <IssueBadge issues={issues[p.id]} />
                </td>
                <td className="px-3 py-2">{getBrand(p.brand)?.name ?? p.brand}</td>
                <td className="px-3 py-2 capitalize">
                  {AUDIENCE_LABEL[p.audience] ?? p.audience} ·{" "}
                  {getCategory(p.category)?.name ?? p.category}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <QuickPrice product={p} />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    <FlagToggle product={p} field="isFeatured" label="Destacado" />
                    <FlagToggle product={p} field="isNew" label="Nuevo" />
                    <FlagToggle product={p} field="isOnSale" label="Oferta" />
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
                <QuickPrice product={p} />
              </div>
              <div className="mt-1.5 flex gap-1 flex-wrap">
                <FlagToggle product={p} field="isFeatured" label="Destacado" />
                <FlagToggle product={p} field="isNew" label="Nuevo" />
                <FlagToggle product={p} field="isOnSale" label="Oferta" />
              </div>
              <IssueBadge issues={issues[p.id]} />
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

// -------------------- Edición rápida --------------------

function QuickPrice({ product }: { product: Product }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(product.price?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const savingRef = useRef(false);

  function save() {
    if (savingRef.current) return;
    const txt = val.trim().replace(",", ".");
    const next = txt === "" ? null : Number(txt);
    if (next === (product.price ?? null)) {
      setEditing(false);
      return;
    }
    savingRef.current = true;
    startTransition(async () => {
      const res = await quickUpdateAction(product.id, "price", next);
      savingRef.current = false;
      if (!res.ok) setError(res.error);
      else {
        setError(null);
        setEditing(false);
        router.refresh();
      }
    });
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        title="Clic para cambiar el precio"
        className="group inline-flex items-center gap-1 rounded px-1 -mx-1 hover:bg-neutral-800"
      >
        {priceLabel(product) ?? <span className="text-amber-400">Sin precio</span>}
        <span className="text-neutral-600 group-hover:text-neutral-300 text-xs">✎</span>
      </button>
    );
  }
  return (
    <span className="inline-flex flex-col">
      <span className="inline-flex items-center gap-1">
        <span className="text-neutral-500">$</span>
        <input
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          inputMode="decimal"
          value={val}
          disabled={pending}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            // Enter solo quita el foco; el guardado ocurre una vez en onBlur.
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              savingRef.current = true; // evita que el blur guarde
              setTimeout(() => (savingRef.current = false), 0);
              setVal(product.price?.toString() ?? "");
              setError(null);
              setEditing(false);
            }
          }}
          onBlur={save}
          placeholder="vacío = sin precio"
          className="w-20 rounded bg-neutral-900 border border-neutral-600 px-1.5 py-0.5 text-sm"
        />
        {pending && <span className="text-xs text-neutral-500">…</span>}
      </span>
      {error && <span className="text-[11px] text-red-400 max-w-[180px] whitespace-normal">{error}</span>}
    </span>
  );
}

function FlagToggle({
  product,
  field,
  label,
}: {
  product: Product;
  field: "isFeatured" | "isNew" | "isOnSale";
  label: string;
}) {
  const router = useRouter();
  const [on, setOn] = useState(Boolean(product[field]));
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={on}
      title={on ? `Quitar "${label}"` : `Marcar como "${label}"`}
      onClick={() => {
        const next = !on;
        setOn(next); // optimista
        startTransition(async () => {
          const res = await quickUpdateAction(product.id, field, next);
          if (!res.ok) {
            setOn(!next);
            window.alert(res.error);
          } else router.refresh();
        });
      }}
      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide transition disabled:opacity-60 ${
        on
          ? "bg-white text-neutral-900 border-white font-semibold"
          : "border-neutral-800 text-neutral-600 hover:border-neutral-600 hover:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}

function IssueBadge({ issues }: { issues?: ProductIssue[] }) {
  if (!issues || issues.length === 0) return null;
  const errors = issues.filter((i) => i.level === "error");
  const shown = errors.length ? errors : issues;
  return (
    <div
      className={`mt-1 text-[11px] ${errors.length ? "text-red-400" : "text-amber-500/80"}`}
      title={issues.map((i) => `• ${i.message}`).join("\n")}
    >
      {errors.length ? "✕" : "!"} {shown[0].message}
      {issues.length > 1 && <span className="text-neutral-500"> (+{issues.length - 1})</span>}
    </div>
  );
}
