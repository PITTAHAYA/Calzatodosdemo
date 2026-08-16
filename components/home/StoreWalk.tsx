"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/Icons";
import { whatsappGeneral } from "@/lib/whatsapp";

// Sección cinemática: al hacer scroll "recorres" la tienda. En desktop el
// scroll controla el fotograma del video (scrub); en móvil el video se
// reproduce solo. Los textos aparecen por etapas en ambos casos.
export function StoreWalk() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [scrub, setScrub] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Modo scrub solo en desktop con puntero fino y sin reduced-motion.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const doScrub = fine && wide && !reduce;
    setScrub(doScrub);

    const v = videoRef.current;
    if (!v) return;
    if (doScrub) {
      // En scrub controlamos el fotograma manualmente.
      v.pause();
    }
    // En móvil/otros: el atributo autoPlay+loop se encarga de reproducir.
  }, [reduce]);

  // Scrub: mapear progreso de scroll al currentTime del video.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!scrub) return;
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    const t = Math.min(v.duration - 0.05, Math.max(0, p * v.duration));
    if (Math.abs(v.currentTime - t) > 0.01) v.currentTime = t;
  });

  // Opacidades por etapa (funcionan en todos los dispositivos).
  const c1 = useTransform(scrollYProgress, [0.0, 0.08, 0.24, 0.32], [0, 1, 1, 0]);
  const c2 = useTransform(scrollYProgress, [0.34, 0.44, 0.58, 0.66], [0, 1, 1, 0]);
  const c3 = useTransform(scrollYProgress, [0.7, 0.82, 1, 1], [0, 1, 1, 1]);
  const hint = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const barScale = scrollYProgress;

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-graphite-950">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/store/store-walk-poster.jpg"
        >
          <source src="/store/store-walk.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/50" />

        {/* Etapas de texto */}
        <div className="relative z-10 px-6 text-center text-white">
          <motion.div style={{ opacity: c1 }} className="absolute inset-x-0 -translate-y-1/2">
            <p className="eyebrow text-brand-400">Bienvenido</p>
            <h2 className="mt-2 text-4xl font-black leading-tight sm:text-7xl">
              Entra a Calzatodos Group
            </h2>
          </motion.div>

          <motion.div style={{ opacity: c2 }} className="absolute inset-x-0 -translate-y-1/2">
            <h2 className="text-4xl font-black leading-tight sm:text-7xl">
              Calzado para toda la familia
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-graphite-100">
              Miles de pasos empiezan aquí. Mujer, hombre y niños.
            </p>
          </motion.div>

          <motion.div style={{ opacity: c3 }} className="absolute inset-x-0 -translate-y-1/2">
            <h2 className="text-4xl font-black leading-tight sm:text-7xl">Estrena hoy</h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="btn-primary !px-6 !py-3 text-base">
                Explorar catálogo <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={whatsappGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp !px-6 !py-3 text-base"
              >
                <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* Hint de scroll */}
        <motion.div
          style={{ opacity: hint }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-widest text-white/70"
        >
          Desliza para recorrer la tienda
          <div className="mx-auto mt-2 h-8 w-5 rounded-full border border-white/50">
            <div className="mx-auto mt-1.5 h-1.5 w-1 animate-bounce rounded-full bg-white/80" />
          </div>
        </motion.div>

        {/* Barra de progreso de la sección */}
        <motion.div
          style={{ scaleX: barScale }}
          className="absolute bottom-0 left-0 h-1 w-full origin-left bg-brand-600"
        />
      </div>
    </section>
  );
}
