import Image from "next/image";
import type { Brand } from "@/data/brands";
import { cn } from "@/lib/utils";

// Muestra el logo real de la marca si existe; si no, un placeholder tipográfico
// elegante con el nombre. Fondo blanco para uniformar los logos.
export function BrandLogo({
  brand,
  className,
}: {
  brand: Brand;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-graphite-100 bg-white p-5",
        className
      )}
    >
      {brand.logo ? (
        <Image
          src={brand.logo}
          alt={brand.name}
          width={220}
          height={120}
          // Los GIF/animados se sirven sin optimizar; el resto se optimiza.
          unoptimized={brand.logo.endsWith(".gif")}
          className="h-14 w-auto max-w-[85%] object-contain"
        />
      ) : (
        // Wordmark tipográfico cuando aún no hay logo oficial.
        <div className="text-center">
          <div className="text-2xl font-black uppercase tracking-tight text-graphite-900">
            {brand.name}
          </div>
          <div className="mx-auto mt-1 h-0.5 w-8 rounded-full bg-brand-600" />
        </div>
      )}
    </div>
  );
}
