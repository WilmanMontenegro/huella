/**
 * Lotes con QR imprimible: cada slug abre /producto/[slug] con trazabilidad,
 * historia del productor y detalle del producto de esa finca.
 */
export const QR_PUBLIC_LOTS = [
  {
    slug: "finca-la-esperanza",
    fileName: "finca-la-esperanza.png",
    label: "Finca La Esperanza · Café Castillo",
    farmName: "Finca La Esperanza",
    product: "Café",
  },
  {
    slug: "gros-michel-norte-3",
    fileName: "gros-michel-norte-3.png",
    label: "Finca La Esperanza · Banano Gros Michel (Lote Norte #3)",
    farmName: "Finca La Esperanza",
    product: "Banano",
  },
] as const;

export type QrPublicLot = (typeof QR_PUBLIC_LOTS)[number];
