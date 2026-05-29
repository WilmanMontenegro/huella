"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getProductPublicUrl } from "@/lib/blockchain/verification";

interface ShareButtonProps {
  lotSlug: string;
  title: string;
}

export function ShareButton({ lotSlug, title }: ShareButtonProps) {
  async function handleShare() {
    const url = getProductPublicUrl(lotSlug);
    const payload = { title, text: `Trazabilidad Huellas — ${title}`, url };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // user cancelled or unsupported
      }
    }

    await navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles");
  }

  return (
    <button type="button" onClick={handleShare} aria-label="Compartir producto">
      <MaterialIcon name="share" className="text-primary" />
    </button>
  );
}
