import Link from "next/link";
import Image from "next/image";
import type { Promotion } from "@/data/promotions";
import { isPromotionExpired } from "@/data/promotions";
import { whatsappCustom } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";
import { cn } from "@/lib/utils";

export function PromoCard({ promo }: { promo: Promotion }) {
  const expired = isPromotionExpired(promo);
  const wa = whatsappCustom(
    `Hola Calzatodos Group, quisiera consultar disponibilidad de la promoción "${promo.name}".`
  );

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-graphite-100 bg-white shadow-card transition hover:shadow-card-hover",
        expired && "opacity-95"
      )}
    >
      {/* Cabecera visual con fotografía */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {promo.image ? (
          <Image
            src={promo.image}
            alt={promo.name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-600 to-brand-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        {/* Etiquetas */}
        <div className="absolute left-4 top-4 flex gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur",
              expired ? "bg-white/85 text-graphite-700" : "bg-white/90 text-brand-700"
            )}
          >
            {expired ? "Finalizada" : "Vigente"}
          </span>
          {promo.demo && (
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              Ejemplo
            </span>
          )}
        </div>
        {typeof promo.discountPercent === "number" && !expired && (
          <div className="absolute right-4 top-4 rounded-full bg-brand-600 px-3 py-1.5 text-sm font-black text-white shadow-lg">
            -{promo.discountPercent}%
          </div>
        )}

        {/* Título sobre la imagen */}
        <h3 className="absolute inset-x-4 bottom-4 text-xl font-bold leading-snug text-white drop-shadow">
          {promo.name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-graphite-600">{promo.description}</p>
        <p className="mt-3 text-xs text-graphite-500">
          Vigencia: {promo.startDate} a {promo.endDate}
        </p>
        <p className="mt-1 text-xs text-graphite-400">{promo.termsSummary}</p>

        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
          <Link href={`/ofertas#${promo.slug}`} className="btn-outline flex-1 !py-2 text-xs">
            Ver promoción
          </Link>
          {!expired && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 !py-2 text-xs"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Consultar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
