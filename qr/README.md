# QR por producto / lote (Finca La Esperanza)

Cada PNG apunta a **`/producto/[slug]`**: la ficha pública con detalle del producto, historia de Don José, mapa, certificaciones, línea de tiempo y tours de la finca (según el plan MagTrace / Huella).

| Archivo | Producto | URL en producción |
|---------|----------|-------------------|
| `finca-la-esperanza.png` | Café Castillo | `/producto/finca-la-esperanza` |
| `gros-michel-norte-3.png` | Banano Gros Michel · Lote Norte #3 | `/producto/gros-michel-norte-3` |

Lista actualizada en `manifest.json` tras regenerar.

## Regenerar todos los QR

Desde `web/`:

```bash
pnpm qr:generate
```

Usa la lista en `src/data/qr-lots.ts`. La URL base es `NEXT_PUBLIC_APP_URL` o, si es localhost, la URL de producción del hackathon.

## Probar

1. Imprime o muestra el PNG del **producto** que quieras demostrar.
2. Escanea con la cámara del celular.
3. Debe abrir la trazabilidad de **ese lote** (no la landing genérica).
4. En la app: **Escanear producto** también acepta esas URLs.

## Añadir otro lote

1. Alta del lote en Supabase (slug único, `product_detail`, trazabilidad con `orden` 0–9).
2. Añade la entrada en `src/data/qr-lots.ts`.
3. `pnpm qr:generate`.
