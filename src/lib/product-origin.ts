import { resolveFarmPhotoUrl } from "@/lib/media/lot-images";
import type { Lot, Producer, ProductBrandInfo, ProductFarmInfo } from "@/types";

export interface ProductOrigin {
  productLine: string;
  brand: ProductBrandInfo;
  farm: ProductFarmInfo;
}

export function resolveProductOrigin(lot: Lot, producer: Producer): ProductOrigin {
  const productLine = [lot.product, lot.variety].filter(Boolean).join(" · ");
  const detail = lot.productDetail;

  const brand: ProductBrandInfo = detail?.brand ?? {
    name: detail?.displayName ?? productLine,
    tagline: `Producto trazable de ${lot.farmName}`,
    description: detail?.summary,
  };

  const farmBase: ProductFarmInfo = detail?.farm ?? {
    name: lot.farmName,
    companyName: `${lot.farmName} — ${producer.name} y familia`,
    municipality: producer.municipality,
    region: "Sierra Nevada del Magdalena, Colombia",
    description: `Cultivo y proceso en ${lot.farmName}${
      lot.elevation ? ` (${lot.elevation})` : ""
    }. Trazabilidad registrada con Huella desde la finca hasta el comprador.`,
  };

  const farm: ProductFarmInfo = {
    ...farmBase,
    imageUrl: resolveFarmPhotoUrl(lot, farmBase),
  };

  return { productLine, brand, farm };
}
