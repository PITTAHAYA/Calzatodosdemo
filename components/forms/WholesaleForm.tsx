"use client";

import { useActionState } from "react";
import { Turnstile } from "./Turnstile";
import { useFormStatus } from "react-dom";
import { submitWholesale, type FormState } from "@/app/actions";
import { Field, ConsentField, inputClass } from "./FormField";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappWholesale } from "@/lib/whatsapp";

const initial: FormState = { status: "idle", message: "" };

const PROVINCES = [
  "Azuay", "Bolívar", "Cañar", "Carchi", "Chimborazo", "Cotopaxi", "El Oro",
  "Esmeraldas", "Galápagos", "Guayas", "Imbabura", "Loja", "Los Ríos", "Manabí",
  "Morona Santiago", "Napo", "Orellana", "Pastaza", "Pichincha", "Santa Elena",
  "Santo Domingo de los Tsáchilas", "Sucumbíos", "Tungurahua", "Zamora Chinchipe",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary flex-1 !py-3" disabled={pending}>
      {pending ? "Enviando…" : "Enviar solicitud"}
    </button>
  );
}

export function WholesaleForm() {
  const [state, formAction] = useActionState(submitWholesale, initial);
  const errors = state.fieldErrors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-lg font-bold text-green-800">Solicitud enviada</h3>
        <p className="mt-2 text-sm text-green-700">{state.message}</p>
        <a
          href={whatsappWholesale()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp mt-5"
        >
          <WhatsAppIcon className="h-4 w-4" /> Continuar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form key={state.submissionId ?? 0} action={formAction} className="space-y-4" noValidate>
      <div className="hidden" aria-hidden>
        <label htmlFor="company-w">No completar</label>
        <input id="company-w" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700" role="alert">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre completo" name="fullName" required error={errors.fullName}>
          <input id="fullName" name="fullName" type="text" autoComplete="name" defaultValue={v.fullName} className={inputClass(!!errors.fullName)} />
        </Field>
        <Field label="Nombre del negocio" name="businessName" required error={errors.businessName}>
          <input id="businessName" name="businessName" type="text" autoComplete="organization" defaultValue={v.businessName} className={inputClass(!!errors.businessName)} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ciudad" name="city" required error={errors.city}>
          <input id="city" name="city" type="text" autoComplete="address-level2" defaultValue={v.city} className={inputClass(!!errors.city)} />
        </Field>
        <Field label="Provincia" name="province" required error={errors.province}>
          <select
            id="province"
            name="province"
            autoComplete="address-level1"
            defaultValue={v.province ?? ""}
            className={inputClass(!!errors.province)}
          >
            <option value="">Selecciona tu provincia</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono" name="phone" required error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass(!!errors.phone)} />
        </Field>
        <Field label="Correo electrónico" name="email" required error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} className={inputClass(!!errors.email)} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de negocio" name="businessType" required error={errors.businessType}>
          <input
            id="businessType"
            name="businessType"
            defaultValue={v.businessType}
            type="text"
            placeholder="Ej.: tienda, bazar, distribuidor"
            className={inputClass(!!errors.businessType)}
          />
        </Field>
        <Field label="Cantidad aproximada requerida" name="quantity" error={errors.quantity}>
          <input
            id="quantity"
            name="quantity"
            defaultValue={v.quantity}
            type="text"
            placeholder="Ej.: 50 pares por mes"
            className={inputClass(!!errors.quantity)}
          />
        </Field>
      </div>

      <Field label="Marcas o categorías de interés" name="interests" error={errors.interests}>
        <input
          id="interests"
          name="interests"
          defaultValue={v.interests}
          type="text"
          placeholder="Ej.: infantil, deportivo, North Star…"
          className={inputClass(!!errors.interests)}
        />
      </Field>

      <Field label="Mensaje" name="message" error={errors.message}>
        <textarea id="message" name="message" rows={4} defaultValue={v.message} className={inputClass(!!errors.message)} />
      </Field>

      <ConsentField error={errors.consent} defaultChecked={v.consent === "on"} />

      <Turnstile />

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <SubmitButton />
        <a
          href={whatsappWholesale()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1 !py-3"
        >
          <WhatsAppIcon className="h-5 w-5" /> Hablar por WhatsApp
        </a>
      </div>
    </form>
  );
}
