# Secretos — no van al repo (GitHub público)

Estos archivos **no se pueden regenerar** desde cero sin entrar a Supabase / Google Cloud / etc., pero **no deben subirse a un repo público**.

Llévalos en USB, correo cifrado o gestor de contraseñas al otro PC:

| Archivo | Ubicación habitual |
|---------|-------------------|
| `.env.local` | `web/.env.local` |
| Google OAuth JSON | `client_secret_*.json` (raíz del workspace) |
| Auth Supabase local | `web/supabase-auth.local.md` |

En el otro PC, después del `git clone`:

```bash
cd huella
# Pegar .env.local aquí
cp .env.example .env.local   # si partes de cero y solo rellenas valores
```

Plantilla vacía: `.env.example`  
Guía OAuth prod: `supabase-auth.production.md`
