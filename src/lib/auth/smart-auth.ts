import type { SupabaseClient } from "@supabase/supabase-js";
import { HUELLA_ROLE_KEY, type HuellaRole } from "@/lib/auth/roles";

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

function roleMetadata(role: HuellaRole) {
  return { [HUELLA_ROLE_KEY]: role };
}

/** Solo inicio de sesión (no crea cuenta nueva). */
export async function signInWithPassword(supabase: SupabaseClient, email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return {
        ok: false as const,
        message: "Confirma tu correo antes de entrar (revisa la bandeja de entrada o spam).",
      };
    }
    if (isInvalidCredentialsError(error.message)) {
      return {
        ok: false as const,
        message: "Correo o contraseña incorrectos. Si no tienes cuenta, regístrate primero.",
      };
    }
    return { ok: false as const, message: error.message };
  }

  return { ok: true as const };
}

/** Registro con rol en metadata. */
export async function signUpWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string,
  role: HuellaRole,
  emailRedirectTo: string
) {
  const signUp = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: roleMetadata(role),
    },
  });

  if (signUp.error) {
    if (isAlreadyRegisteredError(signUp.error.message)) {
      return {
        ok: false as const,
        message: "Este correo ya está registrado. Inicia sesión con tu contraseña.",
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
    message: "Creamos tu cuenta. Revisa tu correo para confirmar y luego inicia sesión.",
  };
}

/** Entra si existe cuenta; si no, registra con el rol indicado. */
export async function signInOrSignUpWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string,
  emailRedirectTo: string,
  role: HuellaRole = "turista"
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
    options: { emailRedirectTo, data: roleMetadata(role) },
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

export async function sendMagicLink(
  supabase: SupabaseClient,
  email: string,
  emailRedirectTo: string,
  options?: { createUser?: boolean; role?: HuellaRole }
) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
      shouldCreateUser: options?.createUser ?? true,
      data: options?.role ? roleMetadata(options.role) : undefined,
    },
  });

  if (error) {
    return { ok: false as const, message: error.message };
  }

  return {
    ok: true as const,
    message: options?.createUser
      ? "Revisa tu correo: el enlace activa tu cuenta y te lleva a tu panel."
      : "Revisa tu correo: abre el enlace para entrar.",
  };
}

/** @deprecated Usar sendMagicLink */
export async function sendSmartMagicLink(
  supabase: SupabaseClient,
  email: string,
  emailRedirectTo: string
) {
  return sendMagicLink(supabase, email, emailRedirectTo, { createUser: true });
}
