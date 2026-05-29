export interface StepVisual {
  icon: string;
  currentClass: string;
  iconClass: string;
  glow?: boolean;
}

/** Iconos semánticos compartidos — Timeline producto + dashboard productor */
export function getStepVisualByLabel(label: string): StepVisual {
  const title = label.toLowerCase();

  if (title.includes("cosecha")) {
    return {
      icon: "agriculture",
      currentClass: "border-2 border-secondary bg-secondary-container shadow-sm",
      iconClass: "text-on-secondary-container",
    };
  }

  if (title.includes("lavado") || title.includes("ferment")) {
    return {
      icon: "water_drop",
      currentClass: "border-2 border-primary-container/30 bg-primary-fixed shadow-sm",
      iconClass: "text-primary-container",
    };
  }

  if (title.includes("secado") || title.includes("sol")) {
    return {
      icon: "wb_sunny",
      currentClass:
        "border-2 border-tertiary bg-gradient-to-br from-tertiary-fixed via-[#f5d547] to-tertiary-container shadow-[0_4px_14px_rgba(201,169,0,0.35)]",
      iconClass: "text-on-tertiary-fixed-variant",
      glow: true,
    };
  }

  if (title.includes("inspecc")) {
    return {
      icon: "fact_check",
      currentClass: "border-2 border-tertiary-container bg-tertiary-fixed/30 shadow-sm",
      iconClass: "text-on-tertiary-fixed-variant",
    };
  }

  if (title.includes("empaque") || title.includes("reposo")) {
    return {
      icon: "inventory_2",
      currentClass: "border-2 border-outline bg-surface-container-high shadow-sm",
      iconClass: "text-on-surface-variant",
    };
  }

  if (title.includes("export") || title.includes("envío") || title.includes("envio")) {
    return {
      icon: "local_shipping",
      currentClass: "border-2 border-outline bg-surface-container-high shadow-sm",
      iconClass: "text-on-surface-variant",
    };
  }

  return {
    icon: "spa",
    currentClass: "border-2 border-tertiary-container bg-surface-container-lowest shadow-sm",
    iconClass: "text-tertiary-container",
  };
}
