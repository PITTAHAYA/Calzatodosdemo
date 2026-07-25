import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PromoCard } from "@/components/PromoCard";
import { WhatsAppIcon } from "@/components/Icons";
import { getVisiblePromotions, isPromotionExpired } from "@/data/promotions";
import { whatsappGeneral } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Ofertas y promociones",
  description:
    "Descubre las promociones vigentes de Calzatodos Group. Descuentos en modelos seleccionados. Consulta disponibilidad por WhatsApp.",
  path: "/ofertas",
});

export default function OfertasPage() {
  const now = new Date();
  const visible = getVisiblePromotions(now);
  const active = visible.filter((p) => !isPromotionExpired(p, now));
  const finished = visible.filter((p) => isPromotionExpired(p, now));

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Ofertas", path: "/ofertas" }]} />
      <h1 className="mt-4 text-3xl font-bold text-graphite-900">Ofertas y promociones</h1>
      <p className="mt-2 max-w-2xl text-graphite-600">
        Aprovecha nuestras promociones de temporada en modelos seleccionados. Las
        condiciones y la disponibilidad se confirman en tienda o por WhatsApp.
      </p>
      <p className="mt-3 inline-block rounded-lg bg-graphite-100 px-3 py-1.5 text-xs text-graphite-600">
        Contenido de demostración. Reemplazable con promociones reales antes del
        lanzamiento.
      </p>

      {active.length > 0 && (
        <section className="mt-10">
          <h2 className="section-title mb-6">Promociones vigentes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((p) => (
              <div key={p.slug} id={p.slug} className="scroll-mt-28">
                <PromoCard promo={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {finished.length > 0 && (
        <section className="mt-14">
          <h2 className="section-title mb-6">Promociones finalizadas</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {finished.map((p) => (
              <div key={p.slug} id={p.slug} className="scroll-mt-28">
                <PromoCard promo={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {active.length === 0 && finished.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-graphite-200 bg-graphite-50 px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-graphite-900">
            No hay promociones activas por el momento
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-graphite-600">
            Escríbenos por WhatsApp para conocer los precios y beneficios vigentes.
          </p>
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-6"
          >
            <WhatsAppIcon className="h-4 w-4" /> Consultar por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
