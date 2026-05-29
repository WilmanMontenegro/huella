import { redirect } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { HuellaLogo } from "@/components/brand/HuellaLogo";
import { DEFAULT_OPERADOR_AGENCIA_SLUG } from "@/lib/constants/operador";
import { readRoleFromUserMetadata } from "@/lib/auth/roles";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const dashboardNext = `/operador/dashboard?agencia=${DEFAULT_OPERADOR_AGENCIA_SLUG}`;
const accederOperador = `/acceder?rol=operador&next=${encodeURIComponent(dashboardNext)}`;

/** Vitrina del operador; el login único es /acceder (evita doble pantalla). */
export default async function OperadorLandingPage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClientIfConfigured();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const role = readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>);
        if (role === "operador") redirect(dashboardNext);
        redirect(accederOperador);
      } else {
        redirect(accederOperador);
      }
    }
  }

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
            "Panel con estadísticas y kit para compartir",
          ].map((text) => (
            <div key={text} className="flex gap-3 rounded-lg bg-surface-container-high px-4 py-3">
              <MaterialIcon name="check_circle" className="shrink-0 text-secondary" />
              <p className="font-body text-body-md text-on-surface-variant">{text}</p>
            </div>
          ))}
        </div>

        <Link
          href={accederOperador}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-body text-label-md text-on-primary"
        >
          <MaterialIcon name="login" />
          Entrar / Registrarse
        </Link>

        <p className="mt-6 font-body text-label-sm text-outline">
          <Link href={`/aliado/${DEFAULT_OPERADOR_AGENCIA_SLUG}`} className="text-secondary hover:underline">
            Ver ejemplo: Huella Tours
          </Link>
        </p>
      </main>
    </div>
  );
}
