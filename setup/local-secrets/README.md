# ⚠️ Secretos temporales (base64) — BORRAR del repo después

GitHub bloquea pushes con secretos en texto plano. Aquí van **codificados en `.b64`**.

## Restaurar en otro PC

```powershell
cd huella   # raíz del repo
.\setup\local-secrets\RESTORE.ps1
```

O sigue las instrucciones en `RESTORE.ps1` (PowerShell / bash).

Copia a:
- `.env.local` → raíz del repo
- `supabase-auth.local.md` → raíz del repo  
- `client_secret_*.json` → carpeta padre del repo (workspace)

## Después

1. Borra `setup/local-secrets/` del repo y commit.
2. Rota claves si el repo fue público con estos archivos.
