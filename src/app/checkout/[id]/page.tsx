import { notFound } from "next/navigation";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { CheckoutAuthGate } from "@/components/checkout/CheckoutAuthGate";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { getCheckoutItem } from "@/lib/data/lots-repository";

interface PageProps {
  params: { id: string };
}

export default async function CheckoutPage({ params }: PageProps) {
  const { id } = params;
  const item = await getCheckoutItem(id);

  if (!item) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <TopAppBar title="Pago" backHref={`/producto/${id}`} variant="checkout" />
      <CheckoutAuthGate lotId={id}>
        <CheckoutClient item={item} />
      </CheckoutAuthGate>
    </div>
  );
}
