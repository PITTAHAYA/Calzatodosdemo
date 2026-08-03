import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

// En móvil: carrusel horizontal deslizable con snap (app-like).
// En desktop: cuadrícula.
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {products.map((p) => (
        <div
          key={p.id}
          className="w-[62vw] max-w-[240px] shrink-0 snap-start sm:w-auto sm:max-w-none"
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
