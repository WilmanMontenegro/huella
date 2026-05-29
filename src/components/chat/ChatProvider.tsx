"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { areaFromPathname, lotIdFromPathname, type ChatArea } from "@/lib/chat/areas";

interface ChatContextValue {
  area: ChatArea;
  lotId?: string;
  isOpen: boolean;
  fabSuppressed: boolean;
  openChat: () => void;
  closeChat: () => void;
  setArea: (area: ChatArea) => void;
  /** Oculta el FAB flotante mientras un modal full-screen (p. ej. cámara QR) está activo. */
  registerFabSuppress: (key: string) => () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [fabSuppressors, setFabSuppressors] = useState<Set<string>>(() => new Set());
  const [area, setArea] = useState<ChatArea>(() => areaFromPathname(pathname));
  const lotId = lotIdFromPathname(pathname);

  const registerFabSuppress = useCallback((key: string) => {
    setFabSuppressors((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    return () => {
      setFabSuppressors((prev) => {
        if (!prev.has(key)) return prev;
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };
  }, []);

  useEffect(() => {
    setArea(areaFromPathname(pathname));
  }, [pathname]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const fabSuppressed = fabSuppressors.size > 0;

  const value = useMemo(
    () => ({ area, lotId, isOpen, fabSuppressed, openChat, closeChat, setArea, registerFabSuppress }),
    [area, lotId, isOpen, fabSuppressed, openChat, closeChat, registerFabSuppress]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
