"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { HuellaLogo } from "@/components/brand/HuellaLogo";
import { sendSmartMagicLink, signInOrSignUpWithPassword } from "@/lib/auth/smart-auth";
import { createClientIfConfigured } from "@/lib/supabase/client";

interface LoginFormProps {
  redirectTo?: string;
  authError?: boolean;
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
    message.includes("primera vez")
  );
}

export function LoginForm({ redirectTo = "/", authError = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailMode, setEmailMode] = useState<EmailMode>("magic-link");
  const [loading, setLoading] = useState<"google" | "email" | null>(null);
  const [message, setMessage] = useState<string | null>(
    authError ? "No pudimos completar el acceso. Intenta de nuevo con Google o correo." : null
  );
  const [showEmailForm, setShowEmailForm] = useState(false);

  function buildCallbackUrl() {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
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

  function goAfterAuth() {
    window.location.href = redirectTo;
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
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(null);
    }
  }

  async function continueWithEmail(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !email.trim()) return;

    setLoading("email");
    setMessage(null);

    const callbackUrl = buildCallbackUrl();
    const normalizedEmail = email.trim();

    if (emailMode === "magic-link") {
      const result = await sendSmartMagicLink(supabase, normalizedEmail, callbackUrl);
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

    const result = await signInOrSignUpWithPassword(
      supabase,
      normalizedEmail,
      password,
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

    goAfterAuth();
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-organic-lg">
      <div className="mb-6 flex justify-center">
        <HuellaLogo variant="vertical" href={undefined} priority />
      </div>
      <h1 className="mb-2 text-center font-display text-headline-md text-primary">Continúa con Huella</h1>
      <p className="mb-8 text-center font-body text-body-md text-on-surface-variant">
        Un solo paso: si ya tienes cuenta entras; si no, la creamos al vuelo. Solo hace falta para comprar.
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
        Primera vez o cuenta existente: Google detecta tu correo automáticamente.
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
          Continuar con correo
        </button>
      ) : (
        <form onSubmit={continueWithEmail} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block font-body text-label-sm text-on-surface-variant">
              Correo electrónico
            </label>
            <input
              id="login-email"
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
                htmlFor="login-password"
                className="mb-1.5 block font-body text-label-sm text-on-surface-variant"
              >
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
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
            Continuar
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
                Prefiero enlace por correo (sin contraseña)
              </button>
            )}
            {emailMode === "magic-link" && (
              <p className="font-body text-label-sm text-outline">
                Te enviamos un enlace: sirve para entrar o crear cuenta con el mismo correo.
              </p>
            )}
            {emailMode === "password" && (
              <p className="font-body text-label-sm text-outline">
                Si el correo es nuevo, registramos tu cuenta; si ya existe, iniciamos sesión.
              </p>
            )}
          </div>
        </form>
      )}

      <p className="mt-8 text-center font-body text-label-sm text-outline">
        Explorar productos y trazabilidad no requiere cuenta.
      </p>
    </div>
  );
}
