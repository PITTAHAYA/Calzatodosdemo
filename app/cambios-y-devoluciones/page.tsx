import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { getPolicy } from "@/data/policies";
import { pageMetadata } from "@/lib/seo";

const doc = getPolicy("cambios-y-devoluciones")!;

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description:
    "Política de cambios y devoluciones de Calzatodos Group. Borrador editable pendiente de aprobación legal.",
  path: "/cambios-y-devoluciones",
});

export default function CambiosPage() {
  return <PolicyPage doc={doc} />;
}
