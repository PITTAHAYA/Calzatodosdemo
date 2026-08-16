"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

// Reflector que sigue el cursor sobre secciones oscuras (solo desktop).
export function Spotlight({
  children,
  className,
  color = "rgba(248,53,53,0.20)",
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
        el.style.setProperty("--so", "1");
      }}
      onMouseLeave={() => ref.current?.style.setProperty("--so", "0")}
      className={cn("relative", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--so, 0)" as unknown as number,
          background: `radial-gradient(600px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
