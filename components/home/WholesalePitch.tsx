"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Counter } from "@/components/motion/Counter";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { Grain } from "@/components/motion/Grain";
import { Spotlight } from "@/components/motion/Spotlight";
import {
  WhatsAppIcon,
  ArrowRightIcon,
  TruckIcon,
  BadgeCheckIcon,
  SparkleIcon,
  HeadsetIcon,
  MapPinIcon,
} from "@/components/Icons";
import { whatsappWholesale } from "@/lib/whatsapp";

// Alturas relativas (0-1) de las barras del "gráfico de crecimiento".
const BARS = [0.3, 0.45, 0.38, 0.6, 0.76, 1];

const STATS = [
  { value: 8, prefix: "", suffix: "", label: "Marcas" },
  { value: 20, prefix: "+", suffix: "", label: "Años" },
  { value: 50, prefix: "+", suffix: "", label: "Modelos" },
  { value: 3, prefix: "", suffix: "", label: "Provincias" },
];

const BENEFITS = [
  { Icon: BadgeCheckIcon, title: "Precio mayorista", text: "Márgenes para crecer." },
  { Icon: TruckIcon, title: "Reposición constante", text: "Stock todo el año." },
  { Icon: SparkleIcon, title: "8 marcas", text: "Internacionales y propias." },
  { Icon: HeadsetIcon, title: "Asesor dedicado", text: "Atención personalizada." },
  { Icon: MapPinIcon, title: "Cobertura nacional", text: "Envíos a todo Ecuador." },
];

const TICKER = ["PRECIO MAYORISTA", "REPOSICIÓN CONSTANTE", "8 MARCAS", "COBERTURA NACIONAL"];

export function WholesalePitch() {
  // Animaciones decorativas: se muestran siempre (catálogo promocional).
  const reduce = false;

  return (
    <section className="section bg-graphite-50">
      <div className="container-page">
        <Spotlight
          className="relative isolate overflow-hidden rounded-3xl bg-graphite-950 px-5 py-8 text-white sm:px-10 sm:py-12"
          color="rgba(248,53,53,0.28)"
        >
          <Grain />

          {/* Resplandores de marca flotando */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-brand-600/40 blur-3xl"
            animate={reduce ? undefined : { x: [0, 26, 0], y: [0, 18, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-14 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl"
            animate={reduce ? undefined : { x: [0, -22, 0], y: [0, -16, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative grid gap-7 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* ---------- Mensaje + gráfico ---------- */}
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
                </span>
                Mayoristas
              </p>

              <RevealText
                as="h2"
                text="Lleva tu negocio a otra escala"
                className="mt-3 block max-w-[9ch] text-2xl font-black leading-[1.05] sm:max-w-none sm:text-4xl"
              />

              {/* Gráfico de crecimiento animado (compacto) */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-widest text-graphite-400">
                    Tus ventas creciendo
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-xs font-bold text-brand-300">
                    <ArrowRightIcon className="h-3 w-3 -rotate-45" />
                    <Counter value={180} prefix="+" suffix="%" duration={2} />
                  </span>
                </div>
                <div className="mt-3 flex h-14 min-w-0 items-end gap-1.5">
                  {BARS.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-brand-700 to-brand-400"
                      style={{ height: `${h * 100}%`, transformOrigin: "bottom" }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ---------- Stats + beneficios ---------- */}
            <div className="min-w-0">
              {/* Stats: fila compacta de 4 */}
              <div className="grid grid-cols-4 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04]">
                {STATS.map((s) => (
                  <div key={s.label} className="px-1 py-3 text-center">
                    <Counter
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                      className="block text-xl font-black text-white sm:text-2xl"
                    />
                    <p className="mt-0.5 text-[10px] text-graphite-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Beneficios: deck deslizable en móvil, lista en desktop */}
              <div className="mt-3 -mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-1 sm:gap-2 sm:overflow-visible sm:px-0">
                {BENEFITS.map(({ Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex min-w-[66%] snap-center items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:min-w-0"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/15 text-brand-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-tight text-white">{title}</p>
                      <p className="truncate text-[11px] text-graphite-400">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-graphite-500 sm:hidden">Desliza →</p>
            </div>
          </div>

          {/* ---------- Ticker de valor ---------- */}
          <div className="marquee-wrap relative mt-7 border-y border-white/10 py-2 no-scrollbar">
            {[0, 1].map((track) => (
              <div
                key={track}
                aria-hidden={track === 1}
                className="marquee-track flex shrink-0 items-center gap-5 whitespace-nowrap pr-5"
              >
                {TICKER.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-5 text-xs font-bold uppercase tracking-widest text-graphite-400"
                  >
                    {t}
                    <span className="text-brand-500">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* ---------- CTA ---------- */}
          <div className="relative mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Magnetic className="w-full sm:w-auto">
              <a
                href={whatsappWholesale()}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-900/40 transition-transform active:scale-95 sm:w-auto"
              >
                {!reduce && (
                  <span className="absolute inset-0 -z-0 animate-ping rounded-full bg-brand-500/40" />
                )}
                <WhatsAppIcon className="relative h-5 w-5" />
                <span className="relative">Quiero ser mayorista</span>
              </a>
            </Magnetic>
            <Link
              href="/mayoristas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline"
            >
              Ver beneficios
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </Spotlight>
      </div>
    </section>
  );
}
