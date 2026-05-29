import type { Lot, ProductFarmInfo } from "@/types";

/** Imágenes en /public/media/lots — producto (empaque) vs finca (paisaje/cultivo). */
const MEDIA = "/media/lots";

export const LOT_MEDIA = {
  producerPortrait:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAoLOfMP3gtZAJLhbH1DJBuOMlYweVX1K15F4NLNKQDVFZMKSMaCwwN6kQGraIa-xdrP8rTKTUoC8WfoWON_89jPw5ut-Kwr8PKjNP8cotpXM-cwsuUO3MJd1_HeQK-6bbdR0dgRZ-1282K67BzraM9l8ioivuLGXIQELq4swvEGF2NO8DVKXTVVn9-OusQLNpcKF57hsP76j4L80Yvp4jYpZOEuvqRV85gmpvcMPBFMXteq1R4WpNu21RGe83wuFfAAbjB3YBM6t6c",
  coffeeProduct: `${MEDIA}/coffee-product.jpg`,
  coffeeFarm: `${MEDIA}/coffee-farm.jpg`,
  bananaProduct: `${MEDIA}/banana-product.jpg`,
  bananaFarm: `${MEDIA}/banana-farm.jpg`,
  cacaoProduct: `${MEDIA}/cacao-product.jpg`,
  cacaoFarm: `${MEDIA}/cacao-farm.jpg`,
} as const;

/** Unsplash viejos en BD que devuelven 404 o mezclan producto/finca. */
const LEGACY_BROKEN_URL_MARKERS = [
  "photo-1559056199-641a0ac8b55c",
  "photo-1605027990121",
  "photo-1578662996442",
  "photo-1447933601403",
] as const;

function productKind(product: string): "coffee" | "banana" | "cacao" | "other" {
  const p = product.toLowerCase();
  if (p.includes("banano")) return "banana";
  if (p.includes("cacao")) return "cacao";
  if (p.includes("café") || p.includes("cafe")) return "coffee";
  return "other";
}

function isUsablePhotoUrl(url: string | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  if (trimmed === LOT_MEDIA.producerPortrait) return false;
  if (LEGACY_BROKEN_URL_MARKERS.some((id) => trimmed.includes(id))) return false;
  return true;
}

/** Hero del producto escaneado — bolsa/marca, no la finca ni el productor. */
export function resolveLotProductPhotoUrl(lot: Pick<Lot, "photoUrl" | "product">): string {
  if (isUsablePhotoUrl(lot.photoUrl)) return lot.photoUrl!.trim();

  switch (productKind(lot.product)) {
    case "banana":
      return LOT_MEDIA.bananaProduct;
    case "cacao":
      return LOT_MEDIA.cacaoProduct;
    case "coffee":
      return LOT_MEDIA.coffeeProduct;
    default:
      return LOT_MEDIA.coffeeProduct;
  }
}

/** Finca, beneficio o empresa — paisaje / cultivo (no empaque ni taza). */
export function resolveFarmPhotoUrl(
  lot: Pick<Lot, "product" | "productDetail">,
  farm?: ProductFarmInfo
): string {
  const fromDetail = farm?.imageUrl?.trim() || lot.productDetail?.farm?.imageUrl?.trim();
  if (isUsablePhotoUrl(fromDetail)) return fromDetail!;

  switch (productKind(lot.product)) {
    case "banana":
      return LOT_MEDIA.bananaFarm;
    case "cacao":
      return LOT_MEDIA.cacaoFarm;
    case "coffee":
      return LOT_MEDIA.coffeeFarm;
    default:
      return LOT_MEDIA.coffeeFarm;
  }
}
