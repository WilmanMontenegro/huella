/** URL pública de producción (Vercel). */
export const PRODUCTION_APP_ORIGIN = "https://web-omega-lilac-31.vercel.app";

/**
 * Origen para el callback OAuth. En el navegador usa siempre la URL actual
 * (así en Vercel no cae en localhost por variables de entorno del build).
 */
export function getClientAuthOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return PRODUCTION_APP_ORIGIN;
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
