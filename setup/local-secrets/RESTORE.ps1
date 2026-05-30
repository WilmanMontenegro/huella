# Restaurar secretos desde archivos .b64 (temporal)

```powershell
# Desde web/ (raíz del repo clonado)
$dir = "setup\local-secrets"
$map = @{
  ".env.local.b64" = ".env.local"
  "supabase-auth.local.md.b64" = "supabase-auth.local.md"
  "client_secret_503751174573-5t6id6ugh1dtbrkpe9681jnc69045fog.apps.googleusercontent.com.json.b64" = "client_secret_503751174573-5t6id6ugh1dtbrkpe9681jnc69045fog.apps.googleusercontent.com.json"
}
foreach ($entry in $map.GetEnumerator()) {
  $src = Join-Path $dir $entry.Key
  if ($entry.Value -like "client_secret*") {
    $dst = Join-Path ".." $entry.Value
  } elseif ($entry.Value -eq ".env.local" -or $entry.Value -like "supabase*") {
    $dst = Join-Path "." $entry.Value
  } else {
    $dst = Join-Path $dir $entry.Value
  }
  [IO.File]::WriteAllBytes($dst, [Convert]::FromBase64String([IO.File]::ReadAllText($src)))
  Write-Host "OK $dst"
}
```

Bash:

```bash
cd huella
b64decode() { base64 -d > "$2" < "$1"; }
b64decode setup/local-secrets/.env.local.b64 .env.local
b64decode setup/local-secrets/supabase-auth.local.md.b64 supabase-auth.local.md
b64decode setup/local-secrets/client_secret_503751174573-5t6id6ugh1dtbrkpe9681jnc69045fog.apps.googleusercontent.com.json.b64 ../client_secret_503751174573-5t6id6ugh1dtbrkpe9681jnc69045fog.apps.googleusercontent.com.json
```

Después borra `setup/local-secrets/` del repo.
