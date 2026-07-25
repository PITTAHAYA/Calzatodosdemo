// Cálculo de estado abierto/cerrado según horario del local.
// Nota: usa la hora local del navegador/servidor. Para máxima fiabilidad,
// idealmente se calcularía en zona horaria de Ecuador (America/Guayaquil).

import type { Store } from "@/data/stores";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenState {
  open: boolean;
  label: string;
}

// Calcula el estado usando la zona horaria de Ecuador (UTC-5, sin DST).
export function getOpenState(store: Store, now: Date = new Date()): OpenState {
  // Convertir "now" a hora de Ecuador (America/Guayaquil = UTC-5 fijo).
  const ecuador = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Guayaquil" })
  );
  const day = ecuador.getDay(); // 0=Dom
  const minutes = ecuador.getHours() * 60 + ecuador.getMinutes();

  const opensAt = toMinutes(store.opensAt);
  const closesAt = toMinutes(store.closesAt);

  const isOpenDay = store.days.includes(day);
  const isOpen = isOpenDay && minutes >= opensAt && minutes < closesAt;

  return {
    open: isOpen,
    label: isOpen ? "Abierto ahora" : "Cerrado ahora",
  };
}
