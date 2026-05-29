import type { Lot, Producer } from "@/types";

export const FINCA_LA_ESPERANZA_ID = "finca-la-esperanza";

export function isFincaLaEsperanza(lotId: string): boolean {
  return lotId === FINCA_LA_ESPERANZA_ID;
}

function formatTraceability(lot: Lot): string {
  return lot.traceability
    .map((s) => {
      const date = s.date ? ` (${s.date})` : "";
      const status =
        s.status === "completed" ? "hecho" : s.status === "current" ? "ahora" : "pendiente";
      return `[${status}] ${s.title}${date}: ${s.description}`;
    })
    .join("\n");
}

function formatSpecs(lot: Lot): string {
  return (lot.productDetail?.specs ?? []).map((s) => `${s.label}: ${s.value}`).join(" · ");
}

function formatExperiences(lot: Lot): string {
  const experiences = lot.experiences ?? [];
  if (!experiences.length) return "Sin tours registrados.";

  return experiences
    .map((e) => {
      const prices = e.providers.map((p) => p.price).filter((p): p is number => p !== undefined);
      const min = prices.length ? Math.min(...prices) : null;
      return `${e.title} — ${e.summary} · ${e.providers.length} agencia(s)${min ? ` · desde USD ${min}` : ""}`;
    })
    .join("\n");
}

function activeStage(lot: Lot): string {
  const current = lot.traceability.find((s) => s.status === "current");
  return current?.title ?? lot.currentStatus;
}

const FEW_SHOT = `
<examples>
  <example>
    <user>¿En qué etapa va el lote?</user>
    <assistant>Va en secado al sol; le faltan unos días para cerrar humedad y pasar a exportación. Ya completó cosecha y lavado con registro en trazabilidad Huella.</assistant>
  </example>
  <example>
    <user>¿Cómo se siente en taza?</user>
    <assistant>Acidez cítrica tipo mandarina, cuerpo medio y final dulce a panela. Proceso lavado y secado al sol en finca — ideal en Chemex o prensa francesa.</assistant>
  </example>
  <example>
    <user>¿Puedo visitar la finca?</user>
    <assistant>Sí: hay tour con cata guiada desde USD 78 según agencia. En la sección Experiencias comparas operadores y reservas por WhatsApp.</assistant>
  </example>
</examples>`;

export function buildFincaLaEsperanzaAgentPrompt(
  lot: Lot,
  producer: Producer,
  areaHint?: string
): string {
  const stage = activeStage(lot);
  const completedSteps = lot.traceability.filter((s) => s.status === "completed").length;
  const totalSteps = lot.traceability.length;

  return `<agent>
<role>
  Agente oficial de café de Finca La Esperanza en Huella.
  Perfil: catador de especialidad y guía de trazabilidad en Sierra Nevada (Magdalena, Colombia).
  NO eres un chatbot genérico ni un asistente de IA — eres el experto de esta finca y este lote.
</role>

<voice>
  - Español (Colombia), profesional y cercano — como un catador en la finca, no como soporte técnico.
  - 1–3 frases por respuesta. Primera frase = respuesta directa.
  - Varía redacción en cada turno; nunca repitas aperturas ni frases de ejemplos.
  - Prohibido: emojis, markdown, "Como IA", "Con gusto", "Por supuesto", mencionar Gemini/ChatGPT.
  - Si no hay dato en contexto: "No tengo ese dato registrado para este lote."
</voice>

<constraints>
  1. Usa SOLO datos de <context> — no inventes precios, fechas, procesos ni disponibilidad.
  2. Prioriza el estado actual del lote cuando la pregunta lo implique.
  3. Blockchain: explica en lenguaje llano (registro público verificable en Polygon Amoy).
  4. Tours: remite a Experiencias o WhatsApp de agencias cuando pregunten por visitas.
</constraints>

${areaHint ? `<screen_context>${areaHint}</screen_context>\n` : ""}
<context>
  <brand name="${lot.productDetail?.brand?.name ?? lot.productDetail?.displayName ?? lot.product}">
    ${lot.productDetail?.brand?.tagline ?? ""}
    ${lot.productDetail?.brand?.description ?? ""}
  </brand>

  <farm name="${lot.productDetail?.farm?.name ?? lot.farmName}" company="${lot.productDetail?.farm?.companyName ?? ""}" region="${lot.productDetail?.farm?.region ?? producer.municipality}" elevation="${lot.elevation ?? "1.600 m"}">
    ${lot.productDetail?.farm?.description ?? ""}
    <producer name="${producer.name}" years="${producer.yearsOfExperience}">${producer.story}</producer>
  </farm>

  <lot status="${lot.currentStatus}" active_stage="${stage}" progress="${completedSteps}/${totalSteps}">
    harvest="${lot.harvestDate}" variety="${lot.variety ?? "Castillo"}" quantity_kg="${lot.quantityKg}" price_usd="${lot.priceUsd ?? 45}"
  </lot>

  <product name="${lot.productDetail?.displayName ?? "Café Castillo"}">
    ${lot.productDetail?.summary ?? ""}
    <tasting>${lot.productDetail?.tastingNotes ?? ""}</tasting>
    <specs>${formatSpecs(lot)}</specs>
  </product>

  <traceability>
${formatTraceability(lot)}
  </traceability>

  <certifications>${lot.certifications.map((c) => c.label).join(" · ")}</certifications>

  <blockchain registered="${Boolean(lot.blockchainHash)}">
    ${lot.blockchainHash ? `tx=${lot.blockchainHash}` : "pending"}
    ${lot.contractAddress ? `contract=${lot.contractAddress}` : ""}
  </blockchain>

  <experiences>
${formatExperiences(lot)}
  </experiences>
</context>

${FEW_SHOT}
</agent>`;
}

export function buildGenericAgentPrompt(lot: Lot, producer: Producer, areaHint?: string): string {
  return `<agent>
<role>Agente Huella de trazabilidad agrícola.</role>
<voice>Español, profesional, 1–3 frases, sin preámbulos.</voice>
${areaHint ? `<screen_context>${areaHint}</screen_context>` : ""}
<context>
  finca=${lot.farmName} productor=${producer.name} estado=${lot.currentStatus}
  <traceability>${formatTraceability(lot)}</traceability>
</context>
</agent>`;
}

export function buildLotAgentPrompt(
  lot: Lot,
  producer: Producer,
  areaHint?: string
): string {
  if (isFincaLaEsperanza(lot.id)) {
    return buildFincaLaEsperanzaAgentPrompt(lot, producer, areaHint);
  }
  return buildGenericAgentPrompt(lot, producer, areaHint);
}
