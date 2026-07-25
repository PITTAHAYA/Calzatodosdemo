import Link from "next/link";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappGeneral } from "@/lib/whatsapp";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-black text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-graphite-900">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-md text-graphite-600">
        Es posible que el enlace haya cambiado o que la página ya no exista. Explora
        nuestro catálogo o escríbenos por WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Ir al inicio</Link>
        <Link href="/catalogo" className="btn-outline">Ver catálogo</Link>
        <a href={whatsappGeneral()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
