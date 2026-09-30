import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ingresar — Panel Calzatodos", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentAdmin();
  if (user) redirect(sp.next && sp.next.startsWith("/admin") ? sp.next : "/admin");

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-1">Panel Calzatodos</h1>
        <p className="text-sm text-neutral-400 mb-6">
          Ingresa con tu usuario administrador.
        </p>
        <input type="hidden" name="next" value={sp.next ?? "/admin"} />
        <label className="block text-sm mb-2">
          Usuario
          <input
            name="username"
            autoComplete="username"
            required
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:border-neutral-500"
          />
        </label>
        <label className="block text-sm mb-2 mt-4">
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 focus:outline-none focus:border-neutral-500"
          />
        </label>
        {sp.error && (
          <p className="mt-3 text-sm text-red-400">{sp.error}</p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-white text-neutral-900 font-semibold py-2 hover:bg-neutral-200 transition"
        >
          Entrar
        </button>
        <p className="mt-6 text-xs text-neutral-500 leading-relaxed">
          El acceso está restringido al personal autorizado. Todas las acciones
          quedan asociadas a tu usuario mientras dure la sesión (8 horas).
        </p>
      </form>
    </main>
  );
}
