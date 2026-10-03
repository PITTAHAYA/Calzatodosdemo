// =========================================================================
// HORARIOS DE TIENDAS — cambios hechos desde el panel /admin/horarios
// -------------------------------------------------------------------------
// Los datos base viven en data/stores.ts. Aquí se guardan aparte:
//   * el horario habitual de cada local (si se cambió en el panel)
//   * los días especiales: feriados, cierres, horarios reducidos
//   * Producción en Vercel     -> Vercel KV (clave "stores:hours")
//   * Desarrollo local / VPS   -> data/store-hours.json
// =========================================================================

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cache as reactCache } from "react";
import { stores as baseStores, buildHoursLabel, type Store, type StoreException } from "@/data/stores";
import { ecuadorDate } from "@/lib/store-hours";

export interface StoreHoursOverride {
  opensAt?: string;
  closesAt?: string;
  days?: number[];
  exceptions: StoreException[];
}

export type StoreHoursData = Record<string, StoreHoursOverride>;

const KV_KEY = "stores:hours";
const FILE_PATH = path.join(process.cwd(), "data", "store-hours.json");
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function useKV(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export const isTime = (v: unknown): v is string => typeof v === "string" && TIME_RE.test(v);
export const isDate = (v: unknown): v is string => typeof v === "string" && DATE_RE.test(v);

function cleanException(raw: unknown): StoreException | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!isDate(r.date)) return null;
  const note = typeof r.note === "string" ? r.note.trim().slice(0, 80) : "";
  if (r.closed === true) return { date: r.date, closed: true, note: note || undefined };
  if (!isTime(r.opensAt) || !isTime(r.closesAt)) return null;
  return { date: r.date, closed: false, opensAt: r.opensAt, closesAt: r.closesAt, note: note || undefined };
}

function normalize(val: unknown): StoreHoursData {
  const out: StoreHoursData = {};
  if (!val || typeof val !== "object") return out;
  for (const s of baseStores) {
    const r = (val as Record<string, unknown>)[s.slug] as Record<string, unknown> | undefined;
    if (!r || typeof r !== "object") continue;
    out[s.slug] = {
      opensAt: isTime(r.opensAt) ? r.opensAt : undefined,
      closesAt: isTime(r.closesAt) ? r.closesAt : undefined,
      days: Array.isArray(r.days)
        ? r.days.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6)
        : undefined,
      exceptions: (Array.isArray(r.exceptions) ? r.exceptions : [])
        .map(cleanException)
        .filter((e): e is StoreException => Boolean(e)),
    };
  }
  return out;
}

async function readRaw(): Promise<StoreHoursData> {
  if (useKV()) {
    const { kv } = await import("@vercel/kv");
    return normalize(await kv.get(KV_KEY));
  }
  try {
    return normalize(JSON.parse(await fs.readFile(FILE_PATH, "utf8")));
  } catch {
    return {};
  }
}

let lastGood: StoreHoursData = {};

export const getStoreHours = reactCache(async (): Promise<StoreHoursData> => {
  try {
    lastGood = await readRaw();
  } catch (err) {
    console.error("[store-hours] No se pudo leer:", err);
  }
  return lastGood;
});

/** Lectura estricta para guardar: si falla, no se escribe nada. */
export async function getStoreHoursForWrite(): Promise<StoreHoursData> {
  return readRaw();
}

export async function saveStoreHours(data: StoreHoursData): Promise<void> {
  const today = ecuadorDate();
  // Los días especiales ya pasados se borran solos.
  for (const o of Object.values(data)) {
    o.exceptions = o.exceptions
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }
  const clean = normalize(data);
  if (useKV()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, clean);
    return;
  }
  await fs.writeFile(FILE_PATH, JSON.stringify(clean, null, 2), "utf8");
}

/** Tiendas con el horario del panel aplicado y sus días especiales próximos. */
export async function getStores(): Promise<Store[]> {
  const data = await getStoreHours();
  const today = ecuadorDate();
  return baseStores.map((s) => {
    const o = data[s.slug];
    if (!o) return s;
    const opensAt = o.opensAt ?? s.opensAt;
    const closesAt = o.closesAt ?? s.closesAt;
    const days = o.days ?? s.days;
    const changed = opensAt !== s.opensAt || closesAt !== s.closesAt || days.join() !== s.days.join();
    return {
      ...s,
      opensAt,
      closesAt,
      days,
      hoursLabel: changed ? buildHoursLabel(days, opensAt, closesAt) : s.hoursLabel,
      exceptions: o.exceptions.filter((e) => e.date >= today),
    };
  });
}
