"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { createClientIfConfigured } from "@/lib/supabase/client";
import {
  displayNameFromAuthUser,
  getPanelPathOrCompleteProfile,
  readRoleFromUserMetadata,
} from "@/lib/auth";
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
  const panelHref = getPanelPathOrCompleteProfile(role);

  const label = displayNameFromAuthUser(user);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href={panelHref}
        className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-3 font-body text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary/90 sm:px-4"
      >
        <MaterialIcon name="dashboard" className="text-lg" />
        <span className="hidden sm:inline">Mi panel</span>
      </Link>
      <span
        className="max-w-[5.5rem] truncate font-body text-label-sm text-outline sm:max-w-[8rem] sm:text-label-md"
        title={user.email ?? label}
      >
        {label}
      </span>
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
