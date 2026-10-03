"use client";

import { useEffect, useState } from "react";
import type { Store, StoreException } from "@/data/stores";
import { ecuadorDate, exceptionDateLabel, exceptionText } from "@/lib/store-hours";
import { cn } from "@/lib/utils";

// Avisos de días especiales (feriados, cierres) de los próximos 14 días.
// Se calcula en el cliente porque depende de la fecha de hoy.
export function SpecialHours({ store, className }: { store: Store; className?: string }) {
  const [items, setItems] = useState<{ e: StoreException; today: boolean }[]>([]);
  useEffect(() => {
    const today = ecuadorDate();
    const limit = ecuadorDate(new Date(Date.now() + 14 * 86_400_000));
    setItems(
      (store.exceptions ?? [])
        .filter((e) => e.date >= today && e.date <= limit)
        .map((e) => ({ e, today: e.date === today }))
    );
  }, [store]);

  if (items.length === 0) return null;
  return (
    <ul className={cn("space-y-1", className)}>
      {items.map(({ e, today }) => (
        <li
          key={e.date}
          className={cn(
            "rounded-md px-2.5 py-1.5 text-xs",
            e.closed ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"
          )}
        >
          <span className="font-semibold">{today ? "Hoy" : exceptionDateLabel(e.date)}:</span>{" "}
          {exceptionText(e)}
        </li>
      ))}
    </ul>
  );
}
