import { NextResponse } from "next/server";
import { createPedido } from "@/lib/data/lots-repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lotSlug, cantidad, tipoEnvio, paisDestino, totalUsd, compradorEmail, estado, agenciaReferenteId, agenciaReferenteSlug } = body;

    if (!lotSlug || !cantidad || !tipoEnvio || totalUsd === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let resolvedAgenciaId = agenciaReferenteId as string | undefined;
    if (!resolvedAgenciaId && agenciaReferenteSlug) {
      const { getAgenciaIdBySlug } = await import("@/lib/data/agencia-repository");
      resolvedAgenciaId = (await getAgenciaIdBySlug(agenciaReferenteSlug)) ?? undefined;
    }

    const pedido = await createPedido({
      lotSlug,
      cantidad: Number(cantidad),
      tipoEnvio,
      paisDestino,
      totalUsd: Number(totalUsd),
      compradorEmail,
      estado: estado ?? "pagado",
      agenciaReferenteId: resolvedAgenciaId,
    });

    if (pedido?.id && agenciaReferenteSlug) {
      const { recordReferralEvent } = await import("@/lib/data/agencia-repository");
      await recordReferralEvent({
        agenciaSlug: agenciaReferenteSlug,
        tipo: "pedido",
        loteSlug: lotSlug,
        pedidoId: pedido.id,
      });
    }

    if (!pedido) {
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    return NextResponse.json({ pedido });
  } catch (error) {
    console.error("[api/pedidos]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, estado } = await request.json();
    if (!id || !estado) {
      return NextResponse.json({ error: "id and estado required" }, { status: 400 });
    }

    const { updatePedidoEstado } = await import("@/lib/data/lots-repository");
    const result = await updatePedidoEstado(id, estado);
    if (!result) return NextResponse.json({ error: "Update failed" }, { status: 500 });

    return NextResponse.json({ pedido: result });
  } catch (error) {
    console.error("[api/pedidos PATCH]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
