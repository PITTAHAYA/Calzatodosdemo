import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { logoutAction } from "../actions";
import { Toast } from "./toast";

export const metadata = {
  title: "Panel Calzatodos",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentAdmin();
  // La pantalla de login se pinta con su propio layout raíz (fuera de este
  // árbol). Este layout solo protege el resto de /admin.
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-900 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <Link href="/admin" className="font-bold shrink-0">
            Panel Calzatodos
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-300 order-3 sm:order-none w-full sm:w-auto">
            <Link href="/admin" className="hover:text-white">Productos</Link>
            <Link href="/admin/producto/nuevo" className="hover:text-white">+ Nuevo</Link>
            <Link href="/admin/guia-fotos" className="hover:text-white">Guía de fotos</Link>
            <Link href="/" className="hover:text-white" target="_blank">Ver sitio ↗</Link>
          </nav>
          <form action={logoutAction} className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-neutral-400 hidden sm:inline">{user}</span>
            <button className="text-sm rounded-md border border-neutral-700 px-3 py-1 hover:bg-neutral-800">
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <Suspense fallback={null}>
        <Toast />
      </Suspense>
    </div>
  );
}
