"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Video de fondo del hero.
// - Descarga SOLO la versión que corresponde a la pantalla (antes se bajaban
//   las dos: ~1,4 MB extra en escritorio y ~2,5 MB extra en móvil).
// - Fuerza play() al montar: algunos navegadores no arrancan el autoplay
//   tras la hidratación y el hero quedaba en negro.
// - Mientras carga (o si el navegador bloquea el autoplay) se ve el póster.
export function HeroVideo() {
  const [variant, setVariant] = useState<"mobile" | "desktop" | null>(null);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const pick = () => setVariant(mq.matches ? "desktop" : "mobile");
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      // Autoplay bloqueado (p. ej. ahorro de datos): se queda el póster.
    });
  }, [variant]);

  const base = variant === "mobile" ? "/hero/hero-mobile" : "/hero/hero";

  return (
    <>
      <picture>
        <source media="(min-width: 640px)" srcSet="/hero/hero-poster.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-mobile-poster.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {variant && (
        <video
          key={variant}
          ref={ref}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            playing ? "opacity-100" : "opacity-0"
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      )}
    </>
  );
}
