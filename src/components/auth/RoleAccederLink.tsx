import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  buildAccederUrlForRole,
  getPanelPathForRole,
  isAuthDisabled,
  type HuellaRole,
} from "@/lib/auth";

const CONFIG: Record<
  HuellaRole,
  { authLabel: string; demoLabel: string; icon: string; demoIcon: string }
> = {
  turista: { authLabel: "Entrar", demoLabel: "Ver pedidos", icon: "login", demoIcon: "shopping_bag" },
  productor: {
    authLabel: "Entrar como productor",
    demoLabel: "Ver panel de finca",
    icon: "login",
    demoIcon: "agriculture",
  },
  operador: {
    authLabel: "Entrar como operador",
    demoLabel: "Ver panel operador",
    icon: "login",
    demoIcon: "dashboard",
  },
  exportador: {
    authLabel: "Entrar como exportador",
    demoLabel: "Ver panel exportador",
    icon: "login",
    demoIcon: "local_shipping",
  },
};

interface RoleAccederLinkProps {
  role: HuellaRole;
  next?: string;
  className?: string;
  presentation?: boolean;
}

export function RoleAccederLink({
  role,
  next,
  className = "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-body text-label-md text-on-primary",
  presentation,
}: RoleAccederLinkProps) {
  const demo = presentation ?? isAuthDisabled();
  const labels = CONFIG[role];
  const href = demo ? getPanelPathForRole(role) : buildAccederUrlForRole(role, next);

  return (
    <Link href={href} className={className}>
      <MaterialIcon name={demo ? labels.demoIcon : labels.icon} />
      {demo ? labels.demoLabel : labels.authLabel}
    </Link>
  );
}
