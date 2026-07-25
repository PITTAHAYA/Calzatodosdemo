"use client";

import { useEffect, useState } from "react";
import type { Store } from "@/data/stores";
import { storeMapsUrl } from "@/data/stores";
import { getOpenState } from "@/lib/store-hours";
import { whatsappStore } from "@/lib/whatsapp";
import { MapPinIcon, ClockIcon, WhatsAppIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export function StoreCard({ store }: { store: Store }) {
  // El estado abierto/cerrado se calcula en el cliente para evitar desajustes
  // de hidratación (depende de la hora actual).
  const [open, setOpen] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    setOpen(getOpenState(store));
    const id = setInterval(() => setOpen(getOpenState(store)), 60_000);
    return () => clearInterval(id);
  }, [store]);

  return (
    <article className="flex flex-col rounded-xl border border-graphite-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
            {store.city}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-graphite-900">{store.name}</h3>
        </div>
        {open && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              open.open
                ? "bg-green-50 text-green-700"
                : "bg-graphite-100 text-graphite-600"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                open.open ? "bg-green-500" : "bg-graphite-400"
              )}
            />
            {open.label}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-graphite-600">
        <p className="flex gap-2">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
          <span>{store.address}</span>
        </p>
        <p className="flex gap-2">
          <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
          <span>{store.hoursLabel}</span>
        </p>
      </div>

      <div className="mt-5 flex gap-2">
        <a
          href={storeMapsUrl(store)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1 !py-2 text-xs"
        >
          <MapPinIcon className="h-4 w-4" />
          Cómo llegar
        </a>
        <a
          href={whatsappStore(store.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1 !py-2 text-xs"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </article>
  );
}
