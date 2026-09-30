// Descarga un respaldo (.json) con todos los cambios hechos desde el panel.
// Se puede volver a cargar desde /admin/actividad si algo sale mal.
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getOverrides } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const overrides = await getOverrides();
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  return new NextResponse(
    JSON.stringify({ app: "calzatodos-admin", version: 1, exportedAt: new Date().toISOString(), exportedBy: user, overrides }, null, 2),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="calzatodos-respaldo-${stamp}.json"`,
        "Cache-Control": "no-store",
      },
    }
  );
}
