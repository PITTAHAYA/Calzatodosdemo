"use client";

// Si algo falla dentro del panel, se muestra este aviso en lugar de una
// pantalla en blanco. El sitio público no se ve afectado.
import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-4">
      <div className="text-4xl">⚠️</div>
      <h1 className="text-xl font-bold">Algo no salió como esperábamos</h1>
      <p className="text-sm text-neutral-400">
        No se guardó ningún cambio a medias: el catálogo público sigue
        funcionando. Puedes reintentar o volver a la lista.
      </p>
      {error.digest && (
        <p className="text-xs text-neutral-600">Código: {error.digest}</p>
      )}
      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={reset}
          className="rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200"
        >
          Reintentar
        </button>
        <Link
          href="/admin"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
        >
          Volver a productos
        </Link>
      </div>
    </div>
  );
}
