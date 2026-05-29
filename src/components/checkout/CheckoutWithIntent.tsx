"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import {
  getCheckoutConfig,
  getProductCopy,
  parsePurchaseIntent,
  type PurchaseIntent,
} from "@/lib/product-copy";
import type { CheckoutItem } from "@/types";

interface CheckoutWithIntentProps {
  item: CheckoutItem;
  initialIntent?: string;
}

export function CheckoutWithIntent({ item, initialIntent }: CheckoutWithIntentProps) {
  const router = useRouter();
  const parsed = initialIntent ? parsePurchaseIntent(initialIntent) : null;
  const [intent, setIntent] = useState<PurchaseIntent | null>(parsed);

  if (!intent) {
    const copy = getProductCopy(item.product);

    return (
      <main className="mx-auto w-full max-w-lg flex-grow px-container-padding-mobile py-10 pb-28 md:px-container-padding-desktop">
        <h2 className="font-display text-headline-md text-primary">¿Cómo quieres comprar?</h2>
        <p className="mt-2 font-body text-body-md text-on-surface-variant">{copy.loteHint}</p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setIntent("bolsa");
              router.replace(`/checkout/${item.lotId}?intencion=bolsa`);
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            <MaterialIcon name="shopping_bag" className="text-xl" />
            {copy.retailCta}
          </button>
          <button
            type="button"
            onClick={() => {
              setIntent("mayorista");
              router.replace(`/checkout/${item.lotId}?intencion=mayorista`);
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-secondary bg-surface font-body text-label-md text-secondary transition-colors hover:bg-secondary/10 active:scale-[0.98]"
          >
            <MaterialIcon name="local_shipping" className="text-xl" />
            {copy.wholesaleCta}
          </button>
        </div>
      </main>
    );
  }

  const config = getCheckoutConfig(item.product, intent);
  return <CheckoutClient item={item} config={config} />;
}
