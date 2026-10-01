import { getHistory } from "@/lib/products-store";
import { findBlobUrls, migrateBlobToR2Action, undoAction } from "../../actions";
import { ImportBackup } from "./import-backup";
import { ConfirmSubmit } from "../confirm-submit";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Guayaquil",
});

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ migrate?: string; fallidas?: string }>;
}) {
  const sp = await searchParams;
  const [history, blobUrls] = await Promise.all([getHistory(), findBlobUrls()]);
  const r2Ready = Boolean(
    process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET && process.env.R2_PUBLIC_URL
  );
  const failed = Number(sp.fallidas ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Actividad y respaldos</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Cada cambio queda registrado. Si algo sale mal, deshazlo aquí o
          restaura un respaldo.
        </p>
      </div>

      <section className="border border-neutral-800 rounded-lg p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <h2 className="font-semibold">Últimos cambios ({history.length})</h2>
          {history.length > 0 && (
            <form action={undoAction}>
              <ConfirmSubmit
                message={`¿Deshacer "${history[0].summary}"?`}
                className="rounded-md border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800"
              >
                ↶ Deshacer el último
              </ConfirmSubmit>
            </form>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-neutral-500 py-6 text-center">
            Aún no hay cambios registrados.
          </p>
        ) : (
          <ol className="text-sm divide-y divide-neutral-800">
            {history.map((h, i) => (
              <li key={`${h.at}-${i}`} className="py-2 flex justify-between gap-4">
                <span className={i === 0 ? "text-white" : "text-neutral-300"}>{h.summary}</span>
                <span className="text-xs text-neutral-500 shrink-0 text-right">
                  {h.user} · {fmt.format(new Date(h.at))}
                </span>
              </li>
            ))}
          </ol>
        )}
        <p className="text-xs text-neutral-600 mt-3">
          Se guardan los últimos 30 cambios. “Deshacer” los revierte de uno en uno, del más reciente al más antiguo.
        </p>
      </section>

      <section className="border border-neutral-800 rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Fotos en la nube</h2>
        {sp.migrate === "sin-r2" && (
          <p className="text-sm text-red-400">Cloudflare R2 no está configurado en este servidor.</p>
        )}
        {sp.migrate && sp.migrate !== "sin-r2" && (
          <p className={`text-sm ${failed ? "text-amber-400" : "text-emerald-400"}`}>
            Se movieron {sp.migrate} foto(s) a Cloudflare.
            {failed > 0 && ` ${failed} no se pudieron copiar: vuelve a intentarlo.`}
          </p>
        )}
        {blobUrls.length === 0 ? (
          <p className="text-sm text-neutral-400">
            ✓ Ninguna foto del catálogo depende de Vercel Blob. Ya puedes
            desconectar y borrar el almacenamiento Blob en Vercel.
          </p>
        ) : (
          <>
            <p className="text-sm text-neutral-400">
              Hay <strong className="text-white">{blobUrls.length}</strong> foto(s)
              guardadas todavía en Vercel Blob. Muévelas a Cloudflare antes de
              borrar Blob, o se verán rotas en la página.
            </p>
            {r2Ready ? (
              <form action={migrateBlobToR2Action}>
                <ConfirmSubmit
                  message={`¿Copiar ${blobUrls.length} foto(s) a Cloudflare y actualizar los productos?`}
                  className="rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200"
                >
                  Mover fotos a Cloudflare
                </ConfirmSubmit>
              </form>
            ) : (
              <p className="text-sm text-amber-400">Configura Cloudflare R2 primero.</p>
            )}
          </>
        )}
      </section>

      <section className="border border-neutral-800 rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Respaldo del catálogo</h2>
        <p className="text-sm text-neutral-400">
          Descarga una copia de todos los cambios hechos desde el panel
          (precios, fotos, productos nuevos y ocultos, marcas y categorías nuevas). Recomendado antes de
          cambios grandes, como actualizar toda la lista de precios.
        </p>
        <a
          href="/admin/respaldo"
          className="inline-block rounded-md bg-white text-neutral-900 font-semibold px-4 py-2 text-sm hover:bg-neutral-200"
        >
          ⬇ Descargar respaldo
        </a>
        <div className="border-t border-neutral-800 pt-4">
          <h3 className="text-sm font-medium mb-1">Restaurar un respaldo</h3>
          <p className="text-xs text-neutral-500 mb-3">
            Reemplaza el estado actual por el del archivo. El estado actual
            queda en el historial, así que también se puede deshacer.
          </p>
          <ImportBackup />
        </div>
      </section>
    </div>
  );
}
