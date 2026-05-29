import { NextResponse } from "next/server";
import type { ChatArea } from "@/lib/chat/areas";
import { getLotById, getProducerForLot } from "@/lib/data/lots-repository";
import {
  buildProductAgentPrompt,
  GeminiUnavailableError,
  generateAgentGreeting,
  generateAgentReply,
  isGeminiConfigured,
  type ChatTurn,
} from "@/lib/gemini/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lotId, message, area, history, intent } = body as {
      lotId: string;
      message?: string;
      area?: ChatArea;
      history?: ChatTurn[];
      intent?: "greeting" | "message";
    };

    if (!lotId) {
      return NextResponse.json({ error: "lotId is required" }, { status: 400 });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json(
        { error: "gemini_not_configured", reply: "Agente no disponible: falta GEMINI_API_KEY en el servidor." },
        { status: 503 }
      );
    }

    const lot = await getLotById(lotId);
    if (!lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 });
    }

    const producer = await getProducerForLot(lot);
    const systemPrompt = buildProductAgentPrompt(lot, producer, area);

    const safeHistory = Array.isArray(history)
      ? history.filter(
          (t): t is ChatTurn =>
            t &&
            typeof t.content === "string" &&
            (t.role === "user" || t.role === "assistant") &&
            t.content.trim().length > 0
        )
      : [];

    let reply: string;

    if (intent === "greeting") {
      reply = await generateAgentGreeting(systemPrompt, area);
    } else {
      if (!message?.trim()) {
        return NextResponse.json({ error: "message is required" }, { status: 400 });
      }
      reply = await generateAgentReply(systemPrompt, message.trim(), safeHistory);
    }

    return NextResponse.json({ reply, source: "gemini" });
  } catch (error) {
    if (error instanceof GeminiUnavailableError) {
      return NextResponse.json(
        {
          error: "gemini_unavailable",
          retry: true,
          reply: "Alta demanda en este momento. Intenta de nuevo en unos segundos.",
        },
        { status: 503 }
      );
    }

    console.error("[api/chat]", error);
    return NextResponse.json(
      { error: "chat_failed", retry: true, reply: "No pude procesar tu pregunta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
