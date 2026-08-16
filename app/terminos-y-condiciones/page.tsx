import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { getPolicy } from "@/data/policies";
import { pageMetadata } from "@/lib/seo";

const doc = getPolicy("terminos-y-condiciones")!;

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description:
    "Términos y condiciones de uso del sitio de Calzatodos Group, conforme a la legislación ecuatoriana (Ley Orgánica de Defensa del Consumidor, Ley de Comercio Electrónico y normativa aplicable).",
  path: "/terminos-y-condiciones",
});

export default function TerminosPage() {
  return <PolicyPage doc={doc} />;
}
