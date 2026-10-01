"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { audiences, styles, type Category } from "@/data/categories";
import type { Brand } from "@/data/brands";
import { validateProductInput, type FieldErrors } from "@/lib/product-validation";
import { uploadImageAction, type FormState } from "../../actions";

interface Props {
  product?: Product;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel?: string;
  showSlug?: boolean;
  // Listas completas (originales + creadas desde el panel).
  brands: Brand[];
  categories: Category[];
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

const STYLE_OPTIONS: [string, string][] = Array.from(
  new Map<string, string>([
    ...styles.map((s) => [s.slug, s.name] as [string, string]),
    ["formal", "Formal"],
    ["escolar", "Escolar"],
    ["deportivo", "Deportivo"],
    ["urbano", "Urbano"],
    ["casual", "Casual"],
  ])
);

const toNum = (v: string) => (v.trim() === "" ? undefined : Number(v.replace(",", ".")));

export function ProductForm({
  product,
  action,
  submitLabel = "Guardar cambios",
  showSlug = false,
  brands,
  categories,
}: Props) {
  const [state, formAction, pending] = useActionState(action, { ok: true });
  const formRef = useRef<HTMLFormElement>(null);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<number[]>(product?.availableSizes ?? []);
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [audience, setAudience] = useState<string>(product?.audience ?? "hombre");
  const [category, setCategory] = useState<string>(product?.category ?? "sneakers");
  const [brand, setBrand] = useState<string>(product?.brand ?? "calzatodos");
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [priceMax, setPriceMax] = useState(product?.priceMax?.toString() ?? "");
  const [previousPrice, setPreviousPrice] = useState(product?.previousPrice?.toString() ?? "");
  const [isOnSale, setIsOnSale] = useState(Boolean(product?.isOnSale));
  const [isNew, setIsNew] = useState(Boolean(product?.isNew));
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);

  // Errores: los del servidor (tras enviar) o los calculados en vivo.
  const liveErrors: FieldErrors = useMemo(
    () =>
      validateProductInput({
        name,
        audience: audience as Product["audience"],
        category,
        brand,
        description,
        price: toNum(price),
        priceMax: toNum(priceMax),
        previousPrice: toNum(previousPrice),
        images,
        availableSizes: sizes,
      }, { brands: brands.map((b) => b.slug), categories: categories.map((c) => c.slug) }),
    [brands, categories, name, audience, category, brand, description, price, priceMax, previousPrice, images, sizes]
  );
  const errors: FieldErrors = touched ? { ...liveErrors, ...(state.errors ?? {}) } : state.errors ?? {};
  const errorCount = Object.keys(liveErrors).length;

  // Si el servidor rechaza el guardado, vuelve a marcar el formulario como
  // "con cambios" para que siga avisando al salir.
  useEffect(() => {
    if (!state.ok) {
      setDirty(true);
      setTouched(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state]);

  // Avisa antes de cerrar la pestaña o recargar si hay cambios sin guardar.
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Atajo ⌘S / Ctrl+S para guardar.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const suggestedSizes = SIZE_PRESETS[audience] ?? SIZE_PRESETS.hombre;
  const categoryOptions = categories.filter(
    (c) => c.audience.includes(audience as Product["audience"]) || c.slug === category
  );

  const priceLabel = useMemo(() => {
    if (!price) return null;
    return priceMax ? `$${price} – $${priceMax}` : `$${price}`;
  }, [price, priceMax]);

  const discount =
    toNum(previousPrice) && toNum(price) && toNum(previousPrice)! > toNum(price)!
      ? Math.round((1 - toNum(price)! / toNum(previousPrice)!) * 100)
      : null;

  async function uploadFiles(files: File[]) {
    const list = files.filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setUploadError(null);
    setUploading((n) => n + list.length);
    const failures: string[] = [];
    await Promise.all(
      list.map(async (file) => {
        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await uploadImageAction(fd);
          if (!res.ok) failures.push(`${file.name}: ${res.error}`);
          else {
            setImages((prev) => [...prev, res.url]);
            setDirty(true);
          }
        } catch {
          failures.push(`${file.name}: error de conexión.`);
        } finally {
          setUploading((n) => n - 1);
        }
      })
    );
    if (failures.length) setUploadError(failures.join(" · "));
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    void uploadFiles(files);
  }

  function removeImage(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  }

  function makeMain(i: number) {
    setImages((prev) => [prev[i], ...prev.filter((_, idx) => idx !== i)]);
    setDirty(true);
  }

  function moveImage(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setDirty(true);
  }

  function toggleSize(s: number) {
    setSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort((a, b) => a - b)
    );
    setDirty(true);
  }

  function toggleColor(c: string) {
    setColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
    setDirty(true);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">
    <form
      ref={formRef}
      action={formAction}
      onChange={() => setDirty(true)}
      onSubmit={(e) => {
        setTouched(true);
        if (errorCount > 0) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        setDirty(false);
      }}
      className="space-y-8 min-w-0"
      noValidate
    >
      <input type="hidden" name="images" value={images.join("\n")} />
      <input type="hidden" name="availableSizes" value={sizes.join(",")} />
      <input type="hidden" name="colors" value={colors.join(",")} />

      {(errors.form || (touched && errorCount > 0)) && (
        <div role="alert" className="rounded-md border border-red-800 bg-red-950/40 text-red-200 px-4 py-3 text-sm">
          {errors.form ?? `Revisa ${errorCount} campo${errorCount === 1 ? "" : "s"} marcado${errorCount === 1 ? "" : "s"} en rojo antes de guardar.`}
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
            onBlur={() => setTouched(true)}
            required
            maxLength={120}
            error={errors.name}
            help="Como quieres que lo vea el cliente. Ej: Sneaker Blanco Urban."
          />
          {showSlug && (
            <Field
              label="Slug (URL)"
              name="slug"
              placeholder="ej. sneaker-blanco-mario"
              error={errors.slug}
              help="Se usará en /productos/<slug>. Déjalo vacío para generarlo del nombre."
            />
          )}
          <Select
            label="Marca"
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            error={errors.brand}
            help={<>¿Llegó una marca nueva? <a href="/admin/marcas-categorias#marcas" target="_blank" className="text-sky-400 underline">Créala aquí</a> y recarga.</>}
            options={[
              ...brands.map((b) => [b.slug, b.hidden ? `${b.name} (oculta)` : b.name] as [string, string]),
              ...(brands.some((b) => b.slug === brand) ? [] : [[brand, `${brand} (no existe)`] as [string, string]]),
            ]}
          />
          <Select
            label="Público"
            name="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            error={errors.audience}
            options={audiences.map((a) => [a.value, a.label] as [string, string])}
          />
          <Select
            label="Categoría"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            help={<>Solo se muestran las que aplican al público elegido. <a href="/admin/marcas-categorias#categorias" target="_blank" className="text-sky-400 underline">Crear categoría</a></>}
            options={[
              ...categoryOptions.map((c) => [c.slug, c.name] as [string, string]),
              ...(categories.some((c) => c.slug === category) ? [] : [[category, `${category} (no existe)`] as [string, string]]),
            ]}
          />
          <Select
            label="Estilo"
            name="style"
            defaultValue={product?.style ?? "casual"}
            options={STYLE_OPTIONS}
          />
        </div>
        <label className="block text-sm mt-4">
          <span className="block font-medium mb-1">Descripción</span>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="2–4 frases sencillas. Ej: Zapato cómodo y resistente para el uso diario…"
            className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
          />
          <span className={`block text-xs mt-1 ${description.trim().length < 20 ? "text-amber-400" : "text-neutral-500"}`}>
            {description.length}/2000
            {description.trim().length < 20 && " · Una descripción de al menos 20 caracteres ayuda a vender y a aparecer en Google."}
          </span>
          {errors.description && <span className="block text-xs text-red-400 mt-1">{errors.description}</span>}
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
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            help="Déjalo vacío si prefieres que consulten por WhatsApp."
          />
          <Field
            label="Precio máximo ($, opcional)"
            name="priceMax"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            error={errors.priceMax}
            help="Solo si el precio cambia según la talla."
          />
          <Field
            label="Precio anterior (tachado, opcional)"
            name="previousPrice"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            value={previousPrice}
            onChange={(e) => setPreviousPrice(e.target.value)}
            error={errors.previousPrice}
            help="Úsalo solo si la oferta es real."
          />
        </div>
        {priceLabel && (
          <p className="mt-3 text-sm text-neutral-400">
            Así se verá en el catálogo: <span className="text-white font-semibold">{priceLabel}</span>
            {discount !== null && (
              <span className="ml-2 rounded bg-red-600/20 text-red-300 px-1.5 py-0.5 text-xs font-semibold">
                −{discount}% de descuento
              </span>
            )}
          </p>
        )}
        {discount !== null && !isOnSale && (
          <p className="mt-2 text-xs text-amber-400">
            Tiene precio anterior pero no está marcado “En oferta”.{" "}
            <button type="button" className="underline" onClick={() => { setIsOnSale(true); setDirty(true); }}>
              Marcarlo ahora
            </button>
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
              onAdd={(n) => {
                setSizes((prev) => (prev.includes(n) ? prev : [...prev, n].sort((a, b) => a - b)));
                setDirty(true);
              }}
            />
            {errors.availableSizes && <p className="text-xs text-red-400 mt-2">{errors.availableSizes}</p>}
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
              onAdd={(c) => {
                setColors((prev) => (prev.includes(c) ? prev : [...prev, c]));
                setDirty(true);
              }}
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

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void uploadFiles(Array.from(e.dataTransfer.files));
          }}
          className={`grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-md transition ${dragOver ? "ring-2 ring-sky-500 ring-offset-4 ring-offset-neutral-950" : ""}`}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative border border-neutral-800 rounded-md overflow-hidden bg-neutral-900"
            >
              <div className="relative aspect-square">
                <Image src={src} alt="" fill sizes="200px" className="object-cover" unoptimized />
                {i === 0 ? (
                  <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeMain(i)}
                    className="absolute top-1 left-1 bg-black/60 hover:bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded"
                  >
                    Hacer principal
                  </button>
                )}
              </div>
              <div className="flex justify-between text-xs bg-neutral-900 border-t border-neutral-800">
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                  className="px-2 py-1.5 disabled:opacity-30 hover:bg-neutral-800" aria-label="Mover a la izquierda">←</button>
                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === images.length - 1}
                  className="px-2 py-1.5 disabled:opacity-30 hover:bg-neutral-800" aria-label="Mover a la derecha">→</button>
                <button type="button" onClick={() => removeImage(i)} className="px-2 py-1.5 text-red-400 hover:bg-neutral-800">
                  Quitar
                </button>
              </div>
            </div>
          ))}
          {Array.from({ length: uploading }).map((_, i) => (
            <div key={`up-${i}`} className="aspect-square rounded-md border border-neutral-800 bg-neutral-900 animate-pulse flex items-center justify-center text-xs text-neutral-500">
              Subiendo…
            </div>
          ))}
          <label className="flex flex-col items-center justify-center border border-dashed border-neutral-700 rounded-md aspect-square cursor-pointer hover:bg-neutral-900 hover:border-neutral-500 text-center px-2 transition">
            <span className="text-2xl">＋</span>
            <span className="text-xs mt-1 text-neutral-400">Subir fotos</span>
            <span className="text-[10px] mt-0.5 text-neutral-600">o arrástralas aquí</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onPickFile}
              className="hidden"
            />
          </label>
        </div>
        {uploadError && <p className="mt-2 text-sm text-red-400">{uploadError}</p>}
        {errors.images && !uploadError && <p className="mt-2 text-sm text-red-400">{errors.images}</p>}
        {images.length === 0 && !errors.images && !uploadError && (
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
          <Checkbox label="Marcar como nuevo" name="isNew" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          <Checkbox label="En oferta" name="isOnSale" checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} />
        </div>
        {isOnSale && !toNum(previousPrice) && (
          <p className="mt-3 text-xs text-amber-400">
            Consejo: agrega un “precio anterior” en la sección 2 para que el cliente vea el descuento.
          </p>
        )}
      </Section>

      <div className="sticky bottom-0 bg-neutral-950/95 backdrop-blur border-t border-neutral-800 -mx-4 px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-500">
          <span className="hidden sm:inline">
            {images.length} foto{images.length === 1 ? "" : "s"} · {sizes.length} talla
            {sizes.length === 1 ? "" : "s"} · {colors.length} color
            {colors.length === 1 ? "" : "es"} ·{" "}
          </span>
          {dirty ? (
            <span className="text-amber-400">● Cambios sin guardar</span>
          ) : (
            <span>Sin cambios</span>
          )}
          <span className="hidden md:inline text-neutral-600"> · ⌘S para guardar</span>
        </p>
        <button
          disabled={pending || uploading > 0}
          className="rounded-md bg-white text-neutral-900 font-semibold px-5 py-2 text-sm hover:bg-neutral-200 disabled:opacity-60"
        >
          {pending ? "Guardando…" : uploading > 0 ? "Esperando fotos…" : submitLabel}
        </button>
      </div>
    </form>

    {/* ---------- Vista previa ---------- */}
    <aside className="hidden lg:block sticky top-20">
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Vista previa en el catálogo</p>
      <div className="rounded-2xl bg-white text-neutral-900 overflow-hidden">
        <div className="relative aspect-square bg-gradient-to-b from-white to-neutral-100">
          {images[0] ? (
            <Image src={images[0]} alt="" fill sizes="260px" className="object-contain" unoptimized />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">Sin foto</div>
          )}
          <div className="absolute left-2 top-2 flex gap-1">
            {isNew && <span className="rounded bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5">Nuevo</span>}
            {isOnSale && <span className="rounded bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5">Oferta</span>}
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-bold leading-tight">{name || "Nombre del producto"}</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {categories.find((c) => c.slug === category)?.name ?? category} ·{" "}
            {brands.find((b) => b.slug === brand)?.name ?? brand}
          </p>
          <p className="mt-2 text-sm">
            {priceLabel ? (
              <>
                <span className="font-bold">{priceLabel}</span>
                {discount !== null && (
                  <span className="ml-2 text-xs text-neutral-400 line-through">${previousPrice}</span>
                )}
              </>
            ) : (
              <span className="text-xs text-neutral-500">Consultar precio</span>
            )}
          </p>
        </div>
      </div>
      <ul className="mt-3 space-y-1 text-xs">
        <Check ok={name.trim().length >= 2}>Nombre</Check>
        <Check ok={images.length > 0}>Al menos 1 foto</Check>
        <Check ok={images.length >= 3} soft>3 o más fotos (venden más)</Check>
        <Check ok={Boolean(price)} soft>Precio</Check>
        <Check ok={sizes.length > 0} soft>Tallas</Check>
        <Check ok={description.trim().length >= 20} soft>Descripción</Check>
      </ul>
    </aside>
    </div>
  );
}

function Check({ ok, soft, children }: { ok: boolean; soft?: boolean; children: React.ReactNode }) {
  return (
    <li className={ok ? "text-emerald-400" : soft ? "text-neutral-500" : "text-red-400"}>
      {ok ? "✓" : soft ? "○" : "✕"} {children}
    </li>
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
  error,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
  error?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <input
        {...rest}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md bg-neutral-900 border px-3 py-2 text-sm ${error ? "border-red-600" : "border-neutral-800"}`}
      />
      {error ? (
        <span className="block text-xs text-red-400 mt-1">{error}</span>
      ) : (
        help && <span className="block text-xs text-neutral-500 mt-1">{help}</span>
      )}
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
  error,
  help,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: [string, string][];
  error?: string;
  help?: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="block font-medium mb-1">{label}</span>
      <select
        {...rest}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md bg-neutral-900 border px-3 py-2 text-sm ${error ? "border-red-600" : "border-neutral-800"}`}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {error ? (
        <span className="block text-xs text-red-400 mt-1">{error}</span>
      ) : (
        help && <span className="block text-xs text-neutral-500 mt-1">{help}</span>
      )}
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
