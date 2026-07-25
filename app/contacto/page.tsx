import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  WhatsAppIcon,
  MailIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  MapPinIcon,
} from "@/components/Icons";
import { site } from "@/data/site-content";
import { stores } from "@/data/stores";
import { whatsappGeneral } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp, correo o redes sociales. Calzatodos Group — calzado para toda la familia en Ecuador.",
  path: "/contacto",
});

export default function ContactoPage() {
  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[{ name: "Contacto", path: "/contacto" }]} />
      <h1 className="mt-4 text-3xl font-bold text-graphite-900">Contacto</h1>
      <p className="mt-2 max-w-2xl text-graphite-600">
        Estamos para ayudarte. Escríbenos y te responderemos lo antes posible.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,1.2fr]">
        {/* Datos de contacto */}
        <div>
          <div className="space-y-3">
            <a
              href={whatsappGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-graphite-100 bg-white p-4 shadow-card transition hover:border-brand-300"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#128C4B]">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-graphite-900">WhatsApp</span>
                <span className="block text-sm text-graphite-600">{site.whatsapp.display}</span>
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-4 rounded-xl border border-graphite-100 bg-white p-4 shadow-card transition hover:border-brand-300"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <MailIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-graphite-900">Correo</span>
                <span className="block text-sm text-graphite-600">{site.email}</span>
              </span>
            </a>
          </div>

          {/* Redes */}
          <div className="mt-4 flex gap-3">
            <SocialLink href={site.socials.instagram} label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={site.socials.facebook} label="Facebook">
              <FacebookIcon className="h-5 w-5" />
            </SocialLink>
            <SocialLink href={site.socials.tiktok} label="TikTok">
              <TikTokIcon className="h-5 w-5" />
            </SocialLink>
          </div>

          {/* Locales resumidos */}
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-graphite-900">
              Nuestros locales
            </h2>
            <ul className="mt-3 space-y-3">
              {stores.map((s) => (
                <li key={s.slug} className="flex gap-3 text-sm">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  <span>
                    <span className="font-semibold text-graphite-800">{s.name}</span>
                    <span className="block text-graphite-500">{s.address}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl border border-graphite-100 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold text-graphite-900">Envíanos un mensaje</h2>
          <p className="mt-1 text-sm text-graphite-500">
            Los campos marcados con * son obligatorios.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-graphite-200 text-graphite-700 transition hover:border-brand-400 hover:text-brand-600"
    >
      {children}
    </a>
  );
}
