import Link from "next/link";
import { AuthNav } from "@/components/auth/AuthNav";
import { HuellaLogo } from "@/components/brand/HuellaLogo";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ScanProductButton } from "@/components/product/ScanProductButton";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-content items-center justify-end px-container-padding-mobile py-4 md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <AuthNav />
          <Link href="/productor/dashboard" className="font-body text-label-md text-secondary hover:text-primary">
            Soy productor
          </Link>
          <Link href="/operador" className="font-body text-label-md text-secondary hover:text-primary">
            Soy operador
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-prose flex-1 flex-col justify-center px-container-padding-mobile pb-16 pt-4 text-center md:px-margin-desktop">
        <div className="mb-8 flex justify-center sm:mb-10">
          <HuellaLogo variant="vertical" size="hero" href={undefined} priority />
        </div>

        <p className="mb-4 font-body text-label-md uppercase tracking-widest text-outline">Magdalena · Colombia 5.0</p>
        <h1 className="mb-6 font-display text-headline-lg-mobile text-primary md:text-display-lg">
          Del campo al turista, con historia verificable
        </h1>
        <p className="mb-10 font-body text-body-lg text-on-surface-variant">
          Un turista prueba el mejor café de su vida en Santa Marta. Quiere llevárselo a su país — pero no sabe de
          dónde viene. Huella conecta cada lote con su agricultor, su trazabilidad y su compra.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ScanProductButton />
          <Link
            href="/productor/dashboard"
            className="flex h-14 w-full max-w-xs items-center justify-center rounded-full border border-primary-container font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container sm:w-auto sm:px-10"
          >
            Panel productor
          </Link>
        </div>

        <p className="mt-8 font-body text-label-sm text-outline">
          <Link href="/aliado/huella-tours" className="text-secondary hover:underline">
            Aliado turístico
          </Link>
          {" · "}
          <Link href="/exportador/dashboard" className="text-secondary hover:underline">
            Exportador
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
