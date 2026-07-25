import { cn } from "@/lib/utils";

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
