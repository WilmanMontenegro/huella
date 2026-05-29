"use client";

import Link from "next/link";
import type { Lot } from "@/types";

interface ProductActionsProps {
  lot: Lot;
  retailCta: string;
  wholesaleCta: string;
  loteHint: string;
}

export function ProductActions({ lot, retailCta, wholesaleCta, loteHint }: ProductActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant/20 bg-surface/95 p-4 shadow-[0_-8px_30px_rgba(75,54,33,0.08)] backdrop-blur-xl md:p-6">
      <div className="mx-auto max-w-5xl space-y-2">
        <p className="text-center font-body text-label-sm text-outline">{loteHint}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/checkout/${lot.id}?intencion=bolsa`}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            {retailCta}
          </Link>
          <Link
            href={`/checkout/${lot.id}?intencion=mayorista`}
            className="flex h-12 flex-1 items-center justify-center rounded-full border-2 border-secondary bg-surface font-body text-label-md text-secondary transition-colors hover:bg-secondary/10 active:scale-[0.98]"
          >
            {wholesaleCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
