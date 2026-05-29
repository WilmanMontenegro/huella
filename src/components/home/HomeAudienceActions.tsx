"use client";

import Link from "next/link";
import { ScanProductButton } from "@/components/product/ScanProductButton";
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

function GuestAudienceActions() {
  const presentation = isAuthDisabled();

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch">
      <p className="mb-4 text-center font-body text-label-sm text-outline">
        {presentation
          ? "Elige el perfil a mostrar en la demo (sin login)"
          : "Elige cómo quieres usar Huella o escanea un producto"}
      </p>
      <div className="flex flex-col items-stretch gap-3">
        <ScanProductButton />
        {LANDING_GUEST_ROLES.map((option) => (
          <Link
            key={option.id}
            href={presentation ? getPanelPathForRole(option.id) : buildAccederUrlForRole(option.id)}
            className={option.landingButtonClassName}
          >
            <MaterialIcon name={option.icon} />
            {presentation ? option.title : option.landingCta}
          </Link>
        ))}
        {presentation && (
          <Link
            href="/mis-pedidos"
            className="text-center font-body text-label-sm text-secondary hover:underline"
          >
            Turista · ver mis pedidos (local)
          </Link>
        )}
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
      <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
        <p className="font-body text-body-md text-on-surface-variant">
          Hola, <span className="font-medium text-primary">{name}</span>. Falta elegir tu perfil en Huella.
        </p>
        <Link
          href={buildAccederUrl({ completarPerfil: true })}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg hover:bg-primary/90"
        >
          <MaterialIcon name="badge" />
          Completar mi perfil
        </Link>
        <ScanProductButton />
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-stretch gap-4">
      <div className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest px-5 py-4 text-left organic-shadow">
        <p className="font-body text-label-sm uppercase tracking-wider text-outline">Sesión activa</p>
        <p className="mt-1 font-display text-headline-md text-primary">Hola, {name}</p>
        <p className="mt-1 flex items-center gap-1.5 font-body text-body-md text-on-surface-variant">
          <MaterialIcon name="verified_user" className="text-lg text-secondary" />
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

      <ScanProductButton />
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

  return <GuestAudienceActions />;
}
