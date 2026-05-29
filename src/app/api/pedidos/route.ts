import { NextResponse } from "next/server";
import { createPedido } from "@/lib/data/lots-repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lotSlug, cantidad, tipoEnvio, paisDestino, totalUsd, compradorEmail } = body;

    if (!lotSlug || !cantidad || !tipoEnvio || totalUsd === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pedido = await createPedido({
      lotSlug,
      cantidad: Number(cantidad),
      tipoEnvio,
      paisDestino,
      totalUsd: Number(totalUsd),
      compradorEmail,
    });

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
