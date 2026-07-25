import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/data/site-content";
import { whatsappGeneral } from "@/lib/whatsapp";
import {
  WhatsAppIcon,
  MailIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
} from "@/components/Icons";
import { BackToTop } from "@/components/BackToTop";

const columns = [
  {
    title: "Catálogo",
    links: [
      { label: "Mujer", href: "/mujer" },
      { label: "Hombre", href: "/hombre" },
      { label: "Niños", href: "/ninos" },
      { label: "Deportivo", href: "/deportivo" },
      { label: "Escolar", href: "/escolar" },
      { label: "Ofertas", href: "/ofertas" },
      { label: "Marcas", href: "/marcas" },
    ],
  },
  {
    title: "Calzatodos Group",
    links: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Mayoristas", href: "/mayoristas" },
      { label: "Tiendas", href: "/tiendas" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Garantía", href: "/garantia" },
      { label: "Cambios y devoluciones", href: "/cambios-y-devoluciones" },
      { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
      { label: "Privacidad", href: "/politica-de-privacidad" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-graphite-800 bg-graphite-900 text-graphite-200">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Marca */}
          <div className="col-span-2">
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-graphite-300">
              {site.slogan}. Distribuidores autorizados de marcas internacionales y
              desarrolladores de marcas propias.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Calzatodos Group"
                className="rounded-full border border-graphite-700 p-2 text-graphite-200 transition hover:border-brand-500 hover:text-white"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Calzatodos Group"
                className="rounded-full border border-graphite-700 p-2 text-graphite-200 transition hover:border-brand-500 hover:text-white"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={site.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de Calzatodos Group"
                className="rounded-full border border-graphite-700 p-2 text-graphite-200 transition hover:border-brand-500 hover:text-white"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Columnas de enlaces */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-graphite-300 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contacto */}
        <div className="mt-12 grid gap-4 border-t border-graphite-800 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-graphite-300 hover:text-white"
          >
            <WhatsAppIcon className="h-5 w-5 text-brand-500" />
            {site.whatsapp.display}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-3 text-sm text-graphite-300 hover:text-white"
          >
            <MailIcon className="h-5 w-5 text-brand-500" />
            {site.email}
          </a>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-graphite-300 hover:text-white"
          >
            <InstagramIcon className="h-5 w-5 text-brand-500" />
            @calzatodos_group
          </a>
          <a
            href={site.socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-graphite-300 hover:text-white"
          >
            <TikTokIcon className="h-5 w-5 text-brand-500" />
            @calzatodosgroupec
          </a>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-graphite-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-graphite-400 sm:flex-row">
          <p>
            © {year} {site.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <p>
              Desarrollado por{" "}
              <a
                href={site.developer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-graphite-200 hover:text-white"
              >
                {site.developer.name}
              </a>
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
