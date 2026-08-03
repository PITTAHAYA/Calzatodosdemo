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

          {/* Foto real del equipo */}
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl sm:aspect-[21/9]">
            <Image
              src="/team/equipo-calzatodos.jpg"
              alt="El equipo de Calzatodos Group"
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {team.map((m, i) => (
              <div
                key={m.name}
                className="group rounded-2xl border border-graphite-100 bg-white p-4 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="200px" />
                  ) : (
                    <div
                      className={`flex h-full items-center justify-center bg-gradient-to-br ${
                        i % 3 === 0
                          ? "from-brand-600 to-brand-800"
                          : "from-graphite-800 to-graphite-950"
                      }`}
                    >
                      <span className="text-4xl font-black tracking-tight text-white/95">
                        {initials(m.name)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-bold text-graphite-900">{m.name}</h3>
                <p className="text-xs font-medium text-brand-600">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
