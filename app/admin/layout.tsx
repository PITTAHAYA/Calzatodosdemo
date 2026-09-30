import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { logoutAction } from "./actions";

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
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold">
              Panel Calzatodos
            </Link>
            <nav className="hidden sm:flex gap-4 text-sm text-neutral-300">
              <Link href="/admin" className="hover:text-white">Productos</Link>
              <Link href="/admin/producto/nuevo" className="hover:text-white">Nuevo</Link>
              <Link href="/admin/guia-fotos" className="hover:text-white">Guía de fotos</Link>
              <Link href="/" className="hover:text-white" target="_blank">Ver sitio ↗</Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <span className="text-xs text-neutral-400 mr-3">
              {user}
            </span>
            <button className="text-sm rounded-md border border-neutral-700 px-3 py-1 hover:bg-neutral-800">
              Salir
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
