// =========================================================================
// LOCALES / TIENDAS — Calzatodos Group
// -------------------------------------------------------------------------
// Cuatro locales oficiales. Los enlaces de Google Maps se generan a partir de
// la dirección (búsqueda). Cuando el cliente entregue los enlaces oficiales o
// coordenadas exactas, reemplaza "mapsQuery" o agrega "mapsUrl".
//
// Horarios: usa formato 24h "HH:MM". "days" indica los días de apertura
// (0 = domingo ... 6 = sábado) para calcular el estado abierto/cerrado.
// =========================================================================

export interface Store {
  slug: string;
  city: string;
  name: string;
  address: string;
  // Horario legible para mostrar.
  hoursLabel: string;
  // Horario estructurado para calcular abierto/cerrado.
  opensAt: string; // "09:00"
  closesAt: string; // "19:30"
  days: number[]; // días abiertos (0=Dom ... 6=Sáb)
  // Consulta para Google Maps (se codifica en la URL).
  mapsQuery: string;
  // Coordenadas opcionales (rellenar cuando se confirmen).
  lat?: number;
  lng?: number;
  // Foto del local (/public/stores/...).
  photo?: string;
}

export const stores: Store[] = [
  {
    slug: "latacunga-centro",
    photo: "/stores/latacunga-centro.jpg",
    city: "Latacunga",
    name: "Latacunga Centro",
    address: "2 de Mayo y Guayaquil, Latacunga, Ecuador",
    hoursLabel: "Lunes a domingo, 09:00 a 19:30",
    opensAt: "09:00",
    closesAt: "19:30",
    days: [0, 1, 2, 3, 4, 5, 6],
    mapsQuery: "Calzatodos Group, 2 de Mayo y Guayaquil, Latacunga, Ecuador",
  },
  {
    slug: "latacunga-sur",
    photo: "/stores/latacunga-sur.jpg",
    city: "Latacunga",
    name: "Latacunga Sur",
    address:
      "Panamericana Sur Km 1 1/2, diagonal al Paradero La Finca, al lado de Don Diego, Latacunga, Ecuador",
    hoursLabel: "Lunes a domingo, 09:00 a 19:00",
    opensAt: "09:00",
    closesAt: "19:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    mapsQuery:
      "Panamericana Sur Km 1.5, diagonal al Paradero La Finca, Latacunga, Ecuador",
    // Coordenadas exactas: 0°57'01.7"S 78°36'54.0"W
    lat: -0.9504722,
    lng: -78.615,
  },
  {
    slug: "quito-centro-historico",
    photo: "/stores/quito-centro-historico.jpg",
    city: "Quito",
    name: "Quito — Centro Histórico",
    address:
      "Centro Histórico, calle Venezuela entre Eugenio Espejo y Sucre, frente a los cajeros del Banco Pichincha, Quito, Ecuador",
    hoursLabel: "Lunes a domingo, 10:00 a 18:00",
    opensAt: "10:00",
    closesAt: "18:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    mapsQuery:
      "Calle Venezuela entre Eugenio Espejo y Sucre, Centro Histórico, Quito, Ecuador",
    // Coordenadas exactas: 0°13'10.2"S 78°30'38.6"W
    lat: -0.2195,
    lng: -78.5107222,
  },
  {
    slug: "riobamba",
    photo: "/stores/riobamba.jpg",
    city: "Riobamba",
    name: "Riobamba",
    address:
      "Calle Guayaquil, entre Gabriel García Moreno y Pichincha, Riobamba, Ecuador",
    hoursLabel: "Lunes a domingo, 10:00 a 20:00",
    opensAt: "10:00",
    closesAt: "20:00",
    days: [0, 1, 2, 3, 4, 5, 6],
    mapsQuery:
      "Calle Guayaquil entre García Moreno y Pichincha, Riobamba, Ecuador",
  },
];

export function getStore(slug: string): Store | undefined {
  return stores.find((s) => s.slug === slug);
}

// ¿Tiene coordenadas exactas confirmadas?
export function hasExactLocation(store: Store): boolean {
  return typeof store.lat === "number" && typeof store.lng === "number";
}

// Enlace de Google Maps: usa coordenadas exactas si existen (pin preciso),
// de lo contrario busca por dirección.
export function storeMapsUrl(store: Store): string {
  if (hasExactLocation(store)) {
    return `https://www.google.com/maps/search/?api=1&query=${store.lat}%2C${store.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    store.mapsQuery
  )}`;
}

// Enlace embebido (iframe) — coordenadas exactas cuando existen (con zoom
// cercano para un mapa más premium), o búsqueda por dirección como respaldo.
export function storeMapsEmbedUrl(store: Store): string {
  if (hasExactLocation(store)) {
    return `https://maps.google.com/maps?q=${store.lat},${store.lng}&z=17&output=embed`;
  }
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    store.mapsQuery
  )}&output=embed`;
}
