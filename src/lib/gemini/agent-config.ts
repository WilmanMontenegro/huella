import {
  HarmCategory,
  HarmBlockThreshold,
  type GenerationConfig,
  type SafetySetting,
} from "@google/generative-ai";

/** Free tier AI Studio — lite primero, flash si hace falta más calidad */
export const GEMINI_MODELS = {
  primary: "gemini-2.5-flash-lite",
  fallback: "gemini-2.5-flash",
} as const;

export const RETRY = {
  attemptsPerModel: 3,
  delaysMs: [500, 1500, 3000] as const,
} as const;

export const HISTORY = {
  maxTurns: 12,
  /** No enviar saludo inicial al historial — el system prompt ya define identidad */
  skipLeadingAssistant: true,
} as const;

/** Ajustes recomendados para agente conversacional factual (Google AI) */
export const GENERATION = {
  /** Respuestas del turista — equilibrio precisión + naturalidad */
  reply: {
    maxOutputTokens: 280,
    temperature: 0.58,
    topP: 0.88,
    topK: 40,
    candidateCount: 1,
  } satisfies GenerationConfig,

  /** Saludo inicial — un poco más de variedad, sigue siendo corto */
  greeting: {
    maxOutputTokens: 120,
    temperature: 0.68,
    topP: 0.9,
    topK: 48,
    candidateCount: 1,
  } satisfies GenerationConfig,
} as const;

/** Producto agrícola — bloquear solo contenido de alto riesgo */
export const SAFETY_SETTINGS: SafetySetting[] = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export function resolveModelChain(preferred?: string): string[] {
  const chain = [preferred ?? GEMINI_MODELS.primary, GEMINI_MODELS.primary, GEMINI_MODELS.fallback];
  return Array.from(new Set(chain.filter(Boolean)));
}

/** Limpia salida del modelo para UI de chat */
export function polishAgentText(raw: string): string {
  return raw
    .replace(/\*\*/g, "")
    .replace(/^#+\s/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^(Claro|Por supuesto|¡Claro!|Con gusto)[,!.]?\s*/i, "")
    .trim();
}
