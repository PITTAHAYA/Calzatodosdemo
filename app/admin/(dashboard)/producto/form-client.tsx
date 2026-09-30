"use client";

import { useMemo, useState, useTransition } from "react";
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

const SIZE_PRESETS: Record<string, number[]> = {
  hombre: [38, 39, 40, 41, 42, 43, 44],
  mujer: [34, 35, 36, 37, 38, 39, 40],
  nino: [28, 29, 30, 31, 32, 33, 34, 35],
  nina: [27, 28, 29, 30, 31, 32, 33, 34],
  infantil: [20, 21, 22, 23, 24, 25],
};

const COLOR_PRESETS = [
  "Negro",
  "Blanco",
  "Café",
  "Azul",
  "Rojo",
  "Gris",
  "Beige",
  "Rosado",
];

export function ProductForm({
  product,
  action,
  submitLabel = "Guardar cambios",
  showSlug = false,
}: Props) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<number[]>(product?.availableSizes ?? []);
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [audience, setAudience] = useState<string>(product?.audience ?? "hombre");
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [priceMax, setPriceMax] = useState(product?.priceMax ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const suggestedSizes = SIZE_PRESETS[audience] ?? SIZE_PRESETS.hombre;

  const priceLabel = useMemo(() => {
    if (!price) return null;
    return priceMax ? `$${price} – $${priceMax}` : `$${price}`;
  }, [price, priceMax]);

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

  function toggleSize(s: number) {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort((a, b) => a - b)
    );
  }

  function toggleColor(c: string) {
    setColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setFormError(null);
        if (!name.trim()) {
          setFormError("El nombre del producto es obligatorio.");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        if (images.length === 0) {
          setFormError(
            "Agrega al menos una foto antes de guardar. Sin foto, el producto se ve vacío en el catálogo."
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const fd = new FormData(e.currentTarget);
        fd.set("images", images.join("\n"));
        fd.set("availableSizes", sizes.join(","));
        fd.set("colors", colors.join(","));
        startTransition(() => action(fd));
      }}
      className="space-y-8"
    >
      {formError && (
        <div className="rounded-md border border-red-800 bg-red-950/40 text-red-200 px-4 py-3 text-sm">
          {formError}
        </div>
      )}

      {/* ---------- 1. Datos básicos ---------- */}
      <Section step={1} title="Datos básicos">
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Nombre del producto"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            help="Como quieres que lo vea el cliente. Ej: Sneaker Blanco Urban."
          />
          {showSlug && (
            <Field
              label="Slug (URL)"
              name="slug"
              placeholder="ej. sneaker-blanco-mario"
              help="Se usará en /productos/<slug>. Déjalo vacío para generarlo del nombre."
            />
          )}
          <Field label="Marca (slug)" name="brand" defaultValue={product?.brand ?? "calzatodos"} />
          <Select
            label="Público"
            name="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            options={[
              ["hombre", "Hombre"],
              ["mujer", "Mujer"],
              ["nino", "Niño"],
              ["nina", "Niña"],
              ["infantil", "Infantil"],
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
        </div>
        <label className="block text-sm mt-4">
          <span className="block font-medium mb-1">Descripción</span>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={3}
            placeholder="2–4 frases sencillas. Ej: Zapato cómodo y resistente para el uso diario…"
            className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
          />
        </label>
      </Section>

      {/* ---------- 2. Precio ---------- */}
      <Section step={2} title="Precio">
        <div className="grid md:grid-cols-3 gap-4">
          <Field
            label="Precio ($)"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <Field
            label="Precio máximo ($, opcional)"
            name="priceMax"
            type="number"
            step="0.01"
            min="0"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value === "" ? "" : Number(e.target.value))}
            help="Solo si el precio cambia según la talla."
          />
          <Field
            label="Precio anterior (tachado, opcional)"
            name="previousPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.previousPrice ?? ""}
            help="Úsalo solo si la oferta es real."
          />
        </div>
        {priceLabel && (
          <p className="mt-3 text-sm text-neutral-400">
            Así se verá en el catálogo: <span className="text-white font-semibold">{priceLabel}</span>
          </p>
        )}
      </Section>

      {/* ---------- 3. Tallas y colores ---------- */}
      <Section step={3} title="Tallas y colores">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium mb-2">
              Tallas disponibles ({sizes.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedSizes.map((s) => (
                <TogglePill key={s} active={sizes.includes(s)} onClick={() => toggleSize(s)}>
                  {s}
                </TogglePill>
              ))}
              {sizes
                .filter((s) => !suggestedSizes.includes(s))
                .map((s) => (
                  <TogglePill key={s} active onClick={() => toggleSize(s)}>
                    {s}
                  </TogglePill>
                ))}
            </div>
            <NumberAdder
              placeholder="Otra talla…"
              onAdd={(n) => setSizes((prev) => (prev.includes(n) ? prev : [...prev, n].sort((a, b) => a - b)))}
            />
            <p className="text-xs text-neutral-500 mt-2">
              Toca las tallas que tienes en stock. Se sugieren según el público
              elegido arriba.
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium mb-2">
              Colores ({colors.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <TogglePill key={c} active={colors.includes(c)} onClick={() => toggleColor(c)}>
                  {c}
                </TogglePill>
              ))}
              {colors
                .filter((c) => !COLOR_PRESETS.includes(c))
                .map((c) => (
                  <TogglePill key={c} active onClick={() => toggleColor(c)}>
                    {c}
                  </TogglePill>
                ))}
            </div>
            <TextAdder
              placeholder="Otro color…"
              onAdd={(c) => setColors((prev) => (prev.includes(c) ? prev : [...prev, c]))}
            />
          </div>
        </div>
      </Section>

      {/* ---------- 4. Fotos ---------- */}
      <Section step={4} title="Fotos del producto">
        <p className="text-xs text-neutral-400 mb-3">
          La primera foto es la principal (se ve en el catálogo). Formato
          recomendado: cuadrada (1:1), 1200×1200 px, fondo blanco o claro,
          JPG/WEBP menor a 4 MB.{" "}
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
                  title="Mover a la izquierda"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  className="px-2 py-1 disabled:opacity-30 hover:bg-neutral-800"
                  title="Mover a la derecha"
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
            </div>
          ))}
          <label className="flex flex-col items-center justify-center border border-dashed border-neutral-700 rounded-md aspect-square cursor-pointer hover:bg-neutral-900 hover:border-neutral-500 text-center px-2 transition">
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
        {images.length === 0 && !uploadError && (
          <p className="mt-2 text-sm text-amber-400">
            Aún no has agregado fotos. Sube al menos una antes de guardar.
          </p>
        )}
      </Section>

      {/* ---------- 5. Detalles adicionales ---------- */}
      <Details title="Más detalles (opcional)">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>
          <Textarea
            label="Etiquetas / palabras clave"
            name="tags"
            defaultValue={product?.tags.join(", ") ?? ""}
            rows={2}
            help="Separadas por coma. Ayudan a que el producto aparezca en más búsquedas."
          />
          <div className="grid md:grid-cols-2 gap-4">
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
          </div>
        </div>
      </Details>

      {/* ---------- 6. Visibilidad ---------- */}
      <Section step={5} title="Visibilidad en el sitio">
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Destacado en portada" name="isFeatured" defaultChecked={product?.isFeatured} />
          <Checkbox label="Marcar como nuevo" name="isNew" defaultChecked={product?.isNew} />
          <Checkbox label="En oferta" name="isOnSale" defaultChecked={product?.isOnSale} />
        </div>
      </Section>

      <div className="sticky bottom-0 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 -mx-4 px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-500 hidden sm:block">
          {images.length} foto{images.length === 1 ? "" : "s"} · {sizes.length} talla
          {sizes.length === 1 ? "" : "s"} · {colors.length} color
          {colors.length === 1 ? "" : "es"}
        </p>
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

// -------------------- Bloques de layout --------------------

function Section({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-neutral-800 rounded-lg p-4">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[11px] font-bold text-neutral-300">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Details({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="border border-neutral-800 rounded-lg p-4 group">
      <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
        {title}
        <span className="text-neutral-500 text-sm group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

// -------------------- Controles --------------------

function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        active
          ? "bg-white text-neutral-900 border-white font-medium"
          : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
      }`}
    >
      {children}
    </button>
  );
}

function NumberAdder({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (n: number) => void;
}) {
  const [val, setVal] = useState("");
  function commit() {
    const n = Number(val);
    if (Number.isFinite(n) && n > 0) onAdd(n);
    setVal("");
  }
  return (
    <input
      type="number"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
      }}
      onBlur={() => val && commit()}
      placeholder={placeholder}
      className="mt-2 w-32 rounded-md bg-neutral-900 border border-neutral-800 px-2 py-1 text-sm"
    />
  );
}

function TextAdder({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (c: string) => void;
}) {
  const [val, setVal] = useState("");
  function commit() {
    const c = val.trim();
    if (c) onAdd(c);
    setVal("");
  }
  return (
    <input
      type="text"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          commit();
        }
      }}
      onBlur={() => val && commit()}
      placeholder={placeholder}
      className="mt-2 w-40 rounded-md bg-neutral-900 border border-neutral-800 px-2 py-1 text-sm"
    />
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
