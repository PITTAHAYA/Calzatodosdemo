"use client";

import { useState } from "react";
import Link from "next/link";
import { WhatsAppIcon, CloseIcon } from "@/components/Icons";
import { whatsappGeneral, whatsappWholesale } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

// Botón flotante de WhatsApp presente en todas las páginas.
// Abre un pequeño modal con accesos rápidos, pero SIEMPRE permite ir directo
// a WhatsApp (el botón principal es un enlace directo con clic derecho / medio).
export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Consultar un producto", href: "/catalogo", internal: true },
    { label: "Comprar al por mayor", href: whatsappWholesale(), internal: false },
    { label: "Encontrar una tienda", href: "/tiendas", internal: true },
    { label: "Servicio al cliente", href: whatsappGeneral(), internal: false },
  ];

  return (
    <div className="fixed bottom-0 right-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pr-[max(1rem,env(safe-area-inset-right))]">
      {/* Modal de accesos rápidos */}
      {open && (
        <div
          className="mb-3 w-64 overflow-hidden rounded-2xl border border-graphite-100 bg-white shadow-card-hover animate-fade-in"
          role="dialog"
          aria-label="Opciones de contacto por WhatsApp"
        >
          <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
            <span className="text-sm font-semibold">¿Cómo podemos ayudarte?</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="rounded-full p-1 hover:bg-white/20"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
          <ul className="p-2">
            {options.map((opt) =>
              opt.internal ? (
                <li key={opt.label}>
                  <Link
                    href={opt.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-graphite-700 transition hover:bg-graphite-50"
                  >
                    {opt.label}
                  </Link>
                </li>
              ) : (
                <li key={opt.label}>
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-graphite-700 transition hover:bg-graphite-50"
                  >
                    {opt.label}
                  </a>
                </li>
              )
            )}
          </ul>
          <div className="border-t border-graphite-100 p-2">
            <a
              href={whatsappGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full !py-2 text-xs"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Abrir WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Botón principal (grupo: abre modal + acceso directo con hover) */}
      <div className="group flex items-center justify-end gap-2">
        <span
          className={cn(
            "pointer-events-none hidden rounded-full bg-graphite-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100 sm:block"
          )}
          aria-hidden
        >
          Consultar por WhatsApp
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Consultar por WhatsApp"
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe5b] active:scale-95"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}
