import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { HuellaLogo } from "@/components/brand/HuellaLogo";
import { OperadorLoginPrompt } from "@/components/operador/OperadorAuthGate";
import { DEFAULT_OPERADOR_AGENCIA_SLUG } from "@/lib/constants/operador";

export default function OperadorLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex justify-center py-8">
        <HuellaLogo variant="vertical" href="/" />
      </header>
      <main className="mx-auto flex max-w-prose flex-1 flex-col items-center px-margin-mobile pb-16 text-center">
        <MaterialIcon name="hiking" className="mb-4 text-5xl text-secondary" />
        <h1 className="mb-4 font-display text-headline-lg text-primary">Operador turístico</h1>
        <p className="mb-8 font-body text-body-lg text-on-surface-variant">
          Comparte el QR Huella con tus turistas, ofrece tours en la misma app y sigue escaneos y compras
          referidas — sin reemplazar WhatsApp, potenciándolo.
        </p>

        <div className="mb-8 w-full space-y-3 text-left">
          {[
            "Vitrina pública en /aliado/tu-agencia",
            "Enlaces y QR con tu código ?ref=",
            "Panel con Google: estadísticas y kit",
          ].map((text) => (
            <div key={text} className="flex gap-3 rounded-lg bg-surface-container-high px-4 py-3">
              <MaterialIcon name="check_circle" className="shrink-0 text-secondary" />
              <p className="font-body text-body-md text-on-surface-variant">{text}</p>
            </div>
          ))}
        </div>

        <OperadorLoginPrompt agenciaSlug={DEFAULT_OPERADOR_AGENCIA_SLUG} />

        <p className="mt-6 font-body text-label-sm text-outline">
          <Link href={`/aliado/${DEFAULT_OPERADOR_AGENCIA_SLUG}`} className="text-secondary hover:underline">
            Ver ejemplo: Huella Tours
          </Link>
        </p>
      </main>
    </div>
  );
}
