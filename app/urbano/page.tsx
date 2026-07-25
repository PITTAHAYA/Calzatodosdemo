import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado Urbano",
  description:
    "Sneakers y calzado casual urbano para el día a día. Estilo y comodidad en Calzatodos Group. Consulta por WhatsApp.",
  path: "/urbano",
});

export default function UrbanoPage() {
  const items = products.filter((p) =>
    ["sneakers", "casual"].includes(p.style)
  );
  return (
    <CategoryLanding
      eyebrow="Estilo"
      title="Calzado Urbano"
      description="Sneakers y casuales de líneas limpias para el día a día. Lo urbano que no pasa de moda."
      products={items}
      crumbs={[{ name: "Urbano", path: "/urbano" }]}
      hideCategory
    />
  );
}
