import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado para Niños",
  description:
    "Calzado infantil, escolar, con luces, sneakers y sandalias para niño, niña e infantil. Calzatodos Group en Ecuador. Consulta por WhatsApp.",
  path: "/ninos",
});

export default function NinosPage() {
  const kids = products.filter((p) =>
    ["nino", "nina", "infantil"].includes(p.audience)
  );
  return (
    <CategoryLanding
      eyebrow="Niños"
      title="Calzado para Niños"
      description="Escolar, con luces, sneakers, sandalias y más para niño, niña e infantil. Filtra por público y consulta por WhatsApp."
      products={kids}
      crumbs={[{ name: "Niños", path: "/ninos" }]}
      heroImage="/brand-gallery/bubble-gummers-2.jpg"
    />
  );
}
