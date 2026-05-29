"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
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

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled) return;
      if (user) {
        setReady(true);
        return;
      }
      router.replace(`/login?next=${encodeURIComponent(checkoutPath)}`);
    });

    return () => {
      cancelled = true;
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
