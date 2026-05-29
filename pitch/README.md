# Huella — Material de pitch

Carpeta versionada en el repo (`web/pitch/`). Editas el deck aquí; el PDF para compartir se genera en `presentacion-pitch.pdf` (raíz del repo).

Kit para presentación oral (5 min). Colores alineados con `web/src/lib/design/tokens.ts`.

## Cómo usarlo

1. Abre **`index.html`** en Chrome o Edge (iconos SVG embebidos, sin internet).
2. Guion en **`guion.html`** (opcional).
3. **`DATOS-Y-FUENTES.md`** — respaldo de afirmaciones.
4. **PDF para GitHub:** `node scripts/export-pdf.mjs` → actualiza `index.pdf` (vista previa) y `web/presentacion-pitch.pdf` (raíz del repo).
5. QR impreso: **`qr/finca-la-esperanza.png`**.

## Estructura (todo necesario para `index.html`)

| Carpeta / archivo | Uso |
|-------------------|-----|
| `index.html` | 6 diapositivas (fuente) |
| `brand/` | Logos Huella |
| `images/` | Fotos de las slides |
| `icons/ph/` | SVG Phosphor (respaldo; el HTML ya los tiene inline) |
| `qr/` | QR demo para slide 4 |
| `scripts/` | `sync-icons.mjs`, `export-pdf.mjs` |
| `index.pdf` | Vista previa local (no se sube) |

## Demo en producción

https://web-omega-lilac-31.vercel.app/producto/finca-la-esperanza

## Regenerar QR

Desde `web/`: `pnpm qr:generate` → escribe en `pitch/qr/`.
