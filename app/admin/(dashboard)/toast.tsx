"use client";

// Notificación flotante que aparece según parámetros en la URL
// (?updated=, ?deleted=, etc.) y se cierra sola. También limpia la URL
// para que un refresh no la vuelva a mostrar.

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ToastConfig {
  key: string;
  message: (value: string) => string;
  color: "green" | "amber";
}

const CONFIGS: ToastConfig[] = [
  { key: "updated", message: () => "Producto actualizado correctamente.", color: "green" },
  { key: "deleted", message: () => "Producto quitado del catálogo. Puedes restaurarlo abajo.", color: "amber" },
  { key: "restored", message: () => "Producto restaurado al catálogo.", color: "green" },
  { key: "duplicated", message: () => "Producto duplicado. Edita el nombre y las fotos.", color: "green" },
  { key: "created", message: () => "Producto creado. Ya aparece en el catálogo.", color: "green" },
  { key: "bulk", message: (v) => BULK_MSG[v] ?? "Cambios aplicados.", color: "green" },
  { key: "undone", message: (v) => `Deshecho: ${v}`, color: "amber" },
  { key: "imported", message: () => "Respaldo restaurado. Revisa el catálogo.", color: "green" },
  { key: "error", message: () => "Ese producto ya no existe.", color: "amber" },
  { key: "bulkHidden", message: (v) => `${v} producto${v === "1" ? "" : "s"} quitado${v === "1" ? "" : "s"} del catálogo.`, color: "amber" },
  { key: "bulkRestored", message: (v) => `${v} producto${v === "1" ? "" : "s"} restaurado${v === "1" ? "" : "s"}.`, color: "green" },
];

const BULK_MSG: Record<string, string> = {
  hide: "Productos quitados del catálogo. Puedes restaurarlos abajo.",
  restore: "Productos restaurados al catálogo.",
  feature: "Productos destacados en portada.",
  unfeature: "Productos quitados de destacados.",
  sale: "Productos marcados en oferta.",
  unsale: "Oferta quitada.",
  new: "Productos marcados como nuevos.",
  unnew: "Etiqueta “nuevo” quitada.",
};

export function Toast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState<{ message: string; color: "green" | "amber" } | null>(null);

  // Detecta el parámetro y limpia la URL. No debe programar aquí el
  // temporizador de auto-cierre: router.replace() cambia `searchParams`, lo
  // que reejecutaría este efecto y cancelaría el timer antes de tiempo.
  useEffect(() => {
    for (const cfg of CONFIGS) {
      const v = searchParams.get(cfg.key);
      if (v === null) continue;
      setVisible({ message: cfg.message(v), color: cfg.color });

      const params = new URLSearchParams(searchParams.toString());
      params.delete(cfg.key);
      params.delete("n");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      break;
    }
    // Solo debe reaccionar cuando cambian los searchParams entrantes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Temporizador de auto-cierre, independiente de la navegación de arriba.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(null), 4500);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  const cls =
    visible.color === "green"
      ? "border-emerald-800 bg-emerald-900/95 text-emerald-100"
      : "border-amber-800 bg-amber-900/95 text-amber-100";

  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 left-4 sm:left-auto z-50 sm:max-w-sm rounded-lg border px-4 py-3 text-sm shadow-2xl backdrop-blur animate-fade-in ${cls}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex-1">{visible.message}</span>
        <button onClick={() => setVisible(null)} aria-label="Cerrar" className="opacity-60 hover:opacity-100">
          ✕
        </button>
      </div>
    </div>
  );
}
