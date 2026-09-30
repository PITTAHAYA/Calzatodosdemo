// Skeleton mostrado por Next.js mientras navega entre páginas del panel.
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-neutral-800" />
          <div className="h-4 w-72 rounded bg-neutral-900" />
        </div>
        <div className="h-9 w-36 rounded-md bg-neutral-800" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg border border-neutral-800 bg-neutral-900" />
        ))}
      </div>
      <div className="h-10 rounded-md bg-neutral-900" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg border border-neutral-800 bg-neutral-900" />
        ))}
      </div>
    </div>
  );
}
