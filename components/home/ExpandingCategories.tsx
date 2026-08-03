"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRightIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export interface CategoryPanel {
  name: string;
  href: string;
  text: string;
  image: string;
}

// Panel de categorías tipo "acordeón horizontal" que se expande al pasar el
// cursor (desktop) — inspirado en las mejores landings editoriales. En móvil
// se convierte en tarjetas apiladas fáciles de tocar.
export function ExpandingCategories({ panels }: { panels: CategoryPanel[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <>
      {/* ===== DESKTOP: acordeón horizontal ===== */}
      <div className="hidden gap-2.5 sm:flex" style={{ height: "min(70vh, 620px)" }}>
        {panels.map((p, i) => {
          const isActive = active === i;
          return (
            <Link
              key={p.name}
              href={p.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group relative overflow-hidden rounded-3xl outline-none ring-brand-500 focus-visible:ring-2"
              style={{
                flexGrow: isActive ? 3.2 : 1,
                flexBasis: 0,
                transition: reduce ? undefined : "flex-grow 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
              aria-label={`${p.name} — ${p.text}`}
            >
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 1024px) 40vw, 30vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                priority={i < 2}
              />
              {/* Oscurecido: más fuerte cuando está colapsado */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  "bg-gradient-to-t from-black/85 via-black/35 to-black/10"
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-black/30 transition-opacity duration-500",
                  isActive ? "opacity-0" : "opacity-100"
                )}
              />

              {/* Contenido */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-5 text-white sm:p-7">
                <div className="flex items-end justify-between gap-3">
                  <h3 className="text-xl font-black leading-none tracking-tight sm:text-2xl lg:text-3xl">
                    {p.name}
                  </h3>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-500",
                      isActive ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                    )}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
                <motion.p
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    height: isActive ? "auto" : 0,
                  }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
                  className="mt-2 max-w-xs overflow-hidden text-sm text-white/85"
                >
                  {p.text}
                </motion.p>
              </div>

              {/* Número índice sutil */}
              <span className="absolute left-5 top-5 text-xs font-bold tracking-widest text-white/60 sm:left-7 sm:top-7">
                0{i + 1}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ===== MÓVIL: tarjetas apiladas ===== */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {panels.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl p-4 text-white"
          >
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="relative">
              <h3 className="text-lg font-black">{p.name}</h3>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white/85">
                Ver más <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
