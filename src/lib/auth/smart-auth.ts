import type { SupabaseClient } from "@supabase/supabase-js";

export function isInvalidCredentialsError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("invalid login credentials") ||
    m.includes("invalid credentials") ||
    m.includes("invalid email or password")
  );
}

export function isAlreadyRegisteredError(message: string): boolean {
  const m = message.toLowerCase();
  return m.includes("already registered") || m.includes("already been registered");
}

/** Intenta entrar; si no hay cuenta, la registra con la misma contraseña. */
export async function signInOrSignUpWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string,
  emailRedirectTo: string
) {
  const signIn = await supabase.auth.signInWithPassword({ email, password });

  if (!signIn.error) {
    return { ok: true as const, kind: "sign-in" as const };
  }

  if (!isInvalidCredentialsError(signIn.error.message)) {
    if (signIn.error.message.toLowerCase().includes("email not confirmed")) {
      return {
        ok: false as const,
        message: "Confirma tu correo antes de entrar (revisa la bandeja de entrada o spam).",
      };
    }
    return { ok: false as const, message: signIn.error.message };
  }

  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (signUp.error) {
    if (isAlreadyRegisteredError(signUp.error.message)) {
      return {
        ok: false as const,
        message:
          "Este correo ya está registrado. Usa tu contraseña correcta o el enlace mágico por correo.",
      };
    }
    return { ok: false as const, message: signUp.error.message };
  }

  if (signUp.data.session) {
    return { ok: true as const, kind: "sign-up" as const };
  }

  return {
    ok: true as const,
    kind: "sign-up-pending" as const,
    message: "Creamos tu cuenta. Revisa tu correo para confirmar y luego entra con tu contraseña.",
  };
}

/** Enlace mágico: entra si existe cuenta; si no, Supabase crea el usuario. */
export async function sendSmartMagicLink(
  supabase: SupabaseClient,
  email: string,
  emailRedirectTo: string
) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return {
    ok: true as const,
    message:
      "Revisa tu correo: abre el enlace para entrar. Si es tu primera vez en Huella, tu cuenta se crea al usarlo.",
  };
}
