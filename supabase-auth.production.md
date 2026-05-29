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

### Vercel — no hace falta tocar el panel

La URL de producción ya está en el código (`PRODUCTION_APP_ORIGIN`) y en `vercel.json` del repo.  
**No necesitas** editar Environment Variables en Vercel para que Google funcione.

Lo que sí debes cambiar es **Supabase** (arriba).

## Google Cloud

Redirect URI del cliente OAuth web:

```
https://chlrbrsbjacqxjekjefu.supabase.co/auth/v1/callback
```

Pantalla de consentimiento → página principal: `https://web-omega-lilac-31.vercel.app`
