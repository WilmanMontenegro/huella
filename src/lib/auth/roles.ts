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
  /** Clases Tailwind del botón en landing. */
  landingButtonClassName?: string;
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
    landingButtonClassName:
      "flex h-14 w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-low font-body text-label-md text-on-surface transition-colors hover:bg-surface-container-high",
  },
  {
    id: "operador",
    title: "Operador turístico",
    description: "Compartes productos con turistas y ves referidos.",
    icon: "tour",
    landingCta: "Soy operador turístico",
    landingButtonClassName:
      "flex h-14 w-full items-center justify-center gap-2 rounded-full border border-primary-container bg-surface font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container",
  },
  {
    id: "exportador",
    title: "Exportador / logística",
    description: "Revisas y apruebas pedidos de exportación.",
    icon: "local_shipping",
    landingCta: "Soy exportador",
    landingButtonClassName:
      "flex h-14 w-full items-center justify-center gap-2 rounded-full border border-secondary/40 bg-surface font-body text-label-md text-secondary transition-colors hover:bg-secondary/10",
  },
];

/** Perfiles mostrados como botones en la landing (sin sesión). */
export const LANDING_GUEST_ROLES = ROLE_OPTIONS.filter((r) => r.landingCta);

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
