import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ROLE_OPTIONS, getRoleLabel, type HuellaRole } from "@/lib/auth/roles";

interface RoleContextBannerProps {
  role: HuellaRole;
}

export function RoleContextBanner({ role }: RoleContextBannerProps) {
  const option = ROLE_OPTIONS.find((r) => r.id === role);
  const iconWrap = option?.landingIconClassName ?? "bg-surface-container-high text-outline";

  return (
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container-low px-4 py-3">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconWrap}`}>
        <MaterialIcon name={option?.icon ?? "person"} className="text-xl" />
      </span>
      <div className="min-w-0 text-left">
        <p className="font-body text-label-sm text-outline">Acceso como</p>
        <p className="font-body text-label-md font-semibold text-primary">{getRoleLabel(role)}</p>
      </div>
    </div>
  );
}
