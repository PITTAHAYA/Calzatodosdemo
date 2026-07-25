// Barra superior informativa (ticker en movimiento continuo).
import { topBarMessages } from "@/data/site-content";

function Message({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <span className="h-1 w-1 shrink-0 rounded-full bg-brand-500" />
      {text}
    </span>
  );
}

export function TopBar() {
  return (
    <div className="bg-graphite-900 py-2 text-xs font-medium text-white">
      {/* MÓVIL: ticker deslizante continuo (dos copias idénticas para un
          bucle sin cortes). Se pausa al mantener presionado. */}
      <div className="marquee-wrap sm:hidden">
        <ul className="marquee-track flex shrink-0 items-center gap-8 pl-4 pr-8">
          {topBarMessages.map((m, i) => (
            <li key={i}>
              <Message text={m} />
            </li>
          ))}
        </ul>
        <ul className="marquee-track flex shrink-0 items-center gap-8 pr-8" aria-hidden>
          {topBarMessages.map((m, i) => (
            <li key={`dup-${i}`}>
              <Message text={m} />
            </li>
          ))}
        </ul>
      </div>

      {/* DESKTOP: distribución estática. */}
      <div className="container-page hidden w-full items-center justify-between sm:flex">
        {topBarMessages.map((m, i) => (
          <Message key={i} text={m} />
        ))}
      </div>
    </div>
  );
}
