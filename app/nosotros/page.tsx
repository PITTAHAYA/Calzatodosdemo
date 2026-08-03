import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/Icons";
import { about, founder, team } from "@/data/team";
import { initials } from "@/lib/utils";
import { whatsappGeneral } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nosotros",
  description:
    "Conoce la historia de Calzatodos Group: más de 30 años de experiencia en el sector del calzado y consolidada desde 2015. Misión, visión, valores y liderazgo.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <div>
      {/* ===== HERO (interior de tienda premium) ===== */}
      <section className="relative isolate overflow-hidden bg-graphite-950 text-white">
        <Image
          src="/lifestyle/nosotros-hero.jpg"
          alt="Interior de una tienda Calzatodos Group"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="container-page relative flex min-h-[56vh] flex-col justify-end py-16">
          <div className="[&_a]:text-graphite-300 [&_a:hover]:text-white [&_span]:text-white/90">
            <Breadcrumbs items={[{ name: "Nosotros", path: "/nosotros" }]} />
          </div>
          <p className="eyebrow mt-6 text-brand-400">Nuestra historia</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Más de 30 años acompañando cada paso
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-graphite-100">{about.historyShort}</p>
        </div>
      </section>

      {/* ===== Cifras ===== */}
      <section className="border-b border-graphite-100 bg-white">
        <div className="container-page grid grid-cols-3 divide-x divide-graphite-100 py-8 text-center">
          {[
            { n: "+30", l: "años de experiencia" },
            { n: "2015", l: "consolidados como empresa" },
            { n: "4", l: "locales en Ecuador" },
          ].map((s) => (
            <div key={s.l} className="px-2">
              <p className="text-3xl font-black text-brand-600 sm:text-5xl">{s.n}</p>
              <p className="mt-1 text-xs text-graphite-500 sm:text-sm">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Historia + fundador ===== */}
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Cómo empezamos</p>
            <h2 className="section-title mt-2">Una empresa familiar ecuatoriana</h2>
            <p className="mt-4 text-graphite-600">{about.historyLong}</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-10">
            <p className="text-sm font-bold uppercase tracking-widest text-white/80">
              Fundador
            </p>
            <p className="mt-3 text-2xl font-bold">{founder.name}</p>
            <p className="mt-4 text-white/90">{founder.bio}</p>
          </div>
        </div>
      </section>

      {/* ===== Foto real del equipo (completa) ===== */}
      <section className="section bg-graphite-50 pt-0">
        <div className="container-page">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="eyebrow">Nuestra gente</p>
            <h2 className="section-title mt-2">Las personas detrás de Calzatodos Group</h2>
            <p className="mt-3 text-graphite-600">
              Un equipo comprometido con la calidad y la atención cercana en cada uno de
              nuestros locales.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-graphite-100 bg-white shadow-card">
            <Image
              src="/team/equipo-calzatodos.jpg"
              alt="El equipo completo de Calzatodos Group"
              width={2000}
              height={1500}
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* ===== Misión / Visión ===== */}
      <section className="section">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-graphite-100 bg-white p-8 shadow-card sm:p-10">
            <p className="eyebrow">Misión</p>
            <p className="mt-3 text-lg leading-relaxed text-graphite-700">{about.mission}</p>
          </div>
          <div className="rounded-3xl border border-graphite-100 bg-white p-8 shadow-card sm:p-10">
            <p className="eyebrow">Visión</p>
            <p className="mt-3 text-lg leading-relaxed text-graphite-700">{about.vision}</p>
          </div>
        </div>
      </section>

      {/* ===== Valores ===== */}
      <section className="section bg-graphite-50">
        <div className="container-page text-center">
          <p className="eyebrow">Lo que nos define</p>
          <h2 className="section-title mt-2">Nuestros valores</h2>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {about.values.map((v) => (
              <span
                key={v}
                className="rounded-full border border-graphite-200 bg-white px-5 py-2.5 text-sm font-semibold text-graphite-800 shadow-sm"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Liderazgo (con nombres, sin foto) ===== */}
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Liderazgo</p>
            <h2 className="section-title mt-2">Quiénes dirigen Calzatodos Group</h2>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
            {team.map((m) => (
              <div
                key={m.name}
                className="flex flex-col items-center rounded-3xl border border-graphite-100 bg-white p-8 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-2xl font-black text-white shadow-sm">
                  {initials(m.name)}
                </span>
                <h3 className="mt-4 text-lg font-bold text-graphite-900">{m.name}</h3>
                <p className="text-sm font-semibold text-brand-600">{m.role}</p>
                {m.description && (
                  <p className="mt-3 text-sm text-graphite-600">{m.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-graphite-950 px-8 py-12 text-center text-white sm:flex-row sm:text-left">
            <div>
              <h2 className="text-2xl font-bold">Visítanos o escríbenos</h2>
              <p className="mt-2 text-graphite-300">
                Te ayudamos a encontrar el calzado ideal para ti y tu familia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={whatsappGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp !px-6 !py-3"
              >
                <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
              </a>
              <Link href="/tiendas" className="btn-outline !border-white/40 !bg-transparent !text-white hover:!bg-white/10 !px-6 !py-3">
                Encontrar una tienda
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
