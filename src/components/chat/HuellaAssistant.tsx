"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { useChat } from "@/components/chat/ChatProvider";
import { CHAT_AREA_CONFIG } from "@/lib/chat/areas";
import { cn } from "@/lib/utils/cn";
import { DEMO_LOT_ID } from "@/data/mock/lots";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function HuellaAssistant() {
  const pathname = usePathname();
  const { area, lotId, isOpen, openChat, closeChat } = useChat();
  const config = CHAT_AREA_CONFIG[area];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const greetingRequestRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);

  const hasProductBottomBar = /^\/producto\/[^/]+$/.test(pathname);
  const effectiveLotId = lotId ?? DEMO_LOT_ID;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  async function fetchGreeting(): Promise<string | null> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lotId: effectiveLotId, area, intent: "greeting" }),
          signal: AbortSignal.timeout(45_000),
        });
        const data = (await res.json()) as { reply?: string; source?: string; retry?: boolean };
        if (data.source === "gemini" && data.reply) return data.reply;
        if (data.reply && !data.retry) return data.reply;
        if (data.retry && attempt < 2) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
      } catch {
        if (attempt < 2) await new Promise((r) => setTimeout(r, 1500));
      }
    }
    return null;
  }

  useEffect(() => {
    if (!isOpen) return;

    const requestId = ++greetingRequestRef.current;
    setMessages([]);
    setLoading(true);

    (async () => {
      try {
        const greeting = await fetchGreeting();
        if (greetingRequestRef.current !== requestId) return;

        setMessages([
          {
            role: "assistant",
            content: greeting ?? config.greeting,
          },
        ]);
      } finally {
        if (greetingRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    })();
  }, [isOpen, area, effectiveLotId, config.greeting]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userText = text.trim();
    const history = messagesRef.current;

    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      let replyText: string | undefined;

      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lotId: effectiveLotId,
            message: userText,
            area,
            history,
          }),
          signal: AbortSignal.timeout(45_000),
        });
        const data = (await res.json()) as { reply?: string; retry?: boolean; source?: string };

        if (data.reply && res.ok && data.source === "gemini") {
          replyText = data.reply;
          break;
        }

        if (data.retry && attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }

        replyText = data.reply ?? "Intenta de nuevo en un momento.";
        break;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText ?? "Intenta de nuevo en un momento." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de conexión. Intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={openChat}
        className={cn(
          "group fixed z-[1001] flex h-14 w-14 items-center justify-center rounded-full border border-tertiary-fixed-dim bg-tertiary-fixed text-on-tertiary-fixed shadow-fab-yellow transition-all hover:scale-105 hover:bg-tertiary-fixed-dim active:scale-95 md:h-16 md:w-16",
          hasProductBottomBar
            ? "bottom-24 left-4 md:bottom-28 md:left-6"
            : "bottom-6 right-4 md:bottom-8 md:right-6"
        )}
        aria-label="Abrir asistente Huella"
      >
        <MaterialIcon name="auto_awesome" className="text-2xl transition-transform group-hover:rotate-12 md:text-3xl" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end justify-center bg-black/40 p-4 md:items-center">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-card bg-surface-container-lowest organic-shadow">
            <div className="flex items-center justify-between border-b border-outline-variant/30 p-4">
              <div className="flex items-center gap-2">
                <MaterialIcon name="auto_awesome" className="text-tertiary-container" />
                <h2 className="font-display text-headline-md text-primary">{config.title}</h2>
              </div>
              <button type="button" onClick={closeChat} aria-label="Cerrar">
                <MaterialIcon name="close" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-4 py-3 font-body text-body-md ${
                    msg.role === "user"
                      ? "ml-8 bg-primary text-on-primary"
                      : "mr-8 bg-surface-container text-on-surface"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && messages.length === 0 && (
                <p className="font-body text-body-md text-outline">Conectando con el agente...</p>
              )}
              {loading && messages.length > 0 && (
                <p className="font-body text-body-md text-outline">Pensando...</p>
              )}
            </div>

            {config.suggestions.length > 0 && (
              <div className="border-t border-outline-variant/20 px-4 py-3">
                <p className="mb-2 font-body text-label-sm text-outline">Preguntas sugeridas</p>
                <div className="flex flex-wrap gap-2">
                  {config.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={loading}
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-outline-variant bg-surface px-3 py-1.5 text-left font-body text-label-sm text-on-surface-variant transition-colors hover:border-tertiary-container hover:bg-tertiary-fixed/20 disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-outline-variant/30 p-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-full border border-outline-variant bg-surface px-4 py-3 font-body text-body-md outline-none focus:border-tertiary-container"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary disabled:opacity-50"
              >
                <MaterialIcon name="send" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
