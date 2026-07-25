import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreCard } from "@/components/StoreCard";
import { PromoCard } from "@/components/PromoCard";
import { BrandLogo } from "@/components/BrandLogo";
import { IconByName, WhatsAppIcon, ArrowRightIcon, StoreIcon } from "@/components/Icons";
import { getFeaturedProducts } from "@/data/products";
import { brands } from "@/data/brands";
import { stores } from "@/data/stores";
import { getVisiblePromotions } from "@/data/promotions";
import { brandCopy, valueProps, site } from "@/data/site-content";
import { about } from "@/data/team";
import { whatsappGeneral, whatsappWholesale } from "@/lib/whatsapp";

const categoryCards = [
  { name: "Mujer", href: "/mujer", text: "Sneakers, sandalias, tacones y más.", tone: "from-brand-600 to-brand-800" },
  { name: "Hombre", href: "/hombre", text: "Casual, formal, deportivo y outdoor.", tone: "from-graphite-800 to-graphite-950" },
  { name: "Niños", href: "/ninos", text: "Escolar, con luces y para jugar.", tone: "from-brand-500 to-brand-700" },
  { name: "Deportivo", href: "/deportivo", text: "Rendimiento para toda la familia.", tone: "from-graphite-700 to-graphite-900" },
  { name: "Escolar", href: "/escolar", text: "Resistencia para el regreso a clases.", tone: "from-brand-700 to-graphite-900" },
  { name: "Formal", href: "/formal", text: "Elegancia para cada ocasión.", tone: "from-graphite-800 to-brand-800" },
];

const styleBlocks = [
  { name: "Sneakers", href: "/catalogo?estilo=sneakers" },
  { name: "Formal", href: "/formal" },
  { name: "Deportivo", href: "/deportivo" },
  { name: "Outdoor", href: "/catalogo?estilo=outdoor" },
  { name: "Sandalias", href: "/catalogo?categoria=sandalias" },
  { name: "Botas y botines", href: "/catalogo?categoria=botas" },
  { name: "Escolar", href: "/escolar" },
  { name: "Seguridad industrial", href: "/seguridad" },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const featuredPromo = getVisiblePromotions()[0];

  return (
    <>
      {/* ============ 1. HERO ============ */}
      <section className="relative overflow-hidden bg-graphite-950 text-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-brand-700 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-900 blur-3xl" />
        </div>
        <div className="container-page relative">
          <div className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-brand-400">Calzatodos Group</p>
              <h1 className="mt-3 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
                {brandCopy.heroTitle}
              </h1>
              <p className="mt-5 max-w-lg text-lg text-graphite-200">
                {brandCopy.heroText}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/catalogo" className="btn-primary !px-6 !py-3">
                  Explorar catálogo
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href={whatsappGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp !px-6 !py-3"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-graphite-300">
                <span>Distribuidores autorizados</span>
                <span aria-hidden>•</span>
                <span>Productos con garantía</span>
                <span aria-hidden>•</span>
                <span>4 locales en Ecuador</span>
              </div>
            </div>

            {/* Composición editorial (placeholder preparado para campañas) */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {["Nueva colección", "Deportivo", "Familiar", "Regreso a clases"].map(
                  (label, i) => (
                    <div
                      key={label}
                      className={`flex aspect-[4/5] items-end rounded-2xl bg-gradient-to-br ${
                        ["from-brand-600 to-brand-800", "from-graphite-700 to-graphite-900", "from-graphite-800 to-graphite-950", "from-brand-700 to-brand-900"][i]
                      } p-5`}
                    >
                      <span className="text-sm font-semibold text-white/90">{label}</span>
                    </div>
                  )
                )}
              </div>
              <p className="mt-3 text-center text-xs text-graphite-400">
                Espacio para campañas de temporada (editable).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. CATEGORÍAS PRINCIPALES ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Compra por categoría"
            title="Calzado para cada integrante de la familia"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categoryCards.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link
                  href={c.href}
                  className={`group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${c.tone} p-5 text-white transition-transform hover:-translate-y-0.5`}
                >
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                  <div className="relative">
                    <h3 className="text-xl font-bold">{c.name}</h3>
                    <p className="mt-1 text-sm text-white/80">{c.text}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                      Ver más
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. PROMOCIÓN DESTACADA ============ */}
      {featuredPromo && (
        <section className="section bg-graphite-50">
          <div className="container-page">
            <SectionHeader eyebrow="Ofertas" title="Promoción destacada" href="/ofertas" hrefLabel="Ver todas las ofertas" />
            <div className="grid gap-6 lg:grid-cols-2">
              <PromoCard promo={featuredPromo} />
              <div className="flex flex-col justify-center rounded-2xl border border-graphite-100 bg-white p-8">
                <h3 className="text-2xl font-bold text-graphite-900">
                  Aprovecha nuestras promociones de temporada
                </h3>
                <p className="mt-3 text-graphite-600">
                  Descubre descuentos y beneficios en modelos seleccionados. Consulta
                  disponibilidad y condiciones directamente por WhatsApp o en tu local
                  más cercano.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/ofertas" className="btn-primary">Ver ofertas</Link>
                  <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <WhatsAppIcon className="h-4 w-4" /> Consultar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ 4. PRODUCTOS DESTACADOS ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Selección"
            title="Productos destacados"
            href="/catalogo"
            hrefLabel="Ver catálogo completo"
          />
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* ============ 5. EXPLORA POR ESTILO ============ */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <SectionHeader eyebrow="Estilos" title="Explora por estilo" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {styleBlocks.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.04}>
                <Link
                  href={s.href}
                  className="group flex h-24 items-center justify-center rounded-xl border border-graphite-100 bg-white px-4 text-center text-sm font-semibold text-graphite-800 shadow-card transition hover:border-brand-300 hover:text-brand-700"
                >
                  {s.name}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. MARCAS ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Nuestras marcas"
            title="Marcas para cada estilo, etapa y ocasión"
            href="/marcas"
            hrefLabel="Ver todas las marcas"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {brands.map((b, i) => (
              <Reveal key={b.slug} delay={i * 0.04}>
                <Link href={`/marcas/${b.slug}`} className="block transition hover:-translate-y-0.5">
                  <BrandLogo brand={b} className="h-28" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. PROPUESTA DE VALOR ============ */}
      <section className="section bg-graphite-950 text-white">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="eyebrow text-brand-400">Por qué elegirnos</p>
            <h2 className="mt-3 text-3xl font-bold">
              Confianza y variedad en cada paso
            </h2>
            <p className="mt-4 text-graphite-300">{brandCopy.trust}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="rounded-2xl border border-graphite-800 bg-graphite-900 p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-brand-400">
                    <IconByName name={v.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-1.5 text-sm text-graphite-400">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. MAYORISTAS ============ */}
      <section className="section">
        <div className="container-page">
          <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-white/80">Mayoristas</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Haz crecer tu negocio con Calzatodos Group
              </h2>
              <p className="mt-4 max-w-lg text-white/90">
                Accede a variedad de marcas, atención personalizada y opciones de
                calzado para diferentes mercados y tipos de clientes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/mayoristas" className="btn !bg-white !text-brand-700 hover:!bg-brand-50">
                  Solicitar información mayorista
                </Link>
                <a
                  href={whatsappWholesale()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-white/70 !text-white hover:!bg-white/10"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {["Atención personalizada", "Marcas internacionales y propias", "Experiencia en distribución", "Cobertura nacional"].map((b) => (
                <li key={b} className="rounded-xl bg-white/10 px-4 py-3 text-sm font-medium">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 9. LOCALES ============ */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <SectionHeader
            eyebrow="Nuestros locales"
            title="Visítanos en Latacunga, Quito y Riobamba"
            href="/tiendas"
            hrefLabel="Ver localizador de tiendas"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {stores.map((s) => (
              <StoreCard key={s.slug} store={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 10. HISTORIA ============ */}
      <section className="section">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-graphite-800 to-graphite-950 p-8 text-white">
              <div className="flex h-full flex-col justify-between">
                <StoreIcon className="h-10 w-10 text-brand-400" />
                <div>
                  <p className="text-5xl font-black">+30</p>
                  <p className="mt-1 text-graphite-300">años de experiencia en el sector</p>
                  <p className="mt-4 text-5xl font-black">2015</p>
                  <p className="mt-1 text-graphite-300">Calzatodos Group consolidado</p>
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow">Nuestra historia</p>
              <h2 className="mt-3 text-3xl font-bold text-graphite-900">
                Más de 30 años acompañando cada paso
              </h2>
              <p className="mt-4 text-graphite-600">{about.historyShort}</p>
              <Link href="/nosotros" className="btn-primary mt-6">
                Conocer nuestra historia
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 11. REDES SOCIALES ============ */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <SectionHeader eyebrow="Síguenos" title="Calzatodos Group en redes" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <a
                key={i}
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-graphite-200 to-graphite-100 text-xs font-medium text-graphite-400 transition hover:from-brand-100 hover:to-brand-50"
                aria-label="Ver contenido en Instagram"
              >
                Contenido social
              </a>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-graphite-500">
            Contenido de ejemplo. Reemplazable con publicaciones reales de{" "}
            <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:underline">
              @calzatodos_group
            </a>.
          </p>
        </div>
      </section>

      {/* ============ 12. CTA FINAL ============ */}
      <section className="section">
        <div className="container-page">
          <div className="rounded-3xl bg-graphite-950 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              Encuentra el calzado ideal para ti
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-300">
              {brandCopy.attention}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="btn-primary !px-6 !py-3">Explorar catálogo</Link>
              <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-6 !py-3">
                <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
              </a>
              <Link href="/tiendas" className="btn-outline !border-white/40 !text-white hover:!bg-white/10 !px-6 !py-3">
                <StoreIcon className="h-5 w-5" /> Encontrar una tienda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Encabezado de sección reutilizable.
function SectionHeader({
  eyebrow,
  title,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-2">{title}</h2>
      </div>
      {href && hrefLabel && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:inline-flex"
        >
          {hrefLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
