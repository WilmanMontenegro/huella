"use client";

import { ChatProvider } from "@/components/chat/ChatProvider";
import { HuellaAssistant } from "@/components/chat/HuellaAssistant";

export function ChatRoot({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      {children}
      <HuellaAssistant />
    </ChatProvider>
  );
}
