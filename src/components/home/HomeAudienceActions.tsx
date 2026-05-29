"use client";

import Link from "next/link";
import { ScanProductButton } from "@/components/product/ScanProductButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getHomePathForRole, type HuellaRole, readRoleFromUserMetadata } from "@/lib/auth/roles";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

function accederHref(rol: HuellaRole) {
  if (rol === "turista") return "/acceder";
  return `/acceder?rol=${rol}`;
}

function panelHref(role: HuellaRole | null, target: HuellaRole) {
  return role === target ? getHomePathForRole(target) : accederHref(target);
}

export function HomeAudienceActions() {
  const { user, loading } = useSupabaseUser();
  const role = user ? readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>) : null;

  const operadorHref = loading ? "#" : panelHref(role, "operador");
  const exportadorHref = loading ? "#" : panelHref(role, "exportador");
  const productorHref = loading ? "#" : panelHref(role, "productor");

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-3">
      <ScanProductButton />

      <Link
        href={operadorHref}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-primary-container bg-surface font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container"
        aria-disabled={loading}
      >
        <MaterialIcon name="tour" />
        Soy operador turístico
      </Link>

      <Link
        href={exportadorHref}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-secondary/40 bg-surface font-body text-label-md text-secondary transition-colors hover:bg-secondary/10"
        aria-disabled={loading}
      >
        <MaterialIcon name="local_shipping" />
        Soy exportador
      </Link>

      <Link
        href={productorHref}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-low font-body text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        aria-disabled={loading}
      >
        <MaterialIcon name="agriculture" />
        Soy productor agrícola
      </Link>
    </div>
  );
}
