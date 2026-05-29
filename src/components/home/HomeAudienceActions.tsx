"use client";

import Link from "next/link";
import { ScanProductButton } from "@/components/product/ScanProductButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getPanelPathForRole } from "@/lib/auth/panel-path";
import {
  getPanelCtaLabel,
  getRoleLabel,
  type HuellaRole,
  readRoleFromUserMetadata,
} from "@/lib/auth/roles";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

function accederHref(rol: HuellaRole) {
  const next = getPanelPathForRole(rol);
  if (rol === "turista") return "/acceder";
  return `/acceder?rol=${rol}&next=${encodeURIComponent(next)}`;
}

function displayName(user: NonNullable<ReturnType<typeof useSupabaseUser>["user"]>): string {
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  return (
    (meta?.full_name as string | undefined) ??
    (meta?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Usuario"
  );
}

function GuestAudienceActions({ loading }: { loading: boolean }) {
  const operadorHref = loading ? "#" : accederHref("operador");
  const exportadorHref = loading ? "#" : accederHref("exportador");
  const productorHref = loading ? "#" : accederHref("productor");

  return (
    <>
      <p className="mb-4 font-body text-label-sm text-outline">
        Elige cómo quieres usar Huella o escanea un producto
      </p>
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
    </>
  );
}

function LoggedInHomeMenu({
  user,
  role,
}: {
  user: NonNullable<ReturnType<typeof useSupabaseUser>["user"]>;
  role: HuellaRole | null;
}) {
  const name = displayName(user);

  if (!role) {
    return (
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <p className="font-body text-body-md text-on-surface-variant">
          Hola, <span className="font-medium text-primary">{name}</span>. Falta elegir tu perfil en Huella.
        </p>
        <Link
          href="/acceder?completar=1"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg hover:bg-primary/90"
        >
          <MaterialIcon name="badge" />
          Completar mi perfil
        </Link>
        <ScanProductButton />
      </div>
    );
  }

  const panelPath = getPanelPathForRole(role);
  const roleLabel = getRoleLabel(role);

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
      <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-5 py-4 text-left organic-shadow">
        <p className="font-body text-label-sm uppercase tracking-wider text-outline">Sesión activa</p>
        <p className="mt-1 font-display text-headline-md text-primary">Hola, {name}</p>
        <p className="mt-1 flex items-center gap-1.5 font-body text-body-md text-on-surface-variant">
          <MaterialIcon name="verified_user" className="text-lg text-secondary" />
          {roleLabel}
        </p>
      </div>

      <Link
        href={panelPath}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-transform hover:bg-primary/90 active:scale-[0.98]"
      >
        <MaterialIcon name="dashboard" />
        {getPanelCtaLabel(role)}
      </Link>

      <ScanProductButton />

      {role === "turista" && (
        <Link
          href="/producto/finca-la-esperanza"
          className="font-body text-label-sm text-secondary hover:underline"
        >
          Ver demo: Café Finca La Esperanza
        </Link>
      )}
    </div>
  );
}

export function HomeAudienceActions() {
  const { user, loading } = useSupabaseUser();
  const role = user ? readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>) : null;

  if (loading) {
    return (
      <div className="flex h-32 w-full max-w-sm items-center justify-center">
        <MaterialIcon name="progress_activity" className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (user) {
    return <LoggedInHomeMenu user={user} role={role} />;
  }

  return <GuestAudienceActions loading={false} />;
}
