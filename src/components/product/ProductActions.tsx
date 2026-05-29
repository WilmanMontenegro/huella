"use client";

import Link from "next/link";
import type { Lot } from "@/types";

interface ProductActionsProps {
  lot: Lot;
}

export function ProductActions({ lot }: ProductActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full border-t border-outline-variant/20 bg-surface/80 p-4 shadow-[0_-8px_30px_rgba(75,54,33,0.05)] backdrop-blur-xl md:p-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/checkout/${lot.id}`}
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-colors hover:bg-primary/90 active:scale-95"
        >
          Comprar este lote
        </Link>
      </div>
    </div>
  );
}
