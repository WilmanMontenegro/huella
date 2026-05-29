import Link from "next/link";
import { AuthNav } from "@/components/auth/AuthNav";
import { HuellasLogo } from "@/components/brand/HuellasLogo";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { LotQrCode } from "@/components/product/LotQrCode";
import { DEMO_LOT_ID } from "@/lib/data/lots-repository";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-container-padding-mobile md:px-margin-desktop">
        <HuellasLogo priority />
        <div className="flex items-center gap-4">
          <AuthNav />
          <Link href="/productor/dashboard" className="font-body text-label-md text-secondary hover:text-primary">
            Soy productor
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-prose flex-1 flex-col justify-center px-container-padding-mobile py-16 text-center md:px-margin-desktop">
        <p className="mb-4 font-body text-label-md uppercase tracking-widest text-outline">Magdalena · Colombia 5.0</p>
        <h1 className="mb-6 font-display text-headline-lg-mobile text-primary md:text-display-lg">
          Del campo al turista, con historia verificable
        </h1>
        <p className="mb-10 font-body text-body-lg text-on-surface-variant">
          Un turista prueba el mejor café de su vida en Santa Marta. Quiere llevárselo a su país — pero no sabe de
          dónde viene. Huellas conecta cada lote con su agricultor, su trazabilidad y su compra.
        </p>

        <div className="mb-10 flex justify-center">
          <LotQrCode lotSlug={DEMO_LOT_ID} size={120} label="Demo · Finca La Esperanza" showUrl={false} />
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/producto/${DEMO_LOT_ID}`}
            className="flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-transform hover:bg-primary/90 active:scale-95 sm:w-auto sm:px-10"
          >
            <MaterialIcon name="qr_code_scanner" />
            Escanea un producto
          </Link>
          <Link
            href="/productor/dashboard"
            className="flex h-14 w-full max-w-xs items-center justify-center rounded-full border border-primary-container font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container sm:w-auto sm:px-10"
          >
            Panel productor
          </Link>
        </div>

        <p className="mt-8 font-body text-label-sm text-outline">
          <Link href="/exportador/dashboard" className="text-secondary hover:underline">
            Vista exportador
          </Link>
          {" · "}
          <Link href="/mis-pedidos" className="text-secondary hover:underline">
            Mis pedidos
          </Link>
        </p>

        <div className="mt-16 flex justify-center gap-8 opacity-70">
          <MaterialIcon name="verified" className="text-3xl text-primary-container" />
          <MaterialIcon name="handshake" className="text-3xl text-primary-container" />
          <MaterialIcon name="park" className="text-3xl text-primary-container" />
        </div>
      </main>
    </div>
  );
}
