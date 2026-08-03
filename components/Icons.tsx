// Conjunto de íconos SVG inline (sin dependencias). Todos aceptan className.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function WhatsAppIcon({ className, ...p }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden {...p}>
      <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export const ShieldCheckIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
    <path d="M9.5 12l1.8 1.8L15 10" />
  </svg>
);

export const BadgeCheckIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M12 3l2 2.2 3-.2.2 3L19.5 10 21 12l-1.5 2-1.3 2 .2 3-3-.2L12 21l-2.4-2.2-3 .2.2-3L5 12l1.6-2-.2-3 3 .2L12 3z" />
    <path d="M9.5 12l1.8 1.8L15 10" />
  </svg>
);

export const UsersIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3 3 0 0 1 0 5.8M21 20a6 6 0 0 0-4-5.7" />
  </svg>
);

export const HeadsetIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <path d="M4 13a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2zM20 13a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2z" />
    <path d="M20 17v1a3 3 0 0 1-3 3h-3" />
  </svg>
);

export const SearchIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const MapPinIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M12 21s-6-5-6-10a6 6 0 0 1 12 0c0 5-6 10-6 10z" />
    <circle cx="12" cy="11" r="2.2" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

export const StoreIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M4 9l1-4h14l1 4M4 9v10h16V9M4 9h16" />
    <path d="M9 19v-5h6v5" />
  </svg>
);

export const SparkleIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.3" />
    <circle cx="17" cy="7" r="0.6" fill="currentColor" />
  </svg>
);

export const FacebookIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden>
    <path d="M14 8.5V7c0-.7.3-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.6V8.5H8V12h2.5v9H14v-9h2.3l.5-3.5H14z" />
  </svg>
);

export const TikTokIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden>
    <path d="M16.5 3c.3 2 1.6 3.6 3.5 3.9V10c-1.4 0-2.7-.4-3.8-1.1v5.9a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 2 2.7V3h3.1z" />
  </svg>
);

export const TruckIcon = (p: IconProps) => (
  <svg {...base} className={p.className} aria-hidden>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);

// Selector por nombre (para datos que referencian íconos por string).
export function IconByName({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "shield-check":
      return <ShieldCheckIcon className={className} />;
    case "badge-check":
      return <BadgeCheckIcon className={className} />;
    case "users":
      return <UsersIcon className={className} />;
    case "headset":
      return <HeadsetIcon className={className} />;
    case "truck":
      return <TruckIcon className={className} />;
    case "store":
      return <StoreIcon className={className} />;
    default:
      return <SparkleIcon className={className} />;
  }
}
