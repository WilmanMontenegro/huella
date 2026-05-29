export type PurchaseIntent = "bolsa" | "mayorista";

/** Textos y límites de compra según producto e intención (menor vs mayorista). */
export function getProductCopy(product: string) {
  const p = product.toLowerCase();
  const isBanana = p.includes("banano");
  const isCacao = p.includes("cacao");

  const productName = isBanana ? "banano" : isCacao ? "cacao" : "café";

  return {
    productName,
    timelineTitle: isBanana
      ? "El camino de tu banano"
      : isCacao
        ? "El camino de tu cacao"
        : "El camino de tu café",
    timelineSubtitle: isBanana
      ? "Del cultivo al empaque — cada paso documentado"
      : isCacao
        ? "Del árbol al chocolate — cada paso documentado"
        : "Del árbol a tu taza — cada paso documentado",
    retailCta: isBanana ? "Llevar banano (bolsa)" : "Llevar una bolsa",
    wholesaleCta: "Pedido mayorista / exportación",
    loteHint:
      "Este QR es un lote trazable en finca (un batch de cosecha). No compras todo el lote: eliges bolsas para llevar o un pedido mayorista.",
  };
}

export interface CheckoutPurchaseConfig {
  intent: PurchaseIntent;
  title: string;
  subtitle: string;
  minQty: number;
  maxQty: number;
  defaultFulfillment: "local" | "export";
  qtyLabel: string;
  unitDescription: string;
  showLocal: boolean;
  showExport: boolean;
}

export function getCheckoutConfig(product: string, intent: PurchaseIntent): CheckoutPurchaseConfig {
  const p = product.toLowerCase();
  const isBanana = p.includes("banano");

  if (intent === "bolsa") {
    return {
      intent,
      title: "Llevar producto contigo",
      subtitle: "Compra al por menor — para turistas o consumo personal",
      minQty: 1,
      maxQty: 5,
      defaultFulfillment: "local",
      qtyLabel: "Bolsas",
      unitDescription: isBanana ? "~2 kg por bolsa" : "250 g grano / molido por bolsa",
      showLocal: true,
      showExport: false,
    };
  }

  return {
    intent,
    title: "Pedido mayorista / exportación",
    subtitle: "Grandes cantidades — el exportador revisa y aprueba el envío",
    minQty: 10,
    maxQty: 200,
    defaultFulfillment: "export",
    qtyLabel: isBanana ? "Cajas de exportación" : "Sacos",
    unitDescription: isBanana ? "~18 kg por caja" : "~60 kg por saco",
    showLocal: false,
    showExport: true,
  };
}

export function parsePurchaseIntent(value: string | undefined): PurchaseIntent {
  return value === "mayorista" ? "mayorista" : "bolsa";
}
