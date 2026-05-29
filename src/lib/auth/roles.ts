/** Perfiles de Huella alineados con la carta del hackathon + productor en origen. */
export type HuellaRole = "turista" | "productor" | "operador" | "exportador";

export const HUELLA_ROLE_KEY = "huella_role";

export interface RoleOption {
  id: HuellaRole;
  title: string;
  description: string;
  icon: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "turista",
    title: "Turista / comprador",
    description: "Escaneas QR, compras bolsas o sigues tus pedidos.",
    icon: "travel_explore",
  },
  {
    id: "productor",
    title: "Productor agrícola",
    description: "Registras lotes, trazabilidad y QR en tu finca.",
    icon: "agriculture",
  },
  {
    id: "operador",
    title: "Operador turístico",
    description: "Compartes productos con turistas y ves referidos.",
    icon: "tour",
  },
  {
    id: "exportador",
    title: "Exportador / logística",
    description: "Revisas y apruebas pedidos de exportación.",
    icon: "local_shipping",
  },
];

export function parseHuellaRole(value: unknown): HuellaRole | null {
  if (value === "turista" || value === "productor" || value === "operador" || value === "exportador") {
    return value;
  }
  return null;
}

export function getHomePathForRole(role: HuellaRole): string {
  switch (role) {
    case "productor":
      return "/productor/dashboard";
    case "operador":
      return "/operador/dashboard";
    case "exportador":
      return "/exportador/dashboard";
    case "turista":
    default:
      return "/mis-pedidos";
  }
}

/** Tras login: respeta `next` explícito; si no, usa el rol guardado en la cuenta. */
export function resolveRedirectAfterAuth(
  next: string | undefined,
  roleFromUser: HuellaRole | null
): string {
  if (
    next?.startsWith("/") &&
    next !== "/login" &&
    next !== "/registro" &&
    next !== "/acceder"
  ) {
    return next;
  }
  if (roleFromUser) return getHomePathForRole(roleFromUser);
  return "/";
}

export function readRoleFromUserMetadata(metadata: Record<string, unknown> | undefined): HuellaRole | null {
  return parseHuellaRole(metadata?.[HUELLA_ROLE_KEY]);
}
