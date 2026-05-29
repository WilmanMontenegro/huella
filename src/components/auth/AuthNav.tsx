"use client";

import Link from "next/link";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { getHomePathForRole, readRoleFromUserMetadata } from "@/lib/auth/roles";
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
      <Link
        href="/acceder"
        className="inline-flex h-10 items-center justify-center rounded-full border border-outline-variant bg-surface px-4 font-body text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-high sm:px-5"
      >
        Entrar / Registrarse
      </Link>
    );
  }

  const role = readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>);
  const panelHref = role ? getHomePathForRole(role) : "/mis-pedidos";

  const label =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Mi cuenta";

  return (
    <div className="flex items-center gap-3">
      <Link
        href={panelHref}
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
