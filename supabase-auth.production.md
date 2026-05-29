# Huella — Auth OAuth (producción)

Proyecto Supabase: `chlrbrsbjacqxjekjefu`  
App: **https://web-omega-lilac-31.vercel.app**

## Si tras Google ves `localhost` o *connection refused*

Eso pasa **en producción** cuando en Supabase la **Site URL** sigue en `http://localhost:3000`.  
No depende de que tú abras la app en local.

### Arreglo (2 minutos)

1. [Supabase Dashboard](https://supabase.com/dashboard/project/chlrbrsbjacqxjekjefu/auth/url-configuration) → **Authentication** → **URL Configuration**
2. **Site URL** → `https://web-omega-lilac-31.vercel.app`
3. **Redirect URLs** — añade (una por línea):

```
https://web-omega-lilac-31.vercel.app/auth/callback
https://web-omega-lilac-31.vercel.app/**
```

4. Guardar.

### Vercel (variables de entorno)

En el proyecto **huella** en Vercel:

| Variable | Valor |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://web-omega-lilac-31.vercel.app` |

No debe quedar `localhost` en ninguna variable pública del deploy.

## Google Cloud

Redirect URI del cliente OAuth web:

```
https://chlrbrsbjacqxjekjefu.supabase.co/auth/v1/callback
```

Pantalla de consentimiento → página principal: `https://web-omega-lilac-31.vercel.app`
