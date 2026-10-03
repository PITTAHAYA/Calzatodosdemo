"use server";

// =========================================================================
// Server actions: horarios de tiendas (horario habitual y días especiales)
// =========================================================================

import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { stores } from "@/data/stores";
import {
  getStoreHoursForWrite,
  isDate,
  isTime,
  saveStoreHours,
  type StoreHoursData,
} from "@/lib/store-hours-store";
import { ecuadorDate } from "@/lib/store-hours";

async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

const back = (q: string) => redirect(`/admin/horarios?${q}`);

function bump() {
  for (const p of ["/", "/tiendas", "/contacto"]) revalidatePath(p, "page");
  revalidatePath("/productos/[slug]", "page");
  revalidatePath("/admin/horarios", "page");
}

const isStore = (slug: string) => stores.some((s) => s.slug === slug);

function entry(data: StoreHoursData, slug: string) {
  return (data[slug] ??= { exceptions: [] });
}

/** Horario habitual de un local. */
export async function saveRegularHoursAction(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("store") ?? "");
  const opensAt = String(formData.get("opensAt") ?? "");
  const closesAt = String(formData.get("closesAt") ?? "");
  const days = formData
    .getAll("days")
    .map(Number)
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  if (!isStore(slug)) back("error=tienda");
  if (!isTime(opensAt) || !isTime(closesAt) || opensAt >= closesAt) back(`error=horas#${slug}`);

  const data = await getStoreHoursForWrite();
  Object.assign(entry(data, slug), { opensAt, closesAt, days });
  await saveStoreHours(data);
  bump();
  back(`ok=horario#${slug}`);
}

/** Día especial (o rango de días) para un local o para todos. */
export async function addExceptionAction(formData: FormData) {
  await requireAdmin();
  const target = String(formData.get("store") ?? "");
  const from = String(formData.get("from") ?? "");
  const to = String(formData.get("to") ?? "") || from;
  const closed = formData.get("mode") !== "horario";
  const opensAt = String(formData.get("opensAt") ?? "");
  const closesAt = String(formData.get("closesAt") ?? "");
  const note = String(formData.get("note") ?? "").trim().slice(0, 80) || undefined;

  const slugs = target === "todas" ? stores.map((s) => s.slug) : [target];
  if (!slugs.every(isStore)) back("error=tienda");
  if (!isDate(from) || !isDate(to) || to < from) back("error=fecha");
  if (from < ecuadorDate()) back("error=pasado");
  if (!closed && (!isTime(opensAt) || !isTime(closesAt) || opensAt >= closesAt)) back("error=horas");

  // Fechas del rango (máx. 60 días para evitar errores de tipeo).
  const dates: string[] = [];
  for (let d = new Date(`${from}T12:00:00Z`); dates.length < 61; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10);
    if (iso > to) break;
    dates.push(iso);
  }
  if (dates.length > 60) back("error=rango");

  const data = await getStoreHoursForWrite();
  for (const slug of slugs) {
    const e = entry(data, slug);
    e.exceptions = e.exceptions.filter((x) => !dates.includes(x.date));
    for (const date of dates) {
      e.exceptions.push(closed ? { date, closed: true, note } : { date, closed: false, opensAt, closesAt, note });
    }
  }
  await saveStoreHours(data);
  bump();
  back(`ok=especial&n=${dates.length * slugs.length}`);
}

export async function deleteExceptionAction(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("store") ?? "");
  const date = String(formData.get("date") ?? "");
  if (!isStore(slug) || !isDate(date)) back("error=tienda");
  const data = await getStoreHoursForWrite();
  const e = entry(data, slug);
  e.exceptions = e.exceptions.filter((x) => x.date !== date);
  await saveStoreHours(data);
  bump();
  back("ok=borrado");
}
