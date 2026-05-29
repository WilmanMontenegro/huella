"use client";

import { useEffect } from "react";
import { useChat } from "@/components/chat/ChatProvider";
import type { ChatArea } from "@/lib/chat/areas";

const SECTION_AREAS: Record<string, ChatArea> = {
  "product-hero": "product-hero",
  "product-detail": "product-detail",
  "product-origin": "product-origin",
  "product-producer": "product-producer",
  "product-certifications": "product-certifications",
  "product-timeline": "product-timeline",
  "product-tours": "product-tours",
};

export function ProductSectionObserver() {
  const { setArea } = useChat();

  useEffect(() => {
    const sections = Object.keys(SECTION_AREAS)
      .map((id) => document.querySelector(`[data-chat-section="${id}"]`))
      .filter(Boolean) as Element[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const key = visible.target.getAttribute("data-chat-section");
        if (key && SECTION_AREAS[key]) setArea(SECTION_AREAS[key]);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [setArea]);

  return null;
}
