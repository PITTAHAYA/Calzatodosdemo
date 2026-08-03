import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductImage } from "./ProductImage";
import { WhatsAppIcon } from "./Icons";
import { priceLabel, cn } from "@/lib/utils";
import { whatsappProduct, brandDisplayName } from "@/lib/whatsapp";
import { getCategory } from "@/data/categories";

export function ProductCard({ product }: { product: Product }) {
  const brand = brandDisplayName(product.brand);
  const category = getCategory(product.category)?.name ?? product.category;

  return (
    <article className="group relative flex flex-col rounded-xl border border-graphite-100 bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-t-xl"
        aria-label={`Ver ${product.name}`}
      >
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
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
          {brand}
        </div>
        <h3 className="mt-1 text-sm font-semibold text-graphite-900">
          <Link href={`/productos/${product.slug}`} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h3>
        <div className="mt-0.5 text-xs text-graphite-500">{category}</div>

        {/* Precio */}
        <div className="mt-2">
          <span
            className={cn(
              "text-sm font-bold",
              typeof product.price === "number" ? "text-graphite-900" : "text-graphite-500"
            )}
          >
            {priceLabel(product)}
          </span>
        </div>

        {/* Acciones */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/productos/${product.slug}`}
            className="btn-outline flex-1 !px-3 !py-2 text-xs"
          >
            Ver producto
          </Link>
          <a
            href={whatsappProduct(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp !px-3 !py-2"
            aria-label={`Consultar ${product.name} por WhatsApp`}
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
