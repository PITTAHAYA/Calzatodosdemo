import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductImage } from "./ProductImage";
import { ArrowRightIcon } from "./Icons";
import { priceLabel, cn, colorHex } from "@/lib/utils";
import { brandDisplayName } from "@/lib/whatsapp";
import { getCategory } from "@/data/categories";

export function ProductCard({ product }: { product: Product }) {
  const brand = brandDisplayName(product.brand);
  const category = getCategory(product.category)?.name ?? product.category;
  const colorCount = product.colors.length;
  const onSale =
    typeof product.previousPrice === "number" &&
    typeof product.price === "number";

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 active:scale-[0.99]"
      aria-label={product.name}
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-white to-graphite-100 shadow-card ring-1 ring-graphite-100/70 transition-shadow duration-300 group-hover:shadow-card-hover">
        <ProductImage
          images={product.images}
          name={product.name}
          brand={brand}
          className="h-full w-full"
          fit="contain"
        />

        {/* Etiquetas */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isNew && <span className="tag-new">Nuevo</span>}
          {product.isOnSale && <span className="tag-sale">Oferta</span>}
          {product.isExclusive && <span className="tag-exclusive">Exclusivo</span>}
        </div>

        {/* Revelado en hover: barra "Ver producto" */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-graphite-950/90 px-4 py-3 text-center text-sm font-semibold text-white backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5">
            Ver producto <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
        <h3 className="text-sm font-bold text-graphite-900 group-hover:text-brand-700">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-graphite-500">{category}</p>

        {/* Muestras de color */}
        <div className="mt-2 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c}
              title={c}
              className="h-3.5 w-3.5 rounded-full ring-1 ring-inset ring-black/15"
              style={{ backgroundColor: colorHex(c) }}
            />
          ))}
          {colorCount > 4 && (
            <span className="text-[10px] font-medium text-graphite-400">
              +{colorCount - 4}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={cn(
              "text-base font-black",
              onSale ? "text-brand-600" : "text-graphite-900",
              typeof product.price !== "number" && "!text-sm !font-bold !text-graphite-500"
            )}
          >
            {priceLabel(product)}
          </span>
          {onSale && (
            <span className="text-xs text-graphite-400 line-through">
              ${product.previousPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
