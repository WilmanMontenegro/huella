import { notFound } from "next/navigation";
import { CheckoutWithIntent } from "@/components/checkout/CheckoutWithIntent";
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

  const intent = searchParams.intencion ? parsePurchaseIntent(searchParams.intencion) : undefined;
  const config = intent ? getCheckoutConfig(item.product, intent) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <TopAppBar title={config?.title ?? "Comprar"} backHref={`/producto/${id}`} variant="checkout" />
      <CheckoutAuthGate lotId={id}>
        <CheckoutWithIntent item={item} initialIntent={searchParams.intencion} />
      </CheckoutAuthGate>
    </div>
  );
}
