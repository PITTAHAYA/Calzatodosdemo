"use server";

// =========================================================================
// Server actions: marcas y categorías creadas desde el panel
// -------------------------------------------------------------------------
// Las marcas/categorías base (data/brands.ts, data/categories.ts) no se
// pueden editar ni borrar desde aquí. Las nuevas sí, y solo se pueden
// eliminar si ningún producto (visible u oculto) las usa.
// =========================================================================

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/product-validation";
import { getOverrides } from "@/lib/products-store";
import {
  getAllBrands,
  getAllCategories,
  getCustomTaxonomyForWrite,
  isBaseBrand,
  isBaseCategory,
  saveCustomTaxonomy,
} from "@/lib/taxonomy-store";
import { getSeedProducts, type Product } from "@/data/products";
import type { Brand } from "@/data/brands";
import type { Audience, Category } from "@/data/categories";

export type TaxonomyFormState = {
  ok: boolean;
  errors?: Partial<Record<"name" | "slug" | "audience" | "logo" | "form", string>>;
};

const AUDIENCES: Audience[] = ["mujer", "hombre", "nino", "nina", "infantil"];

async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

// Las marcas aparecen en el menú (layout) y en todas las páginas: se
// revalida todo el sitio.
function bumpAll() {
  revalidatePath("/", "layout");
}

function fail(err: unknown): TaxonomyFormState {
  if (isRedirectError(err)) throw err;
  console.error("[admin/taxonomy]", err);
  return {
    ok: false,
    errors: { form: "No se pudo guardar por un problema del servidor. Inténtalo de nuevo." },
  };
}

// Todos los productos, incluidos los ocultos, para saber si algo usa una
// marca/categoría antes de eliminarla.
async function everyProduct(): Promise<Product[]> {
  const ov = await getOverrides();
  const seeds = getSeedProducts().map((p) => ({ ...p, ...(ov.patches[p.id] ?? {}) }) as Product);
  return [...seeds, ...ov.created];
}

// -------------------- Marcas --------------------

export async function saveBrandAction(
  editingSlug: string | null,
  _prev: TaxonomyFormState,
  formData: FormData
): Promise<TaxonomyFormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const type = formData.get("type") === "propia" ? "propia" : "internacional";
  const tagline = String(formData.get("tagline") ?? "").trim().slice(0, 140);
  const description = String(formData.get("description") ?? "").trim().slice(0, 1000);
  const logo = String(formData.get("logo") ?? "").trim();
  const hidden = formData.get("hidden") === "on";

  const errors: TaxonomyFormState["errors"] = {};
  if (name.length < 2) errors.name = "Escribe el nombre de la marca (mínimo 2 letras).";
  if (name.length > 60) errors.name = "Nombre demasiado largo (máx. 60).";
  if (logo && !logo.startsWith("/") && !logo.startsWith("https://"))
    errors.logo = "El logo debe subirse con el botón o ser una dirección https://.";

  try {
    const all = await getAllBrands();
    const slug = editingSlug ?? slugify(name);
    if (!editingSlug) {
      if (!slug) errors.name = "Ese nombre no sirve para crear la dirección web.";
      else if (all.some((b) => b.slug === slug))
        errors.name = "Ya existe una marca con ese nombre.";
    } else if (isBaseBrand(editingSlug)) {
      errors.form = "Las marcas originales del sitio no se editan desde aquí.";
    }
    if (all.some((b) => b.slug !== slug && b.name.toLowerCase() === name.toLowerCase()))
      errors.name = "Ya existe una marca con ese nombre.";
    if (Object.keys(errors).length) return { ok: false, errors };

    const tax = await getCustomTaxonomyForWrite();
    const brand: Brand = {
      slug,
      name,
      type,
      tagline: tagline || `Calzado ${name}`,
      description:
        description || `Descubre el calzado ${name} disponible en Calzatodos Group.`,
      logo: logo || undefined,
      hidden: hidden || undefined,
    };
    const brands = editingSlug
      ? tax.brands.map((b) => (b.slug === editingSlug ? { ...b, ...brand } : b))
      : [...tax.brands, brand];
    if (editingSlug && !tax.brands.some((b) => b.slug === editingSlug))
      return { ok: false, errors: { form: "Esa marca ya no existe." } };
    await saveCustomTaxonomy({ ...tax, brands });
    bumpAll();
  } catch (err) {
    return fail(err);
  }
  redirect(`/admin/marcas-categorias?${editingSlug ? "brandUpdated" : "brandCreated"}=1`);
}

export async function deleteBrandAction(slug: string) {
  await requireAdmin();
  if (isBaseBrand(slug)) redirect("/admin/marcas-categorias");
  const users = (await everyProduct()).filter((p) => p.brand === slug);
  if (users.length > 0) {
    redirect(`/admin/marcas-categorias?inUse=${users.length}`);
  }
  const tax = await getCustomTaxonomyForWrite();
  await saveCustomTaxonomy({ ...tax, brands: tax.brands.filter((b) => b.slug !== slug) });
  bumpAll();
  redirect("/admin/marcas-categorias?brandDeleted=1");
}

// -------------------- Categorías --------------------

export async function saveCategoryAction(
  editingSlug: string | null,
  _prev: TaxonomyFormState,
  formData: FormData
): Promise<TaxonomyFormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const description = String(formData.get("description") ?? "").trim().slice(0, 300);
  const audience = formData
    .getAll("audience")
    .map(String)
    .filter((a): a is Audience => AUDIENCES.includes(a as Audience));

  const errors: TaxonomyFormState["errors"] = {};
  if (name.length < 2) errors.name = "Escribe el nombre de la categoría (mínimo 2 letras).";
  if (name.length > 60) errors.name = "Nombre demasiado largo (máx. 60).";
  if (audience.length === 0) errors.audience = "Elige al menos un público.";

  try {
    const all = await getAllCategories();
    const slug = editingSlug ?? slugify(name);
    if (!editingSlug) {
      if (!slug) errors.name = "Ese nombre no sirve para crear la dirección web.";
      else if (all.some((c) => c.slug === slug))
        errors.name = "Ya existe una categoría con ese nombre.";
    } else if (isBaseCategory(editingSlug)) {
      errors.form = "Las categorías originales del sitio no se editan desde aquí.";
    }
    if (all.some((c) => c.slug !== slug && c.name.toLowerCase() === name.toLowerCase()))
      errors.name = "Ya existe una categoría con ese nombre.";
    if (Object.keys(errors).length) return { ok: false, errors };

    const tax = await getCustomTaxonomyForWrite();
    const category: Category = {
      slug,
      name,
      audience,
      description: description || `${name} para toda la familia.`,
    };
    if (editingSlug && !tax.categories.some((c) => c.slug === editingSlug))
      return { ok: false, errors: { form: "Esa categoría ya no existe." } };
    const categories = editingSlug
      ? tax.categories.map((c) => (c.slug === editingSlug ? category : c))
      : [...tax.categories, category];
    await saveCustomTaxonomy({ ...tax, categories });
    bumpAll();
  } catch (err) {
    return fail(err);
  }
  redirect(`/admin/marcas-categorias?${editingSlug ? "catUpdated" : "catCreated"}=1#categorias`);
}

export async function deleteCategoryAction(slug: string) {
  await requireAdmin();
  if (isBaseCategory(slug)) redirect("/admin/marcas-categorias");
  const users = (await everyProduct()).filter((p) => p.category === slug);
  if (users.length > 0) {
    redirect(`/admin/marcas-categorias?inUse=${users.length}#categorias`);
  }
  const tax = await getCustomTaxonomyForWrite();
  await saveCustomTaxonomy({
    ...tax,
    categories: tax.categories.filter((c) => c.slug !== slug),
  });
  bumpAll();
  redirect("/admin/marcas-categorias?catDeleted=1#categorias");
}
