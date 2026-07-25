// =========================================================================
// POLÍTICAS (BORRADORES) — Calzatodos Group
// -------------------------------------------------------------------------
// Textos INICIALES en lenguaje claro, marcados como borradores editables.
// Deben ser revisados y aprobados legalmente en Ecuador antes de publicarse
// como definitivos. NO constituyen asesoría legal.
// =========================================================================

export interface PolicySection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface PolicyDoc {
  slug: string;
  title: string;
  intro: string;
  sections: PolicySection[];
}

const DRAFT_NOTICE =
  "Este documento es un borrador inicial, editable y pendiente de revisión y aprobación legal en Ecuador. No constituye asesoría legal definitiva.";

export const policies: Record<string, PolicyDoc> = {
  garantia: {
    slug: "garantia",
    title: "Garantía",
    intro:
      "En Calzatodos Group respaldamos la calidad de nuestros productos. " +
      DRAFT_NOTICE,
    sections: [
      {
        heading: "Cobertura",
        paragraphs: [
          "Nuestros productos cuentan con garantía por defectos de fabricación, sujeta a las condiciones específicas de cada categoría de calzado.",
        ],
      },
      {
        heading: "Qué cubre",
        paragraphs: ["La garantía puede cubrir, de forma general:"],
        bullets: [
          "Defectos de materiales o de fabricación no derivados del uso normal.",
          "Fallas de componentes bajo condiciones de uso adecuadas.",
        ],
      },
      {
        heading: "Qué no cubre",
        paragraphs: ["De manera general, la garantía no cubre:"],
        bullets: [
          "Desgaste natural por el uso.",
          "Daños por mal uso, humedad excesiva o productos químicos.",
          "Modificaciones o reparaciones ajenas a la marca.",
        ],
      },
      {
        heading: "Cómo hacer válida la garantía",
        paragraphs: [
          "Acércate al local de compra con el producto y el comprobante correspondiente, o escríbenos por WhatsApp para orientarte. Cada caso se evalúa según las condiciones de la categoría.",
        ],
      },
    ],
  },

  "cambios-y-devoluciones": {
    slug: "cambios-y-devoluciones",
    title: "Cambios y devoluciones",
    intro:
      "Queremos que encuentres el calzado ideal. " + DRAFT_NOTICE,
    sections: [
      {
        heading: "Cambios",
        paragraphs: [
          "Los cambios están sujetos a la política vigente y a las condiciones del producto. En términos generales, el producto debe estar sin uso, en buen estado y con su empaque original.",
        ],
      },
      {
        heading: "Plazos",
        paragraphs: [
          "El plazo para solicitar un cambio puede variar según la categoría y la promoción aplicada. Confirma el plazo vigente en tu local de compra o por WhatsApp.",
        ],
      },
      {
        heading: "Productos en promoción",
        paragraphs: [
          "Los productos adquiridos en promoción o liquidación pueden tener condiciones particulares de cambio. Consulta los términos de cada promoción.",
        ],
      },
      {
        heading: "Cómo solicitarlo",
        paragraphs: [
          "Acércate al local de compra con el producto y el comprobante, o escríbenos por WhatsApp para orientarte en el proceso.",
        ],
      },
    ],
  },

  "terminos-y-condiciones": {
    slug: "terminos-y-condiciones",
    title: "Términos y condiciones",
    intro:
      "El uso de este sitio implica la aceptación de los siguientes términos. " +
      DRAFT_NOTICE,
    sections: [
      {
        heading: "Naturaleza del sitio",
        paragraphs: [
          "Este sitio es un catálogo digital informativo. No es una tienda en línea: no procesa pagos ni gestiona pedidos en línea. Las consultas y compras se coordinan por WhatsApp o directamente en nuestros locales.",
        ],
      },
      {
        heading: "Información de productos y precios",
        paragraphs: [
          "La información de productos, imágenes, precios y promociones es referencial y puede cambiar sin previo aviso. La disponibilidad está sujeta a confirmación en tienda.",
        ],
      },
      {
        heading: "Propiedad intelectual",
        paragraphs: [
          "Las marcas, logotipos y contenidos mostrados pertenecen a sus respectivos titulares. Las marcas de terceros se presentan con fines informativos y de distribución autorizada.",
        ],
      },
      {
        heading: "Contacto",
        paragraphs: [
          "Para consultas sobre estos términos, escríbenos por WhatsApp o al correo indicado en la página de Contacto.",
        ],
      },
    ],
  },

  "politica-de-privacidad": {
    slug: "politica-de-privacidad",
    title: "Política de privacidad",
    intro:
      "Respetamos tu privacidad y cuidamos tus datos. " + DRAFT_NOTICE,
    sections: [
      {
        heading: "Datos que recopilamos",
        paragraphs: [
          "Cuando completas un formulario de contacto o mayorista, recopilamos los datos que nos proporcionas (por ejemplo, nombre, teléfono, correo, ciudad y mensaje) con el fin de responder a tu solicitud.",
        ],
      },
      {
        heading: "Uso de la información",
        paragraphs: [
          "Utilizamos tus datos únicamente para gestionar tu consulta o solicitud comercial. No vendemos ni compartimos tus datos con terceros ajenos a este propósito.",
        ],
      },
      {
        heading: "WhatsApp y redes sociales",
        paragraphs: [
          "Al contactarnos por WhatsApp o redes sociales, tu información se rige también por las políticas de dichas plataformas.",
        ],
      },
      {
        heading: "Tus derechos",
        paragraphs: [
          "Puedes solicitar acceso, rectificación o eliminación de tus datos escribiéndonos por los canales de contacto. Atenderemos tu solicitud conforme a la normativa aplicable en Ecuador.",
        ],
      },
    ],
  },
};

export function getPolicy(slug: string): PolicyDoc | undefined {
  return policies[slug];
}
