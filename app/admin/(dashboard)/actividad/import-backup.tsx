"use client";

import { useActionState } from "react";
import { importBackupAction, type FormState } from "../../actions";

export function ImportBackup() {
  const [state, action, pending] = useActionState<FormState, FormData>(importBackupAction, {
    ok: true,
  });
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm("¿Reemplazar el catálogo actual por este respaldo?")) e.preventDefault();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <input
        type="file"
        name="file"
        accept="application/json,.json"
        required
        className="text-sm file:mr-3 file:rounded-md file:border file:border-neutral-700 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-sm file:text-neutral-200"
      />
      <button
        disabled={pending}
        className="rounded-md border border-neutral-700 px-4 py-1.5 text-sm hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Restaurando…" : "Restaurar"}
      </button>
      {state.message && <p className="w-full text-sm text-red-400">{state.message}</p>}
    </form>
  );
}
