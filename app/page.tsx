import Link from "next/link";
import { ProductRail } from "@/components/ProductRail";
import { ExpandingCategories } from "@/components/home/ExpandingCategories";
import { StoreCoverflow } from "@/components/stores/StoreCoverflow";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { KineticMarquee } from "@/components/home/KineticMarquee";
import { WholesalePitch } from "@/components/home/WholesalePitch";
import { RevealText } from "@/components/motion/RevealText";
import { Magnetic } from "@/components/motion/Magnetic";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Grain } from "@/components/motion/Grain";
import { Spotlight } from "@/components/motion/Spotlight";
import { WhatsAppIcon, ArrowRightIcon, StoreIcon } from "@/components/Icons";
import { getFeaturedProducts } from "@/data/products";
import { stores } from "@/data/stores";
import { brandCopy } from "@/data/site-content";
import { whatsappGeneral } from "@/lib/whatsapp";

const categoryCards = [
  { name: "Mujer", href: "/mujer", text: "Luce increíble cada día. Sneakers y más.", image: "/lifestyle/ppl-mujer.jpg" },
  { name: "Hombre", href: "/hombre", text: "Tu estilo, en cada paso. Casual y formal.", image: "/lifestyle/ppl-hombre.jpg" },
  { name: "Niños", href: "/ninos", text: "Para correr, jugar y soñar en grande.", image: "/lifestyle/ppl-ninos.jpg" },
  { name: "Deportivo", href: "/deportivo", text: "Dale energía a cada entrenamiento.", image: "/lifestyle/ppl-deportivo.jpg" },
  { name: "Escolar", href: "/escolar", text: "Listos para el regreso a clases.", image: "/lifestyle/ppl-escolar.jpg" },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);

  return (
    <>
      {/* ============ 1. HERO (video con los muñecos reales) ============ */}
      <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-graphite-950 text-white sm:min-h-[82vh]">
        {/* Video vertical para móvil */}
        <video
          className="absolute inset-0 h-full w-full object-cover sm:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-mobile-poster.jpg"
        >
          <source src="/hero/hero-mobile.webm" type="video/webm" />
          <source src="/hero/hero-mobile.mp4" type="video/mp4" />
        </video>
        {/* Video horizontal para tablet/desktop */}
        <video
          className="absolute inset-0 hidden h-full w-full object-cover sm:block"
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
        <Grain />

        <div className="container-page relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-400">Calzatodos Group</p>
            <RevealText
              as="h1"
              text={brandCopy.heroTitle}
              className="mt-3 text-4xl font-black leading-[1.03] drop-shadow-sm sm:text-6xl lg:text-7xl"
            />
            <p className="mt-5 max-w-lg text-lg text-graphite-100 sm:text-xl">
              {brandCopy.heroText}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/catalogo" className="btn-primary !px-6 !py-3 text-base">
                  Explorar catálogo
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={whatsappGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp !px-6 !py-3 text-base"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Consultar por WhatsApp
                </a>
              </Magnetic>
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

      {/* ============ BANDA CINÉTICA ============ */}
      <KineticMarquee
        items={[
          "Calzado para toda la familia",
          "Productos originales",
          "4 locales en Ecuador",
          "Consulta por WhatsApp",
        ]}
      />

      {/* ============ 3. PRODUCTOS DESTACADOS ============ */}
      <section className="section bg-graphite-50">
        <div className="container-page">
          <SectionHeader
            eyebrow="Los favoritos"
            title="Estrena tus próximos zapatos"
            href="/catalogo"
            hrefLabel="Ver todo el catálogo"
          />
          <ProductRail products={featured} />
        </div>
      </section>

      {/* ============ 4. BANDA EDITORIAL ============ */}
      <section className="relative isolate flex min-h-[420px] items-center overflow-hidden sm:min-h-[520px]">
        <ParallaxImage
          src="/lifestyle/editorial-family.jpg"
          alt="Familia en una tienda Calzatodos Group"
          objectPosition="center 15%"
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
          {/* Marquee de marcas que se desplaza solo */}
          <BrandMarquee />
        </div>
      </section>

      {/* ============ 5.5 BANDA LIFESTYLE "SHOP" ============ */}
      <section className="relative isolate flex min-h-[460px] items-center justify-center overflow-hidden text-center sm:min-h-[560px]">
        <ParallaxImage
          src="/lifestyle/ppl-friends.jpg"
          alt="Amigos luciendo su calzado Calzatodos Group"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/40" />
        <div className="container-page relative py-20 text-white">
          <p className="eyebrow text-brand-400">Nueva temporada</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
            Encuentra el par que te hace sentir bien
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-100">
            Estilos para mujer, hombre y niños. Elige el tuyo y estrénalo hoy mismo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/mujer" className="btn-primary !px-6 !py-3">Mujer</Link>
            <Link href="/hombre" className="btn !bg-white !text-graphite-900 hover:!bg-graphite-100 !px-6 !py-3">Hombre</Link>
            <Link href="/ninos" className="btn !border !border-white/60 !bg-transparent !text-white hover:!bg-white/10 !px-6 !py-3">Niños</Link>
          </div>
        </div>
      </section>

      {/* ============ 6. MAYORISTAS ============ */}
      <WholesalePitch />

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
          <Spotlight className="overflow-hidden rounded-3xl bg-graphite-950 px-6 py-14 text-center text-white sm:px-12">
            <Grain />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">
              Encuentra el calzado ideal para ti
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-graphite-300">{brandCopy.attention}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/catalogo" className="btn-primary !px-6 !py-3">Explorar catálogo</Link>
              <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !px-6 !py-3">
                <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
              </a>
              <Link href="/tiendas" className="btn-outline !border-white/40 !bg-transparent !text-white hover:!bg-white/10 !px-6 !py-3">
                <StoreIcon className="h-5 w-5" /> Encontrar una tienda
              </Link>
            </div>
          </Spotlight>
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
        <RevealText as="h2" text={title} className="section-title mt-2 block" />
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
