// =========================================================================
// PRODUCTS STORE — capa de lectura/escritura del catálogo
// -------------------------------------------------------------------------
// El catálogo base vive en data/products.ts (semilla en código). Los cambios
// hechos desde /admin se guardan como una "superposición" con esta forma:
//
//   {
//     "patches":  { "<id>": { <campos modificados> } },
//     "deleted":  [ "<id>", ... ],
//     "created":  [ Product, ... ]
//   }
//
// Backend automático:
//   * Producción en Vercel     -> Vercel KV (si KV_REST_API_URL está definido)
//   * Desarrollo local / VPS   -> data/products-overrides.json
// =========================================================================

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Product } from "@/data/products";

export interface Overrides {
  patches: Record<string, Partial<Product>>;
  deleted: string[];
  created: Product[];
}

const EMPTY: Overrides = { patches: {}, deleted: [], created: [] };
const KV_KEY = "catalog:overrides";

const OVERRIDES_PATH = path.join(
  process.cwd(),
  "data",
  "products-overrides.json"
);

function useKV(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// -------------------- Backend: Vercel KV --------------------

async function kvRead(): Promise<Overrides> {
  const { kv } = await import("@vercel/kv");
  const val = (await kv.get<Overrides>(KV_KEY)) ?? EMPTY;
  return {
    patches: val.patches ?? {},
    deleted: val.deleted ?? [],
    created: val.created ?? [],
  };
}

async function kvWrite(next: Overrides): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(KV_KEY, next);
}

// -------------------- Backend: sistema de archivos --------------------

async function fsRead(): Promise<Overrides> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<Overrides>;
    return {
      patches: parsed.patches ?? {},
      deleted: parsed.deleted ?? [],
      created: parsed.created ?? [],
    };
  } catch {
    return { ...EMPTY };
  }
}

async function fsWrite(next: Overrides): Promise<void> {
  await fs.mkdir(path.dirname(OVERRIDES_PATH), { recursive: true });
  await fs.writeFile(OVERRIDES_PATH, JSON.stringify(next, null, 2), "utf8");
}

// -------------------- Cache en memoria --------------------
// Evita ir a KV en cada renderizado. Se refresca al escribir y cuando
// caduca el TTL (30 s), para tolerar cambios hechos desde otra instancia.

const CACHE_TTL_MS = 30_000;
let cache: { at: number; data: Overrides } | null = null;

async function readOverrides(force = false): Promise<Overrides> {
  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }
  const data = useKV() ? await kvRead() : await fsRead();
  cache = { at: Date.now(), data };
  return data;
}

async function writeOverrides(next: Overrides): Promise<void> {
  if (useKV()) await kvWrite(next);
  else await fsWrite(next);
  cache = { at: Date.now(), data: next };
}

export function invalidateOverridesCache(): void {
  cache = null;
}

// -------------------- API pública --------------------

export function mergeProducts(seed: Product[], ov: Overrides): Product[] {
  const deleted = new Set(ov.deleted);
  const patched = seed
    .filter((p) => !deleted.has(p.id))
    .map((p) => (ov.patches[p.id] ? { ...p, ...ov.patches[p.id] } : p));
  return [...patched, ...ov.created];
}

export async function getOverrides(): Promise<Overrides> {
  return readOverrides();
}

export async function saveOverrides(next: Overrides): Promise<void> {
  return writeOverrides(next);
}

export function nextProductId(existing: Product[]): string {
  let max = 0;
  for (const p of existing) {
    const m = p.id.match(/^n(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  // Los ids nuevos usan prefijo "n" para no chocar con los "p###" semilla.
  return `n${String(max + 1).padStart(3, "0")}`;
}
