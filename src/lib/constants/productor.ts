/** Productor demo (Don José) — mismo ID que `supabase/seed.sql` */
export const DEFAULT_PRODUCTOR_ID =
  process.env.NEXT_PUBLIC_DEMO_PRODUCTOR_ID ?? "11111111-1111-1111-1111-111111111101";

import { LOT_MEDIA } from "@/lib/media/lot-images";

/** Miniatura de lote en panel productor (producto, no retrato). */
export const LOT_PHOTO_PLACEHOLDER = LOT_MEDIA.coffeeProduct;
