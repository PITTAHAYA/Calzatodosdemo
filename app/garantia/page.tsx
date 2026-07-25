import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { getPolicy } from "@/data/policies";
import { pageMetadata } from "@/lib/seo";

const doc = getPolicy("garantia")!;

export const metadata: Metadata = pageMetadata({
  title: doc.title,
  description:
    "Información sobre la garantía de los productos de Calzatodos Group. Borrador editable pendiente de aprobación legal.",
  path: "/garantia",
});

export default function GarantiaPage() {
  return <PolicyPage doc={doc} />;
}
