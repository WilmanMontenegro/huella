"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const { area, lotId, isOpen, fabSuppressed, openChat, closeChat } = useChat();
  const config = CHAT_AREA_CONFIG[area];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const greetingRequestRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);

  const effectiveLotId = lotId ?? DEMO_LOT_ID;

  /** Siempre flotante a la derecha; solo sube el `bottom` cuando hay barra inferior fija. */
  const fabBottomClass = (() => {
    if (/^\/producto\/[^/]+$/.test(pathname)) return "bottom-24 md:bottom-28";
    if (pathname === "/productor/dashboard") return "bottom-40 md:bottom-44";
    if (/^\/checkout\//.test(pathname)) return "bottom-28 md:bottom-32";
    return "bottom-8 pb-safe md:bottom-10";
  })();

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchGreeting = useCallback(async (): Promise<string | null> => {
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
  }, [effectiveLotId, area]);

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
  }, [isOpen, area, effectiveLotId, config.greeting, fetchGreeting]);

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
      {!isOpen && !fabSuppressed && (
        <button
          type="button"
          onClick={openChat}
          className={cn(
            "group fixed z-40 flex h-12 w-12 items-center justify-center rounded-full p-0",
            "bg-tertiary-fixed text-on-tertiary-fixed shadow-fab-yellow",
            "transition-transform hover:scale-105 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-container/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "right-margin-mobile md:right-margin-desktop",
            fabBottomClass
          )}
          aria-label="Abrir asistente Huella"
        >
          <MaterialIcon
            name="auto_awesome"
            className="text-[34px] leading-none transition-transform group-hover:rotate-12"
          />
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/40 p-4 md:items-center">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-card bg-surface-container-lowest organic-shadow">
            <div className="relative border-b border-outline-variant/30 bg-surface-container-low px-4 pb-4 pt-5">
              <div
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary-container"
                aria-hidden
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed shadow-[0_4px_12px_rgba(201,169,0,0.25)]">
                    <MaterialIcon name="auto_awesome" filled className="text-xl" />
                  </span>
                  <h2 className="font-display text-headline-md text-primary">{config.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={closeChat}
                  aria-label="Cerrar"
                  className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                >
                  <MaterialIcon name="close" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl px-4 py-3 font-body text-body-md",
                    msg.role === "user"
                      ? "ml-8 bg-primary text-on-primary"
                      : "mr-8 border border-secondary-fixed-dim/50 bg-secondary-container/50 text-on-secondary-container"
                  )}
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
                      className="rounded-full border border-outline-variant bg-surface px-3 py-1.5 text-left font-body text-label-sm text-on-surface-variant transition-colors hover:border-secondary hover:bg-secondary-fixed/25 disabled:opacity-50"
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
                className="flex-1 rounded-full border border-outline-variant bg-surface px-4 py-3 font-body text-body-md outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-[0_4px_14px_rgba(27,109,36,0.25)] transition-colors hover:bg-secondary/90 disabled:opacity-50"
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
