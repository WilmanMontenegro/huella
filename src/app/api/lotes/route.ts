import { NextResponse } from "next/server";
import { createLote } from "@/lib/data/lots-repository";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createLote(body);

    if (!result) {
      return NextResponse.json({ error: "Could not create lot" }, { status: 500 });
    }

    return NextResponse.json({ lote: result });
  } catch (error) {
    console.error("[api/lotes]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
