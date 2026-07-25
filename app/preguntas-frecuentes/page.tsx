import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqAccordion } from "@/components/FaqAccordion";
import { WhatsAppIcon } from "@/components/Icons";
import { faqs } from "@/data/faq";
import { whatsappGeneral } from "@/lib/whatsapp";
import { pageMetadata, JsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes",
  description:
    "Resolvemos tus dudas sobre productos, disponibilidad, tiendas, ventas al por mayor, garantía, cambios, tallas, horarios y contacto en Calzatodos Group.",
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  return (
    <div className="container-page py-8">
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs items={[{ name: "Preguntas frecuentes", path: "/preguntas-frecuentes" }]} />
      <h1 className="mt-4 text-3xl font-bold text-graphite-900">Preguntas frecuentes</h1>
      <p className="mt-2 max-w-2xl text-graphite-600">
        Encuentra respuestas a las consultas más comunes. Si necesitas más ayuda,
        escríbenos por WhatsApp.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr,1fr]">
        <FaqAccordion items={faqs} />

        <aside className="h-fit rounded-2xl border border-graphite-100 bg-graphite-50 p-6">
          <h2 className="text-lg font-bold text-graphite-900">¿No encuentras tu respuesta?</h2>
          <p className="mt-2 text-sm text-graphite-600">
            Nuestro equipo te ayuda a resolver cualquier duda sobre productos,
            disponibilidad y locales.
          </p>
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-5 w-full"
          >
            <WhatsAppIcon className="h-5 w-5" /> Consultar por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
