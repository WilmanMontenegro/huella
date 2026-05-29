"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { QR_PUBLIC_LOTS } from "@/data/qr-lots";

interface OperadorShareKitProps {
  agenciaSlug: string;
  agenciaName: string;
}

export function OperadorShareKit({ agenciaSlug, agenciaName }: OperadorShareKitProps) {
  const primaryLot = QR_PUBLIC_LOTS[0];

  function productUrl(slug: string) {
    if (typeof window === "undefined") {
      return `/producto/${slug}?ref=${agenciaSlug}`;
    }
    return `${window.location.origin}/producto/${slug}?ref=${agenciaSlug}`;
  }

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(productUrl(slug));
    alert("Enlace copiado con tu código de referido.");
  }

  return (
    <section className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 organic-shadow">
      <h3 className="font-display text-headline-md text-primary">Kit para compartir</h3>
      <p className="font-body text-body-sm text-on-surface-variant">
        Reparte estos enlaces o QR en tu bus, hotel o tour. Los escaneos y compras quedan asociados a{" "}
        <strong>{agenciaName}</strong>.
      </p>

      <ul className="space-y-3">
        {QR_PUBLIC_LOTS.map((lot) => (
          <li
            key={lot.slug}
            className="flex flex-col gap-2 rounded-lg border border-outline-variant/50 bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-body text-label-md text-primary">{lot.label}</p>
              <p className="font-body text-label-sm text-outline truncate">{productUrl(lot.slug)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => copyLink(lot.slug)}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-secondary px-3 font-body text-label-sm text-secondary"
              >
                <MaterialIcon name="content_copy" className="text-base" />
                Copiar
              </button>
              <Link
                href={`/api/qr/${lot.slug}`}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-tertiary-fixed px-3 font-body text-label-sm text-on-tertiary-container"
                download
              >
                <MaterialIcon name="qr_code_2" className="text-base" />
                QR PNG
              </Link>
              <Link
                href={`/producto/${lot.slug}?ref=${agenciaSlug}`}
                className="inline-flex h-9 items-center gap-1 rounded-full bg-primary px-3 font-body text-label-sm text-on-primary"
              >
                Ver
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="font-body text-label-sm text-outline">
        Tip para pitch: imprime <strong>{primaryLot.fileName}</strong> y colócalo en tu stand en Santa Marta.
      </p>
    </section>
  );
}
