import Link from "next/link";
import { createProductAction } from "../../../actions";
import { ProductForm } from "../form-client";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Nuevo producto</h1>
          <p className="text-sm text-neutral-400">
            Completa los datos y sube al menos una foto. Se publicará
            inmediatamente en el catálogo.
          </p>
        </div>
        <Link href="/admin" className="text-sm text-neutral-400 hover:text-white">
          ← Volver
        </Link>
      </div>
      <ProductForm
        action={createProductAction}
        submitLabel="Crear producto"
        showSlug
      />
    </div>
  );
}
