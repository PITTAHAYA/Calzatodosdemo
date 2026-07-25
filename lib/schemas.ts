// Esquemas de validación con Zod para los formularios (cliente y servidor).

import { z } from "zod";

// --- Formulario de contacto general ---
export const contactSchema = z.object({
  name: z.string().min(2, "Ingresa tu nombre.").max(120),
  email: z.string().email("Ingresa un correo válido."),
  phone: z
    .string()
    .min(7, "Ingresa un teléfono válido.")
    .max(30)
    .optional()
    .or(z.literal("")),
  store: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(2000),
  // Honeypot anti-spam: debe llegar vacío.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

// --- Formulario mayorista ---
export const wholesaleSchema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre completo.").max(120),
  businessName: z.string().min(2, "Ingresa el nombre de tu negocio.").max(160),
  city: z.string().min(2, "Ingresa tu ciudad.").max(80),
  province: z.string().min(2, "Ingresa tu provincia.").max(80),
  phone: z.string().min(7, "Ingresa un teléfono válido.").max(30),
  email: z.string().email("Ingresa un correo válido."),
  businessType: z.string().min(2, "Indica el tipo de negocio.").max(120),
  quantity: z.string().max(120).optional().or(z.literal("")),
  interests: z.string().max(400).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  // Honeypot anti-spam.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type WholesaleInput = z.infer<typeof wholesaleSchema>;
