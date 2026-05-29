/**
 * Auth — API pública del módulo.
 * Importar desde `@/lib/auth` para rutas, roles y navegación (evita URLs duplicadas).
 */
export * from "./roles";
export * from "./navigation";
export { buildAuthCallbackUrl, getClientAuthOrigin, PRODUCTION_APP_ORIGIN } from "./app-origin";
