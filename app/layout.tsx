import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ScrollProgress } from "@/components/ScrollProgress";
import { JsonLd, organizationJsonLd } from "@/lib/seo";
import { site } from "@/data/site-content";
import { siteUrl } from "@/lib/utils";

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e11919",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
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
        {/* Barra superior + header pegados juntos al hacer scroll */}
        <div className="sticky top-0 z-50">
          <TopBar />
          <Header />
        </div>
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
