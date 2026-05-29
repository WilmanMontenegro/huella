"use client";

import { QRCodeSVG } from "qrcode.react";
import { getProductPublicUrl } from "@/lib/blockchain/verification";

interface LotQrCodeProps {
  lotSlug: string;
  size?: number;
  label?: string;
  showUrl?: boolean;
}

export function LotQrCode({ lotSlug, size = 160, label, showUrl = true }: LotQrCodeProps) {
  const url = getProductPublicUrl(lotSlug);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-xl border border-outline-variant bg-white p-3 shadow-organic-lg">
        <QRCodeSVG value={url} size={size} level="M" includeMargin />
      </div>
      {label && (
        <p className="text-center font-body text-label-sm text-on-surface-variant">{label}</p>
      )}
      {showUrl && (
        <p className="max-w-xs break-all text-center font-body text-label-sm text-outline">{url}</p>
      )}
    </div>
  );
}
