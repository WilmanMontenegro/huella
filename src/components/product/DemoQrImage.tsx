import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface DemoQrImageProps {
  lotSlug?: string;
  className?: string;
  showDownload?: boolean;
}

const DEFAULT_LOT = "finca-la-esperanza";

export function DemoQrImage({
  lotSlug = DEFAULT_LOT,
  className,
  showDownload = true,
}: DemoQrImageProps) {
  const src = `/qr/${lotSlug}.png`;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="rounded-xl border border-outline-variant bg-white p-4 shadow-organic-lg">
        <Image
          src={src}
          alt={`QR Huella — escanea para ver trazabilidad de ${lotSlug}`}
          width={1024}
          height={1024}
          className="h-48 w-48 sm:h-56 sm:w-56"
          priority
        />
      </div>
      <p className="max-w-xs text-center font-body text-label-sm text-on-surface-variant">
        Escanea con la cámara del celular — abre la trazabilidad sin registrarte.
      </p>
      {showDownload && (
        <a
          href={src}
          download={`huella-qr-${lotSlug}.png`}
          className="inline-flex items-center gap-2 rounded-full border border-primary-container px-5 py-2.5 font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container"
        >
          Descargar QR (PNG)
        </a>
      )}
    </div>
  );
}

export function DemoQrPitchLink({ lotSlug = DEFAULT_LOT }: { lotSlug?: string }) {
  return (
    <Link
      href={`/producto/${lotSlug}`}
      className="font-body text-label-md text-secondary hover:underline"
    >
      O abrir demo en el navegador
    </Link>
  );
}
