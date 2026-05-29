import { NextResponse } from "next/server";
import { getProducerDashboard } from "@/lib/data/lots-repository";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  const dashboard = await getProducerDashboard();
  return NextResponse.json({
    dashboard,
    configured: isSupabaseConfigured(),
    fromSupabase: dashboard.fromSupabase,
  });
}
