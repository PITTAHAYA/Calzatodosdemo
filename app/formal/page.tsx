import type { Metadata } from "next";
import { CategoryLanding } from "@/components/catalog/CategoryLanding";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Calzado Formal",
  description:
    "Zapatos formales y elegantes para trabajo y eventos. Calzatodos Group en Ecuador. Consulta por WhatsApp.",
  path: "/formal",
});

export default function FormalPage() {
  const items = products.filter(
    (p) => p.category === "formal" || p.style === "formal" || p.category === "tacones"
  );
  return (
    <CategoryLanding
      eyebrow="Estilo"
      title="Calzado Formal"
      description="Elegancia para la oficina, eventos y ocasiones especiales. Zapatos formales y tacones."
      products={items}
      crumbs={[{ name: "Formal", path: "/formal" }]}
      heroImage="/lifestyle/zapatos-5.jpg"
      hideCategory
    />
  );
}
