import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { buildAccederUrlForRole, getPanelPathForRole, readRoleFromUserMetadata, type HuellaRole } from "@/lib/auth";
import { isAuthDisabled } from "./presentation";

/**
 * En paneles restringidos: exige sesión y rol coincidente.
 * Si el rol es otro, redirige a su panel (evita ver vista de comprador por error).
 */
export async function requirePanelRole(
  requiredRole: HuellaRole,
  panelPath: string
): Promise<User | null> {
  if (isAuthDisabled() || !isSupabaseConfigured()) return null;

  const supabase = await createClientIfConfigured();
  if (!supabase) redirect(buildAccederUrlForRole(requiredRole, panelPath));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(buildAccederUrlForRole(requiredRole, panelPath));

  const role = readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>);
  if (!role) redirect(buildAccederUrlForRole(requiredRole, panelPath));
  if (role !== requiredRole) redirect(getPanelPathForRole(role));

  return user;
}
