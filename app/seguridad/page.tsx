import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { getProductsByCategory } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado de Seguridad Industrial",
  description:
    "Zapatos de seguridad con puntera de protección para entornos industriales. Nivel de protección según fabricante. Calzatodos Group. Consulta por WhatsApp.",
  path: "/seguridad",
});

export default function SeguridadPage() {
  return (
    <CategoryLanding
      eyebrow="Seguridad industrial"
      title="Calzado de Seguridad"
      description="Protección para el trabajo con puntera de seguridad y suelas resistentes. Las características de protección dependen de la especificación del fabricante."
      products={getProductsByCategory("seguridad")}
      crumbs={[{ name: "Seguridad", path: "/seguridad" }]}
      hideCategory
    />
  );
}
