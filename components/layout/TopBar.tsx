// Barra superior informativa con mensajes rotativos (marquee CSS, sin JS).
import { topBarMessages } from "@/data/site-content";

export function TopBar() {
  // Duplicamos la lista para un desplazamiento continuo sin cortes.
  const items = [...topBarMessages, ...topBarMessages];
  return (
    <div className="bg-graphite-900 text-white">
      <div className="container-page overflow-hidden">
        <div className="flex whitespace-nowrap py-2 text-xs font-medium">
          {/* En móvil: marquee. En desktop: distribución estática. */}
          <div className="marquee-track flex gap-10 sm:hidden">
            {items.map((m, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-500" />
                {m}
              </span>
            ))}
          </div>
          <div className="hidden w-full items-center justify-between sm:flex">
            {topBarMessages.map((m, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-500" />
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
