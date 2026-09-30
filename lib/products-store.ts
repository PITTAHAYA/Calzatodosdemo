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
import { sanitizeProduct } from "@/lib/product-validation";

export interface Overrides {
  patches: Record<string, Partial<Product>>;
  deleted: string[];
  created: Product[];
}

const EMPTY: Overrides = { patches: {}, deleted: [], created: [] };
const KV_KEY = "catalog:overrides";
const KV_HISTORY_KEY = "catalog:history";
const HISTORY_LIMIT = 30;

// Cada guardado deja una copia de cómo estaba el catálogo ANTES del cambio,
// con quién y qué hizo. Permite "Deshacer" y ver la actividad reciente.
export interface HistoryEntry {
  at: number; // epoch ms
  user: string;
  summary: string;
  before: Overrides;
}

const OVERRIDES_PATH = path.join(
  process.cwd(),
  "data",
  "products-overrides.json"
);
const HISTORY_PATH = path.join(process.cwd(), "data", "products-history.json");

// Normaliza lo que venga del almacenamiento: nunca confiar en la forma.
function normalizeOverrides(val: unknown): Overrides {
  if (!val || typeof val !== "object") return { ...EMPTY };
  const v = val as Partial<Overrides>;
  const patches: Overrides["patches"] = {};
  if (v.patches && typeof v.patches === "object" && !Array.isArray(v.patches)) {
    for (const [id, patch] of Object.entries(v.patches)) {
      if (patch && typeof patch === "object") patches[id] = patch as Partial<Product>;
    }
  }
  return {
    patches,
    deleted: Array.isArray(v.deleted)
      ? v.deleted.filter((x): x is string => typeof x === "string")
      : [],
    created: Array.isArray(v.created) ? (v.created as Product[]) : [],
  };
}

function useKV(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// -------------------- Backend: Vercel KV --------------------

async function kvRead(): Promise<Overrides> {
  const { kv } = await import("@vercel/kv");
  return normalizeOverrides(await kv.get(KV_KEY));
}

async function kvWrite(next: Overrides): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(KV_KEY, next);
}

// -------------------- Backend: sistema de archivos --------------------

async function fsRead(): Promise<Overrides> {
  try {
    const raw = await fs.readFile(OVERRIDES_PATH, "utf8");
    return normalizeOverrides(JSON.parse(raw));
  } catch {
    return { ...EMPTY };
  }
}

// Escritura atómica: escribe a un temporal y renombra, así un corte a
// mitad de escritura nunca deja un JSON corrupto.
async function atomicWrite(file: string, data: unknown): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

async function fsWrite(next: Overrides): Promise<void> {
  await atomicWrite(OVERRIDES_PATH, next);
}

// -------------------- Historial --------------------

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    if (useKV()) {
      const { kv } = await import("@vercel/kv");
      const val = await kv.get<HistoryEntry[]>(KV_HISTORY_KEY);
      return Array.isArray(val) ? val : [];
    }
    const raw = await fs.readFile(HISTORY_PATH, "utf8");
    const val = JSON.parse(raw);
    return Array.isArray(val) ? val : [];
  } catch {
    return [];
  }
}

async function setHistory(list: HistoryEntry[]): Promise<void> {
  const trimmed = list.slice(0, HISTORY_LIMIT);
  if (useKV()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_HISTORY_KEY, trimmed);
  } else {
    await atomicWrite(HISTORY_PATH, trimmed);
  }
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
  try {
    const data = useKV() ? await kvRead() : await fsRead();
    cache = { at: Date.now(), data };
    return data;
  } catch (err) {
    // Si KV no responde, el sitio sigue funcionando con la última copia
    // conocida (o con el catálogo base) en lugar de mostrar un error.
    console.error("[products-store] No se pudo leer el catálogo:", err);
    if (force) throw err;
    return cache?.data ?? { ...EMPTY };
  }
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

// Une semilla + cambios y pasa todo por sanitizeProduct(): un dato dañado
// se repara o se descarta, pero nunca tumba el sitio. También evita slugs
// duplicados (el primero gana) para no romper /productos/[slug].
export function mergeProducts(seed: Product[], ov: Overrides): Product[] {
  const deleted = new Set(ov.deleted);
  const patched = seed
    .filter((p) => !deleted.has(p.id))
    .map((p) => (ov.patches[p.id] ? { ...p, ...ov.patches[p.id] } : p));
  const out: Product[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  for (const raw of [...patched, ...ov.created.filter((p) => !deleted.has(p?.id))]) {
    const p = sanitizeProduct(raw);
    if (!p || seenIds.has(p.id) || seenSlugs.has(p.slug)) continue;
    seenIds.add(p.id);
    seenSlugs.add(p.slug);
    out.push(p);
  }
  return out;
}

export async function getOverrides(): Promise<Overrides> {
  return readOverrides();
}

/**
 * Guarda los cambios y registra en el historial el estado anterior.
 * Lee el estado fresco (sin caché) para que el "antes" sea el real.
 */
export async function saveOverrides(
  next: Overrides,
  meta: { user: string; summary: string } = { user: "sistema", summary: "Cambio" }
): Promise<void> {
  const before = await readOverrides(true);
  await writeOverrides(next);
  try {
    const history = await getHistory();
    await setHistory([{ at: Date.now(), ...meta, before }, ...history]);
  } catch {
    // El historial es un extra: si falla, el guardado principal ya ocurrió.
  }
}

/** Deshace el último cambio registrado. Devuelve su resumen o null. */
export async function undoLastChange(): Promise<string | null> {
  const [last, ...rest] = await getHistory();
  if (!last) return null;
  await writeOverrides(normalizeOverrides(last.before));
  await setHistory(rest);
  return last.summary;
}

export function nextProductId(existing: Product[]): string {
  let max = 0;
  for (const p of existing) {
    const m = String(p?.id ?? "").match(/^n(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  // Los ids nuevos usan prefijo "n" para no chocar con los "p###" semilla.
  return `n${String(max + 1).padStart(3, "0")}`;
}
