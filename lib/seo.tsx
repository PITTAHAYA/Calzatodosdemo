// Datos estructurados (Schema.org) y helpers de metadata.

import type { Metadata } from "next";
import { site } from "@/data/site-content";
import { stores } from "@/data/stores";
import { siteUrl, absoluteUrl } from "@/lib/utils";
import type { Product } from "@/data/products";
import { brandDisplayName } from "@/lib/whatsapp";
import { getCategory } from "@/data/categories";

// Metadata base reutilizable por página.
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  images?: string[];
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: "es_EC",
      type: "website",
      images: opts.images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: opts.images,
    },
  };
}

// Organization + ShoeStore (LocalBusiness) para el sitio completo.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ShoeStore", "LocalBusiness"],
    name: site.name,
    description: site.description,
    url: siteUrl(),
    slogan: site.slogan,
    email: site.email,
    telephone: `+${site.whatsapp.number}`,
    sameAs: [site.socials.instagram, site.socials.facebook, site.socials.tiktok],
    address: stores.map((s) => ({
      "@type": "PostalAddress",
      streetAddress: s.address,
      addressLocality: s.city,
      addressCountry: "EC",
    })),
    location: stores.map((s) => ({
      "@type": "ShoeStore",
      name: `${site.name} — ${s.name}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: s.address,
        addressLocality: s.city,
        addressCountry: "EC",
      },
    })),
  };
}

// LocalBusiness/ShoeStore individual por tienda.
export function storeJsonLd(store: (typeof stores)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "ShoeStore",
    name: `${site.name} — ${store.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressCountry: "EC",
    },
    telephone: `+${site.whatsapp.number}`,
    url: absoluteUrl("/tiendas"),
    openingHours: `Mo-Su ${store.opensAt}-${store.closesAt}`,
  };
}

// Product + Offer (cuando hay precio).
export function productJsonLd(product: Product) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    brand: { "@type": "Brand", name: brandDisplayName(product.brand) },
    category: getCategory(product.category)?.name ?? product.category,
    url: absoluteUrl(`/productos/${product.slug}`),
  };
  if (typeof product.price === "number") {
    data.offers = {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStoreOnly",
      url: absoluteUrl(`/productos/${product.slug}`),
    };
  }
  return data;
}

// BreadcrumbList.
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

// FAQPage.
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

// Componente helper para inyectar JSON-LD.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
