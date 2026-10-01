"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import type { Brand } from "@/data/brands";
import { audiences, type Category } from "@/data/categories";
import { uploadImageAction } from "../../actions";
import {
  saveBrandAction,
  saveCategoryAction,
  type TaxonomyFormState,
} from "../../taxonomy-actions";

const input =
  "w-full rounded-md bg-neutral-900 border px-3 py-2 text-sm";

function FieldError({ msg }: { msg?: string }) {
  return msg ? <span className="block text-xs text-red-400 mt-1">{msg}</span> : null;
}

// -------------------- Marca --------------------

export function BrandForm({ brand }: { brand?: Brand }) {
  const [state, action, pending] = useActionState<TaxonomyFormState, FormData>(
    saveBrandAction.bind(null, brand?.slug ?? null),
    { ok: true }
  );
  const [logo, setLogo] = useState(brand?.logo ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const e = state.errors ?? {};

  async function onPick(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImageAction(fd);
      if (res.ok) setLogo(res.url);
      else setUploadError(res.error);
    } catch {
      setUploadError("No se pudo subir el logo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-4">
      {e.form && <p className="rounded border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-200">{e.form}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="block font-medium mb-1">Nombre de la marca *</span>
          <input name="name" defaultValue={brand?.name} required maxLength={60}
            placeholder="Ej: Adidas" className={`${input} ${e.name ? "border-red-600" : "border-neutral-800"}`} />
          <FieldError msg={e.name} />
          {brand && <span className="block text-xs text-neutral-500 mt-1">Dirección: /marcas/{brand.slug}</span>}
        </label>
        <label className="block text-sm">
          <span className="block font-medium mb-1">Tipo</span>
          <select name="type" defaultValue={brand?.type ?? "internacional"} className={`${input} border-neutral-800`}>
            <option value="internacional">Marca internacional (distribuida)</option>
            <option value="propia">Marca propia de Calzatodos</option>
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="block font-medium mb-1">Frase corta (opcional)</span>
          <input name="tagline" defaultValue={brand?.tagline} maxLength={140}
            placeholder="Ej: Rendimiento para cada paso" className={`${input} border-neutral-800`} />
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="block font-medium mb-1">Descripción (opcional)</span>
          <textarea name="description" defaultValue={brand?.description} rows={2} maxLength={1000}
            placeholder="Se muestra en la página de la marca." className={`${input} border-neutral-800`} />
        </label>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <input type="hidden" name="logo" value={logo} />
        <div className="relative h-16 w-28 rounded-md bg-white flex items-center justify-center overflow-hidden">
          {logo ? (
            <Image src={logo} alt="" fill sizes="112px" className="object-contain p-2" unoptimized />
          ) : (
            <span className="text-[10px] text-neutral-500">Sin logo</span>
          )}
        </div>
        <label className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm cursor-pointer hover:bg-neutral-800">
          {uploading ? "Subiendo…" : logo ? "Cambiar logo" : "Subir logo (opcional)"}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="hidden" onChange={onPick} disabled={uploading} />
        </label>
        {logo && (
          <button type="button" onClick={() => setLogo("")} className="text-sm text-red-400 hover:text-red-300">
            Quitar logo
          </button>
        )}
        <span className="text-xs text-neutral-500 w-full">
          Sin logo, el sitio muestra el nombre de la marca con letras grandes. Ideal: PNG con fondo transparente.
        </span>
        {(uploadError || e.logo) && <span className="text-xs text-red-400 w-full">{uploadError ?? e.logo}</span>}
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="hidden" defaultChecked={brand?.hidden} className="accent-white" />
        Ocultar de la sección de marcas y del menú (sus productos sí se ven)
      </label>

      <div>
        <button disabled={pending || uploading}
          className="rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200 disabled:opacity-60">
          {pending ? "Guardando…" : brand ? "Guardar marca" : "Crear marca"}
        </button>
      </div>
    </form>
  );
}

// -------------------- Categoría --------------------

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState<TaxonomyFormState, FormData>(
    saveCategoryAction.bind(null, category?.slug ?? null),
    { ok: true }
  );
  const e = state.errors ?? {};
  const selected = new Set(category?.audience ?? ["mujer", "hombre", "nino", "nina"]);

  return (
    <form action={action} className="space-y-4">
      {e.form && <p className="rounded border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-200">{e.form}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="block font-medium mb-1">Nombre de la categoría *</span>
          <input name="name" defaultValue={category?.name} required maxLength={60}
            placeholder="Ej: Pantuflas" className={`${input} ${e.name ? "border-red-600" : "border-neutral-800"}`} />
          <FieldError msg={e.name} />
        </label>
        <label className="block text-sm">
          <span className="block font-medium mb-1">Descripción corta (opcional)</span>
          <input name="description" defaultValue={category?.description} maxLength={300}
            placeholder="Ej: Comodidad para estar en casa." className={`${input} border-neutral-800`} />
        </label>
      </div>
      <fieldset>
        <legend className="text-sm font-medium mb-2">¿Para quién es? *</legend>
        <div className="flex flex-wrap gap-4">
          {audiences.map((a) => (
            <label key={a.value} className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="audience" value={a.value} defaultChecked={selected.has(a.value)} className="accent-white" />
              {a.label}
            </label>
          ))}
        </div>
        <span className="block text-xs text-neutral-500 mt-1">
          Al crear un producto, la categoría solo aparece para estos públicos.
        </span>
        <FieldError msg={e.audience} />
      </fieldset>
      <button disabled={pending}
        className="rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200 disabled:opacity-60">
        {pending ? "Guardando…" : category ? "Guardar categoría" : "Crear categoría"}
      </button>
    </form>
  );
}
