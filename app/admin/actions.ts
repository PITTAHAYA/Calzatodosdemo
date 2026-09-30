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
import {
  getOverrides,
  invalidateOverridesCache,
  mergeProducts,
  nextProductId,
  saveOverrides,
  type Overrides,
} from "@/lib/products-store";
import {
  getAllProducts,
  getSeedProducts,
  type Product,
} from "@/data/products";

// -------------------- Guards --------------------

async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) throw new Error("No autorizado");
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
  return raw
    .split(/[\s,]+/)
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function parseStringList(raw: string): string[] {
  return raw
    .split(/[,\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseOptionalNumber(raw: FormDataEntryValue | null): number | undefined {
  if (raw === null || raw === "") return undefined;
  const n = Number(String(raw));
  return Number.isFinite(n) ? n : undefined;
}

function readProductForm(formData: FormData): Partial<Product> {
  const images = parseStringList(String(formData.get("images") ?? ""));
  return {
    name: String(formData.get("name") ?? "").trim(),
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
    isNew: formData.get("isNew") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isOnSale: formData.get("isOnSale") === "on",
    warrantyInformation: String(formData.get("warrantyInformation") ?? "").trim(),
    careInstructions: String(formData.get("careInstructions") ?? "").trim(),
  };
}

// -------------------- CRUD --------------------

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const patch = readProductForm(formData);
  if (!patch.name) throw new Error("El nombre no puede quedar vacío.");

  const ov = await getOverrides();
  const seed = getSeedProducts().find((p) => p.id === id);
  const createdIdx = ov.created.findIndex((p) => p.id === id);

  let next: Overrides;
  if (createdIdx >= 0) {
    const updated = { ...ov.created[createdIdx], ...patch } as Product;
    const created = [...ov.created];
    created[createdIdx] = updated;
    next = { ...ov, created };
  } else if (seed) {
    const current = { ...seed, ...(ov.patches[id] ?? {}) };
    const merged = { ...current, ...patch };
    const diff: Partial<Product> = {};
    (Object.keys(merged) as (keyof Product)[]).forEach((k) => {
      if (JSON.stringify(merged[k]) !== JSON.stringify(seed[k])) {
        (diff as Record<string, unknown>)[k] = merged[k];
      }
    });
    const patches = { ...ov.patches };
    if (Object.keys(diff).length === 0) delete patches[id];
    else patches[id] = diff;
    next = { ...ov, patches };
  } else {
    throw new Error(`Producto ${id} no existe.`);
  }
  await saveOverrides(next);
  bumpCaches();
  redirect(`/admin?updated=${id}`);
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const ov = await getOverrides();
  const createdIdx = ov.created.findIndex((p) => p.id === id);
  let next: Overrides;
  if (createdIdx >= 0) {
    next = { ...ov, created: ov.created.filter((p) => p.id !== id) };
  } else if (!ov.deleted.includes(id)) {
    const patches = { ...ov.patches };
    delete patches[id];
    next = { ...ov, patches, deleted: [...ov.deleted, id] };
  } else {
    return;
  }
  await saveOverrides(next);
  bumpCaches();
  redirect(`/admin?deleted=${id}`);
}

export async function restoreProductAction(id: string) {
  await requireAdmin();
  const ov = await getOverrides();
  if (!ov.deleted.includes(id)) return;
  await saveOverrides({
    ...ov,
    deleted: ov.deleted.filter((x) => x !== id),
  });
  bumpCaches();
  redirect(`/admin?restored=${id}`);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const patch = readProductForm(formData);
  if (!patch.name) throw new Error("El nombre no puede quedar vacío.");

  const slug =
    String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    patch.name!
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const all = await getAllProducts();
  if (all.some((p) => p.slug === slug)) {
    throw new Error(`Ya existe un producto con el slug "${slug}".`);
  }
  const id = nextProductId(all);
  const sku = `CG-${slug.toUpperCase()}`;
  const product: Product = {
    id,
    slug,
    sku,
    name: patch.name!,
    brand: patch.brand || "calzatodos",
    audience: (patch.audience as Product["audience"]) || "hombre",
    category: patch.category || "sneakers",
    style: patch.style || "deportivo",
    description: patch.description || "",
    features: patch.features ?? [],
    materials: patch.materials ?? [],
    availableSizes: patch.availableSizes ?? [],
    colors: patch.colors ?? [],
    price: patch.price,
    priceMax: patch.priceMax,
    previousPrice: patch.previousPrice,
    images: patch.images?.length ? patch.images : [`/products/${slug}.jpg`],
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
  await saveOverrides({ ...ov, created: [...ov.created, product] });
  bumpCaches();
  redirect(`/admin/producto/${id}?created=1`);
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
