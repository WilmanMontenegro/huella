import {
  getCheckoutItem as mockCheckoutItem,
  getExperienceById as mockExperienceById,
  getExperiencesForLot as mockExperiencesForLot,
  getLotById as mockGetLotById,
  getProducerForLot as mockGetProducerForLot,
  demoProducer,
  DEMO_LOT_ID,
} from "@/data/mock/lots";
import { DEFAULT_PRODUCTOR_ID } from "@/lib/constants/productor";
import { getProducerDashboardFromSupabase } from "@/lib/data/productor-repository";
import {
  mapCheckoutItem,
  mapExperiences,
  mapLot,
  mapProductor,
  type DbCertificacion,
  type DbExperiencia,
  type DbExperienciaProveedor,
  type DbLote,
  type DbProductor,
  type DbTrazabilidad,
} from "@/lib/supabase/mappers";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Lot, Producer, ProducerDashboard, TourExperience } from "@/types";

export { DEMO_LOT_ID, isSupabaseConfigured };

async function fetchLoteBySlug(slug: string) {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data: lote, error } = await supabase
    .from("lotes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !lote) return null;
  return lote as DbLote;
}

async function fetchLoteRelations(loteId: string) {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const [trazRes, certRes, expRes] = await Promise.all([
    supabase.from("trazabilidad").select("*").eq("lote_id", loteId).order("orden"),
    supabase.from("certificaciones").select("*").eq("lote_id", loteId),
    supabase.from("experiencias").select("*").eq("lote_id", loteId).order("orden"),
  ]);

  let proveedores: DbExperienciaProveedor[] = [];
  const experiencias = (expRes.data ?? []) as DbExperiencia[];

  if (experiencias.length) {
    const expIds = experiencias.map((e) => e.id);
    const { data: provData } = await supabase
      .from("experiencia_proveedores")
      .select("*, agencias(whatsapp)")
      .in("experiencia_id", expIds);
    proveedores = (provData ?? []) as DbExperienciaProveedor[];
  }

  return {
    trazabilidad: (trazRes.data ?? []) as DbTrazabilidad[],
    certificaciones: (certRes.data ?? []) as DbCertificacion[],
    experiencias: mapExperiences(experiencias, proveedores),
  };
}

export async function getLotById(id: string): Promise<Lot | undefined> {
  if (!isSupabaseConfigured()) return mockGetLotById(id);

  const lote = await fetchLoteBySlug(id);
  if (!lote) return undefined;

  const relations = await fetchLoteRelations(lote.id);
  if (!relations) return undefined;

  return mapLot(lote, relations.trazabilidad, relations.certificaciones, relations.experiencias);
}

export async function getProducerForLot(lot: Lot): Promise<Producer> {
  if (!isSupabaseConfigured()) return mockGetProducerForLot(lot);

  const supabase = await createClientIfConfigured();
  if (!supabase) return mockGetProducerForLot(lot);

  const { data } = await supabase
    .from("productores")
    .select("*")
    .eq("id", lot.producerId)
    .maybeSingle();

  if (!data) {
    return {
      id: lot.producerId,
      name: "Productor",
      photoUrl: "",
      story: "",
      municipality: lot.farmName,
      lat: 0,
      lng: 0,
      yearsOfExperience: 0,
    };
  }
  return mapProductor(data as DbProductor);
}

export async function getExperiencesForLot(lotId: string): Promise<TourExperience[]> {
  const lot = await getLotById(lotId);
  if (!lot) return [];
  return lot.experiences ?? mockExperiencesForLot(lotId);
}

export async function getExperienceById(
  lotId: string,
  experienceId: string
): Promise<TourExperience | undefined> {
  const experiences = await getExperiencesForLot(lotId);
  const found = experiences.find((e) => e.id === experienceId);
  if (found) return found;
  return mockExperienceById(lotId, experienceId);
}

export async function getCheckoutItem(lotId: string) {
  const lot = await getLotById(lotId);
  if (!lot) return mockCheckoutItem(lotId);
  return mapCheckoutItem(lot);
}

export async function getProducerDashboard(
  productorId = DEFAULT_PRODUCTOR_ID
): Promise<ProducerDashboard & { fromSupabase: boolean }> {
  if (!isSupabaseConfigured()) {
    return { ...demoProducer, fromSupabase: false };
  }

  const dashboard = await getProducerDashboardFromSupabase(productorId);
  if (dashboard) {
    return { ...dashboard, fromSupabase: true };
  }

  return {
    name: "Productor",
    monthlySalesUsd: 0,
    activeLots: 0,
    lots: [],
    fromSupabase: false,
  };
}

export {
  getProductorProfile,
  getPedidosForProductor,
  type ProductorProfile,
  type ProductorPedidoRow,
} from "@/lib/data/productor-repository";

export async function createPedido(input: {
  lotSlug: string;
  cantidad: number;
  tipoEnvio: "local" | "export";
  paisDestino?: string;
  totalUsd: number;
  compradorEmail?: string;
  estado?: string;
  agenciaReferenteId?: string;
}) {
  const estado = input.estado ?? "pendiente";

  if (!isSupabaseConfigured()) {
    return { id: `demo-${Date.now()}`, ...input, estado };
  }

  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const lote = await fetchLoteBySlug(input.lotSlug);
  if (!lote) return null;

  const { data, error } = await supabase
    .from("pedidos")
    .insert({
      lote_id: lote.id,
      cantidad: input.cantidad,
      tipo_envio: input.tipoEnvio,
      pais_destino: input.paisDestino,
      total_usd: input.totalUsd,
      comprador_email: input.compradorEmail,
      estado,
      agencia_referente_id: input.agenciaReferenteId ?? null,
    })
    .select("id, estado")
    .single();

  if (error) {
    console.error("[createPedido]", error);
    return null;
  }

  return data;
}

export interface PedidoRow {
  id: string;
  cantidad: number;
  tipo_envio: string;
  pais_destino: string | null;
  estado: string;
  total_usd: number | null;
  comprador_email: string | null;
  created_at: string;
  lotes?: { slug: string; finca_nombre: string | null; producto: string } | null;
}

export async function getPedidosExportacion(): Promise<PedidoRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data } = await supabase
    .from("pedidos")
    .select("*, lotes(slug, finca_nombre, producto)")
    .eq("tipo_envio", "export")
    .order("created_at", { ascending: false });

  return (data ?? []) as PedidoRow[];
}

export async function getPedidoById(id: string): Promise<PedidoRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data } = await supabase
    .from("pedidos")
    .select("*, lotes(slug, finca_nombre, producto)")
    .eq("id", id)
    .maybeSingle();

  return (data as PedidoRow) ?? null;
}

export async function updatePedidoEstado(id: string, estado: string) {
  if (!isSupabaseConfigured()) return { id, estado };

  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("pedidos")
    .update({ estado })
    .eq("id", id)
    .select("id, estado")
    .single();

  if (error) {
    console.error("[updatePedidoEstado]", error);
    return null;
  }

  return data;
}

export async function createLote(input: {
  producto: string;
  variedad?: string;
  cantidadKg: number;
  fechaCosecha?: string;
  estadoActual: string;
  fincaNombre: string;
  elevacion?: string;
  productorId?: string;
}) {
  const productorId = input.productorId ?? DEFAULT_PRODUCTOR_ID;
  const slug = `${input.fincaNombre.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;

  if (!isSupabaseConfigured()) {
    return { slug, id: slug, qrUrl: `/producto/${slug}` };
  }

  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data: lote, error } = await supabase
    .from("lotes")
    .insert({
      slug,
      productor_id: productorId,
      producto: input.producto,
      variedad: input.variedad,
      cantidad_kg: input.cantidadKg,
      fecha_cosecha: input.fechaCosecha,
      estado_actual: input.estadoActual,
      finca_nombre: input.fincaNombre,
      elevacion: input.elevacion,
      dashboard_status: "drying",
      dashboard_status_label: "Registrado",
      tags: [input.producto],
    })
    .select("id, slug")
    .single();

  if (error || !lote) {
    console.error("[createLote]", error);
    return null;
  }

  const steps = [
    { etapa: "Cosecha", status: "completed" as const, orden: 10 },
    { etapa: "Lavado", status: "current" as const, orden: 11 },
    { etapa: "Secado", status: "pending" as const, orden: 12 },
    { etapa: "Reposo", status: "pending" as const, orden: 13 },
  ];

  await supabase.from("trazabilidad").insert(
    steps.map((s) => ({
      lote_id: lote.id,
      etapa: s.etapa,
      status: s.status,
      orden: s.orden,
      descripcion: `Etapa ${s.etapa.toLowerCase()} registrada.`,
    }))
  );

  return { slug: lote.slug, id: lote.id, qrUrl: `/producto/${lote.slug}` };
}
