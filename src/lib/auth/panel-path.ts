import { DEFAULT_OPERADOR_AGENCIA_SLUG } from "@/lib/constants/operador";
import { getHomePathForRole, type HuellaRole } from "@/lib/auth/roles";

/** Ruta del panel según rol (operador incluye agencia demo). */
export function getPanelPathForRole(role: HuellaRole): string {
  if (role === "operador") {
    return `/operador/dashboard?agencia=${DEFAULT_OPERADOR_AGENCIA_SLUG}`;
  }
  return getHomePathForRole(role);
}
