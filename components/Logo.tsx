// Logotipo oficial de Calzatodos Group.
// El archivo vive en /public/logo/calzatodos-group.png (fondo transparente).
// Para reemplazarlo, sustituye ese archivo manteniendo el nombre.

import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  // "light" añade un ligero realce para fondos oscuros (el logo es rojo).
  variant?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/logo/calzatodos-group.png"
        alt="Calzatodos Group"
        width={448}
        height={203}
        priority
        className={cn(
          "h-9 w-auto sm:h-10",
          variant === "light" && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
        )}
      />
    </span>
  );
}
