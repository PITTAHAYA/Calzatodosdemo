import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado Deportivo",
  description:
    "Calzado deportivo para entrenar y correr, para toda la familia. Marcas como Power y My Athletic en Calzatodos Group. Consulta por WhatsApp.",
  path: "/deportivo",
});

export default function DeportivoPage() {
  const items = products.filter(
    (p) => p.category === "deportivo" || p.style === "deportivo"
  );
  return (
    <CategoryLanding
      eyebrow="Estilo"
      title="Calzado Deportivo"
      description="Rendimiento y confort para entrenar, correr y moverte. Para mujer, hombre y niños."
      products={items}
      crumbs={[{ name: "Deportivo", path: "/deportivo" }]}
      hideCategory
    />
  );
}
