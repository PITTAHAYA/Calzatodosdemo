import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StoresClient } from "@/components/stores/StoresClient";
import { stores } from "@/data/stores";
import { pageMetadata, JsonLd, storeJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tiendas — Locales en Latacunga, Quito y Riobamba",
  description:
    "Encuentra tu tienda Calzatodos Group más cercana. Locales en Latacunga (Centro y Sur), Quito (Centro Histórico) y Riobamba. Direcciones, horarios y cómo llegar.",
  path: "/tiendas",
});

export default function TiendasPage() {
  return (
    <div className="container-page py-8">
      {stores.map((s) => (
        <JsonLd key={s.slug} data={storeJsonLd(s)} />
      ))}
      <Breadcrumbs items={[{ name: "Tiendas", path: "/tiendas" }]} />
      <h1 className="mt-4 text-3xl font-bold text-graphite-900">Nuestras tiendas</h1>
      <p className="mt-2 max-w-2xl text-graphite-600">
        Visítanos en cualquiera de nuestros locales. Consulta direcciones, horarios y
        obtén indicaciones para llegar. También puedes escribirnos por WhatsApp.
      </p>

      <div className="mt-8">
        <StoresClient stores={stores} />
      </div>
    </div>
  );
}
