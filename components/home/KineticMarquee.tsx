import { cn } from "@/lib/utils";

// Banda de texto cinética que se desplaza sola — sello editorial de marca.
export function KineticMarquee({
  items,
  tone = "brand",
}: {
  items: string[];
  tone?: "brand" | "dark";
}) {
  const bg =
    tone === "brand" ? "bg-brand-600 text-white" : "bg-graphite-950 text-white";
  const star = tone === "brand" ? "text-white/60" : "text-brand-500";

  const Track = ({ dup = false }: { dup?: boolean }) => (
    <div
      className="marquee-track flex shrink-0 items-center"
      style={{ animationDuration: "30s" }}
      aria-hidden={dup}
    >
      {items.map((t, i) => (
        <span key={(dup ? "d" : "") + i} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-2xl font-black uppercase tracking-tight sm:text-4xl">
            {t}
          </span>
          <span className={cn("text-xl sm:text-2xl", star)} aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "marquee-wrap select-none py-4 sm:py-5",
        bg
      )}
    >
      <Track />
      <Track dup />
    </div>
  );
}
