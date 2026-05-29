/**
 * Modo presentación / demo ante jurado: sin pantalla de login.
 * Activar con NEXT_PUBLIC_AUTH_DISABLED=true (solo hackathon; no usar en prod real).
 */
export function isAuthDisabled(): boolean {
  return process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";
}
