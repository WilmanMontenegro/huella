# Auth — Huella

Un solo flujo de acceso: **`/acceder`** (Google + correo). `/login` y `/registro` redirigen aquí.

## Importar

```ts
import {
  buildAccederUrl,
  buildAccederUrlForRole,
  getPanelPathForRole,
  resolveRedirectAfterAuth,
  isAuthDisabled,
} from "@/lib/auth";
```

Paneles protegidos (solo server):

```ts
import { requirePanelRole, requireOperadorPanel } from "@/lib/auth/panel-access";
```

Cliente (checkout, etc.):

```ts
import { ClientAuthGate } from "@/components/auth/ClientAuthGate";
import { RoleAccederLink } from "@/components/auth/RoleAccederLink";
```

## Rutas por rol

| Rol | Panel |
|-----|--------|
| turista | `/mis-pedidos` |
| productor | `/productor/dashboard` |
| operador | `/operador/dashboard?agencia=huella-tours` |
| exportador | `/exportador/dashboard` |

## Landing

- **Turista:** escanear QR (sin cuenta) o **Entrar** en el header.
- **Productor / operador / exportador:** tarjetas → `/acceder?rol=…&next=…`.

## Verificación

```bash
pnpm auth:verify
```

## Modo presentación

`NEXT_PUBLIC_AUTH_DISABLED=true` — sin login; paneles directos. Desactivar en producción real.
