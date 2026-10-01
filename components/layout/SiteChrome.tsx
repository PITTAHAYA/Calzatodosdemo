"use client";

// El panel /admin tiene su propia interfaz (login, header de administración)
// y no debe mostrar la marquesina, el menú público ni el botón flotante de
// WhatsApp del sitio. Este wrapper los oculta en esas rutas.

import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import type { Brand } from "@/data/brands";

function isAdminRoute(pathname: string | null): boolean {
  return Boolean(pathname && pathname.startsWith("/admin"));
}

export function SiteHeader({ extraBrands = [] }: { extraBrands?: Brand[] }) {
  const pathname = usePathname();
  if (isAdminRoute(pathname)) return null;
  return (
    <div className="sticky top-0 z-50">
      <TopBar />
      <Header extraBrands={extraBrands} />
    </div>
  );
}

export function SiteFooterAndExtras() {
  const pathname = usePathname();
  if (isAdminRoute(pathname)) return null;
  return (
    <>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
