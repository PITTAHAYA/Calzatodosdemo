import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StoreIcon } from "@/components/Icons";
import { about, founder, team } from "@/data/team";
import { initials } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nosotros",
  description:
    "Conoce la historia de Calzatodos Group: más de 30 años de experiencia en el sector del calzado y consolidada desde 2015. Misión, visión, valores y equipo.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero historia */}
      <section className="bg-graphite-950 text-white">
        <div className="container-page py-12 sm:py-16">
          <div className="[&_a]:text-graphite-400 [&_a:hover]:text-white [&_span]:text-graphite-200">
            <Breadcrumbs items={[{ name: "Nosotros", path: "/nosotros" }]} />
          </div>
          <p className="eyebrow mt-6 text-brand-400">Nuestra historia</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black sm:text-5xl">
            Más de 30 años acompañando cada paso
          </h1>
          <div className="mt-6 flex flex-wrap gap-8">
            <div>
              <p className="text-4xl font-black text-brand-400">+30</p>
              <p className="text-sm text-graphite-300">años de experiencia en el sector</p>
            </div>
            <div>
              <p className="text-4xl font-black text-brand-400">2015</p>
              <p className="text-sm text-graphite-300">Calzatodos Group consolidado</p>
            </div>
            <div>
              <p className="text-4xl font-black text-brand-400">4</p>
              <p className="text-sm text-graphite-300">locales en Ecuador</p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Cómo empezamos</h2>
            <p className="mt-4 text-graphite-600">{about.historyLong}</p>
          </div>
          <div className="rounded-2xl border border-graphite-100 bg-graphite-50 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-600">
              Fundador
            </h3>
            <p className="mt-2 text-xl font-bold text-graphite-900">{founder.name}</p>
            <p className="mt-3 text-graphite-600">{founder.bio}</p>
          </div>
        </div>
      </section>

      {/* Misión / Visión */}
      <section className="section bg-graphite-50">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-graphite-100 bg-white p-8 shadow-card">
            <p className="eyebrow">Misión</p>
            <p className="mt-3 text-lg text-graphite-700">{about.mission}</p>
          </div>
          <div className="rounded-2xl border border-graphite-100 bg-white p-8 shadow-card">
            <p className="eyebrow">Visión</p>
            <p className="mt-3 text-lg text-graphite-700">{about.vision}</p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="section">
        <div className="container-page">
          <h2 className="section-title text-center">Nuestros valores</h2>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
            {about.values.map((v) => (
              <span
                key={v}
                className="rounded-full bg-brand-50 px-5 py-2.5 text-sm font-semibold text-brand-700"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <div className="text-center">
            <p className="eyebrow">Nuestro equipo</p>
            <h2 className="section-title mt-2">Las personas detrás de Calzatodos Group</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-graphite-200 to-graphite-100">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-3xl font-black text-graphite-400">
                        {initials(m.name)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-graphite-900">{m.name}</h3>
                <p className="text-xs text-graphite-500">{m.role}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-graphite-400">
            Espacios preparados para fotografías del equipo. Se muestran las iniciales
            mientras se incorporan las fotos reales.
          </p>
        </div>
      </section>
    </div>
  );
}
