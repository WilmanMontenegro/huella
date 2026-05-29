import { NextResponse } from "next/server";
import { getProductorProfile } from "@/lib/data/lots-repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no configurado", configured: false },
      { status: 503 }
    );
  }

  const profile = await getProductorProfile();
  if (!profile) {
    return NextResponse.json(
      {
        error: "Productor no encontrado. Ejecuta el seed en Supabase (pnpm db:seed:remote).",
        configured: true,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ profile, configured: true });
}
