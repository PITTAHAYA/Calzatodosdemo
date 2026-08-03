import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ProductRail } from "@/components/ProductRail";
import { ExpandingCategories } from "@/components/home/ExpandingCategories";
import { StoreCoverflow } from "@/components/stores/StoreCoverflow";
import { BrandLogo } from "@/components/BrandLogo";
import { WhatsAppIcon, ArrowRightIcon, StoreIcon } from "@/components/Icons";
import { getFeaturedProducts } from "@/data/products";
import { visibleBrands } from "@/data/brands";
import { stores } from "@/data/stores";
import { brandCopy } from "@/data/site-content";
import { whatsappGeneral, whatsappWholesale } from "@/lib/whatsapp";

const categoryCards = [
  { name: "Mujer", href: "/mujer", text: "Sneakers y calzado escolar con estilo y comodidad.", image: "/brand-gallery/north-star-1.jpg" },
  { name: "Hombre", href: "/hombre", text: "Formal y sneakers para acompañar tu día a día.", image: "/lifestyle/zapatos-2.jpg" },
  { name: "Niños", href: "/ninos", text: "Escolar y para jugar, pensado para los más pequeños.", image: "/brand-gallery/bubble-gummers-2.jpg" },
  { name: "Deportivo", href: "/deportivo", text: "Sneakers deportivos para toda la familia.", image: "/lifestyle/zapatos-1.jpg" },
  { name: "Escolar", href: "/escolar", text: "Resistencia y comodidad para el regreso a clases.", image: "/lifestyle/zapatos-3.jpg" },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);

  return (
    <>
      {/* ============ 1. HERO (video con los muñecos reales) ============ */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-graphite-950 text-white sm:min-h-[82vh]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-poster.jpg"
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        <div className="container-page relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-400">Calzatodos Group</p>
            <h1 className="mt-3 text-4xl font-black leading-[1.03] drop-shadow-sm sm:text-6xl lg:text-7xl">
              {brandCopy.heroTitle}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-graphite-100 sm:text-xl">
              {brandCopy.heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-primary !px-6 !py-3 text-base">
                Explorar catálogo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={whatsappGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp !px-6 !py-3 text-base"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-graphite-200">
              <span>Distribuidores autorizados</span>
              <span aria-hidden>•</span>
              <span>Productos con garantía</span>
              <span aria-hidden>•</span>
              <span>4 locales en Ecuador</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. CATEGORÍAS ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Compra por categoría"
            title="Calzado para cada integrante de la familia"
          />
          <ExpandingCategories panels={categoryCards} />
          <p className="mt-4 text-center text-xs uppercase tracking-widest text-graphite-400 sm:hidden">
            Toca una categoría para explorar
          </p>
        </div>
      </section>

      {/* ============ 3. PRODUCTOS DESTACADOS ============ */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <SectionHeader
            eyebrow="Selección"
            title="Productos destacados"
            href="/catalogo"
            hrefLabel="Ver catálogo completo"
          />
          <ProductRail products={featured} />
        </div>
      </section>

      {/* ============ 4. BANDA EDITORIAL ============ */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden sm:min-h-[520px]">
        <Image
          src="/lifestyle/editorial-family.jpg"
          alt="Familia en una tienda Calzatodos Group"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="container-page relative py-20 text-white">
          <div className="max-w-xl">
            <p className="eyebrow text-brand-400">Calzatodos Group</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Calidad que se siente en cada paso
            </h2>
            <p className="mt-4 text-lg text-graphite-100">{brandCopy.valueProp}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-primary !px-6 !py-3">
                Explorar catálogo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/nosotros"
                className="btn !border !border-white/50 !text-white hover:!bg-white/10 !px-6 !py-3"
              >
                Conócenos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. MARCAS ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Nuestras marcas"
            title="Marcas para cada estilo, etapa y ocasión"
            href="/marcas"
            hrefLabel="Ver todas las marcas"
          />
          {/* Móvil: tira deslizable · Desktop: cuadrícula */}
          <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {visibleBrands.map((b, i) => (
              <Reveal key={b.slug} delay={i * 0.04} className="w-40 shrink-0 snap-start sm:w-auto">
                <Link
                  href={`/marcas/${b.slug}`}
                  className="block transition active:scale-[0.98] hover:-translate-y-0.5"
                >
                  <BrandLogo brand={b} className="h-28" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 6. MAYORISTAS ============ */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <div className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white sm:p-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-white/80">Mayoristas</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Haz crecer tu negocio con Calzatodos Group
              </h2>
              <p className="mt-4 max-w-lg text-white/90">
                Accede a variedad de marcas, atención personalizada y opciones de calzado
                para diferentes mercados y tipos de clientes.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/mayoristas" className="btn !bg-white !text-brand-700 hover:!bg-brand-50">
                  Solicitar información
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

      {/* ============ 7. LOCALES ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Nuestros locales"
            title="Visítanos en Latacunga, Quito y Riobamba"
            href="/tiendas"
            hrefLabel="Ver localizador de tiendas"
          />
          <StoreCoverflow stores={stores} />
        </div>
      </section>

      {/* ============ 8. CTA FINAL ============ */}
      <section className="section pt-0">
        <div className="container-page">
          <div className="rounded-3xl bg-graphite-950 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              Encuentra el calzado ideal para ti
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-graphite-300">{brandCopy.attention}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="btn-primary !px-6 !py-3">Explorar catálogo</Link>
              <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-6 !py-3">
                <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
              </a>
              <Link href="/tiendas" className="btn-outline !border-white/40 !bg-transparent !text-white hover:!bg-white/10 !px-6 !py-3">
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
