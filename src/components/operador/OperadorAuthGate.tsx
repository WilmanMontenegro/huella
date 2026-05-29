"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { createClientIfConfigured } from "@/lib/supabase/client";

interface OperadorAuthGateProps {
  children: React.ReactNode;
}

export function OperadorAuthGate({ children }: OperadorAuthGateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agencia = searchParams.get("agencia");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setReady(true);
      return;
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setReady(true);
        return;
      }
      const next = `/operador/dashboard${agencia ? `?agencia=${encodeURIComponent(agencia)}` : ""}`;
      router.replace(`/acceder?rol=operador&next=${encodeURIComponent(next)}`);
    });
  }, [router, agencia]);

  if (!ready) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-margin-mobile py-24 text-center">
        <MaterialIcon name="progress_activity" className="mb-4 animate-spin text-4xl text-primary" />
        <p className="font-body text-body-md text-on-surface-variant">Verificando sesión del operador…</p>
      </main>
    );
  }

  return <>{children}</>;
}

export function OperadorLoginPrompt({ agenciaSlug }: { agenciaSlug?: string }) {
  const next = `/operador/dashboard${agenciaSlug ? `?agencia=${agenciaSlug}` : ""}`;

  return (
    <Link
      href={`/acceder?rol=operador&next=${encodeURIComponent(next)}`}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-body text-label-md text-on-primary"
    >
      <MaterialIcon name="login" />
      Entrar / Registrarse
    </Link>
  );
}
