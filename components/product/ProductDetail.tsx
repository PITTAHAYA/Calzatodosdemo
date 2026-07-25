"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductImage } from "@/components/ProductImage";
import { WhatsAppIcon, StoreIcon, MapPinIcon } from "@/components/Icons";
import { whatsappProductDetailed } from "@/lib/whatsapp";
import { formatPrice, cn, absoluteUrl } from "@/lib/utils";
import { brandCopy } from "@/data/site-content";

export function ProductDetail({
  product,
  brandName,
  categoryName,
}: {
  product: Product;
  brandName: string;
  categoryName: string;
}) {
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const productUrl = absoluteUrl(`/productos/${product.slug}`);
  const waHref = whatsappProductDetailed({
    name: product.name,
    sku: product.sku,
    size,
    color,
    url: productUrl,
  });

  const gallerySlots = product.images.length > 0 ? product.images : [null, null, null];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Galería */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-graphite-100">
          <ProductImage
            images={product.images.length ? [product.images[activeImage]] : []}
            name={product.name}
            brand={brandName}
            className="h-full w-full"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
            {product.isNew && <span className="tag-new">Nuevo</span>}
            {product.isOnSale && <span className="tag-sale">Oferta</span>}
            {product.isExclusive && <span className="tag-exclusive">Exclusivo</span>}
          </div>
        </div>
        {/* Miniaturas */}
        <div className="mt-3 grid grid-cols-4 gap-3">
          {gallerySlots.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border transition",
                activeImage === i ? "border-brand-600 ring-1 ring-brand-600" : "border-graphite-100"
              )}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <ProductImage
                images={img ? [img] : []}
                name={product.name}
                className="h-full w-full"
                sizes="120px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Información */}
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">
          {brandName}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-graphite-900">{product.name}</h1>
        <p className="mt-1 text-sm text-graphite-500">
          {categoryName} · Código {product.sku}
        </p>

        {/* Precio */}
        <div className="mt-4 flex items-baseline gap-3">
          <span
            className={cn(
              "text-2xl font-bold",
              typeof product.price === "number" ? "text-graphite-900" : "text-graphite-500"
            )}
          >
            {formatPrice(product.price)}
          </span>
          {typeof product.previousPrice === "number" && typeof product.price === "number" && (
            <span className="text-base text-graphite-400 line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>

        <p className="mt-4 text-graphite-600">{product.description}</p>

        {/* Colores */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-graphite-900">
            Color {color && <span className="font-normal text-graphite-500">· {color}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(color === c ? null : c)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition",
                  color === c
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-graphite-200 text-graphite-700 hover:border-graphite-400"
                )}
                aria-pressed={color === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Tallas */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-graphite-900">
            Talla {size && <span className="font-normal text-graphite-500">· {size}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.availableSizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(size === s ? null : s)}
                className={cn(
                  "h-10 w-11 rounded-lg border text-sm font-medium transition",
                  size === s
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-graphite-200 text-graphite-700 hover:border-graphite-400"
                )}
                aria-pressed={size === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Aviso de disponibilidad */}
        <p className="mt-5 rounded-lg bg-graphite-50 px-4 py-3 text-sm text-graphite-600">
          {brandCopy.availabilityNote} Selecciona talla y color para agilizar tu consulta
          (opcional).
        </p>

        {/* CTAs */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 !py-3"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
          <Link href="/tiendas" className="btn-outline flex-1 !py-3">
            <StoreIcon className="h-5 w-5" />
            Encontrar una tienda
          </Link>
        </div>

        {/* Detalles */}
        <div className="mt-8 space-y-4 border-t border-graphite-100 pt-6">
          <DetailBlock title="Características" items={product.features} />
          <DetailBlock title="Materiales" items={product.materials} />
          <DetailBlock title="Cuidados" text={product.careInstructions} />
          <DetailBlock title="Garantía" text={product.warrantyInformation} />
        </div>
      </div>
    </div>
  );
}

function DetailBlock({
  title,
  items,
  text,
}: {
  title: string;
  items?: string[];
  text?: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-graphite-900">
        {title}
      </h2>
      {items ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-graphite-600">
          {items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-graphite-600">{text}</p>
      )}
    </div>
  );
}
