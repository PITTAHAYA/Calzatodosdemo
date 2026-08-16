import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { getProductsByAudience } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado para Hombre",
  description:
    "Sneakers, zapatos formales, botas, deportivo, outdoor y seguridad para hombre. Calzatodos Group en Ecuador. Consulta por WhatsApp.",
  path: "/hombre",
});

export default function HombrePage() {
  return (
    <CategoryLanding
      eyebrow="Hombre"
      title="Calzado para Hombre"
      description="Sneakers, casual y deportivo para todos los días. Encuentra tu modelo y consúltalo por WhatsApp."
      products={getProductsByAudience("hombre")}
      crumbs={[{ name: "Hombre", path: "/hombre" }]}
      heroImage="/lifestyle/ppl-hombre.jpg"
      hideAudience
    />
  );
}
