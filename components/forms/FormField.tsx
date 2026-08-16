import Link from "next/link";
import { cn } from "@/lib/utils";

// Casilla de consentimiento de datos (LOPDP). Requerida para enviar.
export function ConsentField({ error }: { error?: string }) {
  return (
    <div className="rounded-xl border border-graphite-200 bg-graphite-50 p-3.5">
      <label htmlFor="consent" className="flex items-start gap-2.5 text-sm text-graphite-700">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          value="on"
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded border-graphite-300 text-brand-600 accent-brand-600 focus:ring-brand-500",
            error && "ring-2 ring-brand-400"
          )}
        />
        <span>
          He leído y acepto la{" "}
          <Link
            href="/politica-de-privacidad"
            target="_blank"
            className="font-semibold text-brand-700 underline underline-offset-2"
          >
            Política de Privacidad
          </Link>{" "}
          y autorizo el tratamiento de mis datos para atender mi solicitud.
          <span className="text-brand-600"> *</span>
        </span>
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-brand-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Field({
  label,
  name,
  error,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-graphite-800">
        {label}
        {required && <span className="text-brand-600"> *</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-brand-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-500",
    hasError ? "border-brand-400" : "border-graphite-200"
  );
