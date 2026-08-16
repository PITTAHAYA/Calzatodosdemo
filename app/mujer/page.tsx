import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { getProductsByAudience } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado para Mujer",
  description:
    "Sneakers, sandalias, tacones, botas y más para mujer. Descubre el calzado de Calzatodos Group en Ecuador y consulta por WhatsApp.",
  path: "/mujer",
});

export default function MujerPage() {
  return (
    <CategoryLanding
      eyebrow="Mujer"
      title="Calzado para Mujer"
      description="Sneakers, urbanas y calzado casual para tu día a día. Encuentra tu estilo y consúltalo por WhatsApp."
      products={getProductsByAudience("mujer")}
      crumbs={[{ name: "Mujer", path: "/mujer" }]}
      heroImage="/lifestyle/ppl-mujer.jpg"
      hideAudience
    />
  );
}
