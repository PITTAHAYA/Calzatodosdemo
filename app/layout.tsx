import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader, SiteFooterAndExtras } from "@/components/layout/SiteChrome";
import { getCustomTaxonomy } from "@/lib/taxonomy-store";
import { ScrollProgress } from "@/components/ScrollProgress";
import { JsonLd, organizationJsonLd, defaultOgImage } from "@/lib/seo";
import { site } from "@/data/site-content";
import { siteUrl } from "@/lib/utils";

// Red de seguridad: las páginas públicas se regeneran como máximo cada 60 s,
// así cualquier versión desactualizada del catálogo se corrige sola. Los
// cambios del panel igual se publican al instante con revalidatePath().
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} — ${site.slogan}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "zapatería",
    "calzado",
    "zapatos Ecuador",
    "Latacunga",
    "Quito",
    "Riobamba",
    "calzado para toda la familia",
    "calzado al por mayor Ecuador",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: site.name,
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: [defaultOgImage.url],
  },
  robots: { index: true, follow: true },
  // Código de Google Search Console (método "Etiqueta HTML"), opcional.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#e11919",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd()} />
        <ScrollProgress />
        {/* Salto al contenido para accesibilidad por teclado */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        {/* Barra superior + header (ocultos en /admin) */}
        <SiteHeader extraBrands={(await getCustomTaxonomy()).brands.filter((b) => !b.hidden)} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooterAndExtras />
      </body>
    </html>
  );
}
