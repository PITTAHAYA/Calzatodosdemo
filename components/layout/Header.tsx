"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  SearchIcon,
  MenuIcon,
  CloseIcon,
  ChevronDownIcon,
  StoreIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { megaMenus } from "@/data/categories";
import { internationalBrands, ownBrands } from "@/data/brands";
import { site } from "@/data/site-content";
import { whatsappGeneral } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type MenuKey = "mujer" | "hombre" | "ninos" | "marcas" | null;

const primaryLinks = [
  { label: "Mujer", href: "/mujer", menu: "mujer" as const },
  { label: "Hombre", href: "/hombre", menu: "hombre" as const },
  { label: "Niños", href: "/ninos", menu: "ninos" as const },
  { label: "Marcas", href: "/marcas", menu: "marcas" as const },
  { label: "Ofertas", href: "/ofertas", menu: null },
  { label: "Mayoristas", href: "/mayoristas", menu: null },
  { label: "Tiendas", href: "/tiendas", menu: null },
  { label: "Nosotros", href: "/nosotros", menu: null },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cerrar menús al cambiar de ruta.
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Bloquear scroll cuando el drawer móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Cerrar mega menú con Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openWithDelay = useCallback((key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
    setMobileOpen(false);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative w-full">
      {/* Fila principal */}
      <div className="border-b border-graphite-100 bg-white/95 backdrop-blur">
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-[70px]">
            {/* Izquierda: menú móvil + logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-ghost -ml-2 !px-2 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú"
                aria-expanded={mobileOpen}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <Link href="/" aria-label="Calzatodos Group — Inicio">
                <Logo />
              </Link>
            </div>

            {/* Centro: buscador (desktop) */}
            <form
              onSubmit={onSearch}
              role="search"
              className="hidden flex-1 max-w-md items-center md:flex"
            >
              <label htmlFor="header-search" className="sr-only">
                Buscar productos
              </label>
              <div className="relative w-full">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
                <input
                  id="header-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, marca, código…"
                  className="w-full rounded-full border border-graphite-200 bg-graphite-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </div>
            </form>

            {/* Derecha: acciones (el WhatsApp vive en el botón flotante para no duplicarlo) */}
            <div className="flex items-center gap-2">
              <Link href="/tiendas" className="btn-outline !px-3">
                <StoreIcon className="h-4 w-4" />
                <span className="hidden lg:inline">Tiendas</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navegación principal (desktop) */}
        <nav
          className="hidden border-t border-graphite-100 lg:block"
          aria-label="Navegación principal"
          onMouseLeave={scheduleClose}
        >
          <div className="container-page">
            <ul className="flex items-center gap-1">
              {primaryLinks.map((item) => (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.menu && openWithDelay(item.menu)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-brand-700"
                        : "text-graphite-700 hover:text-brand-700"
                    )}
                    aria-expanded={item.menu ? openMenu === item.menu : undefined}
                    onFocus={() => item.menu && openWithDelay(item.menu)}
                  >
                    {item.label}
                    {item.menu && (
                      <ChevronDownIcon
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          openMenu === item.menu && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-600" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mega menús */}
          {openMenu && (
            <div
              className="absolute inset-x-0 top-full border-t border-graphite-100 bg-white shadow-card-hover animate-fade-in"
              onMouseEnter={() => openWithDelay(openMenu)}
            >
              <div className="container-page py-8">
                {openMenu === "marcas" ? (
                  <MarcasMenu />
                ) : (
                  <CategoriaMenu menuKey={openMenu} />
                )}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Drawer móvil */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        search={search}
        setSearch={setSearch}
        onSearch={onSearch}
        isActive={isActive}
      />
    </header>
  );
}

// ------------------- Mega menú de categorías -------------------
function CategoriaMenu({ menuKey }: { menuKey: "mujer" | "hombre" | "ninos" }) {
  const col = megaMenus[menuKey];
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <div className="md:col-span-3">
        <h3 className="eyebrow mb-3">{col.title}</h3>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 md:grid-cols-3">
          {col.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-md px-2 py-1.5 text-sm text-graphite-700 transition hover:bg-graphite-50 hover:text-brand-700"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
          Calzatodos Group
        </p>
        <p className="mt-2 text-lg font-bold leading-snug">
          Calzado para toda la familia
        </p>
        <p className="mt-2 text-sm text-white/80">
          Explora el catálogo completo y consulta por WhatsApp.
        </p>
        <Link
          href="/catalogo"
          className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}

// ------------------- Mega menú de marcas -------------------
function MarcasMenu() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h3 className="eyebrow mb-3">Marcas internacionales</h3>
        <ul className="grid grid-cols-2 gap-1.5">
          {internationalBrands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/marcas/${b.slug}`}
                className="block rounded-md px-2 py-1.5 text-sm text-graphite-700 transition hover:bg-graphite-50 hover:text-brand-700"
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="eyebrow mb-3">Marcas propias</h3>
        <ul className="grid grid-cols-2 gap-1.5">
          {ownBrands.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/marcas/${b.slug}`}
                className="block rounded-md px-2 py-1.5 text-sm text-graphite-700 transition hover:bg-graphite-50 hover:text-brand-700"
              >
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/marcas" className="mt-3 inline-flex text-sm font-semibold text-brand-700 hover:underline">
          Ver todas las marcas →
        </Link>
      </div>
    </div>
  );
}

// ------------------- Drawer móvil -------------------
function MobileDrawer({
  open,
  onClose,
  search,
  setSearch,
  onSearch,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  search: string;
  setSearch: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isActive: (href: string) => boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-graphite-900/50 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          "absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className="flex items-center justify-between border-b border-graphite-100 px-4 py-3">
          <Logo />
          <button
            type="button"
            className="btn-ghost !px-2"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <form onSubmit={onSearch} role="search" className="mb-4">
            <label htmlFor="mobile-search" className="sr-only">
              Buscar productos
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input
                id="mobile-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos…"
                className="w-full rounded-full border border-graphite-200 bg-graphite-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
          </form>

          <nav aria-label="Navegación móvil">
            <ul className="space-y-1">
              {(["mujer", "hombre", "ninos"] as const).map((key) => {
                const col = megaMenus[key];
                const isOpenAcc = expanded === key;
                return (
                  <li key={key} className="border-b border-graphite-100">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-3 text-left text-base font-semibold text-graphite-900"
                      onClick={() => setExpanded(isOpenAcc ? null : key)}
                      aria-expanded={isOpenAcc}
                    >
                      {col.title}
                      <ChevronDownIcon
                        className={cn("h-4 w-4 transition-transform", isOpenAcc && "rotate-180")}
                      />
                    </button>
                    {isOpenAcc && (
                      <ul className="pb-3">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              className="block rounded-md px-3 py-2 text-sm text-graphite-600 hover:bg-graphite-50"
                              onClick={onClose}
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}

              {[
                { label: "Marcas", href: "/marcas" },
                { label: "Ofertas", href: "/ofertas" },
                { label: "Mayoristas", href: "/mayoristas" },
                { label: "Tiendas", href: "/tiendas" },
                { label: "Nosotros", href: "/nosotros" },
                { label: "Contacto", href: "/contacto" },
              ].map((l) => (
                <li key={l.href} className="border-b border-graphite-100">
                  <Link
                    href={l.href}
                    className={cn(
                      "block py-3 text-base font-semibold",
                      isActive(l.href) ? "text-brand-700" : "text-graphite-900"
                    )}
                    onClick={onClose}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-graphite-100 p-4">
          <a
            href={whatsappGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
