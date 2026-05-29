import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

interface PanelEmptyStateProps {
  icon: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function PanelEmptyState({
  icon,
  title,
  description,
  ctaHref,
  ctaLabel,
}: PanelEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
      <MaterialIcon name={icon} className="mb-3 text-4xl text-outline" />
      <p className="font-body text-body-md text-on-surface-variant">{title}</p>
      {description && (
        <p className="mt-2 font-body text-body-sm text-outline">{description}</p>
      )}
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
