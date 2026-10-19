// Plantilla HTML para los correos que llegan desde los formularios.
// Todo en línea y con tablas: así se ve bien en Gmail, Outlook/Hotmail y el celular.

import "server-only";
import { absoluteUrl } from "@/lib/utils";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// "0991234567" -> "593991234567" para el enlace de WhatsApp.
function waNumber(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = `593${d.slice(1)}`;
  return d.length >= 9 ? d : null;
}

export function renderFormEmail(opts: {
  badge: string; // "Nuevo mensaje de contacto"
  title: string; // nombre de quien escribe / negocio
  fields: [string, string | undefined][];
  message?: string;
  replyEmail: string;
  phone?: string;
  footer: string;
}): string {
  const rows = opts.fields
    .filter(([, v]) => v && v.trim() && v !== "-")
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#777;font-size:13px;width:38%;vertical-align:top">${esc(k)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;font-weight:600">${esc(v!)}</td>
      </tr>`
    )
    .join("");

  const wa = opts.phone ? waNumber(opts.phone) : null;
  const btn = (href: string, label: string, bg: string) =>
    `<a href="${esc(href)}" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 20px;border-radius:999px;background:${bg};color:#fff;font-size:14px;font-weight:700;text-decoration:none">${label}</a>`;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f3f4;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f4;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#111;padding:20px 28px" align="left">
          <img src="${absoluteUrl("/logo/calzatodos-group.png")}" width="140" alt="Calzatodos Group" style="display:block;border:0">
        </td></tr>
        <tr><td style="height:4px;background:#dc2626;line-height:4px;font-size:0">&nbsp;</td></tr>
        <tr><td style="padding:28px">
          <p style="margin:0 0 6px;color:#dc2626;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${esc(opts.badge)}</p>
          <h1 style="margin:0 0 20px;color:#111;font-size:24px;line-height:1.25">${esc(opts.title)}</h1>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          ${
            opts.message
              ? `<p style="margin:24px 0 8px;color:#777;font-size:13px">Mensaje</p>
          <div style="background:#f7f7f8;border-left:4px solid #dc2626;border-radius:8px;padding:16px;color:#111;font-size:15px;line-height:1.55;white-space:pre-wrap">${esc(opts.message)}</div>`
              : ""
          }
          <div style="margin-top:24px">
            ${btn(`mailto:${opts.replyEmail}`, "Responder por correo", "#111")}
            ${wa ? btn(`https://wa.me/${wa}`, "Escribir por WhatsApp", "#16a34a") : ""}
          </div>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#fafafa;color:#999;font-size:11px;line-height:1.5">
          ${esc(opts.footer)}<br>Enviado desde el formulario de calzatodos.com
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Confirmación automática para la persona que llenó el formulario.
export function renderConfirmationEmail(opts: {
  name: string;
  intro: string; // "Recibimos tu mensaje…"
  message?: string;
  whatsappUrl: string;
}): string {
  const first = opts.name.trim().split(/\s+/)[0] || opts.name;
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f3f4;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f4;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
        <tr><td style="background:#111;padding:20px 28px">
          <img src="${absoluteUrl("/logo/calzatodos-group.png")}" width="140" alt="Calzatodos Group" style="display:block;border:0">
        </td></tr>
        <tr><td style="height:4px;background:#dc2626;line-height:4px;font-size:0">&nbsp;</td></tr>
        <tr><td style="padding:28px;color:#111">
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25">¡Hola, ${esc(first)}! 👋</h1>
          <p style="margin:0 0 14px;font-size:15px;line-height:1.6">${esc(opts.intro)}</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Un asesor de <strong>Calzatodos Group</strong> te contactará muy pronto. Si es urgente, escríbenos por WhatsApp y te atendemos al instante.</p>
          ${
            opts.message
              ? `<p style="margin:0 0 8px;color:#777;font-size:13px">Tu mensaje</p>
          <div style="background:#f7f7f8;border-left:4px solid #dc2626;border-radius:8px;padding:16px;font-size:14px;line-height:1.55;white-space:pre-wrap;color:#333">${esc(opts.message)}</div>`
              : ""
          }
          <div style="margin-top:24px">
            <a href="${esc(opts.whatsappUrl)}" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 20px;border-radius:999px;background:#16a34a;color:#fff;font-size:14px;font-weight:700;text-decoration:none">Escribir por WhatsApp</a>
            <a href="${absoluteUrl("/catalogo")}" style="display:inline-block;margin:4px 6px 4px 0;padding:12px 20px;border-radius:999px;background:#111;color:#fff;font-size:14px;font-weight:700;text-decoration:none">Ver catálogo</a>
          </div>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.6">Gracias por confiar en nosotros,<br><strong>Equipo Calzatodos Group</strong></p>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#fafafa;color:#999;font-size:11px;line-height:1.5">
          Recibiste este correo porque escribiste en calzatodos.com. Es una respuesta automática; si respondes a este correo, también nos llega.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
