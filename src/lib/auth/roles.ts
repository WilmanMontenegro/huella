/** Perfiles de Huella alineados con la carta del hackathon + productor en origen. */
export type HuellaRole = "turista" | "productor" | "operador" | "exportador";

export const HUELLA_ROLE_KEY = "huella_role";

export interface RoleOption {
  id: HuellaRole;
  title: string;
  description: string;
  icon: string;
  /** Texto del botón en landing (solo invitados). */
  landingCta?: string;
  /** Círculo del icono en tarjetas de la landing. */
  landingIconClassName?: string;
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
    landingCta: "Soy productor agrícola",
    landingIconClassName: "bg-primary-container/20 text-primary",
  },
  {
    id: "operador",
    title: "Operador turístico",
    description: "Compartes productos con turistas y ves referidos.",
    icon: "tour",
    landingCta: "Soy operador turístico",
    landingIconClassName: "bg-primary/10 text-primary",
  },
  {
    id: "exportador",
    title: "Exportador / logística",
    description: "Revisas y apruebas pedidos de exportación.",
    icon: "local_shipping",
    landingCta: "Soy exportador",
    landingIconClassName: "bg-tertiary-fixed text-on-tertiary-container",
  },
];

/** Perfiles con login dedicado en landing (turista usa escáner + Entrar en header). */
const LANDING_ROLE_ORDER: HuellaRole[] = ["productor", "operador", "exportador"];

/** Perfiles mostrados en la landing (sin sesión). */
export const LANDING_GUEST_ROLES = LANDING_ROLE_ORDER.map((id) =>
  ROLE_OPTIONS.find((r) => r.id === id)
).filter((r): r is RoleOption => Boolean(r?.landingCta));

export function getRoleShortLabel(role: HuellaRole): string {
  switch (role) {
    case "turista":
      return "Turista";
    case "productor":
      return "Productor";
    case "operador":
      return "Operador";
    case "exportador":
      return "Exportador";
  }
}

export function getAccederIntro(role: HuellaRole | null): { title: string; subtitle: string } {
  switch (role) {
    case "turista":
      return {
        title: "Turista y comprador",
        subtitle: "Entra para ver tus pedidos y seguir comprando con trazabilidad.",
      };
    case "productor":
      return {
        title: "Panel del productor",
        subtitle: "Gestiona lotes, trazabilidad y QR desde tu finca.",
      };
    case "operador":
      return {
        title: "Panel del operador",
        subtitle: "Referidos, tours y kit QR para compartir con turistas.",
      };
    case "exportador":
      return {
        title: "Panel del exportador",
        subtitle: "Revisa y aprueba pedidos de exportación en un solo lugar.",
      };
    default:
      return {
        title: "Entrar a Huella",
        subtitle: "Continúa con Google o correo. Después te llevamos a tu panel según tu perfil.",
      };
  }
}

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

export function getRoleLabel(role: HuellaRole): string {
  return ROLE_OPTIONS.find((r) => r.id === role)?.title ?? "Huella";
}

export function getPanelCtaLabel(role: HuellaRole): string {
  switch (role) {
    case "productor":
      return "Ir a mi panel de finca";
    case "operador":
      return "Ir a mi panel de operador";
    case "exportador":
      return "Ir a mi panel de exportador";
    case "turista":
    default:
      return "Ver mis pedidos";
  }
}

export function readRoleFromUserMetadata(metadata: Record<string, unknown> | undefined): HuellaRole | null {
  return parseHuellaRole(metadata?.[HUELLA_ROLE_KEY]);
}
