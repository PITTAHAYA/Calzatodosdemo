// Imagen de producto con placeholder elegante cuando no hay foto real.
// Cuando cargues fotos reales en /public/products, pásalas en "images" y se
// usará next/image con optimización y lazy loading.

import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductImage({
  images,
  name,
  brand,
  className,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: {
  images: string[];
  name: string;
  brand?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const hasImage = images && images.length > 0;

  if (hasImage) {
    return (
      <div className={cn("relative overflow-hidden bg-graphite-50", className)}>
        <Image
          src={images[0]}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {images[1] && (
          <Image
            src={images[1]}
            alt={`${name} — vista alternativa`}
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>
    );
  }

  // Placeholder editorial (sin foto). Cambia sutilmente en hover.
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-graphite-100 to-graphite-50 transition-colors duration-500 group-hover:from-graphite-200 group-hover:to-graphite-100",
        className
      )}
      role="img"
      aria-label={name}
    >
      <div className="pointer-events-none select-none px-4 text-center">
        {brand && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
            {brand}
          </div>
        )}
        <div className="mt-1 text-sm font-semibold text-graphite-500 line-clamp-2">
          {name}
        </div>
        <div className="mt-3 text-[10px] uppercase tracking-widest text-graphite-400">
          Foto próximamente
        </div>
      </div>
    </div>
  );
}
