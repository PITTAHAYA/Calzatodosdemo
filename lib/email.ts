// =========================================================================
// Envío de correo (SOLO servidor)
// -------------------------------------------------------------------------
// Estrategia sin dependencias adicionales:
//   1. Si existe RESEND_API_KEY -> envía vía la API HTTP de Resend (fetch).
//   2. Si NO hay proveedor configurado -> "modo demostración": registra la
//      solicitud en la consola del servidor y devuelve éxito (ideal en local).
//
// SMTP: si prefieres SMTP puro (variables SMTP_* del .env.example), instala
// "nodemailer" y reemplaza la función sendViaSmtp con tu transporte. Se deja
// preparado el punto de extensión abajo.
// =========================================================================

import "server-only";

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

type SendResult = { ok: true; mode: "resend" | "demo" } | { ok: false; error: string };

export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.SMTP_FROM || "Calzatodos Group <no-reply@calzatodos.com>";

  // --- Opción 1: Resend (HTTP, sin dependencias) ---
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [payload.to],
          subject: payload.subject,
          text: payload.text,
          reply_to: payload.replyTo,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        return { ok: false, error: `Resend error ${res.status}: ${detail}` };
      }
      return { ok: true, mode: "resend" };
    } catch (err) {
      return { ok: false, error: `Resend request failed: ${String(err)}` };
    }
  }

  // --- Opción 2: modo demostración (sin proveedor configurado) ---
  // No falla el formulario en desarrollo; deja constancia en el servidor.
  console.info(
    "\n[Calzatodos Group] Formulario recibido (modo demostración — sin proveedor de correo configurado):\n" +
      `  Para:     ${payload.to}\n` +
      `  Asunto:   ${payload.subject}\n` +
      `  Responder: ${payload.replyTo ?? "-"}\n` +
      `  Mensaje:\n${payload.text}\n`
  );
  return { ok: true, mode: "demo" };
}
