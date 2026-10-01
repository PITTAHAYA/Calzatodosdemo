// Esqueleto que se ve mientras carga el catálogo interactivo (en lugar de un
// texto suelto "Cargando…").
export function CatalogSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando catálogo">
      <div className="mb-6 h-11 animate-pulse rounded-full bg-graphite-100" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-2xl bg-graphite-100" />
            <div className="mt-3 h-3 w-1/2 rounded bg-graphite-100" />
            <div className="mt-2 h-3 w-3/4 rounded bg-graphite-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
