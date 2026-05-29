import type { Lot, ProductFarmInfo } from "@/types";

/** Fotos demo (Unsplash) — producto empaquetado vs finca/cultivo. */
export const LOT_MEDIA = {
  producerPortrait:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAoLOfMP3gtZAJLhbH1DJBuOMlYweVX1K15F4NLNKQDVFZMKSMaCwwN6kQGraIa-xdrP8rTKTUoC8WfoWON_89jPw5ut-Kwr8PKjNP8cotpXM-cwsuUO3MJd1_HeQK-6bbdR0dgRZ-1282K67BzraM9l8ioivuLGXIQELq4swvEGF2NO8DVKXTVVn9-OusQLNpcKF57hsP76j4L80Yvp4jYpZOEuvqRV85gmpvcMPBFMXteq1R4WpNu21RGe83wuFfAAbjB3YBM6t6c",
  coffeeProduct:
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=1200&q=80&auto=format&fit=crop",
  coffeeFarm:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80&auto=format&fit=crop",
  bananaProduct:
    "https://images.unsplash.com/photo-1605027990121-4753a3042ed6?w=1200&q=80&auto=format&fit=crop",
  bananaFarm:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80&auto=format&fit=crop",
} as const;

function productKind(product: string): "coffee" | "banana" | "other" {
  const p = product.toLowerCase();
  if (p.includes("banano")) return "banana";
  if (p.includes("café") || p.includes("cafe") || p.includes("cacao")) return "coffee";
  return "other";
}

/** Hero del producto escaneado — bolsa/marca, no la finca ni el productor. */
export function resolveLotProductPhotoUrl(lot: Pick<Lot, "photoUrl" | "product">): string {
  const url = lot.photoUrl?.trim();
  if (url && url !== LOT_MEDIA.producerPortrait) return url;

  switch (productKind(lot.product)) {
    case "banana":
      return LOT_MEDIA.bananaProduct;
    case "coffee":
      return LOT_MEDIA.coffeeProduct;
    default:
      return LOT_MEDIA.coffeeProduct;
  }
}

/** Finca, beneficio o empresa — paisaje / cultivo. */
export function resolveFarmPhotoUrl(
  lot: Pick<Lot, "product" | "productDetail">,
  farm?: ProductFarmInfo
): string {
  const fromDetail = farm?.imageUrl?.trim() || lot.productDetail?.farm?.imageUrl?.trim();
  if (fromDetail) return fromDetail;

  switch (productKind(lot.product)) {
    case "banana":
      return LOT_MEDIA.bananaFarm;
    case "coffee":
      return LOT_MEDIA.coffeeFarm;
    default:
      return LOT_MEDIA.coffeeFarm;
  }
}
