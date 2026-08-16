"use client";

import { motion, useReducedMotion } from "framer-motion";

// Transición de página: una cortina roja se levanta revelando el contenido.
// Se anima solo la entrada (App Router remonta en cada navegación).
// El contenido usa solo opacidad para no crear un contenedor que rompa
// elementos position:fixed (drawers, modales).
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] origin-top bg-brand-600"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[89] origin-top bg-graphite-950"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
