// Cálculo de estado abierto/cerrado según horario del local, en hora de
// Ecuador (America/Guayaquil, UTC-5 sin cambio de horario). Tiene en cuenta
// los días especiales (feriados, cierres) definidos desde el panel.

import type { Store, StoreException } from "@/data/stores";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenState {
  open: boolean;
  label: string;
}

/** Fecha "YYYY-MM-DD" en Ecuador. */
export function ecuadorDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(now);
}

/** Día especial de hoy, si lo hay. */
export function todayException(store: Store, now: Date = new Date()): StoreException | undefined {
  const today = ecuadorDate(now);
  return store.exceptions?.find((e) => e.date === today);
}

export function getOpenState(store: Store, now: Date = new Date()): OpenState {
  const ecuador = new Date(now.toLocaleString("en-US", { timeZone: "America/Guayaquil" }));
  const day = ecuador.getDay(); // 0=Dom
  const minutes = ecuador.getHours() * 60 + ecuador.getMinutes();

  const special = todayException(store, now);
  if (special?.closed) return { open: false, label: "Cerrado hoy" };

  const opensAt = toMinutes(special?.opensAt ?? store.opensAt);
  const closesAt = toMinutes(special?.closesAt ?? store.closesAt);
  const isOpenDay = special ? true : store.days.includes(day);
  const isOpen = isOpenDay && minutes >= opensAt && minutes < closesAt;

  return { open: isOpen, label: isOpen ? "Abierto ahora" : "Cerrado ahora" };
}

/** "Cerrado" o "10:00 a 14:00", más el motivo si existe. */
export function exceptionText(e: StoreException): string {
  const base = e.closed ? "Cerrado" : `${e.opensAt} a ${e.closesAt}`;
  return e.note ? `${base} · ${e.note}` : base;
}

/** "Lunes 2 de noviembre" */
export function exceptionDateLabel(date: string): string {
  const d = new Date(`${date}T12:00:00-05:00`);
  const t = new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Guayaquil",
  }).format(d);
  return t.charAt(0).toUpperCase() + t.slice(1);
}
