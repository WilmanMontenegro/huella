# Huella — Auth OAuth (plantilla)

Copia este archivo a `supabase-auth.local.md` y completa con los valores de tu proyecto Supabase.

## Callback URL (Google Cloud)

```
https://TU-PROJECT-REF.supabase.co/auth/v1/callback
```

## URL Configuration (Supabase Dashboard) — obligatorio

Authentication → **URL Configuration**:

| Campo | Valor |
|--------|--------|
| **Site URL** | `https://web-omega-lilac-31.vercel.app` (no dejes `localhost` si pruebas en producción) |
| **Redirect URLs** | Ver lista abajo |

Si **Site URL** queda en `http://localhost:3000`, tras Google te manda a localhost y verás *connection refused* si no tienes `pnpm dev` corriendo.

```
http://localhost:3000/auth/callback
https://web-omega-lilac-31.vercel.app/auth/callback
https://web-omega-lilac-31.vercel.app/**
```

## Pantalla de Google “Sign in to continue to …supabase.co”

Google muestra el dominio del callback (`PROJECT_REF.supabase.co`) si la **pantalla de consentimiento OAuth** no está bien configurada.

En [Google Cloud Console](https://console.cloud.google.com/) → APIs y servicios → **Pantalla de consentimiento de OAuth**:

1. **Nombre de la aplicación:** `Huella` (no el project ref de Supabase)
2. **Logo de la aplicación:** sube el logo Huella (cuadrado, ~120×120 px)
3. **Correo de asistencia** y **correos de contacto del desarrollador**
4. **Página principal de la aplicación:** `https://TU-DOMINIO.vercel.app`
5. **Dominios autorizados:** `vercel.app` (y tu dominio propio si tienes)

Luego en **Credenciales** → tu cliente OAuth web, verifica el redirect:

```
https://TU-PROJECT-REF.supabase.co/auth/v1/callback
```

Tras guardar, puede tardar unos minutos. En muchos casos el texto pasa a **“Continuar a Huella”** en lugar del subdominio feo.

### Quitar por completo `*.supabase.co` en la pantalla de Google

Solo con **dominio personalizado de Auth** en Supabase (plan de pago): p. ej. `auth.tudominio.com` apuntando al proyecto. Sin eso, Google siempre verá el dominio de Supabase en el flujo OAuth.

## Archivos locales (no subir)

- `client_secret*.json` — JSON descargado de Google Cloud
- Carpeta opcional: `web/.local/` para copias de respaldo
