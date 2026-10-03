import { getStores } from "@/lib/store-hours-store";
import { ecuadorDate, exceptionDateLabel, exceptionText } from "@/lib/store-hours";
import {
  addExceptionAction,
  deleteExceptionAction,
  saveRegularHoursAction,
} from "../../hours-actions";

export const dynamic = "force-dynamic";

const DAYS: [number, string][] = [
  [1, "Lun"], [2, "Mar"], [3, "Mié"], [4, "Jue"], [5, "Vie"], [6, "Sáb"], [0, "Dom"],
];

const MESSAGES: Record<string, string> = {
  "ok:horario": "Horario guardado.",
  "ok:especial": "Día especial agregado.",
  "ok:borrado": "Día especial eliminado.",
  "error:tienda": "Tienda no válida.",
  "error:horas": "Revisa las horas: la apertura debe ser antes del cierre.",
  "error:fecha": "Revisa las fechas: «hasta» no puede ser antes de «desde».",
  "error:pasado": "No se pueden agregar fechas que ya pasaron.",
  "error:rango": "Máximo 60 días seguidos por vez.",
};

const input = "rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm";

export default async function HorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const stores = await getStores();
  const today = ecuadorDate();
  const msg = sp.ok ? MESSAGES[`ok:${sp.ok}`] : sp.error ? MESSAGES[`error:${sp.error}`] : null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Horarios de tiendas</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Cambia el horario habitual de cada local o agrega días especiales (feriados,
          cierres por motivos personales, horario reducido). Se muestran en la web
          automáticamente y desaparecen solos cuando pasa la fecha.
        </p>
        {msg && (
          <p className={`mt-4 rounded-md px-3 py-2 text-sm ${sp.ok ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"}`}>
            {msg}
          </p>
        )}
      </div>

      {/* ============ Día especial ============ */}
      <section className="border border-neutral-800 rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold">＋ Agregar día especial</h2>
        <form action={addExceptionAction} className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="block text-neutral-300">Tienda</span>
            <select name="store" className={`${input} w-full`} defaultValue="todas">
              <option value="todas">Todas las tiendas</option>
              {stores.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="block text-neutral-300">Motivo (se muestra al cliente)</span>
            <input name="note" maxLength={80} placeholder="Ej.: Feriado de Difuntos" className={`${input} w-full`} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="block text-neutral-300">Desde</span>
            <input type="date" name="from" required min={today} className={`${input} w-full`} />
          </label>
          <label className="space-y-1 text-sm">
            <span className="block text-neutral-300">Hasta (opcional, para varios días)</span>
            <input type="date" name="to" min={today} className={`${input} w-full`} />
          </label>
          <fieldset className="space-y-2 text-sm sm:col-span-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="mode" value="cerrado" defaultChecked /> Cerrado todo el día
            </label>
            <label className="flex flex-wrap items-center gap-2">
              <input type="radio" name="mode" value="horario" /> Horario distinto: de
              <input type="time" name="opensAt" defaultValue="10:00" className={input} /> a
              <input type="time" name="closesAt" defaultValue="14:00" className={input} />
            </label>
          </fieldset>
          <div className="sm:col-span-2">
            <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500">
              Guardar día especial
            </button>
          </div>
        </form>
      </section>

      {/* ============ Por tienda ============ */}
      {stores.map((s) => (
        <section key={s.slug} id={s.slug} className="border border-neutral-800 rounded-lg p-4 space-y-5 scroll-mt-20">
          <div>
            <h2 className="text-lg font-semibold">{s.name}</h2>
            <p className="text-sm text-neutral-400">En la web: {s.hoursLabel}</p>
          </div>

          <form action={saveRegularHoursAction} className="space-y-3">
            <input type="hidden" name="store" value={s.slug} />
            <p className="text-sm font-medium text-neutral-300">Horario habitual</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(([d, label]) => (
                <label key={d} className="flex items-center gap-1.5 rounded-md border border-neutral-700 px-2 py-1 text-sm">
                  <input type="checkbox" name="days" value={d} defaultChecked={s.days.includes(d)} />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              De <input type="time" name="opensAt" defaultValue={s.opensAt} required className={input} />
              a <input type="time" name="closesAt" defaultValue={s.closesAt} required className={input} />
              <button className="ml-2 rounded-md border border-neutral-600 px-3 py-1.5 hover:bg-neutral-800">
                Guardar horario
              </button>
            </div>
          </form>

          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-300">Días especiales</p>
            {(s.exceptions ?? []).length === 0 ? (
              <p className="text-sm text-neutral-500">Ninguno programado.</p>
            ) : (
              <ul className="divide-y divide-neutral-800 rounded-md border border-neutral-800">
                {s.exceptions!.map((e) => (
                  <li key={e.date} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                    <span>
                      <span className="font-medium">{exceptionDateLabel(e.date)}</span>
                      <span className={e.closed ? "text-red-400" : "text-amber-300"}> — {exceptionText(e)}</span>
                    </span>
                    <form action={deleteExceptionAction}>
                      <input type="hidden" name="store" value={s.slug} />
                      <input type="hidden" name="date" value={e.date} />
                      <button className="text-xs text-neutral-400 hover:text-red-400">Quitar</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
