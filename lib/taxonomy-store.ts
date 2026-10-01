// =========================================================================
// TAXONOMY STORE — marcas y categorías agregadas desde el panel /admin
// -------------------------------------------------------------------------
// Las marcas y categorías base viven en data/brands.ts y data/categories.ts.
// Las nuevas que se crean desde el panel se guardan aparte:
//   * Producción en Vercel     -> Vercel KV (clave "catalog:taxonomy")
//   * Desarrollo local / VPS   -> data/taxonomy.json
// Las base siempre ganan si se repite un slug, así nunca se pisan.
// =========================================================================

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache as reactCache } from "react";
import { brands as baseBrands, type Brand, type BrandType } from "@/data/brands";
import {
  categories as baseCategories,
  type Audience,
  type Category,
} from "@/data/categories";

export interface Taxonomy {
  brands: Brand[];
  categories: Category[];
}

const KV_KEY = "catalog:taxonomy";
const FILE_PATH = path.join(process.cwd(), "data", "taxonomy.json");
const AUDIENCES: Audience[] = ["mujer", "hombre", "nino", "nina", "infantil"];

function useKV(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// -------------------- Saneamiento --------------------

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function cleanBrand(raw: unknown): Brand | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const slug = str(r.slug);
  const name = str(r.name);
  if (!slug || !name) return null;
  const logo = str(r.logo);
  return {
    slug,
    name,
    type: (r.type === "propia" ? "propia" : "internacional") as BrandType,
    tagline: str(r.tagline),
    description: str(r.description),
    logo: logo && (logo.startsWith("/") || logo.startsWith("https://")) ? logo : undefined,
    gallery: Array.isArray(r.gallery)
      ? r.gallery.filter((x): x is string => typeof x === "string" && x !== "")
      : undefined,
    hidden: r.hidden === true ? true : undefined,
  };
}

function cleanCategory(raw: unknown): Category | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const slug = str(r.slug);
  const name = str(r.name);
  if (!slug || !name) return null;
  const audience = Array.isArray(r.audience)
    ? r.audience.filter((a): a is Audience => AUDIENCES.includes(a as Audience))
    : [];
  return {
    slug,
    name,
    audience: audience.length ? audience : [...AUDIENCES],
    description: str(r.description),
  };
}

function normalize(val: unknown): Taxonomy {
  const v = (val && typeof val === "object" ? val : {}) as Partial<Taxonomy>;
  return {
    brands: (Array.isArray(v.brands) ? v.brands : [])
      .map(cleanBrand)
      .filter((b): b is Brand => Boolean(b)),
    categories: (Array.isArray(v.categories) ? v.categories : [])
      .map(cleanCategory)
      .filter((c): c is Category => Boolean(c)),
  };
}

// -------------------- Lectura / escritura --------------------

let lastGood: Taxonomy | null = null;

async function readRaw(): Promise<Taxonomy> {
  if (useKV()) {
    const { kv } = await import("@vercel/kv");
    return normalize(await kv.get(KV_KEY));
  }
  try {
    return normalize(JSON.parse(await fs.readFile(FILE_PATH, "utf8")));
  } catch {
    return { brands: [], categories: [] };
  }
}

/** Marcas y categorías creadas desde el panel (solo las nuevas). */
export const getCustomTaxonomy = reactCache(async (): Promise<Taxonomy> => {
  try {
    const data = await readRaw();
    lastGood = data;
    return data;
  } catch (err) {
    console.error("[taxonomy-store] No se pudo leer:", err);
    return lastGood ?? { brands: [], categories: [] };
  }
});

/** Lectura estricta para guardar: si falla, no se escribe nada. */
export async function getCustomTaxonomyForWrite(): Promise<Taxonomy> {
  return readRaw();
}

export async function saveCustomTaxonomy(next: Taxonomy): Promise<void> {
  const clean = normalize(next);
  if (useKV()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, clean);
  } else {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    const tmp = `${FILE_PATH}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(clean, null, 2), "utf8");
    await fs.rename(tmp, FILE_PATH);
  }
  lastGood = clean;
}

// -------------------- API combinada (base + nuevas) --------------------

export async function getAllBrands(): Promise<Brand[]> {
  const custom = await getCustomTaxonomy();
  const taken = new Set(baseBrands.map((b) => b.slug));
  return [...baseBrands, ...custom.brands.filter((b) => !taken.has(b.slug))];
}

export async function getAllCategories(): Promise<Category[]> {
  const custom = await getCustomTaxonomy();
  const taken = new Set(baseCategories.map((c) => c.slug));
  return [...baseCategories, ...custom.categories.filter((c) => !taken.has(c.slug))];
}

export async function getBrandAsync(slug: string): Promise<Brand | undefined> {
  return (await getAllBrands()).find((b) => b.slug === slug);
}

export async function getVisibleBrands(): Promise<Brand[]> {
  return (await getAllBrands()).filter((b) => !b.hidden);
}

export function isBaseBrand(slug: string): boolean {
  return baseBrands.some((b) => b.slug === slug);
}

export function isBaseCategory(slug: string): boolean {
  return baseCategories.some((c) => c.slug === slug);
}

/** Slugs válidos (base + nuevos) para validar productos. */
export async function getKnownSlugs(): Promise<{ brands: string[]; categories: string[] }> {
  const [b, c] = await Promise.all([getAllBrands(), getAllCategories()]);
  return { brands: b.map((x) => x.slug), categories: c.map((x) => x.slug) };
}
