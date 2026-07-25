import Link from "next/link";
import { ChevronRightIcon } from "@/components/Icons";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <nav aria-label="Ruta de navegación" className="text-sm">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <ol className="flex flex-wrap items-center gap-1 text-graphite-500">
        {full.map((c, i) => {
          const last = i === full.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1">
              {last ? (
                <span className="font-medium text-graphite-800" aria-current="page">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="hover:text-brand-700">
                    {c.name}
                  </Link>
                  <ChevronRightIcon className="h-3.5 w-3.5 text-graphite-300" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
