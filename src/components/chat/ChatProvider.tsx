"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { areaFromPathname, lotIdFromPathname, type ChatArea } from "@/lib/chat/areas";

interface ChatContextValue {
  area: ChatArea;
  lotId?: string;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  setArea: (area: ChatArea) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [area, setArea] = useState<ChatArea>(() => areaFromPathname(pathname));
  const lotId = lotIdFromPathname(pathname);

  useEffect(() => {
    setArea(areaFromPathname(pathname));
  }, [pathname]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ area, lotId, isOpen, openChat, closeChat, setArea }),
    [area, lotId, isOpen, openChat, closeChat]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
