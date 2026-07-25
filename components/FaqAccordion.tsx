"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/faq";
import { ChevronDownIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-graphite-100 rounded-2xl border border-graphite-100 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-graphite-900 sm:text-base">
                {item.question}
              </span>
              <ChevronDownIcon
                className={cn(
                  "h-5 w-5 shrink-0 text-graphite-400 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-graphite-600">{item.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
