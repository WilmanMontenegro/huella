import { DEFAULT_PRODUCTOR_ID, LOT_PHOTO_PLACEHOLDER } from "@/lib/constants/productor";
import {
  mapLotSummary,
  mapProducerDashboard,
  mapProductor,
  type DbLote,
  type DbProductor,
  type DbTrazabilidad,
} from "@/lib/supabase/mappers";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { LotSummary, ProducerDashboard } from "@/types";

export interface ProductorProfile {
  id: string;
  name: string;
  fullName: string;
  fincaNombre: string;
  municipio: string;
  defaultProducto: string;
  defaultElevacion: string;
}

function startOfCurrentMonthIso(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

async function fetchMonthlySalesUsd(
  supabase: NonNullable<Awaited<ReturnType<typeof createClientIfConfigured>>>,
  productorId: string,
  fallbackUsd: number
): Promise<number> {
  const { data: lotes } = await supabase.from("lotes").select("id").eq("productor_id", productorId);
  if (!lotes?.length) return fallbackUsd;

  const loteIds = lotes.map((l) => l.id);
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("total_usd, estado")
    .in("lote_id", loteIds)
    .gte("created_at", startOfCurrentMonthIso());

  const fromPedidos =
    pedidos?.reduce((sum, p) => {
      if (p.estado === "cancelado") return sum;
      return sum + Number(p.total_usd ?? 0);
    }, 0) ?? 0;

  return fromPedidos > 0 ? fromPedidos : fallbackUsd;
}

function enrichLotSummaries(
  summaries: LotSummary[],
  fotoFallback: string
): LotSummary[] {
  return summaries.map((lot) => ({
    ...lot,
    photoUrl: lot.photoUrl || fotoFallback,
  }));
}

export async function getProductorProfile(
  productorId = DEFAULT_PRODUCTOR_ID
): Promise<ProductorProfile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data: productor } = await supabase
    .from("productores")
    .select("*")
    .eq("id", productorId)
    .maybeSingle();

  if (!productor) return null;

  const row = productor as DbProductor;

  const { data: ultimoLote } = await supabase
    .from("lotes")
    .select("finca_nombre, producto, elevacion")
    .eq("productor_id", productorId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    id: row.id,
    name: row.nombre_corto ?? row.nombre,
    fullName: row.nombre,
    fincaNombre: ultimoLote?.finca_nombre ?? "Finca La Esperanza",
    municipio: row.municipio ?? "Magdalena, Colombia",
    defaultProducto: ultimoLote?.producto ?? "Café",
    defaultElevacion: ultimoLote?.elevacion ?? "1.600 m",
  };
}

export async function getProducerDashboardFromSupabase(
  productorId = DEFAULT_PRODUCTOR_ID
): Promise<ProducerDashboard | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data: productor, error: prodError } = await supabase
    .from("productores")
    .select("*")
    .eq("id", productorId)
    .maybeSingle();

  if (prodError) {
    console.error("[getProducerDashboard]", prodError);
    return null;
  }

  if (!productor) return null;

  const row = productor as DbProductor;
  const fotoFallback = row.foto_url ?? LOT_PHOTO_PLACEHOLDER;

  const { data: lotes, error: lotesError } = await supabase
    .from("lotes")
    .select("*")
    .eq("productor_id", productorId)
    .order("created_at", { ascending: false });

  if (lotesError) {
    console.error("[getProducerDashboard] lotes", lotesError);
    return null;
  }

  const monthlySalesUsd = await fetchMonthlySalesUsd(
    supabase,
    productorId,
    Number(row.ventas_mes_usd ?? 0)
  );

  if (!lotes?.length) {
    return {
      name: row.nombre_corto ?? row.nombre,
      monthlySalesUsd,
      activeLots: 0,
      lots: [],
    };
  }

  const summaries = await Promise.all(
    (lotes as DbLote[]).map(async (lote) => {
      const { data: traz } = await supabase
        .from("trazabilidad")
        .select("*")
        .eq("lote_id", lote.id)
        .order("orden");
      return mapLotSummary(lote, (traz ?? []) as DbTrazabilidad[]);
    })
  );

  const dashboard = mapProducerDashboard(row, enrichLotSummaries(summaries, fotoFallback));
  return { ...dashboard, monthlySalesUsd };
}

export interface ProductorPedidoRow {
  id: string;
  cantidad: number;
  tipo_envio: string;
  estado: string;
  total_usd: number | null;
  created_at: string;
  lotes?: { slug: string; producto: string | null; finca_nombre: string | null } | null;
}

export async function getPedidosForProductor(
  productorId = DEFAULT_PRODUCTOR_ID,
  limit = 5
): Promise<ProductorPedidoRow[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data: lotes } = await supabase.from("lotes").select("id").eq("productor_id", productorId);
  if (!lotes?.length) return [];

  const loteIds = lotes.map((l) => l.id);
  const { data } = await supabase
    .from("pedidos")
    .select("id, cantidad, tipo_envio, estado, total_usd, created_at, lotes(slug, producto, finca_nombre)")
    .in("lote_id", loteIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as ProductorPedidoRow[];
}

export { mapProductor };
