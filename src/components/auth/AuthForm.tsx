"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { HuellaLogo } from "@/components/brand/HuellaLogo";
import { RolePicker } from "@/components/auth/RolePicker";
import {
  getHomePathForRole,
  type HuellaRole,
  readRoleFromUserMetadata,
} from "@/lib/auth/roles";
import { buildAuthCallbackUrl } from "@/lib/auth/app-origin";
import { signInWithPassword, signUpWithPassword } from "@/lib/auth/smart-auth";
import { createClientIfConfigured } from "@/lib/supabase/client";

export type AuthFormMode = "login" | "register" | "unified";

type UnifiedStep = "sign-in" | "pick-role";

interface AuthFormProps {
  mode: AuthFormMode;
  redirectTo?: string;
  authError?: boolean;
  /** Preselección desde /acceder?rol=operador (solo paso de perfil) */
  initialRole?: HuellaRole | null;
  /** Tras Google/correo sin rol: elegir perfil */
  needsRoleCompletion?: boolean;
}

const inputClassName =
  "h-12 w-full rounded-xl border border-outline-variant bg-surface px-4 font-body text-body-md text-on-surface outline-none ring-primary focus:border-primary focus:ring-2";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function isSuccessMessage(message: string): boolean {
  return (
    message.includes("Revisa tu correo") ||
    message.includes("Creamos tu cuenta") ||
    message.includes("activa tu cuenta")
  );
}

export function AuthForm({
  mode,
  redirectTo = "/",
  authError = false,
  initialRole = null,
  needsRoleCompletion = false,
}: AuthFormProps) {
  const isRegister = mode === "register";
  const isUnified = mode === "unified";

  const [unifiedStep, setUnifiedStep] = useState<UnifiedStep>(
    needsRoleCompletion ? "pick-role" : "sign-in"
  );
  const [role, setRole] = useState<HuellaRole | null>(
    isRegister ? (initialRole ?? null) : initialRole ?? null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | "role" | null>(null);
  const [message, setMessage] = useState<string | null>(
    authError ? "No pudimos completar el acceso. Intenta de nuevo." : null
  );
  const [showEmailForm, setShowEmailForm] = useState(false);

  const onPickRoleStep = isUnified && unifiedStep === "pick-role";
  const showRolePicker = isRegister || onPickRoleStep;

  function effectiveRedirect(forRole?: HuellaRole | null): string {
    const r = forRole ?? role;
    if (
      redirectTo.startsWith("/") &&
      redirectTo !== "/login" &&
      redirectTo !== "/registro" &&
      redirectTo !== "/acceder"
    ) {
      return redirectTo;
    }
    if (r) return getHomePathForRole(r);
    return redirectTo;
  }

  function buildCallbackUrl() {
    return buildAuthCallbackUrl(
      effectiveRedirect(),
      initialRole && isUnified && unifiedStep === "sign-in"
        ? { pending_rol: initialRole }
        : undefined
    );
  }

  function getSupabase() {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setMessage(
        process.env.NODE_ENV === "production"
          ? "El acceso aún no está disponible. Si acabas de desplegar, espera un minuto y recarga."
          : "Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_ANON_KEY en .env.local."
      );
      return null;
    }
    return supabase;
  }

  function requireRole(): HuellaRole | null {
    if (!showRolePicker) return "turista";
    if (role) return role;
    setMessage("Elige cómo quieres usar Huella para continuar.");
    return null;
  }

  function validatePasswordPair(requireConfirm: boolean): boolean {
    if (!password) {
      setMessage("Escribe tu contraseña.");
      return false;
    }
    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    if (requireConfirm && password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  }

  async function goAfterAuth(supabase: NonNullable<ReturnType<typeof createClientIfConfigured>>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const storedRole = readRoleFromUserMetadata(user?.user_metadata as Record<string, unknown>);
    if (storedRole) {
      window.location.href = getHomePathForRole(storedRole);
      return;
    }
    if (isUnified) {
      setUnifiedStep("pick-role");
      setMessage("¡Bienvenido! Elige tu perfil para terminar el registro.");
      return;
    }
    window.location.href = effectiveRedirect();
  }

  async function continueWithGoogle() {
    const supabase = getSupabase();
    if (!supabase) return;

    setLoading("google");
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildCallbackUrl(),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(null);
    }
  }

  async function saveRoleAndContinue() {
    const pickedRole = requireRole();
    if (!pickedRole) return;

    setLoading("role");
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(null);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: pickedRole }),
      });
      setLoading(null);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(body.error ?? "No pudimos guardar tu perfil.");
        return;
      }
      window.location.href = getHomePathForRole(pickedRole);
      return;
    }

    if (!email.trim() || !validatePasswordPair(true)) {
      setLoading(null);
      return;
    }

    const result = await signUpWithPassword(
      supabase,
      email.trim(),
      password,
      pickedRole,
      buildCallbackUrl()
    );
    setLoading(null);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    if (result.kind === "sign-up-pending") {
      setMessage(result.message);
      return;
    }
    window.location.href = getHomePathForRole(pickedRole);
  }

  async function continueWithEmail(e: React.FormEvent) {
    e.preventDefault();

    if (onPickRoleStep) {
      await saveRoleAndContinue();
      return;
    }

    const supabase = getSupabase();
    if (!supabase || !email.trim()) return;

    setLoading("email");
    setMessage(null);

    const callbackUrl = buildCallbackUrl();
    const normalizedEmail = email.trim();

    if (!validatePasswordPair(isRegister)) {
      setLoading(null);
      return;
    }

    if (isRegister) {
      const pickedRole = requireRole();
      if (!pickedRole) {
        setLoading(null);
        return;
      }
      const result = await signUpWithPassword(
        supabase,
        normalizedEmail,
        password,
        pickedRole,
        callbackUrl
      );
      setLoading(null);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      if (result.kind === "sign-up-pending") {
        setMessage(result.message);
        return;
      }
      await goAfterAuth(supabase);
      return;
    }

    const result = await signInWithPassword(supabase, normalizedEmail, password);
    setLoading(null);

    if (!result.ok) {
      const needsRegister =
        result.message.includes("regístrate") || result.message.includes("registr");
      if (isUnified && needsRegister) {
        if (!validatePasswordPair(true)) return;
        setUnifiedStep("pick-role");
        setMessage("Cuenta nueva: elige tu perfil para terminar el registro.");
        return;
      }
      setMessage(result.message);
      return;
    }

    await goAfterAuth(supabase);
  }

  function EmailPasswordFields({ idPrefix, showConfirm }: { idPrefix: string; showConfirm: boolean }) {
    return (
      <>
        <div>
          <label
            htmlFor={`${idPrefix}-email`}
            className="mb-1.5 block font-body text-label-sm text-on-surface-variant"
          >
            Correo electrónico
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className={inputClassName}
          />
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-password`}
            className="mb-1.5 block font-body text-label-sm text-on-surface-variant"
          >
            Contraseña
          </label>
          <input
            id={`${idPrefix}-password`}
            type="password"
            autoComplete={showConfirm ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={inputClassName}
          />
        </div>
        {showConfirm && (
          <div>
            <label
              htmlFor={`${idPrefix}-confirm-password`}
              className="mb-1.5 block font-body text-label-sm text-on-surface-variant"
            >
              Confirmar contraseña
            </label>
            <input
              id={`${idPrefix}-confirm-password`}
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              className={inputClassName}
            />
          </div>
        )}
      </>
    );
  }

  if (onPickRoleStep) {
    return (
      <div className="mx-auto w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-organic-lg">
        <div className="mb-6 flex justify-center">
          <HuellaLogo variant="vertical" href={undefined} priority />
        </div>
        <h1 className="mb-2 text-center font-display text-headline-md text-primary">Elige tu perfil</h1>
        <p className="mb-6 text-center font-body text-body-md text-on-surface-variant">
          Es tu primera vez en Huella. ¿Cómo vas a usar la plataforma?
        </p>

        {message && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 font-body text-body-sm ${
              isSuccessMessage(message)
                ? "bg-tertiary-fixed text-on-tertiary-container"
                : "bg-error-container/20 text-error"
            }`}
            role="status"
          >
            {message}
          </div>
        )}

        <RolePicker value={role} onChange={setRole} />

        {needsRoleCompletion ? (
          <button
            type="button"
            onClick={saveRoleAndContinue}
            disabled={loading !== null}
            className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg hover:bg-primary/90 disabled:opacity-60"
          >
            {loading === "role" && (
              <MaterialIcon name="progress_activity" className="animate-spin text-lg" />
            )}
            Continuar a mi panel
          </button>
        ) : (
          <form onSubmit={continueWithEmail} className="mt-6 space-y-4">
            <EmailPasswordFields idPrefix="pick-role" showConfirm />
            <button
              type="submit"
              disabled={loading !== null}
              className="flex h-14 w-full items-center justify-center rounded-full bg-primary font-body text-label-md text-on-primary disabled:opacity-60"
            >
              {loading !== null && (
                <MaterialIcon name="progress_activity" className="mr-2 animate-spin" />
              )}
              Crear cuenta
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-organic-lg">
      <div className="mb-6 flex justify-center">
        <HuellaLogo variant="vertical" href={undefined} priority />
      </div>

      <h1 className="mb-2 text-center font-display text-headline-md text-primary">
        {isUnified ? "Entrar / Registrarse" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h1>
      <p className="mb-6 text-center font-body text-body-md text-on-surface-variant">
        {isUnified
          ? "Continúa con Google o correo. Si es tu primera vez, después eliges tu perfil."
          : isRegister
            ? "Elige tu perfil una sola vez. Luego entras directo a tu panel."
            : "Entra con el correo con el que te registraste."}
      </p>

      {isRegister && (
        <div className="mb-6">
          <RolePicker value={role} onChange={setRole} />
        </div>
      )}

      {message && (
        <div
          className={`mb-6 rounded-lg px-4 py-3 font-body text-body-sm ${
            isSuccessMessage(message)
              ? "bg-tertiary-fixed text-on-tertiary-container"
              : "bg-error-container/20 text-error"
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={loading !== null}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-transform hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
      >
        {loading === "google" ? (
          <MaterialIcon name="progress_activity" className="animate-spin text-xl" />
        ) : (
          <GoogleIcon />
        )}
        Continuar con Google
      </button>
      <p className="mt-2 text-center font-body text-label-sm text-outline">
        Si ya tienes cuenta, entras al instante.
      </p>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-outline-variant" />
        <span className="font-body text-label-sm text-outline">o</span>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      {!showEmailForm ? (
        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-outline-variant bg-surface font-body text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <MaterialIcon name="mail" className="text-lg" />
          Usar correo y contraseña
        </button>
      ) : (
        <form onSubmit={continueWithEmail} className="space-y-4">
          <EmailPasswordFields idPrefix="auth" showConfirm />
          <p className="font-body text-label-sm text-outline">
            ¿Ya tienes cuenta? Solo correo y contraseña. Si es tu primera vez, confirma la contraseña y
            luego eliges tu perfil.
          </p>
          <button
            type="submit"
            disabled={loading !== null}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary-container bg-surface font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
          >
            {loading === "email" && (
              <MaterialIcon name="progress_activity" className="animate-spin text-lg" />
            )}
            {isUnified ? "Entrar / Registrarse" : isRegister ? "Crear cuenta" : "Entrar"}
          </button>
        </form>
      )}

      {!isUnified && (
        <p className="mt-8 text-center font-body text-label-sm text-outline">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <Link href="/acceder" className="text-secondary hover:underline">
                Entrar / Registrarse
              </Link>
            </>
          ) : (
            <>
              ¿Primera vez?{" "}
              <Link href="/acceder" className="text-secondary hover:underline">
                Crear cuenta aquí
              </Link>
            </>
          )}
        </p>
      )}

      {(isUnified || !isRegister) && (
        <p className="mt-3 text-center font-body text-label-sm text-outline">
          Escanear productos y ver trazabilidad no requiere cuenta.
        </p>
      )}
    </div>
  );
}
