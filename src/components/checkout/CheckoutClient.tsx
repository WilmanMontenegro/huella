"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { SimulatedPayment } from "@/components/checkout/SimulatedPayment";
import type { CheckoutPurchaseConfig } from "@/lib/product-copy";
import { readReferralSlug } from "@/lib/referral/client";
import { savePedidoLocal } from "@/lib/pedidos-local";
import {
  generateSimulatedTransactionId,
  paymentMethodLabel,
  simulatePaymentDelay,
  type SimulatedPaymentMethod,
} from "@/lib/payment/simulate";
import type { CheckoutItem } from "@/types";

type Fulfillment = "local" | "export";

interface CheckoutClientProps {
  item: CheckoutItem;
  config: CheckoutPurchaseConfig;
}

export function CheckoutClient({ item, config }: CheckoutClientProps) {
  const router = useRouter();
  const [qty, setQty] = useState(config.minQty);
  const [fulfillment, setFulfillment] = useState<Fulfillment>(config.defaultFulfillment);
  const [paisDestino, setPaisDestino] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<SimulatedPaymentMethod>("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242424242424242");
  const [receipt, setReceipt] = useState<{ txId: string; method: string } | null>(null);

  useEffect(() => {
    setQty(config.minQty);
    setFulfillment(config.defaultFulfillment);
  }, [config]);

  const shipping = fulfillment === "export" ? 15 : 0;
  const subtotal = item.priceUsd * qty;
  const total = subtotal + shipping;

  const formatted = useMemo(
    () => ({
      subtotal: `$${subtotal.toFixed(2)}`,
      shipping: shipping === 0 ? "$0.00" : `$${shipping.toFixed(2)}`,
      total: `$${total.toFixed(2)}`,
    }),
    [subtotal, shipping, total]
  );

  function changeQty(delta: number) {
    setQty((q) => Math.min(config.maxQty, Math.max(config.minQty, q + delta)));
  }

  async function handlePay() {
    if (config.intent === "mayorista" && fulfillment === "export" && !paisDestino.trim()) {
      alert("Indica el país de destino para el pedido de exportación.");
      return;
    }
    if (paymentMethod === "card" && cardNumber.replace(/\s/g, "").length < 15) {
      alert("Ingresa un número de tarjeta válido (demo: 4242…).");
      return;
    }

    setLoading(true);
    const txId = generateSimulatedTransactionId();
    const methodLabel = paymentMethodLabel(paymentMethod);

    try {
      await simulatePaymentDelay(2200);

      const agenciaReferenteSlug = readReferralSlug();

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotSlug: item.lotId,
          cantidad: qty,
          tipoEnvio: fulfillment,
          paisDestino: fulfillment === "export" ? paisDestino.trim() || "Internacional" : "Colombia",
          totalUsd: total,
          estado: "pagado",
          agenciaReferenteSlug: agenciaReferenteSlug ?? undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const pedidoId = data.pedido?.id ?? `demo-${Date.now()}`;

      savePedidoLocal({
        id: pedidoId,
        lotSlug: item.lotId,
        totalUsd: total,
        estado: "pagado",
        metodoPago: methodLabel,
        transaccionId: txId,
        cantidad: qty,
        tipoEnvio: fulfillment,
        createdAt: new Date().toISOString(),
      });

      setReceipt({ txId, method: methodLabel });
      setDone(true);
      setTimeout(() => router.push("/mis-pedidos"), 3500);
    } catch {
      alert("No se pudo procesar el pago simulado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-container-padding-mobile py-24 text-center">
        <MaterialIcon name="check_circle" filled className="mb-4 text-5xl text-secondary" />
        <h2 className="font-display text-headline-md text-primary">¡Pago exitoso!</h2>
        <p className="mt-2 font-body text-body-md text-on-surface-variant">
          {config.intent === "mayorista"
            ? "Pago registrado. El exportador revisará el envío internacional."
            : "Tu compra quedó registrada. Te redirigimos a tus pedidos…"}
        </p>
        {receipt && (
          <div className="mt-6 w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-left">
            <p className="font-body text-label-sm text-outline">Transacción (simulada)</p>
            <p className="mt-1 font-mono text-label-md text-primary">{receipt.txId}</p>
            <p className="mt-2 font-body text-body-sm text-on-surface-variant">{receipt.method}</p>
            <p className="mt-1 font-display text-headline-sm text-primary">{formatted.total}</p>
          </div>
        )}
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-grow space-y-10 px-container-padding-mobile py-8 pb-32 md:px-container-padding-desktop">
        <header>
          <h2 className="font-display text-headline-md text-primary">{config.title}</h2>
          <p className="mt-1 font-body text-body-md text-on-surface-variant">{config.subtitle}</p>
          <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 font-body text-label-sm text-outline">
            Origen trazable: <strong className="text-on-surface">{item.variety ?? item.product}</strong> de{" "}
            {item.farmName} · {config.unitDescription}
          </p>
        </header>

        <section>
          <h2 className="mb-4 font-body text-label-md uppercase tracking-wider text-outline">Resumen</h2>
          <div className="flex flex-col gap-6 rounded-xl border border-tertiary-fixed/40 bg-tertiary-fixed/20 p-4 shadow-organic-nav sm:flex-row">
            <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container-high sm:w-32">
              <Image src={item.imageUrl} alt={item.product} fill className="object-cover" />
            </div>
            <div className="flex flex-grow flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-headline-md text-on-surface">
                    {item.farmName}
                    <br />
                    <span className="font-body text-body-lg text-outline">{item.variety ?? item.product}</span>
                  </h3>
                  <span className="font-display text-headline-md text-primary">${item.priceUsd.toFixed(2)}</span>
                </div>
                <p className="mt-1 font-body text-label-sm text-outline">Precio referencia por {config.qtyLabel.slice(0, -1).toLowerCase()}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-transparent bg-tertiary-fixed px-2 py-1 font-body text-label-sm text-on-tertiary-container">
                    {item.weight}
                  </span>
                  <span className="rounded-full border border-transparent bg-tertiary-fixed px-2 py-1 font-body text-label-sm text-on-tertiary-container">
                    {item.origin}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-body text-label-md text-outline">{config.qtyLabel}</span>
                <div className="flex items-center gap-4 rounded-full border border-surface-variant bg-surface-container-lowest px-2 py-1">
                  <button
                    type="button"
                    onClick={() => changeQty(-1)}
                    disabled={qty <= config.minQty}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-tertiary-fixed/50 active:scale-95 disabled:opacity-40"
                  >
                    <MaterialIcon name="remove" className="text-[20px]" />
                  </button>
                  <span className="min-w-[2ch] text-center font-body text-label-md">{qty}</span>
                  <button
                    type="button"
                    onClick={() => changeQty(1)}
                    disabled={qty >= config.maxQty}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-tertiary-fixed/50 active:scale-95 disabled:opacity-40"
                  >
                    <MaterialIcon name="add" className="text-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-body text-label-md uppercase tracking-wider text-outline">Entrega</h2>
          <div className="space-y-4">
            {config.showLocal && (
              <FulfillmentOption
                id="local"
                checked={fulfillment === "local"}
                onChange={() => setFulfillment("local")}
                icon="storefront"
                title="Recogida en el Magdalena"
                description="Santa Marta o Minca. Ideal si sigues viajando por la zona."
                price="Gratis"
              />
            )}
            {config.showExport && (
              <FulfillmentOption
                id="export"
                checked={fulfillment === "export"}
                onChange={() => setFulfillment("export")}
                icon="flight_takeoff"
                title="Exportación internacional"
                description="Envío al exterior. Revisión del exportador Huella."
                price="$15.00"
              />
            )}
          </div>
          {fulfillment === "export" && (
            <input
              type="text"
              placeholder="País destino (ej. Alemania, EE. UU.)"
              value={paisDestino}
              onChange={(e) => setPaisDestino(e.target.value)}
              className="mt-4 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-body-md outline-none focus:border-secondary"
            />
          )}
        </section>

        <SimulatedPayment
          method={paymentMethod}
          onMethodChange={setPaymentMethod}
          cardName={cardName}
          onCardNameChange={setCardName}
          cardNumber={cardNumber}
          onCardNumberChange={setCardNumber}
        />

        <section className="border-t border-surface-variant/50 pt-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-body text-body-md">Subtotal</span>
              <span className="font-body text-body-md">{formatted.subtotal}</span>
            </div>
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="font-body text-body-md">Envío</span>
              <span className="font-body text-body-md">{formatted.shipping}</span>
            </div>
            <div className="flex items-end justify-between pt-4">
              <span className="font-body text-label-md text-outline">Total estimado</span>
              <span className="font-display text-display-lg text-primary">{formatted.total}</span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 z-40 flex w-full justify-center border-t border-surface-variant/30 bg-background/90 p-container-padding-mobile backdrop-blur-xl">
        <div className="w-full max-w-3xl">
          <button
            type="button"
            disabled={loading}
            onClick={handlePay}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary-container font-body text-label-md text-on-primary-container shadow-lg transition-transform hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <>
                <MaterialIcon name="progress_activity" className="animate-spin text-[20px]" />
                Procesando pago…
              </>
            ) : (
              <>
                <MaterialIcon name="lock" filled className="text-[20px]" />
                Pagar {formatted.total} (simulado)
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function FulfillmentOption({
  id,
  checked,
  onChange,
  icon,
  title,
  description,
  price,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  icon: string;
  title: string;
  description: string;
  price: string;
}) {
  return (
    <label className="group relative flex cursor-pointer items-start gap-4 rounded-xl border border-surface-variant bg-surface p-5 transition-colors hover:bg-surface-container-low">
      <input type="radio" name="fulfillment" value={id} checked={checked} onChange={onChange} className="peer sr-only" />
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          checked ? "border-tertiary-container bg-tertiary-container" : "border-outline"
        }`}
      >
        <div className={`h-2 w-2 rounded-full bg-surface transition-transform ${checked ? "scale-100" : "scale-0"}`} />
      </div>
      <div className="flex-grow">
        <div className="mb-1 flex items-center gap-2">
          <MaterialIcon name={icon} className={checked ? "text-tertiary-container" : "text-outline"} />
          <span className="font-body text-label-md text-on-surface">{title}</span>
        </div>
        <p className="font-body text-body-md text-outline">{description}</p>
      </div>
      <span className="shrink-0 font-body text-label-md text-on-surface">{price}</span>
      <div
        className={`pointer-events-none absolute inset-0 rounded-xl border-2 transition-colors ${
          checked ? "border-tertiary-container/30" : "border-transparent"
        }`}
      />
    </label>
  );
}
