"use client";

import { ChatProvider } from "@/components/chat/ChatProvider";
import { HuellasAssistant } from "@/components/chat/HuellasAssistant";

export function ChatRoot({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      {children}
      <HuellasAssistant />
    </ChatProvider>
  );
}
