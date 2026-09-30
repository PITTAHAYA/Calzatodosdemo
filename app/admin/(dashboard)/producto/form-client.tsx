"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { uploadImageAction } from "../../actions";

export interface ProductFormValues extends Partial<Product> {}

interface Props {
  product?: Product;
  action: (formData: FormData) => void;
  submitLabel?: string;
  showSlug?: boolean;
}

export function ProductForm({
  product,
  action,
  submitLabel = "Guardar cambios",
  showSlug = false,
}: Props) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImageAction(fd);
      if (!res.ok) setUploadError(res.error);
      else setImages((prev) => [...prev, res.url]);
    } catch (err) {
      setUploadError((err as Error).message ?? "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  function moveImage(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  return (
    <form
      onSubmit={(e) => {
        // Enviamos con startTransition para tener el estado "pending".
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("images", images.join("\n"));
        startTransition(() => action(fd));
      }}
      className="space-y-8"
    >
      <section className="grid md:grid-cols-2 gap-4">
        <Field label="Nombre" name="name" defaultValue={product?.name} required />
        {showSlug && (
          <Field
            label="Slug (URL)"
            name="slug"
            placeholder="ej. sneaker-blanco-mario"
            help="Se usará en /productos/<slug>. Solo minúsculas, números y guiones."
          />
        )}
        <Field label="Marca (slug)" name="brand" defaultValue={product?.brand ?? "calzatodos"} />
        <Select
          label="Público"
          name="audience"
          defaultValue={product?.audience}
          options={[
            ["hombre", "Hombre"],
            ["mujer", "Mujer"],
            ["nino", "Niño"],
            ["nina", "Niña"],
          ]}
        />
        <Select
          label="Categoría"
          name="category"
          defaultValue={product?.category}
          options={[
            ["formal", "Formal"],
            ["escolar", "Escolar"],
            ["sneakers", "Sneakers"],
            ["deportivo", "Deportivo"],
            ["luces", "Con luces"],
            ["urbano", "Urbano"],
          ]}
        />
        <Select
          label="Estilo"
          name="style"
          defaultValue={product?.style}
          options={[
            ["formal", "Formal"],
            ["escolar", "Escolar"],
            ["deportivo", "Deportivo"],
            ["urbano", "Urbano"],
            ["casual", "Casual"],
          ]}
        />
      </section>

      <section>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={4}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Field
          label="Precio ($)"
          name="price"
          type="number"
          step="0.01"
          defaultValue={product?.price ?? ""}
          help="Si el producto tiene un solo precio, deja el rango vacío."
        />
        <Field
          label="Precio máximo ($, opcional)"
          name="priceMax"
          type="number"
          step="0.01"
          defaultValue={product?.priceMax ?? ""}
          help="Úsalo cuando el precio varía según la talla."
        />
        <Field
          label="Precio anterior (tachado, opcional)"
          name="previousPrice"
          type="number"
          step="0.01"
          defaultValue={product?.previousPrice ?? ""}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Field
          label="Tallas disponibles"
          name="availableSizes"
          defaultValue={product?.availableSizes.join(", ") ?? ""}
          help="Separadas por coma. Ejemplo: 38, 39, 40, 41."
        />
        <Field
          label="Colores"
          name="colors"
          defaultValue={product?.colors.join(", ") ?? ""}
          help="Separados por coma. Ejemplo: Negro, Blanco, Café."
        />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Textarea
          label="Características (una por línea)"
          name="features"
          defaultValue={product?.features.join("\n") ?? ""}
        />
        <Textarea
          label="Materiales (uno por línea)"
          name="materials"
          defaultValue={product?.materials.join("\n") ?? ""}
        />
      </section>

      <section>
        <Textarea
          label="Etiquetas / palabras clave"
          name="tags"
          defaultValue={product?.tags.join(", ") ?? ""}
          rows={2}
        />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Textarea
          label="Información de garantía"
          name="warrantyInformation"
          defaultValue={product?.warrantyInformation}
          rows={2}
        />
        <Textarea
          label="Cuidados"
          name="careInstructions"
          defaultValue={product?.careInstructions}
          rows={2}
        />
      </section>

      <section className="flex flex-wrap gap-6">
        <Checkbox label="Destacado en portada" name="isFeatured" defaultChecked={product?.isFeatured} />
        <Checkbox label="Marcar como nuevo" name="isNew" defaultChecked={product?.isNew} />
        <Checkbox label="En oferta" name="isOnSale" defaultChecked={product?.isOnSale} />
      </section>

      {/* ---------- Fotos ---------- */}
      <section className="border border-neutral-800 rounded-lg p-4">
        <h2 className="font-semibold mb-1">Fotos del producto</h2>
        <p className="text-xs text-neutral-400 mb-3">
          La primera foto es la principal. Formato recomendado: cuadrada (1:1),
          1200×1200 px, fondo blanco o claro, JPG/WEBP menor a 4 MB.{" "}
          <a
            href="/admin/guia-fotos"
            className="text-sky-400 hover:text-sky-300 underline"
            target="_blank"
          >
            Ver guía completa
          </a>
          .
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative border border-neutral-800 rounded-md overflow-hidden bg-neutral-900"
            >
              <div className="relative aspect-square">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                )}
              </div>
              <div className="flex justify-between text-xs bg-neutral-900 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  className="px-2 py-1 disabled:opacity-30 hover:bg-neutral-800"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  className="px-2 py-1 disabled:opacity-30 hover:bg-neutral-800"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="px-2 py-1 text-red-400 hover:bg-neutral-800"
                >
                  Quitar
                </button>
              </div>
              <p className="px-2 pb-2 text-[10px] text-neutral-500 truncate">
                {src}
              </p>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center border border-dashed border-neutral-700 rounded-md aspect-square cursor-pointer hover:bg-neutral-900 text-center px-2">
            <span className="text-2xl">＋</span>
            <span className="text-xs mt-1 text-neutral-400">
              {uploading ? "Subiendo…" : "Subir foto"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onPickFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        {uploadError && (
          <p className="mt-2 text-sm text-red-400">{uploadError}</p>
        )}
        <p className="mt-3 text-xs text-neutral-500">
          Consejo: puedes reemplazar la principal quitándola y subiendo la
          nueva, o arrastrando con los botones ← →.
        </p>
      </section>

      <div className="sticky bottom-0 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 -mx-4 px-4 py-3 flex justify-end">
        <button
          disabled={pending || uploading}
          className="rounded-md bg-white text-neutral-900 font-semibold px-5 py-2 text-sm hover:bg-neutral-200 disabled:opacity-60"
        >
          {pending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  help,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <input
        {...rest}
        className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
      />
      {help && <span className="block text-xs text-neutral-500 mt-1">{help}</span>}
    </label>
  );
}

function Textarea({
  label,
  help,
  rows = 4,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  help?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <textarea
        {...rest}
        rows={rows}
        className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
      />
      {help && <span className="block text-xs text-neutral-500 mt-1">{help}</span>}
    </label>
  );
}

function Select({
  label,
  options,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: [string, string][];
}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <select
        {...rest}
        className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Checkbox({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" {...rest} className="accent-white" />
      <span>{label}</span>
    </label>
  );
}
