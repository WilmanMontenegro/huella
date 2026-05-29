/** URL pública de producción (Vercel). */
export const PRODUCTION_APP_ORIGIN = "https://web-omega-lilac-31.vercel.app";

function resolveCanonicalOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv && !fromEnv.includes("localhost") && !fromEnv.includes("127.0.0.1")) {
    return fromEnv;
  }
  return PRODUCTION_APP_ORIGIN;
}

/**
 * Origen para callbacks OAuth y enlaces de correo.
 * En build de producción siempre usa la URL canónica (Vercel), no localhost.
 */
export function getClientAuthOrigin(): string {
  if (process.env.NODE_ENV === "production") {
    return resolveCanonicalOrigin();
  }
  if (typeof window !== "undefined") return window.location.origin;
  return resolveCanonicalOrigin();
}

export function buildAuthCallbackUrl(
  nextPath: string,
  extra?: Record<string, string | undefined>
): string {
  const origin = getClientAuthOrigin();
  const params = new URLSearchParams({ next: nextPath });
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  return `${origin}/auth/callback?${params.toString()}`;
}
