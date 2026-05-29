import type { ReactNode } from "react";

interface ProductPageSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

/** Bloque narrativo de la ficha de producto (orden coherente al escanear QR). */
export function ProductPageSection({ title, subtitle, children, className = "" }: ProductPageSectionProps) {
  return (
    <section
      className={`mx-auto max-w-prose space-y-6 px-container-padding-mobile md:px-0 ${className}`.trim()}
    >
      <header className="border-b border-outline-variant/30 pb-4">
        <h2 className="font-display text-headline-lg-mobile text-primary md:text-headline-lg">{title}</h2>
        {subtitle && (
          <p className="mt-1.5 font-body text-body-md text-on-surface-variant">{subtitle}</p>
        )}
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
