"use client";

import { useEffect, useRef } from "react";

// Input de búsqueda que se enfoca al presionar "/" en cualquier parte del
// panel (atajo típico de apps de administración), salvo si ya se está
// escribiendo en otro campo.
export function SearchBox({ defaultValue }: { defaultValue: string }) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      e.preventDefault();
      ref.current?.focus();
      ref.current?.select();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <input
      ref={ref}
      name="q"
      defaultValue={defaultValue}
      placeholder="Buscar por nombre, marca, slug o SKU… (atajo: /)"
      className="flex-1 min-w-[220px] rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm"
    />
  );
}
