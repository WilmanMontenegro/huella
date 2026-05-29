# Módulo `lib/auth`

Un solo lugar para **roles**, **rutas de panel** y **URLs de login**. Evita armar `/acceder?rol=…` a mano en cada pantalla.

## Import recomendado

```ts
import {
  buildAccederUrl,
  buildAccederUrlForRole,
  getPanelPathForRole,
  getOperadorDashboardPath,
  resolveRedirectAfterAuth,
  readRoleFromUserMetadata,
  LANDING_GUEST_ROLES,
} from "@/lib/auth";
```

## Funciones clave

| Función | Uso |
|---------|-----|
| `buildAccederUrl({ role, next, completarPerfil, authError })` | Cualquier enlace a login |
| `buildAccederUrlForRole("operador")` | Registro/login con destino al panel del rol |
| `getPanelPathForRole(role)` | Botón "Mi panel" / redirect post-login |
| `getOperadorDashboardPath(agenciaSlug?)` | Solo operador turístico |
| `resolveRedirectAfterAuth(next, role)` | Callback OAuth y `/acceder` |
| `displayNameFromAuthUser(user)` | Saludo en landing |
| `LANDING_GUEST_ROLES` | Botones de la home sin sesión (config en `roles.ts`) |

## Añadir un rol nuevo

1. Extender tipo `HuellaRole` y entrada en `ROLE_OPTIONS` (`roles.ts`).
2. Añadir ruta en `getHomePathForRole` si el panel tiene path fijo.
3. Si el panel necesita query (como operador + `agencia`), extender `getPanelPathForRole` en `navigation.ts`.
4. Opcional: `landingCta` + `landingButtonClassName` para el botón en la landing.

## Modo presentación (sin login)

Variable `NEXT_PUBLIC_AUTH_DISABLED=true`: la home enlaza directo a cada panel, checkout sin sesión, `/acceder` redirige al inicio. Ver `presentation.ts`. **Desactivar después del pitch.**

## Archivos

- `roles.ts` — tipos, metadata `huella_role`, textos de UI por rol
- `presentation.ts` — flag de demo sin autenticación
- `navigation.ts` — construcción de URLs (parámetros)
- `app-origin.ts` — callback OAuth en producción
- `smart-auth.ts` — correo/contraseña (Supabase)
- `index.ts` — reexport público
