import { NextResponse } from "next/server";
import { recordReferralEvent } from "@/lib/data/agencia-repository";

export async function POST(request: Request) {
  try {
    const { agenciaSlug, tipo, loteSlug } = await request.json();
    if (!agenciaSlug || !tipo) {
      return NextResponse.json({ error: "agenciaSlug and tipo required" }, { status: 400 });
    }
    if (tipo !== "escaneo" && tipo !== "pedido") {
      return NextResponse.json({ error: "invalid tipo" }, { status: 400 });
    }

    await recordReferralEvent({ agenciaSlug, tipo, loteSlug });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/referidos]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
