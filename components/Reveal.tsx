"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Animación discreta de aparición al entrar en viewport (decorativa; se
// muestra siempre para conservar la sensación premium del catálogo).
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
