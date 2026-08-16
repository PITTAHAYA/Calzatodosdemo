import { cn } from "@/lib/utils";

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Textura de grano sutil para secciones oscuras (da profundidad/cine).
export function Grain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light",
        className
      )}
      style={{ backgroundImage: NOISE, backgroundSize: "160px 160px" }}
    />
  );
}
