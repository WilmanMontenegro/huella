"use client";

import { createClientIfConfigured } from "@/lib/supabase/client";

interface SignOutButtonProps {
  redirectTo?: string;
  className?: string;
  label?: string;
}

export function SignOutButton({
  redirectTo = "/",
  className = "font-body text-label-sm text-outline hover:text-primary",
  label = "Salir",
}: SignOutButtonProps) {
  async function handleSignOut() {
    const supabase = createClientIfConfigured();
    if (supabase) await supabase.auth.signOut();
    window.location.href = redirectTo;
  }

  return (
    <button type="button" onClick={handleSignOut} className={className}>
      {label}
    </button>
  );
}
