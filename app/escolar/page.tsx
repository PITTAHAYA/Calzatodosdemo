import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { getProductsByCategory } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado Escolar",
  description:
    "Zapatos escolares resistentes para el regreso a clases. Calzado infantil en Calzatodos Group, Ecuador. Consulta por WhatsApp.",
  path: "/escolar",
});

export default function EscolarPage() {
  return (
    <CategoryLanding
      eyebrow="Regreso a clases"
      title="Calzado Escolar"
      description="Resistencia y comodidad para el día a día en clases. Modelos pensados para niños y niñas."
      products={getProductsByCategory("escolar")}
      crumbs={[{ name: "Escolar", path: "/escolar" }]}
      heroImage="/lifestyle/zapatos-3.jpg"
      hideCategory
    />
  );
}
