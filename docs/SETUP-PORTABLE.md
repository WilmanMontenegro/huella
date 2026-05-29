# Llevar el proyecto a otro PC (vía GitHub)

Todo lo que **no se regenera** está versionado en este repo. Lo que **sí se regenera** (`node_modules`, `.next`) no se sube.

## En el otro PC

```bash
git clone https://github.com/WilmanMontenegro/huella.git
cd huella
cp .env.example .env.local   # luego pegar valores (ver setup/SECRETS-MANUAL.md)
pnpm install
pnpm dev
```

## Qué incluye el repo (portable)

| Carpeta / archivo | Qué es |
|-------------------|--------|
| `pitch/` | Deck HTML, guion, QR, scripts PDF, imágenes |
| `docs/stitch-export/` | Export Google Stitch (referencia diseño) |
| `docs/magtrace-plan.md` | Plan MVP + guía pitch |
| `public/brand/` | Logos Huella (con y sin fondo) |
| `presentacion-pitch.pdf` | PDF del pitch |
| `setup/cursor/` | MCP Engram + regla Cursor (copiar a `.cursor/` en la raíz del workspace) |
| `setup/engram/` | Config memoria (`project_name: magtrace`) |

## Workspace Cursor (opcional)

Abre la carpeta **padre** del repo (`Hackaton 5.0/` o donde clones) y copia:

```
setup/cursor/mcp.json      → .cursor/mcp.json
setup/cursor/rules/engram.mdc → .cursor/rules/engram.mdc
setup/engram/config.json   → .engram/config.json
```

En Windows, si MCP no arranca, edita `mcp.json` y usa la ruta absoluta a `engram.exe`.

## Secretos (no están en GitHub)

Ver [setup/SECRETS-MANUAL.md](../setup/SECRETS-MANUAL.md) — llevar en USB o gestor de contraseñas.
