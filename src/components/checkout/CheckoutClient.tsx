"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { savePedidoLocal } from "@/lib/pedidos-local";
import type { CheckoutItem } from "@/types";

type Fulfillment = "local" | "export";

interface CheckoutClientProps {
  item: CheckoutItem;
}

export function CheckoutClient({ item }: CheckoutClientProps) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("local");
  const [paisDestino, setPaisDestino] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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

  async function handleConfirm() {
    setLoading(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotSlug: item.lotId,
          cantidad: qty,
          tipoEnvio: fulfillment,
          paisDestino: fulfillment === "export" ? paisDestino || "Internacional" : "Colombia",
          totalUsd: total,
        }),
      });

      const data = await res.json();
      const pedidoId = data.pedido?.id ?? `demo-${Date.now()}`;

      savePedidoLocal({
        id: pedidoId,
        lotSlug: item.lotId,
        totalUsd: total,
        estado: data.pedido?.estado ?? "pendiente",
        createdAt: new Date().toISOString(),
      });

      setDone(true);
      setTimeout(() => router.push("/mis-pedidos"), 1500);
    } catch {
      alert("No se pudo confirmar el pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-container-padding-mobile py-24 text-center">
        <MaterialIcon name="check_circle" filled className="mb-4 text-5xl text-secondary" />
        <h2 className="font-display text-headline-md text-primary">¡Pedido confirmado!</h2>
        <p className="mt-2 font-body text-body-md text-on-surface-variant">
          Redirigiendo a tus pedidos…
        </p>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-grow space-y-10 px-container-padding-mobile py-8 pb-32 md:px-container-padding-desktop">
        <section>
          <h2 className="mb-4 font-body text-label-md uppercase tracking-wider text-outline">Resumen del pedido</h2>
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
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full border border-transparent bg-tertiary-fixed px-2 py-1 font-body text-label-sm text-on-tertiary-container">
                    {item.weight}
                  </span>
                  <span className="rounded-full border border-transparent bg-tertiary-fixed px-2 py-1 font-body text-label-sm text-on-tertiary-container">
                    {item.origin}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-body text-label-md text-outline">Cantidad</span>
                <div className="flex items-center gap-4 rounded-full border border-surface-variant bg-surface-container-lowest px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-tertiary-fixed/50 active:scale-95"
                  >
                    <MaterialIcon name="remove" className="text-[20px]" />
                  </button>
                  <span className="w-4 text-center font-body text-label-md">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-tertiary-fixed/50 active:scale-95"
                  >
                    <MaterialIcon name="add" className="text-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-body text-label-md uppercase tracking-wider text-outline">Forma de entrega</h2>
          <div className="space-y-4">
            <FulfillmentOption
              id="local"
              checked={fulfillment === "local"}
              onChange={() => setFulfillment("local")}
              icon="storefront"
              title="Recogida local"
              description="Tostadora Santa Marta. Listo en 2 horas."
              price="Gratis"
            />
            <FulfillmentOption
              id="export"
              checked={fulfillment === "export"}
              onChange={() => setFulfillment("export")}
              icon="flight_takeoff"
              title="Exportación internacional"
              description="Envío global vía DHL. 5-7 días hábiles."
              price="$15.00"
            />
          </div>
          {fulfillment === "export" && (
            <input
              type="text"
              placeholder="País destino (ej. Alemania)"
              value={paisDestino}
              onChange={(e) => setPaisDestino(e.target.value)}
              className="mt-4 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 font-body text-body-md outline-none focus:border-secondary"
            />
          )}
        </section>

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
              <span className="font-body text-label-md text-outline">Total</span>
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
            onClick={handleConfirm}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary-container font-body text-label-md text-on-primary-container shadow-lg transition-transform hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            <MaterialIcon name="lock" filled className="text-[20px]" />
            {loading ? "Confirmando…" : "Confirmar compra"}
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
