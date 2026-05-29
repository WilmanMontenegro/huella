import { notFound } from "next/navigation";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { CheckoutAuthGate } from "@/components/checkout/CheckoutAuthGate";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { getCheckoutItem } from "@/lib/data/lots-repository";
import { getCheckoutConfig, parsePurchaseIntent } from "@/lib/product-copy";

interface PageProps {
  params: { id: string };
  searchParams: { intencion?: string };
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { id } = params;
  const item = await getCheckoutItem(id);

  if (!item) notFound();

  const intent = parsePurchaseIntent(searchParams.intencion);
  const config = getCheckoutConfig(item.product, intent);

  return (
    <div className="flex min-h-screen flex-col">
      <TopAppBar title={config.title} backHref={`/producto/${id}`} variant="checkout" />
      <CheckoutAuthGate lotId={id}>
        <CheckoutClient item={item} config={config} />
      </CheckoutAuthGate>
    </div>
  );
}
