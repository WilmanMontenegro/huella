"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { AuthFormCard } from "@/components/auth/AuthFormCard";
import { RoleContextBanner } from "@/components/auth/RoleContextBanner";
import { RolePicker } from "@/components/auth/RolePicker";
import {
  buildAuthCallbackUrl,
  getAccederIntro,
  getPanelCtaLabel,
  getPanelPathForRole,
  isValidNextPath,
  type HuellaRole,
  readRoleFromUserMetadata,
} from "@/lib/auth";
import { signInWithPassword, signUpWithPassword } from "@/lib/auth/smart-auth";
import { createClientIfConfigured } from "@/lib/supabase/client";

type AuthStep = "sign-in" | "pick-role";

interface AuthFormProps {
  redirectTo?: string;
  authError?: boolean;
  /** Preselección desde /acceder?rol=… */
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
  redirectTo = "/",
  authError = false,
  initialRole = null,
  needsRoleCompletion = false,
}: AuthFormProps) {
  const [step, setStep] = useState<AuthStep>(needsRoleCompletion ? "pick-role" : "sign-in");
  const [role, setRole] = useState<HuellaRole | null>(initialRole ?? null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | "role" | null>(null);
  const [message, setMessage] = useState<string | null>(
    authError ? "No pudimos completar el acceso. Intenta de nuevo." : null
  );
  const [showEmailForm, setShowEmailForm] = useState(false);
  /** unified: entrar (solo correo+clave) vs crear cuenta (pide confirmar) */
  const [emailIntent, setEmailIntent] = useState<"sign-in" | "sign-up">("sign-in");

  const onPickRoleStep = step === "pick-role";
  const showConfirmPassword = emailIntent === "sign-up";
  const roleIntro = getAccederIntro(initialRole);

  function effectiveRedirect(forRole?: HuellaRole | null): string {
    const r = forRole ?? role;
    if (isValidNextPath(redirectTo)) return redirectTo;
    if (r) return getPanelPathForRole(r);
    return redirectTo;
  }

  function pendingRoleForOAuth(): HuellaRole | null {
    return role ?? initialRole;
  }

  function buildCallbackUrl() {
    const pending = pendingRoleForOAuth();
    return buildAuthCallbackUrl(
      effectiveRedirect(pending),
      pending ? { pending_rol: pending } : undefined
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
      window.location.href = effectiveRedirect(storedRole);
      return;
    }
    setStep("pick-role");
    setMessage("¡Bienvenido! Elige tu perfil para terminar el registro.");
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
      window.location.href = effectiveRedirect(pickedRole);
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
    window.location.href = effectiveRedirect(pickedRole);
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

    const normalizedEmail = email.trim();

    if (!validatePasswordPair(showConfirmPassword)) {
      setLoading(null);
      return;
    }

    if (emailIntent === "sign-up") {
      setLoading(null);
      setStep("pick-role");
      setMessage("Elige tu perfil para terminar el registro.");
      return;
    }

    const result = await signInWithPassword(supabase, normalizedEmail, password);
    setLoading(null);

    if (!result.ok) {
      const needsRegister =
        result.message.includes("regístrate") || result.message.includes("registr");
      if (needsRegister) {
        if (!validatePasswordPair(true)) return;
        setStep("pick-role");
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
      <AuthFormCard>
        <h1 className="mb-2 text-center font-display text-headline-md text-primary">Elige tu perfil</h1>
        <p className="mb-6 text-center font-body text-body-md text-on-surface-variant">
          Una sola vez. Luego entras directo a tu panel.
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
            {role ? getPanelCtaLabel(role) : "Continuar a mi panel"}
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
      </AuthFormCard>
    );
  }

  const signInTitle = initialRole ? roleIntro.title : "Entrar a Huella";
  const signInSubtitle = initialRole
    ? roleIntro.subtitle
    : "Continúa con Google o correo. Si es tu primera vez, eliges tu perfil después.";

  return (
    <AuthFormCard>
      <h1 className="mb-2 text-center font-display text-headline-md text-primary">{signInTitle}</h1>
      <p className="mb-6 text-center font-body text-body-md text-on-surface-variant">{signInSubtitle}</p>

      {initialRole && <RoleContextBanner role={initialRole} />}

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
          <EmailPasswordFields idPrefix="auth" showConfirm={showConfirmPassword} />
          <p className="font-body text-label-sm text-outline">
            {emailIntent === "sign-in" ? (
              <>
                ¿Primera vez?{" "}
                <button
                  type="button"
                  className="text-secondary hover:underline"
                  onClick={() => {
                    setEmailIntent("sign-up");
                    setConfirmPassword("");
                    setMessage(null);
                  }}
                >
                  Crear cuenta
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  className="text-secondary hover:underline"
                  onClick={() => {
                    setEmailIntent("sign-in");
                    setConfirmPassword("");
                    setMessage(null);
                  }}
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </p>
          <button
            type="submit"
            disabled={loading !== null}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary-container bg-surface font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
          >
            {loading === "email" && (
              <MaterialIcon name="progress_activity" className="animate-spin text-lg" />
            )}
            {emailIntent === "sign-up" ? "Continuar" : "Entrar"}
          </button>
        </form>
      )}

      <p className="mt-3 text-center font-body text-label-sm text-outline">
        Escanear productos y ver trazabilidad no requiere cuenta.
      </p>
    </AuthFormCard>
  );
}
