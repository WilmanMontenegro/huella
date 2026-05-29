import {
  GoogleGenerativeAI,
  type Content,
  type GenerationConfig,
} from "@google/generative-ai";
import type { ChatArea } from "@/lib/chat/areas";
import { buildLotAgentPrompt } from "@/lib/gemini/finca-la-esperanza-agent";
import {
  GENERATION,
  HISTORY,
  RETRY,
  SAFETY_SETTINGS,
  polishAgentText,
  resolveModelChain,
} from "@/lib/gemini/agent-config";
import type { Lot, Producer } from "@/types";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const AREA_HINTS: Partial<Record<ChatArea, string>> = {
  landing: "Pantalla: landing Huella.",
  "product-hero": "Pantalla: acaba de escanear el QR del lote.",
  "product-detail": "Pantalla: ficha del producto y specs.",
  "product-producer": "Pantalla: historia del productor.",
  "product-certifications": "Pantalla: certificaciones del lote.",
  "product-timeline": "Pantalla: línea de tiempo y blockchain.",
  "product-tours": "Pantalla: tours vinculados al lote.",
  "experiences-list": "Pantalla: comparador de experiencias.",
  "experience-detail": "Pantalla: detalle de experiencia y agencias.",
  checkout: "Pantalla: checkout de compra.",
  "producer-dashboard": "Pantalla: dashboard del productor.",
  "producer-new-lot": "Pantalla: registro de lote nuevo.",
};

export function buildProductAgentPrompt(lot: Lot, producer: Producer, area?: ChatArea): string {
  const areaHint = area && AREA_HINTS[area] ? AREA_HINTS[area] : undefined;
  return buildLotAgentPrompt(lot, producer, areaHint);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableGeminiError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /429|quota|503|unavailable|500|502|504|resource exhausted|high demand|blocked/i.test(msg);
}

function isModelNotFound(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /404|not found|not supported/i.test(msg);
}

/**
 * Gemini exige: historial empieza en `user` y alterna user/model.
 * El saludo inicial (solo assistant) no se incluye — vive en systemInstruction.
 */
function toGeminiHistory(history: ChatTurn[]): Content[] {
  let turns = history.slice(-HISTORY.maxTurns);

  if (HISTORY.skipLeadingAssistant && turns[0]?.role === "assistant") {
    turns = turns.slice(1);
  }

  const contents: Content[] = [];

  for (const turn of turns) {
    const role = turn.role === "assistant" ? "model" : "user";
    const text = turn.content.trim();
    if (!text) continue;

    const last = contents[contents.length - 1];
    if (last?.role === role) {
      const prev = last.parts[0]?.text ?? "";
      last.parts = [{ text: `${prev}\n${text}` }];
      continue;
    }

    contents.push({ role, parts: [{ text }] });
  }

  if (contents[0]?.role === "model") {
    contents.shift();
  }

  return contents;
}

export class GeminiUnavailableError extends Error {
  constructor(message = "Gemini no respondió tras varios intentos") {
    super(message);
    this.name = "GeminiUnavailableError";
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

async function callGeminiChat(
  modelName: string,
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: ChatTurn[],
  generationConfig: GenerationConfig
): Promise<string | null> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig,
    safetySettings: SAFETY_SETTINGS,
  });

  const geminiHistory = toGeminiHistory(history);
  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(userMessage);
  const text = result.response.text()?.trim();

  return text ? polishAgentText(text) : null;
}

async function runWithModelFallback(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: ChatTurn[],
  generationConfig: GenerationConfig
): Promise<string> {
  const models = resolveModelChain(process.env.GEMINI_MODEL);
  const errors: string[] = [];

  for (const modelName of models) {
    for (let attempt = 0; attempt < RETRY.attemptsPerModel; attempt++) {
      try {
        const text = await callGeminiChat(
          modelName,
          apiKey,
          systemPrompt,
          userMessage,
          history,
          generationConfig
        );
        if (text) return text;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        errors.push(`${modelName}#${attempt + 1}: ${msg.slice(0, 140)}`);

        if (isModelNotFound(error)) break;

        if (isRetryableGeminiError(error) && attempt < RETRY.attemptsPerModel - 1) {
          await sleep(RETRY.delaysMs[attempt] ?? 2000);
          continue;
        }

        if (isRetryableGeminiError(error)) break;
        throw error;
      }
    }
  }

  console.error("[gemini] exhausted:", errors.join(" | "));
  throw new GeminiUnavailableError();
}

export async function generateAgentReply(
  systemPrompt: string,
  userMessage: string,
  history: ChatTurn[] = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new GeminiUnavailableError("GEMINI_API_KEY no configurada en el servidor");
  }

  const wrappedMessage = `<user_query>${userMessage.trim()}</user_query>`;

  return runWithModelFallback(
    apiKey,
    systemPrompt,
    wrappedMessage,
    history,
    GENERATION.reply
  );
}

export async function generateAgentGreeting(
  systemPrompt: string,
  area?: ChatArea
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new GeminiUnavailableError("GEMINI_API_KEY no configurada en el servidor");
  }

  const areaTag = area ? `<screen>${area}</screen>` : "";
  const prompt = `<task>opening_greeting</task>${areaTag}
Genera UN saludo inicial (máximo 2 frases). Preséntate como agente de la finca. Invita a preguntar. Redacción natural y distinta cada vez.`;

  return runWithModelFallback(apiKey, systemPrompt, prompt, [], GENERATION.greeting);
}
