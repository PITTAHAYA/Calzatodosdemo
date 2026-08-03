import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { visibleBrands } from "@/data/brands";

// Marquee de marcas que se desplaza solo (bucle continuo). Se pausa al pasar
// el cursor; en dispositivos con "reducir movimiento" se puede deslizar.
export function BrandMarquee() {
  const Track = ({ dup = false }: { dup?: boolean }) => (
    <ul
      className="marquee-track flex shrink-0 items-center gap-4 pr-4"
      style={{ animationDuration: "38s" }}
      aria-hidden={dup}
    >
      {visibleBrands.map((b) => (
        <li key={(dup ? "d-" : "") + b.slug} className="w-44 shrink-0">
          <Link
            href={`/marcas/${b.slug}`}
            className="block transition hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <BrandLogo brand={b} className="h-28" />
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee-wrap -mx-4 sm:-mx-6 lg:-mx-8"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
      }}
    >
      <Track />
      <Track dup />
    </div>
  );
}
