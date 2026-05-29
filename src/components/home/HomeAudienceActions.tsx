"use client";

import Link from "next/link";
import { ScanProductButton } from "@/components/product/ScanProductButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getHomePathForRole, readRoleFromUserMetadata } from "@/lib/auth/roles";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

function accederHref(rol: "operador" | "productor") {
  return `/acceder?rol=${rol}`;
}

export function HomeAudienceActions() {
  const { user, loading } = useSupabaseUser();
  const role = user ? readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>) : null;

  const operadorHref =
    role === "operador" ? getHomePathForRole("operador") : accederHref("operador");
  const productorHref =
    role === "productor" ? getHomePathForRole("productor") : accederHref("productor");

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-3">
      <ScanProductButton />

      <Link
        href={loading ? "#" : operadorHref}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-primary-container bg-surface font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container"
        aria-disabled={loading}
      >
        <MaterialIcon name="tour" />
        Soy operador turístico
      </Link>

      <Link
        href={loading ? "#" : productorHref}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface-container-low font-body text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        aria-disabled={loading}
      >
        <MaterialIcon name="agriculture" />
        Soy productor agrícola
      </Link>

      <p className="mt-1 font-body text-label-sm text-outline">
        Comprador: escanea el QR. Operador y productor: entra o crea cuenta con un clic arriba a la derecha.
      </p>
    </div>
  );
}
