"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { buildAccederUrl, buildAccederUrlForRole, isAuthDisabled, type HuellaRole } from "@/lib/auth";
import { createClientIfConfigured } from "@/lib/supabase/client";

interface ClientAuthGateProps {
  nextPath: string;
  role?: HuellaRole;
  loadingMessage: string;
  children: ReactNode;
}

/** Espera sesión; si no hay usuario, redirige a /acceder con destino. */
export function ClientAuthGate({ nextPath, role, loadingMessage, children }: ClientAuthGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isAuthDisabled()) {
      setReady(true);
      return;
    }

    const supabase = createClientIfConfigured();
    if (!supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user) setReady(true);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      if (user) {
        setReady(true);
        return;
      }
      const loginUrl = role
        ? buildAccederUrlForRole(role, nextPath)
        : buildAccederUrl({ next: nextPath });
      router.replace(loginUrl);
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [router, nextPath, role]);

  if (!ready) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-container-padding-mobile py-24 text-center">
        <MaterialIcon name="progress_activity" className="mb-4 animate-spin text-4xl text-primary" />
        <p className="font-body text-body-md text-on-surface-variant">{loadingMessage}</p>
      </main>
    );
  }

  return <>{children}</>;
}
