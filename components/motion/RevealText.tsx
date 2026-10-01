"use client";

import { createElement, useRef, type ElementType } from "react";
import { motion, useInView } from "framer-motion";

// Titular que se revela palabra por palabra al entrar en viewport.
// Un solo observador para todo el titular: así ninguna palabra queda
// invisible si su propio observador no llega a dispararse.
export function RevealText({
  text,
  className,
  as = "span",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const words = text.split(" ");
  return createElement(
    as,
    { ref, className, "aria-label": text },
    words.map((w, i) => (
      <span key={i} aria-hidden style={{ display: "inline-block", whiteSpace: "pre" }}>
        <motion.span
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: "0.6em" }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}
