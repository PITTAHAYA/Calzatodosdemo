"use server";

// =========================================================================
// Server actions del panel /admin
// -------------------------------------------------------------------------
// Backends automáticos:
//   * Datos: Vercel KV si KV_REST_API_URL está definido, si no JSON local.
//   * Fotos: Vercel Blob si BLOB_READ_WRITE_TOKEN está definido, si no /public.
// =========================================================================

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  clearSessionCookie,
  getCurrentAdmin,
  setSessionCookie,
} from "@/lib/admin-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  getOverrides,
  invalidateOverridesCache,
  nextProductId,
  saveOverrides,
  undoLastChange,
  type Overrides,
} from "@/lib/products-store";
import {
  sanitizeProduct,
  slugify,
  validateProductInput,
  type FieldErrors,
} from "@/lib/product-validation";
import {
  getAllProducts,
  getSeedProducts,
  type Product,
} from "@/data/products";
import { getKnownSlugs } from "@/lib/taxonomy-store";

// -------------------- Guards --------------------

async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

function bumpCaches() {
  invalidateOverridesCache();
  const paths = [
    "/",
    "/catalogo",
    "/ofertas",
    "/hombre",
    "/mujer",
    "/ninos",
    "/deportivo",
    "/urbano",
    "/formal",
    "/escolar",
    "/seguridad",
  ];
  for (const p of paths) revalidatePath(p, "page");
  revalidatePath("/productos/[slug]", "page");
  revalidatePath("/marcas/[slug]", "page");
  revalidatePath("/marcas", "page");
  revalidatePath("/admin", "layout");
}

// -------------------- Autenticación --------------------

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const safeNext = next.startsWith("/admin") ? next : "/admin";
  if (!username || !password) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Ingresa usuario y contraseña."
      )}&next=${encodeURIComponent(safeNext)}`
    );
  }
  if (!checkCredentials(username, password)) {
    await new Promise((r) => setTimeout(r, 400));
    redirect(
      `/admin/login?error=${encodeURIComponent(
        "Usuario o contraseña incorrectos."
      )}&next=${encodeURIComponent(safeNext)}`
    );
  }
  await setSessionCookie(username);
  redirect(safeNext);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

// -------------------- Parseo de formulario --------------------

function parseNumberList(raw: string): number[] {
  return Array.from(
    new Set(
      raw
        .split(/[\s,]+/)
        .map((x) => Number(x.trim().replace(",", ".")))
        .filter((n) => Number.isFinite(n) && n > 0)
    )
  ).sort((a, b) => a - b);
}

function parseStringList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[,\n]+/)
        .map((x) => x.trim())
        .filter(Boolean)
    )
  );
}

function parseOptionalNumber(raw: FormDataEntryValue | null): number | undefined {
  if (raw === null) return undefined;
  const txt = String(raw).trim().replace(",", ".");
  if (txt === "") return undefined;
  const n = Number(txt);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}

function readProductForm(formData: FormData): Partial<Product> {
  const images = parseStringList(String(formData.get("images") ?? ""));
  return {
    name: String(formData.get("name") ?? "").trim().replace(/\s+/g, " "),
    brand: String(formData.get("brand") ?? "").trim(),
    audience: String(formData.get("audience") ?? "").trim() as Product["audience"],
    category: String(formData.get("category") ?? "").trim(),
    style: String(formData.get("style") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: parseOptionalNumber(formData.get("price")),
    priceMax: parseOptionalNumber(formData.get("priceMax")),
    previousPrice: parseOptionalNumber(formData.get("previousPrice")),
    availableSizes: parseNumberList(String(formData.get("availableSizes") ?? "")),
    colors: parseStringList(String(formData.get("colors") ?? "")),
    features: parseStringList(String(formData.get("features") ?? "")),
    materials: parseStringList(String(formData.get("materials") ?? "")),
    tags: parseStringList(String(formData.get("tags") ?? "")),
    images,
    isNew: formData.get("isNew") === "on" || undefined,
    isFeatured: formData.get("isFeatured") === "on" || undefined,
    isOnSale: formData.get("isOnSale") === "on" || undefined,
    warrantyInformation: String(formData.get("warrantyInformation") ?? "").trim(),
    careInstructions: String(formData.get("careInstructions") ?? "").trim(),
  };
}

// Estado que devuelven las acciones de formulario (useActionState).
export type FormState = { ok: boolean; errors?: FieldErrors; message?: string };

function friendlyError(err: unknown): FormState {
  // redirect() de Next lanza un error especial que debe propagarse.
  if (isRedirectError(err)) throw err;
  console.error("[admin]", err);
  return {
    ok: false,
    errors: {
      form:
        "No se pudo guardar por un problema del servidor. Tus datos siguen en el formulario: inténtalo de nuevo en unos segundos.",
    },
  };
}

// Calcula el "diff" de un producto semilla contra sus valores originales.
// Guardar solo lo cambiado permite que futuras mejoras a la semilla sigan
// llegando a los campos que nadie tocó.
function patchFor(seed: Product, merged: Product): Partial<Product> {
  const diff: Partial<Product> = {};
  (Object.keys(merged) as (keyof Product)[]).forEach((k) => {
    if (JSON.stringify(merged[k]) !== JSON.stringify(seed[k])) {
      (diff as Record<string, unknown>)[k] = merged[k] === undefined ? null : merged[k];
    }
  });
  return diff;
}

// Aplica un cambio parcial a un producto (semilla o creado).
function applyPatch(ov: Overrides, id: string, patch: Partial<Product>): Overrides {
  const createdIdx = ov.created.findIndex((p) => p.id === id);
  if (createdIdx >= 0) {
    const created = [...ov.created];
    created[createdIdx] = { ...created[createdIdx], ...patch } as Product;
    return { ...ov, created };
  }
  const seed = getSeedProducts().find((p) => p.id === id);
  if (!seed) throw new Error(`Producto ${id} no existe.`);
  const current = { ...seed, ...(ov.patches[id] ?? {}) } as Product;
  const merged = { ...current, ...patch } as Product;
  const diff = patchFor(seed, merged);
  const patches = { ...ov.patches };
  if (Object.keys(diff).length === 0) delete patches[id];
  else patches[id] = diff;
  return { ...ov, patches };
}

// -------------------- CRUD --------------------

export async function updateProductAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireAdmin();
  const patch = readProductForm(formData);
  const errors = validateProductInput(patch, await getKnownSlugs());
  if (Object.keys(errors).length) return { ok: false, errors };

  try {
    const ov = await getOverrides();
    const exists =
      ov.created.some((p) => p.id === id) || getSeedProducts().some((p) => p.id === id);
    if (!exists) return { ok: false, errors: { form: "Este producto ya no existe." } };
    await saveOverrides(applyPatch(ov, id, patch), {
      user,
      summary: `Editó "${patch.name}"`,
    });
    bumpCaches();
  } catch (err) {
    return friendlyError(err);
  }
  redirect(`/admin?updated=${id}`);
}

// Oculta un producto. Función pura para reutilizar en deleteProductAction y
// en la versión en lote.
function hideProductInOverrides(ov: Overrides, id: string): Overrides {
  if (ov.deleted.includes(id)) return ov;
  // Nunca se borra nada: tanto los productos base como los creados en el
  // panel quedan en "ocultos" y conservan sus cambios para restaurarlos.
  return { ...ov, deleted: [...ov.deleted, id] };
}

function restoreProductInOverrides(ov: Overrides, id: string): Overrides {
  if (!ov.deleted.includes(id)) return ov;
  return { ...ov, deleted: ov.deleted.filter((x) => x !== id) };
}

async function nameOf(id: string): Promise<string> {
  const ov = await getOverrides();
  const p =
    ov.created.find((x) => x.id === id) ?? getSeedProducts().find((x) => x.id === id);
  return (ov.patches[id]?.name as string | undefined) ?? p?.name ?? id;
}

export async function deleteProductAction(id: string) {
  const user = await requireAdmin();
  const ov = await getOverrides();
  const next = hideProductInOverrides(ov, id);
  if (next !== ov) {
    await saveOverrides(next, { user, summary: `Quitó "${await nameOf(id)}" del catálogo` });
    bumpCaches();
  }
  redirect(`/admin?deleted=${id}`);
}

export async function restoreProductAction(id: string) {
  const user = await requireAdmin();
  const ov = await getOverrides();
  const next = restoreProductInOverrides(ov, id);
  if (next !== ov) {
    await saveOverrides(next, { user, summary: `Restauró "${await nameOf(id)}"` });
    bumpCaches();
  }
  redirect(`/admin?restored=${id}`);
}

// -------------------- Acciones en lote --------------------

type BulkOp =
  | "hide"
  | "restore"
  | "feature"
  | "unfeature"
  | "sale"
  | "unsale"
  | "new"
  | "unnew";

const BULK_LABEL: Record<BulkOp, string> = {
  hide: "Quitó del catálogo",
  restore: "Restauró",
  feature: "Destacó",
  unfeature: "Quitó de destacados",
  sale: "Marcó en oferta",
  unsale: "Quitó la oferta de",
  new: "Marcó como nuevo",
  unnew: "Quitó 'nuevo' de",
};

export async function bulkAction(formData: FormData) {
  const user = await requireAdmin();
  const op = String(formData.get("op") ?? "") as BulkOp;
  const ids = Array.from(new Set(formData.getAll("ids").map(String).filter(Boolean)));
  if (ids.length === 0 || !(op in BULK_LABEL)) redirect("/admin");

  let ov = await getOverrides();
  for (const id of ids) {
    try {
      if (op === "hide") ov = hideProductInOverrides(ov, id);
      else if (op === "restore") ov = restoreProductInOverrides(ov, id);
      else {
        const flag =
          op === "feature" || op === "unfeature"
            ? "isFeatured"
            : op === "sale" || op === "unsale"
              ? "isOnSale"
              : "isNew";
        const on = !op.startsWith("un");
        ov = applyPatch(ov, id, { [flag]: on || undefined });
      }
    } catch {
      // Un id inexistente no debe frenar al resto del lote.
    }
  }
  await saveOverrides(ov, {
    user,
    summary: `${BULK_LABEL[op]} ${ids.length} producto${ids.length === 1 ? "" : "s"}`,
  });
  bumpCaches();
  redirect(`/admin?bulk=${op}&n=${ids.length}`);
}

// Compatibilidad con formularios existentes.
export async function bulkHideAction(formData: FormData) {
  formData.set("op", "hide");
  return bulkAction(formData);
}
export async function bulkRestoreAction(formData: FormData) {
  formData.set("op", "restore");
  return bulkAction(formData);
}

// -------------------- Edición rápida desde la lista --------------------

export async function quickUpdateAction(
  id: string,
  field: "price" | "isFeatured" | "isOnSale" | "isNew",
  value: number | boolean | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireAdmin();
  try {
    const all = await getAllProducts();
    const product = all.find((p) => p.id === id);
    if (!product) return { ok: false, error: "El producto ya no existe." };

    let patch: Partial<Product>;
    if (field === "price") {
      const v = value === null ? undefined : Number(value);
      const errors = validateProductInput({ ...product, price: v }, await getKnownSlugs());
      const msg = errors.price ?? errors.priceMax ?? errors.previousPrice;
      if (msg) return { ok: false, error: msg };
      patch = { price: v };
    } else {
      patch = { [field]: value ? true : undefined };
    }
    const ov = await getOverrides();
    await saveOverrides(applyPatch(ov, id, patch), {
      user,
      summary:
        field === "price"
          ? `Cambió precio de "${product.name}" a ${v2s(value)}`
          : `${value ? "Activó" : "Desactivó"} ${FLAG_LABEL[field]} en "${product.name}"`,
    });
    bumpCaches();
    return { ok: true };
  } catch (err) {
    console.error("[admin] quickUpdate", err);
    return { ok: false, error: "No se pudo guardar. Inténtalo de nuevo." };
  }
}

const FLAG_LABEL = { isFeatured: "destacado", isOnSale: "oferta", isNew: "nuevo" } as const;
const v2s = (v: unknown) => (v === null ? "sin precio" : `$${v}`);

// -------------------- Duplicar / crear --------------------

export async function duplicateProductAction(id: string) {
  const user = await requireAdmin();
  const all = await getAllProducts();
  const source = all.find((p) => p.id === id);
  if (!source) redirect("/admin?error=notfound");

  const baseSlug = `${source.slug}-copia`;
  let slug = baseSlug;
  let n = 2;
  const taken = new Set([...all, ...(await getOverrides()).created].map((p) => p.slug));
  while (taken.has(slug)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }
  const newId = nextProductId([...all, ...(await getOverrides()).created]);
  const copy: Product = {
    ...source,
    id: newId,
    slug,
    sku: `CG-${slug.toUpperCase()}`,
    name: `${source.name} (copia)`,
    isFeatured: undefined,
    isNew: undefined,
    isOnSale: undefined,
  };
  const ov = await getOverrides();
  await saveOverrides(
    { ...ov, created: [...ov.created, copy] },
    { user, summary: `Duplicó "${source.name}"` }
  );
  bumpCaches();
  redirect(`/admin/producto/${newId}?duplicated=1`);
}

export async function createProductAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireAdmin();
  const patch = readProductForm(formData);
  const errors = validateProductInput(patch, await getKnownSlugs());

  const slug = slugify(String(formData.get("slug") ?? "")) || slugify(patch.name ?? "");
  let id = "";
  try {
    const all = await getAllProducts();
    if (!slug) errors.slug = "No se pudo generar la dirección (URL). Revisa el nombre.";
    else if (
      all.some((p) => p.slug === slug) ||
      (await getOverrides()).created.some((p) => p.slug === slug)
    )
      errors.slug = `Ya existe un producto con la dirección "${slug}". Cambia el nombre o el slug.`;
    if (Object.keys(errors).length) return { ok: false, errors };

    id = nextProductId([...all, ...(await getOverrides()).created]);
    const product: Product = {
      id,
      slug,
      sku: `CG-${slug.toUpperCase()}`,
      name: patch.name!,
      brand: patch.brand || "calzatodos",
      audience: (patch.audience as Product["audience"]) || "hombre",
      category: patch.category || "sneakers",
      style: patch.style || "casual",
      description: patch.description || "",
      features: patch.features ?? [],
      materials: patch.materials ?? [],
      availableSizes: patch.availableSizes ?? [],
      colors: patch.colors ?? [],
      price: patch.price,
      priceMax: patch.priceMax,
      previousPrice: patch.previousPrice,
      images: patch.images ?? [],
      isNew: patch.isNew,
      isFeatured: patch.isFeatured,
      isOnSale: patch.isOnSale,
      warrantyInformation:
        patch.warrantyInformation ||
        "Garantía por defectos de fabricación, sujeta a las condiciones de cada categoría.",
      careInstructions:
        patch.careInstructions ||
        "Limpiar con paño húmedo. Airear tras el uso. Evitar lavadora.",
      tags: patch.tags ?? [],
    };
    const ov = await getOverrides();
    await saveOverrides(
      { ...ov, created: [...ov.created, product] },
      { user, summary: `Creó "${product.name}"` }
    );
    bumpCaches();
  } catch (err) {
    return friendlyError(err);
  }
  redirect(`/admin/producto/${id}?created=1`);
}

// -------------------- Historial / respaldo --------------------

export async function undoAction() {
  await requireAdmin();
  const summary = await undoLastChange();
  bumpCaches();
  redirect(summary ? `/admin?undone=${encodeURIComponent(summary)}` : "/admin");
}

export async function importBackupAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, message: "Elige un archivo de respaldo (.json)." };
  if (file.size > 5 * 1024 * 1024)
    return { ok: false, message: "El archivo es demasiado grande." };
  let data: unknown;
  try {
    data = JSON.parse(await file.text());
  } catch {
    return { ok: false, message: "El archivo no es un JSON válido." };
  }
  const payload = (data as { overrides?: unknown })?.overrides ?? data;
  const p = payload as Partial<Overrides>;
  if (
    !p ||
    typeof p !== "object" ||
    !p.patches ||
    !Array.isArray(p.deleted) ||
    !Array.isArray(p.created)
  ) {
    return { ok: false, message: "Ese archivo no es un respaldo del panel Calzatodos." };
  }
  // Se descartan productos creados que no pasen el saneamiento.
  const created = p.created.map(sanitizeProduct).filter((x): x is Product => Boolean(x));
  try {
    await saveOverrides(
      { patches: p.patches, deleted: p.deleted.map(String), created },
      { user, summary: "Restauró un respaldo" }
    );
    bumpCaches();
  } catch (err) {
    return friendlyError(err);
  }
  redirect("/admin?imported=1");
}

// -------------------- Subida de imágenes --------------------

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

function useBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadImageAction(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No se recibió ningún archivo." };
  }
  if (file.size === 0) return { ok: false, error: "El archivo está vacío." };
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: `El archivo pesa ${(file.size / 1024 / 1024).toFixed(2)} MB. Máximo permitido: 4 MB.`,
    };
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return {
      ok: false,
      error: `Tipo no permitido (${file.type}). Usa JPG, PNG, WEBP o AVIF.`,
    };
  }

  const safeBase =
    (file.name || "imagen")
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "imagen";
  const stamp = Date.now().toString(36);
  const filename = `${safeBase}-${stamp}${ext}`;

  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`products/${filename}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return { ok: true, url: blob.url };
  }

  // Fallback local (dev / VPS)
  const dir = path.join(process.cwd(), "public", "uploads", "products");
  await fs.mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buf);
  return { ok: true, url: `/uploads/products/${filename}` };
}
