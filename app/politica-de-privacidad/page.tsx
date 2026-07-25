import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { getPolicy } from "@/data/policies";
import { pageMetadata } from "@/lib/seo";

const doc = getPolicy("politica-de-privacidad")!;

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description:
    "Política de privacidad de Calzatodos Group: cómo tratamos tus datos. Borrador editable pendiente de aprobación legal.",
  path: "/politica-de-privacidad",
});

export default function PrivacidadPage() {
  return <PolicyPage doc={doc} />;
}
