// =========================================================================
// EQUIPO — Calzatodos Group
// -------------------------------------------------------------------------
// Cuando existan fotografías reales, agrega la ruta en "photo"
// (/public/team/...). Mientras tanto se muestra un bloque con iniciales.
// No usar fotografías generadas de personas que puedan confundirse con el
// equipo real.
// =========================================================================

export interface TeamMember {
  name: string;
  role: string;
  description?: string;
  photo?: string; // /public/team/...
}

export const founder = {
  name: "Marco Alcides Acuña Herrera",
  role: "Fundador",
  bio:
    "Su conocimiento del mercado, su experiencia de más de 30 años en el sector y su decisión de emprender hicieron posible el crecimiento de la empresa.",
};

export const team: TeamMember[] = [
  {
    name: "Marco Acuña",
    role: "Gerente General",
    description:
      "Lidera la visión y la estrategia de Calzatodos Group, cuidando la calidad y la atención cercana a cada cliente.",
  },
  {
    name: "Alex Acuña",
    role: "Jefe de Compras",
    description:
      "Selecciona marcas y modelos para asegurar variedad y disponibilidad para toda la familia en cada temporada.",
  },
  {
    name: "Marco Alban",
    role: "Administrador Zonal",
    description:
      "Coordina la operación de nuestros locales para brindar una experiencia consistente y un servicio de excelencia.",
  },
];

// Liderazgo mostrado por rol/función (sin nombres) en la página Nosotros.
export interface LeadershipRole {
  role: string;
  icon: string; // nombre de ícono (ver components/Icons.tsx)
  description: string;
}

export const leadership: LeadershipRole[] = [
  {
    role: "Gerencia General",
    icon: "badge-check",
    description:
      "Define la visión y la estrategia de Calzatodos Group, cuidando la calidad, el crecimiento y la atención cercana a cada cliente.",
  },
  {
    role: "Jefatura de Compras",
    icon: "truck",
    description:
      "Selecciona marcas y modelos, y asegura variedad y disponibilidad para toda la familia en cada temporada.",
  },
  {
    role: "Administración Zonal",
    icon: "store",
    description:
      "Coordina la operación de nuestros locales para brindar una experiencia consistente y un servicio de excelencia.",
  },
];

// Contenido institucional editable.
export const about = {
  historyShort:
    "Calzatodos Group reúne más de 30 años de experiencia directa e indirecta en el sector del calzado. Desde su consolidación como empresa en 2015, la marca ha trabajado para ofrecer variedad, calidad y atención cercana a familias y comercios ecuatorianos.",
  historyLong:
    "El negocio nació tras la separación de una sociedad en 2015. Su fundador, con más de 30 años de experiencia directa e indirecta en el sector del calzado, decidió emprender un proyecto propio enfocado en la variedad, la calidad y la atención cercana. Desde entonces, Calzatodos Group se ha consolidado como una cadena presente en varias ciudades del país, atendiendo tanto a familias como a comercios mayoristas.",
  mission:
    "Proporcionamos a nuestros clientes productos de moda que cumplen con exigentes estándares de calidad y precios competitivos. Trabajamos para convertirnos en una de las principales opciones del mercado ecuatoriano, ofreciendo alternativas de compra confiables y una atención cercana.",
  vision:
    "Convertirnos en un referente reconocido del mercado de calzado, proporcionando máxima satisfacción mediante productos y servicios alineados con las tendencias de moda, la calidad y una atención excepcional.",
  values: ["Ética", "Puntualidad", "Creatividad", "Pasión", "Calidad"],
  // Cifra histórica adicional pendiente de confirmación (no mostrar en público
  // hasta validar). Se mantiene aquí como referencia interna.
  pendingHistoryNote:
    "PENDIENTE DE CONFIRMACIÓN: cualquier cifra histórica adicional (p. ej. número exacto de años de operación de la empresa) debe validarse con el cliente antes de publicarse.",
};

// Experiencia comercial mencionada para la sección mayorista.
// Presentar con sobriedad, SIN logotipos sin autorización.
export const wholesaleExperience = {
  intro:
    "A lo largo de su trayectoria, la empresa ha trabajado con cadenas y comercios reconocidos del país.",
  partners: ["De Prati", "Etafashion", "RM", "Súper Éxito"],
};
