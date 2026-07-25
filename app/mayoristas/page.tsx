import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WholesaleForm } from "@/components/forms/WholesaleForm";
import { IconByName, WhatsAppIcon } from "@/components/Icons";
import { whatsappWholesale } from "@/lib/whatsapp";
import { wholesaleExperience } from "@/data/team";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mayoristas — Calzado al por mayor en Ecuador",
  description:
    "Compra calzado al por mayor con Calzatodos Group. Marcas internacionales y propias, atención personalizada y cobertura nacional. Solicita información.",
  path: "/mayoristas",
});

const benefits = [
  { icon: "headset", title: "Atención personalizada", text: "Un trato cercano y directo para tu negocio." },
  { icon: "users", title: "Portafolio para distintos públicos", text: "Calzado para diferentes segmentos y edades." },
  { icon: "badge-check", title: "Marcas internacionales y propias", text: "Variedad de marcas para tu clientela." },
  { icon: "truck", title: "Experiencia en distribución", text: "Trayectoria abasteciendo comercios." },
  { icon: "shield-check", title: "Garantía de producto", text: "Respaldo según las condiciones de cada categoría." },
  { icon: "shield-check", title: "Cobertura nacional", text: "Presencia y despacho a nivel nacional." },
];

export default function MayoristasPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-graphite-950 text-white">
        <div className="container-page py-12 sm:py-16">
          <div className="[&_a]:text-graphite-400 [&_a:hover]:text-white [&_span]:text-graphite-200">
            <Breadcrumbs items={[{ name: "Mayoristas", path: "/mayoristas" }]} />
          </div>
          <p className="eyebrow mt-6 text-brand-400">Mayoristas</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black sm:text-5xl">
            Calzado y marcas para hacer crecer tu negocio
          </h1>
          <p className="mt-4 max-w-2xl text-graphite-300">
            Calzatodos Group atiende a comercios y compradores mayoristas que buscan
            variedad, respaldo, atención cercana y productos para diferentes segmentos del
            mercado.
          </p>
          <a
            href={whatsappWholesale()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-7"
          >
            <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section className="section">
        <div className="container-page">
          <h2 className="section-title">Beneficios para mayoristas</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-graphite-100 bg-white p-6 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <IconByName name={b.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-graphite-900">{b.title}</h3>
                <p className="mt-1.5 text-sm text-graphite-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiencia comercial */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Trayectoria</p>
            <h2 className="section-title mt-2">Experiencia comercial</h2>
            <p className="mt-4 text-graphite-600">{wholesaleExperience.intro}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {wholesaleExperience.partners.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-graphite-200 bg-white px-4 py-2 text-sm font-semibold text-graphite-700"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-graphite-400">
              Nombres presentados con fines informativos. Marcas y logotipos pertenecen a
              sus respectivos titulares.
            </p>
          </div>
        </div>
      </section>

      {/* Formulario */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h2 className="section-title">Solicita información mayorista</h2>
              <p className="mt-2 text-graphite-600">
                Completa el formulario y nuestro equipo te contactará. También puedes
                escribirnos directamente por WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl border border-graphite-100 bg-white p-6 shadow-card sm:p-8">
              <WholesaleForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
