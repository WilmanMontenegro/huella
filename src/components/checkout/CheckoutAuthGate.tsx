"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { buildAccederUrl } from "@/lib/auth";
import { createClientIfConfigured } from "@/lib/supabase/client";

interface CheckoutAuthGateProps {
  lotId: string;
  children: React.ReactNode;
}

export function CheckoutAuthGate({ lotId, children }: CheckoutAuthGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const checkoutPath = `/checkout/${lotId}`;

  useEffect(() => {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setReady(true);
      return;
    }

    let cancelled = false;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        setReady(true);
      }
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      if (user) {
        setReady(true);
        return;
      }
      router.replace(buildAccederUrl({ role: "turista", next: checkoutPath }));
    });

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [router, checkoutPath]);

  if (!ready) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-container-padding-mobile py-24 text-center">
        <MaterialIcon name="progress_activity" className="mb-4 animate-spin text-4xl text-primary" />
        <p className="font-body text-body-md text-on-surface-variant">Verificando sesión para comprar…</p>
      </main>
    );
  }

  return <>{children}</>;
}
