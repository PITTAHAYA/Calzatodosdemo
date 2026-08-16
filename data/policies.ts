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
  updated?: string;
  sections: PolicySection[];
  note?: string;
}

// Fecha de última revisión de los documentos legales.
const UPDATED = "16 de agosto de 2026";

const DRAFT_NOTICE =
  "Este documento se rige por la legislación de la República del Ecuador. Tiene carácter informativo y no sustituye la asesoría legal para casos particulares.";

// Nota que se muestra al pie de cada documento legal.
const LEGAL_NOTE =
  "Calzatodos Group es un nombre comercial. Para efectos formales debe constar la razón social, el RUC y el domicilio legal de la compañía titular. Este documento describe prácticas generales conforme a la normativa ecuatoriana vigente y puede actualizarse en cualquier momento; rige la versión publicada en este sitio.";

export const policies: Record<string, PolicyDoc> = {
  garantia: {
    slug: "garantia",
    title: "Garantía",
    updated: UPDATED,
    intro:
      "En Calzatodos Group respaldamos la calidad de nuestros productos y reconocemos la garantía que la Ley Orgánica de Defensa del Consumidor establece a favor de los consumidores. " +
      DRAFT_NOTICE,
    note: LEGAL_NOTE,
    sections: [
      {
        heading: "Cobertura",
        paragraphs: [
          "Nuestros productos cuentan con garantía por defectos de fabricación, sujeta a las condiciones específicas de cada categoría de calzado, conforme a la Ley Orgánica de Defensa del Consumidor.",
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
    updated: UPDATED,
    intro:
      "Queremos que encuentres el calzado ideal. Nuestra política de cambios se aplica sin perjuicio de los derechos que la Ley Orgánica de Defensa del Consumidor reconoce a los consumidores. " +
      DRAFT_NOTICE,
    note: LEGAL_NOTE,
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
    updated: UPDATED,
    intro:
      "El acceso y uso de este sitio, operado por Calzatodos Group, implican la aceptación plena de estos Términos y Condiciones. Si no estás de acuerdo con ellos, te pedimos abstenerte de utilizar el sitio. " +
      DRAFT_NOTICE,
    note: LEGAL_NOTE,
    sections: [
      {
        heading: "1. Identificación del titular",
        paragraphs: [
          "Este sitio pertenece a Calzatodos Group (nombre comercial), cadena ecuatoriana de comercialización de calzado con locales físicos en el Ecuador. Puedes contactarnos por WhatsApp al +593 99 634 6715 o al correo calzatodos@hotmail.com para cualquier asunto relacionado con estos términos.",
        ],
      },
      {
        heading: "2. Naturaleza del sitio: catálogo, no tienda en línea",
        paragraphs: [
          "Este sitio es un catálogo digital de carácter informativo. No es una tienda en línea: no procesa pagos, no gestiona pedidos ni realiza ventas electrónicas a través de la web. Las consultas y compras se coordinan por WhatsApp o directamente en nuestros locales.",
          "La relación de compraventa se perfecciona únicamente en el local o por el canal expresamente acordado con el cliente, momento en el que se confirman producto, precio, disponibilidad y condiciones aplicables.",
        ],
      },
      {
        heading: "3. Aceptación y capacidad para contratar",
        paragraphs: [
          "Al utilizar este sitio declaras ser mayor de edad y contar con la capacidad legal para contratar conforme al Código Civil ecuatoriano. Si actúas en representación de un negocio (por ejemplo, como mayorista), declaras estar autorizado para ello.",
        ],
      },
      {
        heading: "4. Información de productos, precios y disponibilidad",
        paragraphs: [
          "Las imágenes, descripciones, precios y promociones se muestran con fines referenciales y pueden cambiar sin previo aviso. Los precios se expresan en dólares de los Estados Unidos de América (USD). La disponibilidad de tallas, colores y modelos está sujeta a existencias y a confirmación en tienda.",
          "En cumplimiento de la Ley Orgánica de Defensa del Consumidor, la información y publicidad de este sitio busca ser veraz y no inducir a error. En caso de un error tipográfico o de precio manifiestamente evidente, te lo informaremos y confirmaremos las condiciones correctas antes de concretar cualquier transacción.",
        ],
      },
      {
        heading: "5. Promociones y ofertas",
        paragraphs: [
          "Las promociones, descuentos y liquidaciones pueden estar sujetos a vigencia, stock limitado y condiciones particulares que se informarán en cada caso. Los productos adquiridos bajo estas condiciones pueden tener políticas específicas de cambio o devolución.",
        ],
      },
      {
        heading: "6. Derechos del consumidor",
        paragraphs: [
          "Reconocemos y respetamos los derechos que la Ley Orgánica de Defensa del Consumidor reconoce a nuestros clientes, entre ellos el derecho a información clara y veraz, a un trato equitativo y no discriminatorio, a la protección frente a publicidad engañosa y a la garantía de los bienes.",
          "Si tienes un reclamo, escríbenos por nuestros canales de contacto para atenderlo. Sin perjuicio de ello, puedes acudir a la Defensoría del Pueblo del Ecuador o a la autoridad competente en materia de protección al consumidor.",
        ],
      },
      {
        heading: "7. Uso permitido del sitio",
        paragraphs: [
          "Te comprometes a usar el sitio de forma lícita. Queda prohibido intentar vulnerar su seguridad, introducir código malicioso, realizar extracción masiva o automatizada de contenidos, o cualquier uso que afecte su funcionamiento o infrinja derechos de terceros.",
        ],
      },
      {
        heading: "8. Propiedad intelectual",
        paragraphs: [
          "El nombre comercial Calzatodos Group, su logotipo y los contenidos propios del sitio están protegidos por la normativa de propiedad intelectual del Ecuador, en particular el Código Orgánico de la Economía Social de los Conocimientos, Creatividad e Innovación (Código Ingenios).",
          "Las marcas, logotipos y demás signos de terceros pertenecen a sus respectivos titulares y se muestran con fines informativos y de distribución autorizada. Queda prohibida su reproducción, copia o uso sin autorización de los titulares correspondientes.",
        ],
      },
      {
        heading: "9. Enlaces y servicios de terceros",
        paragraphs: [
          "El sitio puede incluir enlaces o integraciones con servicios de terceros (WhatsApp, redes sociales, mapas, entre otros). No somos responsables por el contenido, disponibilidad ni por las políticas de dichos servicios, que se rigen por sus propios términos.",
        ],
      },
      {
        heading: "10. Comunicaciones y validez de los mensajes de datos",
        paragraphs: [
          "Las comunicaciones que mantengamos contigo por WhatsApp, formularios o correo electrónico tienen validez y eficacia jurídica como mensajes de datos, conforme a la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos.",
        ],
      },
      {
        heading: "11. Limitación de responsabilidad",
        paragraphs: [
          "El sitio se ofrece “tal cual” y con la información disponible al momento de su publicación. No garantizamos que esté libre de errores ni que su acceso sea ininterrumpido. En la medida permitida por la ley, no seremos responsables por daños indirectos derivados del uso del sitio.",
          "Nada de lo anterior excluye ni limita la responsabilidad que la legislación ecuatoriana no permita excluir, en especial frente a los consumidores.",
        ],
      },
      {
        heading: "12. Protección de datos personales",
        paragraphs: [
          "El tratamiento de tus datos personales se rige por nuestra Política de Privacidad y por la Ley Orgánica de Protección de Datos Personales (LOPDP). Te recomendamos revisarla para conocer cómo cuidamos tu información y cuáles son tus derechos.",
        ],
      },
      {
        heading: "13. Modificaciones",
        paragraphs: [
          "Podemos actualizar estos Términos y Condiciones en cualquier momento. La versión vigente es la publicada en este sitio, con su respectiva fecha de última actualización. El uso continuado del sitio tras una actualización implica la aceptación de los cambios.",
        ],
      },
      {
        heading: "14. Legislación aplicable y solución de controversias",
        paragraphs: [
          "Estos términos se rigen por las leyes de la República del Ecuador. Cualquier controversia se procurará resolver de buena fe a través de nuestros canales de atención y, de ser aplicable, mediante métodos alternativos como la mediación. A falta de acuerdo, las partes se someten a los jueces y tribunales competentes del Ecuador, respetando el fuero que la ley reconoce al consumidor.",
        ],
      },
      {
        heading: "15. Contacto",
        paragraphs: [
          "Para consultas sobre estos Términos y Condiciones, escríbenos por WhatsApp al +593 99 634 6715 o al correo calzatodos@hotmail.com.",
        ],
      },
    ],
  },

  "politica-de-privacidad": {
    slug: "politica-de-privacidad",
    title: "Política de privacidad",
    updated: UPDATED,
    intro:
      "En Calzatodos Group protegemos tus datos personales y tratamos tu información conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador y su reglamento. " +
      DRAFT_NOTICE,
    note: LEGAL_NOTE,
    sections: [
      {
        heading: "1. Responsable del tratamiento",
        paragraphs: [
          "El responsable del tratamiento de tus datos personales es Calzatodos Group (nombre comercial). Puedes contactarnos para cualquier asunto de privacidad por WhatsApp al +593 99 634 6715 o al correo calzatodos@hotmail.com.",
        ],
      },
      {
        heading: "2. Qué datos recopilamos",
        paragraphs: [
          "Recopilamos únicamente los datos necesarios para atenderte:",
        ],
        bullets: [
          "Datos de identificación y contacto que nos proporcionas: nombre, teléfono, correo electrónico y ciudad.",
          "El contenido de tu consulta, mensaje o solicitud (por ejemplo, en formularios de contacto o mayoristas).",
          "Datos técnicos básicos de navegación que puedan generarse al usar el sitio, cuando aplique.",
        ],
      },
      {
        heading: "3. Datos sensibles",
        paragraphs: [
          "No solicitamos datos sensibles (como los relativos a salud, origen étnico, religión, afiliación política o datos biométricos). Te pedimos no incluir este tipo de información en tus mensajes.",
        ],
      },
      {
        heading: "4. Finalidades del tratamiento",
        paragraphs: ["Tratamos tus datos para las siguientes finalidades:"],
        bullets: [
          "Responder tus consultas y brindarte atención personalizada.",
          "Gestionar solicitudes comerciales y de mayoristas.",
          "Coordinar la compra, disponibilidad y entrega de productos por los canales acordados.",
          "Cumplir obligaciones legales, contables y tributarias aplicables.",
          "Mejorar nuestros productos, atención y comunicación (cuando corresponda y de forma proporcional).",
        ],
      },
      {
        heading: "5. Base de licitud (legitimación)",
        paragraphs: [
          "Tratamos tus datos con fundamento en una o más de las bases que reconoce el artículo 7 de la LOPDP, según el caso: tu consentimiento, la ejecución de medidas precontractuales o de una relación comercial a tu solicitud, el cumplimiento de una obligación legal y el interés legítimo, siempre respetando tus derechos.",
        ],
      },
      {
        heading: "6. Consentimiento",
        paragraphs: [
          "Cuando envías un formulario o nos contactas de forma voluntaria, consientes el tratamiento de tus datos para las finalidades descritas en esta política. Puedes retirar tu consentimiento en cualquier momento, sin que ello afecte la licitud del tratamiento previo.",
        ],
      },
      {
        heading: "7. Plazo de conservación",
        paragraphs: [
          "Conservamos tus datos durante el tiempo necesario para cumplir la finalidad para la que fueron recabados y para atender obligaciones legales, contables o tributarias. Cumplido ese plazo, los eliminamos o los anonimizamos de forma segura.",
        ],
      },
      {
        heading: "8. Con quién compartimos tus datos",
        paragraphs: [
          "No vendemos tus datos personales. Podemos compartirlos con proveedores que actúan como encargados del tratamiento y nos prestan servicios (por ejemplo, plataformas de mensajería como WhatsApp/Meta, correo electrónico o alojamiento web), quienes solo pueden tratarlos siguiendo nuestras instrucciones.",
          "Algunos de estos servicios pueden implicar transferencias internacionales de datos. En esos casos procuramos que existan garantías adecuadas conforme a la LOPDP. Al comunicarte por WhatsApp o redes sociales, tu información también se rige por las políticas de dichas plataformas.",
        ],
      },
      {
        heading: "9. Tus derechos",
        paragraphs: [
          "Como titular de los datos, la LOPDP te reconoce los siguientes derechos, que puedes ejercer de forma gratuita:",
        ],
        bullets: [
          "Acceso: saber qué datos tuyos tratamos y cómo.",
          "Rectificación y actualización: corregir datos inexactos o desactualizados.",
          "Eliminación (supresión): solicitar que borremos tus datos cuando proceda.",
          "Oposición: oponerte a determinados tratamientos.",
          "Portabilidad: recibir tus datos en un formato estructurado.",
          "Limitación del tratamiento y a no ser objeto de decisiones automatizadas que produzcan efectos jurídicos sobre ti.",
        ],
      },
      {
        heading: "10. Cómo ejercer tus derechos",
        paragraphs: [
          "Para ejercer cualquiera de estos derechos, escríbenos por WhatsApp al +593 99 634 6715 o al correo calzatodos@hotmail.com, indicando tu solicitud. Podremos pedirte información que acredite tu identidad. Atenderemos tu petición sin dilación y dentro de los plazos que establece la LOPDP y su reglamento.",
        ],
      },
      {
        heading: "11. Seguridad de la información",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a pérdida, acceso no autorizado, alteración o divulgación indebida, en función del estado de la técnica y del riesgo del tratamiento.",
        ],
      },
      {
        heading: "12. Vulneraciones de seguridad",
        paragraphs: [
          "En caso de una vulneración de la seguridad de los datos personales que suponga un riesgo para tus derechos, notificaremos a la autoridad de control y, cuando corresponda, a las personas afectadas, en los términos previstos por la LOPDP.",
        ],
      },
      {
        heading: "13. Datos de niñas, niños y adolescentes",
        paragraphs: [
          "Este sitio no está dirigido a menores de edad ni buscamos recopilar sus datos. Si un menor nos proporciona información, esta debe contar con la autorización de su representante legal; de lo contrario, procederemos a eliminarla.",
        ],
      },
      {
        heading: "14. Cookies y tecnologías similares",
        paragraphs: [
          "El sitio utiliza únicamente las cookies o tecnologías necesarias para su funcionamiento básico. Si en el futuro incorporamos herramientas de analítica o medición, lo informaremos y, cuando la ley lo requiera, solicitaremos tu consentimiento. Puedes gestionar o bloquear las cookies desde la configuración de tu navegador.",
        ],
      },
      {
        heading: "15. Autoridad de control",
        paragraphs: [
          "Si consideras que el tratamiento de tus datos no se ajusta a la normativa, tienes derecho a presentar un reclamo ante la Superintendencia de Protección de Datos Personales del Ecuador, sin perjuicio de contactarnos previamente para resolver tu inquietud.",
        ],
      },
      {
        heading: "16. Cambios a esta política",
        paragraphs: [
          "Podemos actualizar esta Política de Privacidad para reflejar cambios legales u operativos. Publicaremos la versión vigente en este sitio con su fecha de última actualización.",
        ],
      },
    ],
  },
};

export function getPolicy(slug: string): PolicyDoc | undefined {
  return policies[slug];
}
