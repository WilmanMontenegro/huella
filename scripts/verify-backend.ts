/**
 * Verificación rápida de Supabase + repositorios (ejecutar: pnpm exec tsx scripts/verify-backend.ts)
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Check = { name: string; ok: boolean; detail: string };

async function main() {
  const results: Check[] = [];

  if (!url || !key) {
    console.error("Falta NEXT_PUBLIC_SUPABASE_URL o ANON_KEY en .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const tables = [
    "productores",
    "lotes",
    "trazabilidad",
    "certificaciones",
    "agencias",
    "experiencias",
    "pedidos",
    "operador_usuarios",
    "referidos_eventos",
  ] as const;

  for (const table of tables) {
    const { error, count } = await supabase.from(table).select("*", { count: "exact", head: true });
    results.push({
      name: `tabla ${table}`,
      ok: !error,
      detail: error ? error.message : `${count ?? 0} filas`,
    });
  }

  const { data: lote, error: loteErr } = await supabase
    .from("lotes")
    .select("id, slug, producto, productor_id")
    .eq("slug", "finca-la-esperanza")
    .maybeSingle();

  results.push({
    name: "lote demo finca-la-esperanza",
    ok: !loteErr && !!lote,
    detail: loteErr?.message ?? (lote ? `${lote.producto} · ${lote.id}` : "no encontrado"),
  });

  const { data: agenciaCols } = await supabase.from("agencias").select("slug, tagline, descripcion").limit(1);
  results.push({
    name: "columnas agencias (tagline/descripcion)",
    ok: !!agenciaCols && agenciaCols.length > 0 && "tagline" in agenciaCols[0],
    detail: agenciaCols?.[0] ? JSON.stringify(agenciaCols[0]) : "sin datos",
  });

  const { error: pedidoColErr } = await supabase
    .from("pedidos")
    .select("id, agencia_referente_id")
    .limit(1);

  results.push({
    name: "columna pedidos.agencia_referente_id",
    ok: !pedidoColErr,
    detail: pedidoColErr?.message ?? "ok",
  });

  if (lote) {
    const { data: traz, error: trazErr } = await supabase
      .from("trazabilidad")
      .select("etapa, orden")
      .eq("lote_id", lote.id)
      .order("orden");
    results.push({
      name: "trazabilidad del lote demo",
      ok: !trazErr && (traz?.length ?? 0) > 0,
      detail: trazErr?.message ?? `${traz?.length ?? 0} pasos`,
    });
  }

  const failed = results.filter((r) => !r.ok);
  console.log("\n=== Verificación backend Huella ===\n");
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.name}: ${r.detail}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} OK\n`);

  if (failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
