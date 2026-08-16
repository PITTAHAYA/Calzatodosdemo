import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppIcon } from "@/components/Icons";
import type { PolicyDoc } from "@/data/policies";
import { whatsappGeneral } from "@/lib/whatsapp";

export function PolicyPage({ doc }: { doc: PolicyDoc }) {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: doc.title, path: `/${doc.slug}` }]} />
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.7fr,1fr]">
        <article className="max-w-2xl">
          <h1 className="text-3xl font-bold text-graphite-900">{doc.title}</h1>
          {doc.updated && (
            <p className="mt-1 text-sm text-graphite-500">
              Última actualización: {doc.updated}
            </p>
          )}
          <p className="mt-3 rounded-lg bg-graphite-100 px-4 py-3 text-sm text-graphite-600">
            {doc.intro}
          </p>

          <div className="mt-8 space-y-8">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-bold text-graphite-900">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="mt-2 text-graphite-600">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-graphite-600">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {doc.note && (
            <p className="mt-10 border-t border-graphite-100 pt-5 text-xs leading-relaxed text-graphite-500">
              {doc.note}
            </p>
          )}
        </article>

        <aside className="h-fit rounded-2xl border border-graphite-100 bg-graphite-50 p-6">
          <h2 className="text-base font-bold text-graphite-900">¿Tienes dudas?</h2>
          <p className="mt-2 text-sm text-graphite-600">
            Escríbenos por WhatsApp y con gusto te orientamos según tu caso.
          </p>
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-4 w-full"
          >
            <WhatsAppIcon className="h-5 w-5" /> Consultar
          </a>
          <div className="mt-5 space-y-1.5 text-sm">
            <Link href="/garantia" className="block text-graphite-600 hover:text-brand-700">Garantía</Link>
            <Link href="/cambios-y-devoluciones" className="block text-graphite-600 hover:text-brand-700">Cambios y devoluciones</Link>
            <Link href="/terminos-y-condiciones" className="block text-graphite-600 hover:text-brand-700">Términos y condiciones</Link>
            <Link href="/politica-de-privacidad" className="block text-graphite-600 hover:text-brand-700">Política de privacidad</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
