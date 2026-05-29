"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { persistReferralSlug } from "@/lib/referral/client";

interface ReferralCaptureProps {
  loteSlug: string;
}

export function ReferralCapture({ loteSlug }: ReferralCaptureProps) {
  const searchParams = useSearchParams();
  const tracked = useRef(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref || tracked.current) return;
    tracked.current = true;

    persistReferralSlug(ref);

    fetch("/api/referidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agenciaSlug: ref, tipo: "escaneo", loteSlug }),
    }).catch(() => {
      /* demo: no bloquear UX */
    });
  }, [searchParams, loteSlug]);

  return null;
}
