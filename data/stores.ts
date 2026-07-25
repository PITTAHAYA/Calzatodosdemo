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
}

export const stores: Store[] = [
  {
    slug: "latacunga-centro",
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
  },
  {
    slug: "quito-centro-historico",
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
  },
  {
    slug: "riobamba",
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

// Genera un enlace de Google Maps a partir de la consulta de dirección.
export function storeMapsUrl(store: Store): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    store.mapsQuery
  )}`;
}

// Enlace embebido (iframe) por consulta — carga diferida en el cliente.
export function storeMapsEmbedUrl(store: Store): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(
    store.mapsQuery
  )}&output=embed`;
}
