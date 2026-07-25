# Calzatodos Group — Sitio web (catálogo digital)

Sitio web oficial de **Calzatodos Group**, cadena ecuatoriana de calzado para toda
la familia. Es un **catálogo digital** (no un ecommerce): no tiene carrito, pagos,
ni registro. El objetivo es explorar productos y **convertir por WhatsApp** y en los
locales físicos.

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Estilos:** Tailwind CSS
- **Animaciones:** Framer Motion (discretas, respetan `prefers-reduced-motion`)
- **Validación:** Zod + Server Actions
- **Despliegue:** optimizado para Vercel

CTA principal: **Consultar por WhatsApp** · CTA secundario: **Encontrar una tienda**.

---

## 1. Requisitos

- Node.js 18.18+ (recomendado 20+)
- npm

## 2. Instalación y desarrollo

```bash
npm install
cp .env.example .env.local   # opcional (ver sección Variables de entorno)
npm run dev
```

Abre <http://localhost:3000>.

Scripts disponibles:

| Comando            | Descripción                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Servidor de desarrollo               |
| `npm run build`    | Compilación de producción            |
| `npm run start`    | Sirve la compilación de producción   |
| `npm run lint`     | Linter de Next.js                    |
| `npm run typecheck`| Verifica tipos con TypeScript        |

## 3. Despliegue en Vercel

1. Sube el repositorio a GitHub/GitLab.
2. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
3. Framework detectado: **Next.js** (sin configuración extra).
4. Agrega las **variables de entorno** (sección 4) en *Project Settings → Environment Variables*.
5. **Deploy**.

> Define `NEXT_PUBLIC_SITE_URL` con el dominio final para que el SEO, el sitemap,
> las URLs canónicas y Open Graph sean correctos.

## 4. Variables de entorno

Copia `.env.example` a `.env.local`. Todas son **opcionales** en desarrollo:
si no configuras correo, los formularios funcionan en **modo demostración**
(validan y registran la solicitud en la consola del servidor, sin enviar correo).

| Variable                | Uso                                                            |
| ----------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | URL pública del sitio (SEO, canonical, sitemap, OG).          |
| `RESEND_API_KEY`        | Envío de correo vía [Resend](https://resend.com) (recomendado, sin dependencias). |
| `SMTP_FROM`             | Remitente de los correos.                                     |
| `CONTACT_TO_EMAIL`      | Destinatario del formulario de contacto.                      |
| `WHOLESALE_TO_EMAIL`    | Destinatario del formulario mayorista.                        |
| `SMTP_HOST/PORT/USER/PASSWORD` | Reservadas para SMTP puro (ver nota).                  |

**Correo:** la implementación lista para usar es **Resend** (API HTTP, sin dependencias).
Define `RESEND_API_KEY` y `SMTP_FROM` y listo. Si prefieres **SMTP puro**, instala
`nodemailer` y completa la función `sendViaSmtp` en [`lib/email.ts`](lib/email.ts).
Las claves solo se leen en el servidor; nunca se exponen al navegador.

## 5. Cómo administrar el contenido (sin tocar componentes)

Todo el contenido editable vive en la carpeta [`data/`](data/):

| Archivo                    | Qué contiene                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `data/site-content.ts`     | Nombre, eslogan, **WhatsApp**, correo, redes, barra superior, textos de marca. |
| `data/categories.ts`       | Públicos, categorías, estilos y **mega menús**.                   |
| `data/brands.ts`           | Marcas (internacionales y propias) y sus **logos**.               |
| `data/products.ts`         | **Productos** del catálogo (demostración).                        |
| `data/promotions.ts`       | **Promociones** (demostración).                                   |
| `data/stores.ts`           | **Locales**: dirección, horario, enlaces de Google Maps.          |
| `data/team.ts`             | Historia, fundador, misión/visión/valores y **equipo**.           |
| `data/faq.ts`              | Preguntas frecuentes.                                             |
| `data/policies.ts`         | Garantía, cambios, términos y privacidad (borradores).            |

### Cambiar el número de WhatsApp

En `data/site-content.ts` → `site.whatsapp.number` (formato internacional sin `+`
ni espacios, p. ej. `593996346715`) y `site.whatsapp.display` (versión legible).
Todos los botones y mensajes prellenados se actualizan solos.

### Agregar o editar un producto

Añade un objeto al arreglo `products` en `data/products.ts`. Campos clave:

- `price` / `previousPrice` son **opcionales**. Sin precio, el sitio muestra
  “Consulta el precio” y oculta el filtro/orden por precio.
- `images` es **opcional**. Vacío = placeholder elegante. Para fotos reales,
  coloca archivos en `public/products/` y referencia p. ej. `"/products/foto.jpg"`.
- No se muestra stock; la disponibilidad queda “sujeta a confirmación en tienda”.

### Actualizar promociones

Edita `data/promotions.ts`. Las promociones vencidas (`endDate` pasado) se muestran
como **finalizadas** (`expiredBehavior: "keep"`) o se **ocultan** (`"auto"`).

### Actualizar locales / Google Maps

Edita `data/stores.ts`. Los botones “Cómo llegar” y el mapa se generan a partir de
`mapsQuery` (búsqueda por dirección). Cuando tengas los enlaces o coordenadas
oficiales, actualiza `mapsQuery` o agrega `lat`/`lng`. El estado **abierto/cerrado**
se calcula con `opensAt`, `closesAt` y `days` (zona horaria de Ecuador).

## 6. Imágenes y logos

- **Logo de la empresa:** `public/logo/calzatodos-group.png` (reemplázalo con el
  mismo nombre para actualizarlo en todo el sitio).
- **Logos de marca:** `public/brands/` (referenciados en `data/brands.ts`).
  _Weinbrenner_ y _Kaloa_ están **pendientes de logo** y muestran un placeholder.
- **Fotos de producto:** `public/products/` (ver arriba).
- **Fotos del equipo:** `public/team/` + campo `photo` en `data/team.ts`.

## 7. SEO

- Metadata única por página, Open Graph y Twitter Cards.
- `app/sitemap.ts` y `app/robots.ts` (incluye productos y marcas).
- Datos estructurados Schema.org: `Organization`, `LocalBusiness`/`ShoeStore`,
  `Product`+`Offer`, `BreadcrumbList`, `FAQPage` (en `lib/seo.tsx`).

## 8. Estructura del proyecto

```
app/            Rutas (App Router): home, categorías, catálogo, producto,
                marcas, mayoristas, tiendas, nosotros, contacto, políticas…
  actions.ts    Server Actions de los formularios (contacto y mayoristas).
components/     Componentes reutilizables (layout, catálogo, formularios…).
data/           CONTENIDO EDITABLE (ver sección 5).
lib/            Utilidades: WhatsApp, SEO, validación, correo, horarios.
public/         Imágenes y logos.
```

## 9. Notas importantes

- **No** hay carrito, checkout ni pagos: es un catálogo con conversión por WhatsApp.
- Los **productos y promociones son de demostración**; reemplázalos antes del
  lanzamiento. No representan modelos, precios ni inventario reales de las marcas.
- Las **políticas** son borradores editables **pendientes de revisión legal** en Ecuador.
- La marca **My Athletic** se incluyó como marca propia a partir del logo entregado.

---

Desarrollado para Calzatodos Group.
