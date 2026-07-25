"use client";

import { ArrowUpIcon } from "@/components/Icons";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-1.5 rounded-full border border-graphite-700 px-3 py-1.5 font-semibold text-graphite-200 transition hover:border-brand-500 hover:text-white"
      aria-label="Volver arriba"
    >
      <ArrowUpIcon className="h-3.5 w-3.5" />
      Arriba
    </button>
  );
}
