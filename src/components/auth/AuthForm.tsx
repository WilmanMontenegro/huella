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
import {
  sendMagicLink,
  signInOrSignUpWithPassword,
  signInWithPassword,
  signUpWithPassword,
} from "@/lib/auth/smart-auth";
import { createClientIfConfigured } from "@/lib/supabase/client";

export type AuthFormMode = "login" | "register" | "unified";

interface AuthFormProps {
  mode: AuthFormMode;
  redirectTo?: string;
  authError?: boolean;
  /** Preselección desde /acceder?rol=operador|productor|… */
  initialRole?: HuellaRole | null;
}

type EmailMode = "magic-link" | "password";

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
}: AuthFormProps) {
  const isRegister = mode === "register";
  const isUnified = mode === "unified";
  const showRolePicker = isRegister || isUnified;
  const [role, setRole] = useState<HuellaRole | null>(
    isRegister ? (initialRole ?? null) : isUnified ? (initialRole ?? "turista") : "turista"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailMode, setEmailMode] = useState<EmailMode>("magic-link");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [message, setMessage] = useState<string | null>(
    authError ? "No pudimos completar el acceso. Intenta de nuevo." : null
  );
  const [showEmailForm, setShowEmailForm] = useState(false);

  function effectiveRedirect(): string {
    if (
      redirectTo.startsWith("/") &&
      redirectTo !== "/login" &&
      redirectTo !== "/registro" &&
      redirectTo !== "/acceder"
    ) {
      return redirectTo;
    }
    if ((isRegister || isUnified) && role) return getHomePathForRole(role);
    return redirectTo;
  }

  function buildCallbackUrl(forRole?: HuellaRole) {
    const next = encodeURIComponent(effectiveRedirect());
    const base = `${window.location.origin}/auth/callback?next=${next}`;
    const r = forRole ?? role;
    if (r && (isRegister || isUnified)) return `${base}&role=${r}`;
    return base;
  }

  function getSupabase() {
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setMessage(
        process.env.NODE_ENV === "production"
          ? "El acceso aún no está disponible. Si acabas de desplegar, espera un minuto y recarga."
          : "Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local (ver .env.example)."
      );
      return null;
    }
    return supabase;
  }

  function requireRole(): HuellaRole | null {
    if (!showRolePicker) return "turista";
    if (role) return role;
    setMessage("Elige cómo quieres usar Huella antes de continuar.");
    return null;
  }

  async function goAfterAuth(supabase: NonNullable<ReturnType<typeof createClientIfConfigured>>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const storedRole = readRoleFromUserMetadata(user?.user_metadata as Record<string, unknown>);
    window.location.href = storedRole ? getHomePathForRole(storedRole) : effectiveRedirect();
  }

  async function continueWithGoogle() {
    const pickedRole = requireRole();
    if (!pickedRole) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setLoading("google");
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: buildCallbackUrl(pickedRole),
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(null);
    }
  }

  async function continueWithEmail(e: React.FormEvent) {
    e.preventDefault();
    const pickedRole = requireRole();
    if (!pickedRole) return;

    const supabase = getSupabase();
    if (!supabase || !email.trim()) return;

    setLoading("email");
    setMessage(null);

    const callbackUrl = buildCallbackUrl(pickedRole);
    const normalizedEmail = email.trim();

    if (emailMode === "magic-link") {
      const result = await sendMagicLink(supabase, normalizedEmail, callbackUrl, {
        createUser: isRegister || isUnified,
        role: showRolePicker ? pickedRole : undefined,
      });
      setLoading(null);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      setMessage(result.message);
      return;
    }

    if (!password) {
      setLoading(null);
      setMessage("Escribe tu contraseña para continuar.");
      return;
    }

    if (isRegister) {
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

    if (isUnified) {
      const result = await signInOrSignUpWithPassword(
        supabase,
        normalizedEmail,
        password,
        callbackUrl,
        pickedRole
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
      setMessage(result.message);
      return;
    }
    await goAfterAuth(supabase);
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
          ? "Si ya tienes cuenta, entras; si no, la creamos con el perfil que elijas abajo."
          : isRegister
            ? "Elige tu perfil una sola vez. Luego entras directo a tu panel."
            : "Entra con el correo con el que te registraste."}
      </p>

      {showRolePicker && (
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
        {isUnified ? "Continuar con Google" : isRegister ? "Registrarse con Google" : "Continuar con Google"}
      </button>

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
          Continuar con correo
        </button>
      ) : (
        <form onSubmit={continueWithEmail} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="mb-1.5 block font-body text-label-sm text-on-surface-variant">
              Correo electrónico
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="h-12 w-full rounded-xl border border-outline-variant bg-surface px-4 font-body text-body-md text-on-surface outline-none ring-primary focus:border-primary focus:ring-2"
            />
          </div>

          {emailMode === "password" && (
            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block font-body text-label-sm text-on-surface-variant"
              >
                Contraseña
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="h-12 w-full rounded-xl border border-outline-variant bg-surface px-4 font-body text-body-md text-on-surface outline-none ring-primary focus:border-primary focus:ring-2"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading !== null}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary-container bg-surface font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
          >
            {loading === "email" && (
              <MaterialIcon name="progress_activity" className="animate-spin text-lg" />
            )}
            {isUnified ? "Continuar" : isRegister ? "Crear cuenta" : "Entrar"}
          </button>

          <div className="flex flex-col gap-2 pt-1 text-center">
            {emailMode === "magic-link" ? (
              <button
                type="button"
                onClick={() => {
                  setEmailMode("password");
                  setMessage(null);
                }}
                className="font-body text-label-sm text-secondary hover:underline"
              >
                Prefiero usar contraseña
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEmailMode("magic-link");
                  setPassword("");
                  setMessage(null);
                }}
                className="font-body text-label-sm text-secondary hover:underline"
              >
                Prefiero enlace por correo
              </button>
            )}
          </div>
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
