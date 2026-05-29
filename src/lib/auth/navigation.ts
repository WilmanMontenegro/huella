import { DEFAULT_OPERADOR_AGENCIA_SLUG } from "@/lib/constants/operador";
import {
  getHomePathForRole,
  getPanelCtaLabel,
  getRoleLabel,
  type HuellaRole,
} from "@/lib/auth/roles";

/** Parámetros para construir `/acceder?…` (única pantalla de login). */
export interface AccederUrlParams {
  role?: HuellaRole | null;
  /** Ruta interna post-login (ej. `/operador/dashboard?agencia=…`). */
  next?: string;
  completarPerfil?: boolean;
  authError?: boolean;
}

const ACCEDER_PATH = "/acceder";

/** Rutas que no deben usarse como `next` tras autenticación. */
const INVALID_NEXT_PATHS = new Set(["/login", "/registro", ACCEDER_PATH]);

export function isValidNextPath(path: string | undefined): path is string {
  return Boolean(path?.startsWith("/") && !INVALID_NEXT_PATHS.has(path));
}

/** `/acceder` con query string; fuente única para enlaces de login. */
export function buildAccederUrl(params: AccederUrlParams = {}): string {
  const q = new URLSearchParams();
  if (params.role) q.set("rol", params.role);
  if (params.next) q.set("next", params.next);
  if (params.completarPerfil) q.set("completar", "1");
  if (params.authError) q.set("error", "auth");
  const qs = q.toString();
  return qs ? `${ACCEDER_PATH}?${qs}` : ACCEDER_PATH;
}

/** Login con rol preseleccionado y destino al panel correspondiente. */
export function buildAccederUrlForRole(role: HuellaRole, next?: string): string {
  const destination = next ?? getPanelPathForRole(role);
  return buildAccederUrl({ role, next: destination });
}

export function getOperadorDashboardPath(agenciaSlug = DEFAULT_OPERADOR_AGENCIA_SLUG): string {
  return `/operador/dashboard?agencia=${encodeURIComponent(agenciaSlug)}`;
}

/** Panel principal según rol (operador incluye agencia por defecto). */
export function getPanelPathForRole(
  role: HuellaRole,
  options?: { operadorAgenciaSlug?: string }
): string {
  if (role === "operador") {
    return getOperadorDashboardPath(options?.operadorAgenciaSlug ?? DEFAULT_OPERADOR_AGENCIA_SLUG);
  }
  return getHomePathForRole(role);
}

/** Tras login: destino explícito (`next` distinto de `/`); si no, panel del rol. */
export function resolveRedirectAfterAuth(
  next: string | undefined,
  roleFromUser: HuellaRole | null
): string {
  if (isValidNextPath(next) && next !== "/") return next;
  if (roleFromUser) return getPanelPathForRole(roleFromUser);
  if (isValidNextPath(next)) return next;
  return "/";
}

/** Panel si hay rol; si no, flujo de completar perfil. */
export function getPanelPathOrCompleteProfile(role: HuellaRole | null): string {
  if (!role) return buildAccederUrl({ completarPerfil: true });
  return getPanelPathForRole(role);
}

export type AuthUserLike = {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

export function displayNameFromAuthUser(user: AuthUserLike): string {
  const meta = user.user_metadata;
  return (
    (meta?.full_name as string | undefined) ??
    (meta?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Usuario"
  );
}

export { getPanelCtaLabel, getRoleLabel };
