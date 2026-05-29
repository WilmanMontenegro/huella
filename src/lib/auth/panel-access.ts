import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { resolveOperadorAgencia, type AgenciaPublicProfile } from "@/lib/data/agencia-repository";
import { DEFAULT_OPERADOR_AGENCIA_SLUG } from "@/lib/constants/operador";
import { buildAccederUrl, buildAccederUrlForRole, getOperadorDashboardPath, getPanelPathForRole } from "./navigation";
import { readRoleFromUserMetadata, type HuellaRole } from "./roles";
import { isAuthDisabled } from "./presentation";

export type OperadorPanelSession = {
  user: User;
  agencia: AgenciaPublicProfile;
};

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

/** Panel operador: rol operador + agencia vinculada en Supabase. */
export async function requireOperadorPanel(agenciaParam?: string): Promise<OperadorPanelSession | null> {
  const panelPath = getOperadorDashboardPath(agenciaParam);
  const user = await requirePanelRole("operador", panelPath);
  if (!user) return null;

  const agencia =
    (await resolveOperadorAgencia(user.id, agenciaParam)) ??
    (await resolveOperadorAgencia(user.id, DEFAULT_OPERADOR_AGENCIA_SLUG));

  if (!agencia) {
    redirect(buildAccederUrl({ role: "operador", next: panelPath, authError: true }));
  }

  return { user, agencia };
}
