"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Store } from "@/data/stores";
import { storeMapsEmbedUrl, storeMapsUrl } from "@/data/stores";
import { getOpenState } from "@/lib/store-hours";
import { whatsappStore } from "@/lib/whatsapp";
import {
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
  CloseIcon,
  ChevronRightIcon,
} from "@/components/Icons";
import { cn } from "@/lib/utils";

// Coverflow arrastrable de locales: mueve a los lados y toca para ver el mapa.
export function StoreCoverflow({ stores }: { stores: Store[] }) {
  const [active, setActive] = useState(0);
  const [mapStore, setMapStore] = useState<Store | null>(null);
  const [step, setStep] = useState(300);
  const [cardW, setCardW] = useState(300);
  const dragging = useRef(false);
  const reduce = false;

  // Dimensiones responsivas.
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const cw = Math.min(320, Math.max(200, w * 0.72));
      setCardW(cw);
      setStep(w < 640 ? cw * 0.52 : cw * 0.66);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(stores.length - 1, i)),
    [stores.length]
  );
  const next = useCallback(() => setActive((a) => clamp(a + 1)), [clamp]);
  const prev = useCallback(() => setActive((a) => clamp(a - 1)), [clamp]);

  // Teclado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mapStore) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, mapStore]);

  // Bloquear scroll cuando el mapa está abierto.
  useEffect(() => {
    document.body.style.overflow = mapStore ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mapStore]);

  return (
    <div>
      {/* Escenario 3D (overflow-hidden evita desbordamiento horizontal de la página) */}
      <div
        className="relative select-none overflow-hidden"
        style={{ perspective: 1600, height: cardW * 1.42 + 40 }}
      >
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragSnapToOrigin
          dragElastic={0.12}
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={() => {
            dragging.current = true;
          }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50 || info.velocity.x < -400) next();
            else if (info.offset.x > 50 || info.velocity.x > 400) prev();
            setTimeout(() => (dragging.current = false), 30);
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {stores.map((s, i) => {
            const offset = i - active;
            const abs = Math.abs(offset);
            const isActive = offset === 0;
            const visible = abs <= 2;
            return (
              <div
                key={s.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: cardW,
                  height: cardW * 1.32,
                  marginLeft: -cardW / 2,
                  marginTop: -(cardW * 1.32) / 2,
                  transform: reduce
                    ? `translateX(${offset * (cardW + 16)}px)`
                    : `translateX(${offset * step}px) rotateY(${offset * -32}deg) scale(${
                        isActive ? 1 : 0.82
                      }) translateZ(${isActive ? 0 : -140}px)`,
                  transformStyle: "preserve-3d",
                  transition:
                    "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease",
                  opacity: visible ? (isActive ? 1 : 0.55) : 0,
                  zIndex: 20 - abs,
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <StoreCard3D
                  store={s}
                  isActive={isActive}
                  onClick={() => {
                    if (dragging.current) return;
                    if (isActive) setMapStore(s);
                    else setActive(i);
                  }}
                />
              </div>
            );
          })}
        </motion.div>

        {/* Flechas */}
        <button
          type="button"
          onClick={prev}
          disabled={active === 0}
          aria-label="Local anterior"
          className="absolute left-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-graphite-200 bg-white/90 p-3 shadow-md backdrop-blur transition hover:bg-white disabled:opacity-30 sm:block"
        >
          <ChevronRightIcon className="h-5 w-5 rotate-180 text-graphite-800" />
        </button>
        <button
          type="button"
          onClick={next}
          disabled={active === stores.length - 1}
          aria-label="Siguiente local"
          className="absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-graphite-200 bg-white/90 p-3 shadow-md backdrop-blur transition hover:bg-white disabled:opacity-30 sm:block"
        >
          <ChevronRightIcon className="h-5 w-5 text-graphite-800" />
        </button>
      </div>

      {/* Puntos / dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {stores.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ir a ${s.name}`}
            className={cn(
              "h-2 rounded-full transition-all",
              active === i ? "w-7 bg-brand-600" : "w-2 bg-graphite-300 hover:bg-graphite-400"
            )}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-xs uppercase tracking-widest text-graphite-400">
        Desliza · toca para ver el mapa
      </p>

      {/* Modal de mapa */}
      <AnimatePresence>
        {mapStore && (
          <MapModal store={mapStore} onClose={() => setMapStore(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// -------- Tarjeta 3D --------
function StoreCard3D({
  store,
  isActive,
  onClick,
}: {
  store: Store;
  isActive: boolean;
  onClick: () => void;
}) {
  const [open, setOpen] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    setOpen(getOpenState(store));
  }, [store]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative h-full w-full overflow-hidden rounded-3xl text-left shadow-2xl ring-1 ring-black/10"
      aria-label={isActive ? `Ver mapa de ${store.name}` : `Ver ${store.name}`}
    >
      {store.photo ? (
        <Image
          src={store.photo}
          alt={store.name}
          fill
          sizes="320px"
          className="object-cover"
          draggable={false}
        />
      ) : (
        <div className="h-full w-full bg-graphite-200" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

      {open && (
        <span
          className={cn(
            "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur",
            open.open ? "bg-green-500/90 text-white" : "bg-white/85 text-graphite-700"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", open.open ? "bg-white" : "bg-graphite-400")} />
          {open.label}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-300">
          {store.city}
        </p>
        <h3 className="mt-1 text-2xl font-black leading-tight">{store.name}</h3>
        <div
          className={cn(
            "mt-3 flex items-center gap-2 text-sm font-semibold transition-all duration-500",
            isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-graphite-900">
            <MapPinIcon className="h-4 w-4 text-brand-600" /> Ver mapa
          </span>
        </div>
      </div>
    </button>
  );
}

// -------- Modal de mapa --------
function MapModal({ store, onClose }: { store: Store; onClose: () => void }) {
  const reduce = false;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.25 }}
    >
      <div className="absolute inset-0 bg-graphite-950/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Mapa de ${store.name}`}
        initial={{ scale: reduce ? 1 : 0.92, y: reduce ? 0 : 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: reduce ? 1 : 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-graphite-100 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              {store.city}
            </p>
            <h3 className="mt-0.5 text-xl font-bold text-graphite-900">{store.name}</h3>
            <p className="mt-1 flex items-start gap-2 text-sm text-graphite-600">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
              {store.address}
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-graphite-500">
              <ClockIcon className="h-4 w-4 text-graphite-400" />
              {store.hoursLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar mapa"
            className="rounded-full p-2 text-graphite-500 transition hover:bg-graphite-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="aspect-[16/10] w-full bg-graphite-100">
          <iframe
            title={`Mapa de ${store.name}`}
            src={storeMapsEmbedUrl(store)}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col gap-2 p-5 sm:flex-row">
          <a
            href={storeMapsUrl(store)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex-1 !py-2.5"
          >
            <MapPinIcon className="h-4 w-4" /> Cómo llegar
          </a>
          <a
            href={whatsappStore(store.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 !py-2.5"
          >
            <WhatsAppIcon className="h-4 w-4" /> Consultar por WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
