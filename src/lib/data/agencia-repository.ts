import {
  DEFAULT_OPERADOR_AGENCIA_ID,
  DEFAULT_OPERADOR_AGENCIA_SLUG,
} from "@/lib/constants/operador";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { TourExperience, TourProvider } from "@/types";

export interface DbAgencia {
  id: string;
  slug: string;
  nombre: string;
  whatsapp: string | null;
  logo_url: string | null;
  descripcion: string | null;
  tagline: string | null;
}

export interface AgenciaPublicProfile {
  id: string;
  slug: string;
  name: string;
  whatsapp?: string;
  description?: string;
  tagline?: string;
}

export interface AgenciaExperience {
  experienceId: string;
  experienceSlug: string;
  lotSlug: string;
  title: string;
  summary: string;
  description: string;
  imageUrl: string;
  provider: TourProvider;
}

export interface OperadorStats {
  escaneos: number;
  pedidos: number;
  ingresosUsd: number;
}

const MOCK_AGENCIA: AgenciaPublicProfile = {
  id: DEFAULT_OPERADOR_AGENCIA_ID,
  slug: DEFAULT_OPERADOR_AGENCIA_SLUG,
  name: "Huella Tours",
  whatsapp: "573009876543",
  tagline: "Tours bilingües en la Sierra Nevada del Magdalena",
  description:
    "Conectamos turistas en Santa Marta y Minca con fincas trazables. Compartimos el QR Huella para que vivas el origen del café que acabas de probar.",
};

async function fetchAgenciaBySlug(slug: string): Promise<DbAgencia | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return null;

  const { data } = await supabase.from("agencias").select("*").eq("slug", slug).maybeSingle();
  return (data as DbAgencia) ?? null;
}

export async function getAgenciaBySlug(slug: string): Promise<AgenciaPublicProfile | null> {
  if (!isSupabaseConfigured()) {
    return slug === DEFAULT_OPERADOR_AGENCIA_SLUG ? MOCK_AGENCIA : null;
  }

  const row = await fetchAgenciaBySlug(slug);
  if (!row) return slug === DEFAULT_OPERADOR_AGENCIA_SLUG ? MOCK_AGENCIA : null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.nombre,
    whatsapp: row.whatsapp ?? undefined,
    description: row.descripcion ?? undefined,
    tagline: row.tagline ?? undefined,
  };
}

export async function getAgenciaExperiences(agenciaId: string): Promise<AgenciaExperience[]> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return [];

  const { data: provs } = await supabase
    .from("experiencia_proveedores")
    .select(
      `
      *,
      agencias ( whatsapp ),
      experiencias (
        id, slug, titulo, resumen, descripcion, imagen_url,
        lotes ( slug )
      )
    `
    )
    .eq("agencia_id", agenciaId);

  if (!provs?.length) return [];

  return provs
    .map((p) => {
      const exp = p.experiencias as {
        id: string;
        slug: string;
        titulo: string;
        resumen: string | null;
        descripcion: string | null;
        imagen_url: string | null;
        lotes: { slug: string } | null;
      } | null;
      if (!exp) return null;

      const lotSlug = exp.lotes?.slug ?? "finca-la-esperanza";
      return {
        experienceId: exp.id,
        experienceSlug: exp.slug,
        lotSlug,
        title: exp.titulo,
        summary: exp.resumen ?? "",
        description: exp.descripcion ?? "",
        imageUrl: exp.imagen_url ?? "",
        provider: {
          id: p.id,
          agencyName: p.agency_name,
          description: p.descripcion ?? undefined,
          duration: p.duracion ?? undefined,
          price: p.precio ?? undefined,
          meetingPoint: p.punto_encuentro ?? undefined,
          capacity: p.capacidad ?? undefined,
          languages: p.idiomas ?? undefined,
          whatsapp: (p.agencias as { whatsapp: string | null } | null)?.whatsapp ?? undefined,
        },
      } satisfies AgenciaExperience;
    })
    .filter(Boolean) as AgenciaExperience[];
}

export async function linkUserToAgencia(userId: string, agenciaSlug: string): Promise<string | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return DEFAULT_OPERADOR_AGENCIA_ID;

  const agencia = await fetchAgenciaBySlug(agenciaSlug);
  if (!agencia) return null;

  const { error } = await supabase.from("operador_usuarios").upsert(
    { user_id: userId, agencia_id: agencia.id },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[linkUserToAgencia]", error);
    return null;
  }

  return agencia.id;
}

export async function getAgenciaIdForUser(userId: string): Promise<string | null> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return DEFAULT_OPERADOR_AGENCIA_ID;

  const { data } = await supabase
    .from("operador_usuarios")
    .select("agencia_id")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.agencia_id ?? null;
}

export async function resolveOperadorAgencia(
  userId: string,
  preferredSlug?: string
): Promise<AgenciaPublicProfile | null> {
  const slug = preferredSlug ?? DEFAULT_OPERADOR_AGENCIA_SLUG;
  let agenciaId = await getAgenciaIdForUser(userId);

  if (!agenciaId) {
    agenciaId = await linkUserToAgencia(userId, slug);
  }

  if (!agenciaId) return getAgenciaBySlug(slug);

  const supabase = await createClientIfConfigured();
  if (!supabase) return getAgenciaBySlug(slug);

  const { data } = await supabase.from("agencias").select("*").eq("id", agenciaId).maybeSingle();

  if (!data) return getAgenciaBySlug(slug);

  const row = data as DbAgencia;
  return {
    id: row.id,
    slug: row.slug,
    name: row.nombre,
    whatsapp: row.whatsapp ?? undefined,
    description: row.descripcion ?? undefined,
    tagline: row.tagline ?? undefined,
  };
}

export async function recordReferralEvent(input: {
  agenciaSlug: string;
  tipo: "escaneo" | "pedido";
  loteSlug?: string;
  pedidoId?: string;
}) {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClientIfConfigured();
  if (!supabase) return;

  const agencia = await fetchAgenciaBySlug(input.agenciaSlug);
  if (!agencia) return;

  await supabase.from("referidos_eventos").insert({
    agencia_id: agencia.id,
    tipo: input.tipo,
    lote_slug: input.loteSlug,
    pedido_id: input.pedidoId,
  });
}

export async function getOperadorStats(agenciaId: string): Promise<OperadorStats> {
  const supabase = await createClientIfConfigured();
  if (!supabase) {
    return { escaneos: 12, pedidos: 3, ingresosUsd: 285 };
  }

  const { data: eventos } = await supabase
    .from("referidos_eventos")
    .select("tipo")
    .eq("agencia_id", agenciaId);

  const escaneos = eventos?.filter((e) => e.tipo === "escaneo").length ?? 0;
  const pedidosCount = eventos?.filter((e) => e.tipo === "pedido").length ?? 0;

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("total_usd")
    .eq("agencia_referente_id", agenciaId);

  const ingresosUsd =
    pedidos?.reduce((sum, p) => sum + Number(p.total_usd ?? 0), 0) ?? 0;

  return { escaneos, pedidos: pedidosCount, ingresosUsd };
}

export async function getAgenciaIdBySlug(slug: string): Promise<string | null> {
  const agencia = await getAgenciaBySlug(slug);
  return agencia?.id ?? null;
}
