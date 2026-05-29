"use client";

import Link from "next/link";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

export function AuthNav() {
  const { user, loading } = useSupabaseUser();

  async function signOut() {
    const supabase = createClientIfConfigured();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <span className="font-body text-label-md text-outline" aria-hidden>
        ···
      </span>
    );
  }

  if (!user) {
    return (
      <Link href="/login" className="font-body text-label-md text-outline hover:text-primary">
        Entrar / Registrarse
      </Link>
    );
  }

  const label =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Cuenta";

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/mis-pedidos"
        className="max-w-[8rem] truncate font-body text-label-md text-primary hover:underline"
        title={user.email ?? label}
      >
        {label}
      </Link>
      <button
        type="button"
        onClick={signOut}
        className="font-body text-label-sm text-outline hover:text-primary"
      >
        Salir
      </button>
    </div>
  );
}
