import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getStepVisualByLabel } from "@/lib/design/traceability-icons";
import { cn } from "@/lib/utils/cn";

type StepStatus = "completed" | "current" | "pending";

interface TraceabilityStepIconProps {
  label: string;
  status: StepStatus;
  size?: "md" | "sm";
  variant?: "coffee" | "banana";
}

/** Indicador de etapa — mismo lenguaje visual en producto y dashboard productor */
export function TraceabilityStepIcon({
  label,
  status,
  size = "md",
  variant = "coffee",
}: TraceabilityStepIconProps) {
  const visual = getStepVisualByLabel(label);
  const isBanana = variant === "banana";
  const dim = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "text-sm" : "text-base";
  const iconSizeCurrent = size === "sm" ? "text-base" : "text-lg";

  if (status === "completed") {
    const bg = isBanana ? "bg-tertiary-container" : "bg-secondary";
    const fg = isBanana ? "text-on-tertiary-container" : "text-on-secondary";
    const checkColor = isBanana ? "text-tertiary-container" : "text-secondary";

    return (
      <div
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center rounded-full ring-4 ring-surface-container-lowest shadow-sm",
          dim,
          bg
        )}
      >
        <MaterialIcon name={visual.icon} filled className={cn(iconSize, fg)} />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-surface-container-lowest ring-2 ring-surface-container-lowest">
          <MaterialIcon name="check" filled className={cn("text-[9px]", checkColor)} />
        </span>
      </div>
    );
  }

  if (status === "current") {
    const currentClass = isBanana
      ? "border-2 border-tertiary-container bg-surface-container-lowest shadow-sm"
      : visual.currentClass;

    return (
      <div
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center rounded-full ring-4 ring-surface-container-lowest",
          dim,
          currentClass
        )}
      >
        {!isBanana && visual.glow && (
          <span className="absolute inset-0 rounded-full bg-tertiary-fixed/40 blur-md" aria-hidden />
        )}
        <MaterialIcon
          name={visual.icon}
          filled
          className={cn("relative", iconSizeCurrent, isBanana ? "text-tertiary-container" : visual.iconClass)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-outline-variant/60 bg-surface-container ring-4 ring-surface-container-lowest",
        dim
      )}
    >
      <MaterialIcon name={visual.icon} className={cn(iconSize, "text-outline/70")} />
    </div>
  );
}

interface TraceabilityStepLabelProps {
  label: string;
  status: StepStatus;
  variant?: "coffee" | "banana";
}

export function TraceabilityStepLabel({ label, status, variant = "coffee" }: TraceabilityStepLabelProps) {
  const isBanana = variant === "banana";

  return (
    <span
      className={cn(
        "max-w-[4.5rem] text-center font-body text-[10px] leading-tight md:max-w-none md:text-label-sm",
        status === "pending" && "text-outline opacity-60",
        status === "current" && (isBanana ? "font-bold text-tertiary-container" : "font-bold text-primary"),
        status === "completed" && (isBanana ? "text-tertiary-container" : "text-secondary")
      )}
    >
      {label}
    </span>
  );
}
