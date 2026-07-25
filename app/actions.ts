"use server";

import { headers } from "next/headers";
import { contactSchema, wholesaleSchema } from "@/lib/schemas";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
  // Errores por campo (para mostrar junto a cada input).
  fieldErrors?: Record<string, string>;
}

async function clientKey(prefix: string): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "anon";
  return `${prefix}:${ip}`;
}

// ---------------- Contacto general ----------------
export async function submitContact(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  // Honeypot: si "company" viene con contenido, es probablemente un bot.
  if (raw.company) {
    return { status: "success", message: "Gracias por tu mensaje." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Revisa los campos marcados e inténtalo de nuevo.",
      fieldErrors,
    };
  }

  const limited = rateLimit({ key: await clientKey("contact"), limit: 5, windowMs: 60_000 });
  if (!limited.allowed) {
    return {
      status: "error",
      message: `Demasiadas solicitudes. Inténtalo de nuevo en ${limited.retryAfter}s.`,
    };
  }

  const d = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL || "calzatodos@hotmail.com";
  const result = await sendEmail({
    to,
    replyTo: d.email,
    subject: `Nuevo mensaje de contacto — ${d.name}`,
    text: [
      `Nombre: ${d.name}`,
      `Correo: ${d.email}`,
      `Teléfono: ${d.phone || "-"}`,
      `Local de interés: ${d.store || "-"}`,
      "",
      "Mensaje:",
      d.message,
    ].join("\n"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "No pudimos enviar tu mensaje en este momento. Intenta por WhatsApp o vuelve a intentarlo.",
    };
  }

  return {
    status: "success",
    message: "¡Gracias! Recibimos tu mensaje y te responderemos pronto.",
  };
}

// ---------------- Mayoristas ----------------
export async function submitWholesale(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  if (raw.company) {
    return { status: "success", message: "Gracias por tu solicitud." };
  }

  const parsed = wholesaleSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Revisa los campos marcados e inténtalo de nuevo.",
      fieldErrors,
    };
  }

  const limited = rateLimit({ key: await clientKey("wholesale"), limit: 5, windowMs: 60_000 });
  if (!limited.allowed) {
    return {
      status: "error",
      message: `Demasiadas solicitudes. Inténtalo de nuevo en ${limited.retryAfter}s.`,
    };
  }

  const d = parsed.data;
  const to = process.env.WHOLESALE_TO_EMAIL || "calzatodos@hotmail.com";
  const result = await sendEmail({
    to,
    replyTo: d.email,
    subject: `Solicitud mayorista — ${d.businessName} (${d.city})`,
    text: [
      `Nombre: ${d.fullName}`,
      `Negocio: ${d.businessName}`,
      `Ciudad: ${d.city}`,
      `Provincia: ${d.province}`,
      `Teléfono: ${d.phone}`,
      `Correo: ${d.email}`,
      `Tipo de negocio: ${d.businessType}`,
      `Cantidad aproximada: ${d.quantity || "-"}`,
      `Marcas/categorías de interés: ${d.interests || "-"}`,
      "",
      "Mensaje:",
      d.message || "-",
    ].join("\n"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message:
        "No pudimos enviar tu solicitud en este momento. Intenta por WhatsApp o vuelve a intentarlo.",
    };
  }

  return {
    status: "success",
    message: "¡Gracias! Recibimos tu solicitud mayorista y te contactaremos pronto.",
  };
}
