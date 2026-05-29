"use client";

import Link from "next/link";
import { ScanProductButton } from "@/components/product/ScanProductButton";
import { RoleLandingLink } from "@/components/home/RoleLandingLink";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  buildAccederUrl,
  buildAccederUrlForRole,
  displayNameFromAuthUser,
  getPanelCtaLabel,
  getPanelPathForRole,
  getRoleLabel,
  isAuthDisabled,
  LANDING_GUEST_ROLES,
  readRoleFromUserMetadata,
  type HuellaRole,
} from "@/lib/auth";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { DEMO_LOT_ID } from "@/data/mock/lots";

const DEMO_PRODUCT_PATH = `/producto/${DEMO_LOT_ID}`;

function GuestAudienceActions() {
  const presentation = isAuthDisabled();

  return (
    <div className="flex w-full max-w-md flex-col items-stretch">
      <p className="mb-5 text-center font-body text-label-sm text-outline">
        {presentation
          ? "Elige el perfil a mostrar en la demo"
          : "Escanea un producto. Si compras, usa Entrar arriba a la derecha."}
      </p>

      <ScanProductButton instantProductPath={DEMO_PRODUCT_PATH} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-outline-variant/50" />
        </div>
        <p className="relative mx-auto w-fit bg-background px-3 font-body text-label-sm text-outline">
          {presentation ? "Paneles de demo" : "Gestión finca, tours o exportación"}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {LANDING_GUEST_ROLES.map((option) => (
          <RoleLandingLink
            key={option.id}
            option={option}
            href={presentation ? getPanelPathForRole(option.id) : buildAccederUrlForRole(option.id)}
            presentation={presentation}
          />
        ))}
      </div>
    </div>
  );
}

function LoggedInHomeMenu({
  user,
  role,
}: {
  user: NonNullable<ReturnType<typeof useSupabaseUser>["user"]>;
  role: HuellaRole | null;
}) {
  const name = displayNameFromAuthUser(user);

  if (!role) {
    return (
      <div className="flex w-full max-w-md flex-col items-stretch gap-4">
        <div className="rounded-2xl border border-tertiary-container/40 bg-tertiary-fixed/30 px-5 py-4 text-left">
          <p className="font-body text-body-md text-on-surface-variant">
            Hola, <span className="font-semibold text-primary">{name}</span>
          </p>
          <p className="mt-1 font-body text-label-sm text-outline">
            Falta elegir tu perfil para ir a tu panel.
          </p>
        </div>
        <Link
          href={buildAccederUrl({ completarPerfil: true })}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-transform hover:bg-primary/90 active:scale-[0.98]"
        >
          <MaterialIcon name="badge" />
          Completar mi perfil
        </Link>
        <ScanProductButton instantProductPath={DEMO_PRODUCT_PATH} />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-4">
      <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest px-5 py-4 text-left organic-shadow">
        <p className="font-body text-label-sm uppercase tracking-wider text-outline">Sesión activa</p>
        <p className="mt-1 font-display text-headline-md text-primary">Hola, {name}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-body text-label-sm text-on-surface-variant">
          <MaterialIcon name="verified_user" className="text-base text-secondary" />
          {getRoleLabel(role)}
        </p>
      </div>

      <Link
        href={getPanelPathForRole(role)}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-transform hover:bg-primary/90 active:scale-[0.98]"
      >
        <MaterialIcon name="dashboard" />
        {getPanelCtaLabel(role)}
      </Link>

      <ScanProductButton instantProductPath={DEMO_PRODUCT_PATH} />
    </div>
  );
}

export function HomeAudienceActions() {
  const { user, loading } = useSupabaseUser();
  const role = user ? readRoleFromUserMetadata(user.user_metadata as Record<string, unknown>) : null;

  if (loading) {
    return (
      <div className="flex h-32 w-full max-w-md items-center justify-center">
        <MaterialIcon name="progress_activity" className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (user) {
    return <LoggedInHomeMenu user={user} role={role} />;
  }

  return <GuestAudienceActions />;
}
