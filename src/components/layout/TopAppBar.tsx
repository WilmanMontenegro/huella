import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { cn } from "@/lib/utils/cn";

interface TopAppBarProps {
  title?: string;
  backHref?: string;
  rightAction?: React.ReactNode;
  variant?: "default" | "checkout";
  className?: string;
}

export function TopAppBar({
  title = "Huella",
  backHref,
  rightAction,
  variant = "default",
  className,
}: TopAppBarProps) {
  const isCheckout = variant === "checkout";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full",
        isCheckout
          ? "border-b border-surface-variant/30 bg-background/80 backdrop-blur-xl"
          : "bg-surface/40 shadow-organic-nav backdrop-blur-xl",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-full max-w-content items-center justify-between",
          isCheckout
            ? "max-w-3xl px-container-padding-mobile md:px-container-padding-desktop"
            : "px-container-padding-mobile md:px-margin-mobile"
        )}
      >
        {backHref ? (
          <Link
            href={backHref}
            className="text-primary transition-opacity hover:opacity-80 active:scale-95"
            aria-label="Volver"
          >
            <MaterialIcon name="arrow_back" />
          </Link>
        ) : (
          <button type="button" className="text-primary transition-opacity hover:opacity-80">
            <MaterialIcon name="menu" />
          </button>
        )}

        <h1 className="font-display text-headline-md font-semibold tracking-tight text-primary">
          {title}
        </h1>

        {rightAction ?? <span className="inline-flex h-6 w-6 shrink-0" aria-hidden />}
      </div>
    </header>
  );
}
