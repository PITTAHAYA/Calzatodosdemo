import Link from "next/link";
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
        "relative flex flex-col overflow-hidden rounded-2xl border border-graphite-100 bg-white shadow-card",
        expired && "opacity-90"
      )}
    >
      {/* Cabecera visual (placeholder de imagen editable) */}
      <div className="relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
        {typeof promo.discountPercent === "number" && (
          <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-black text-brand-700">
            -{promo.discountPercent}%
          </div>
        )}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
            {expired ? "Promoción finalizada" : "Promoción vigente"}
          </p>
          <h3 className="mt-1 text-xl font-bold leading-snug">{promo.name}</h3>
        </div>
        {promo.demo && (
          <span className="absolute left-4 top-4 rounded bg-black/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
            Ejemplo
          </span>
        )}
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
              Consultar disponibilidad
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
