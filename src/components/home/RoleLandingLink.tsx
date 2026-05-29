import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { RoleOption } from "@/lib/auth/roles";

interface RoleLandingLinkProps {
  option: RoleOption;
  href: string;
  /** Modo presentación: salta login y abre el panel. */
  presentation?: boolean;
}

export function RoleLandingLink({ option, href, presentation = false }: RoleLandingLinkProps) {
  const iconWrap =
    option.landingIconClassName ??
    "bg-surface-container-high text-on-surface-variant";

  return (
    <Link
      href={href}
      className="group flex w-full items-center gap-3 rounded-2xl border border-outline-variant/70 bg-surface-container-lowest px-4 py-3.5 text-left shadow-sm transition-all hover:border-outline-variant hover:bg-surface-container-low hover:shadow-organic active:scale-[0.99]"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconWrap}`}
      >
        <MaterialIcon name={option.icon} className="text-[22px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-body text-label-md text-primary">
          {presentation ? option.title : option.landingCta}
        </span>
        <span className="mt-0.5 block font-body text-label-sm leading-snug text-outline">
          {option.description}
        </span>
      </span>
      <MaterialIcon
        name="arrow_forward"
        className="shrink-0 text-xl text-outline transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </Link>
  );
}
