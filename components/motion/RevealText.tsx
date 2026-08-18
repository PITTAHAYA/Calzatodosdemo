"use client";

import { createElement, type ElementType } from "react";
import { motion } from "framer-motion";

// Titular que se revela palabra por palabra al entrar en viewport.
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

  const words = text.split(" ");
  return createElement(
    as,
    { className, "aria-label": text },
    words.map((w, i) => (
      <span key={i} aria-hidden style={{ display: "inline-block", whiteSpace: "pre" }}>
        <motion.span
          style={{ display: "inline-block", willChange: "transform, opacity" }}
          initial={{ opacity: 0, y: "0.6em" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}
