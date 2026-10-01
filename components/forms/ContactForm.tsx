"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type FormState } from "@/app/actions";
import { Field, ConsentField, inputClass } from "./FormField";
import { stores } from "@/data/stores";

const initial: FormState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full !py-3" disabled={pending}>
      {pending ? "Enviando…" : "Enviar mensaje"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initial);
  const errors = state.fieldErrors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-lg font-bold text-green-800">Mensaje enviado</h3>
        <p className="mt-2 text-sm text-green-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form key={state.submissionId ?? 0} action={formAction} className="space-y-4" noValidate>
      {/* Honeypot anti-spam (oculto para humanos) */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">No completar</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700" role="alert">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" name="name" required error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" defaultValue={v.name} className={inputClass(!!errors.name)} />
        </Field>
        <Field label="Correo electrónico" name="email" required error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={v.email} className={inputClass(!!errors.email)} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputClass(!!errors.phone)} />
        </Field>
        <Field label="Local de interés" name="store" error={errors.store}>
          <select id="store" name="store" className={inputClass(!!errors.store)} defaultValue={v.store ?? ""}>
            <option value="">Selecciona un local (opcional)</option>
            {stores.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Mensaje" name="message" required error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={v.message}
          className={inputClass(!!errors.message)}
          placeholder="¿En qué podemos ayudarte?"
        />
      </Field>

      <ConsentField error={errors.consent} defaultChecked={v.consent === "on"} />

      <SubmitButton />
    </form>
  );
}
