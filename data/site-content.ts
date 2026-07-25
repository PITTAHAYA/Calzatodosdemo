// =========================================================================
// CONTENIDO GLOBAL DEL SITIO — Calzatodos Group
// -------------------------------------------------------------------------
// Edita aquí datos de contacto, redes, mensajes de la barra superior,
// número de WhatsApp y textos institucionales. NO es necesario tocar los
// componentes visuales para actualizar esta información.
// =========================================================================

export const site = {
  name: "Calzatodos Group",
  shortName: "Calzatodos",
  slogan: "Calzado para toda la familia",
  legalName: "Calzatodos Group",
  foundedYear: 2015,
  description:
    "Cadena ecuatoriana de calzado para toda la familia. Explora nuestro catálogo, descubre marcas internacionales y propias, y consulta disponibilidad directamente por WhatsApp.",

  // URL pública (se sobreescribe con NEXT_PUBLIC_SITE_URL en producción).
  url: "https://www.calzatodos.com",

  // ------------------------------------------------------------------
  // WhatsApp — CTA principal de todo el sitio.
  // ------------------------------------------------------------------
  whatsapp: {
    // Número en formato internacional SIN "+" ni espacios (para wa.me).
    number: "593996346715",
    // Número legible para mostrar en pantalla.
    display: "+593 99 634 6715",
  },

  // ------------------------------------------------------------------
  // Contacto e institucional.
  // ------------------------------------------------------------------
  email: "calzatodos@hotmail.com",

  socials: {
    instagram: "https://www.instagram.com/calzatodos_group",
    facebook: "https://www.facebook.com/share/1Dw54m81re/",
    tiktok: "https://www.tiktok.com/@calzatodosgroupec",
  },

  developer: {
    name: "Pittahaya",
    url: "https://www.pittahaya.com",
  },
} as const;

// ------------------------------------------------------------------
// Barra superior informativa — mensajes rotativos editables.
// ------------------------------------------------------------------
export const topBarMessages: string[] = [
  "Productos originales con garantía.",
  "Atención personalizada en nuestros locales.",
  "Ventas al por mayor y menor.",
  "Consulta disponibilidad directamente por WhatsApp.",
];

// ------------------------------------------------------------------
// Mensajes prellenados de WhatsApp según contexto.
// (Los constructores de enlaces viven en /lib/whatsapp.ts)
// ------------------------------------------------------------------
export const whatsappMessages = {
  general:
    "Hola Calzatodos Group, visité su página web y quisiera recibir más información.",
  // Los mensajes de producto y mayorista se construyen dinámicamente.
} as const;

// ------------------------------------------------------------------
// Propuesta de valor / contenido de marca reutilizable.
// ------------------------------------------------------------------
export const brandCopy = {
  heroTitle: "Calzado para toda la familia",
  heroText:
    "Descubre variedad, calidad y las marcas que acompañan cada paso de tu familia.",
  valueProp:
    "Encuentra variedad, calidad y atención personalizada en cada paso. Descubre calzado para mujer, hombre y niños, disponible en nuestros locales y mediante atención directa por WhatsApp.",
  trust:
    "Somos distribuidores autorizados a nivel nacional de marcas internacionales y desarrollamos marcas propias pensadas para diferentes estilos, edades y necesidades.",
  warranty:
    "Todos nuestros productos cuentan con garantía, sujeta a las condiciones correspondientes de cada categoría.",
  attention:
    "Te ayudamos a encontrar el modelo, talla y local más conveniente para ti.",
  availabilityNote: "Disponibilidad sujeta a confirmación en tienda.",
} as const;

// ------------------------------------------------------------------
// Ventajas / propuesta de valor con iconografía (sección de inicio).
// ------------------------------------------------------------------
export const valueProps = [
  {
    icon: "shield-check",
    title: "Distribuidores autorizados",
    text: "Trabajamos con marcas reconocidas a nivel nacional.",
  },
  {
    icon: "badge-check",
    title: "Productos con garantía",
    text: "Respaldo en cada compra, según las condiciones de cada categoría.",
  },
  {
    icon: "users",
    title: "Variedad para toda la familia",
    text: "Calzado para mujer, hombre y niños en cada etapa.",
  },
  {
    icon: "headset",
    title: "Atención personalizada",
    text: "Te acompañamos por WhatsApp y en nuestros locales.",
  },
] as const;
