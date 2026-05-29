"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { SimulatedPaymentMethod } from "@/lib/payment/simulate";

interface SimulatedPaymentProps {
  method: SimulatedPaymentMethod;
  onMethodChange: (method: SimulatedPaymentMethod) => void;
  cardName: string;
  onCardNameChange: (value: string) => void;
  cardNumber: string;
  onCardNumberChange: (value: string) => void;
}

export function SimulatedPayment({
  method,
  onMethodChange,
  cardName,
  onCardNameChange,
  cardNumber,
  onCardNumberChange,
}: SimulatedPaymentProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2.5">
        <MaterialIcon name="info" className="mt-0.5 shrink-0 text-secondary" />
        <p className="font-body text-label-sm text-on-surface-variant">
          <strong className="text-primary">Pago simulado (demo).</strong> No se cobra dinero real. Ideal para
          presentar el flujo ante el jurado.
        </p>
      </div>

      <h2 className="font-body text-label-md uppercase tracking-wider text-outline">Método de pago</h2>

      <div className="grid grid-cols-2 gap-3">
        <PaymentMethodChip
          active={method === "card"}
          onClick={() => onMethodChange("card")}
          icon="credit_card"
          label="Tarjeta"
        />
        <PaymentMethodChip
          active={method === "nequi"}
          onClick={() => onMethodChange("nequi")}
          icon="account_balance_wallet"
          label="Nequi / PSE"
        />
      </div>

      {method === "card" ? (
        <div className="space-y-3 rounded-xl border border-outline-variant bg-surface p-4">
          <label className="block">
            <span className="mb-1 block font-body text-label-sm text-on-surface-variant">Nombre en la tarjeta</span>
            <input
              type="text"
              value={cardName}
              onChange={(e) => onCardNameChange(e.target.value)}
              placeholder="Como en la tarjeta"
              className="h-11 w-full rounded-lg border border-outline-variant px-3 font-body text-body-md outline-none focus:border-secondary"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-body text-label-sm text-on-surface-variant">Número de tarjeta</span>
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => onCardNumberChange(e.target.value.replace(/\D/g, "").slice(0, 16))}
              placeholder="4242 4242 4242 4242"
              className="h-11 w-full rounded-lg border border-outline-variant px-3 font-body text-body-md tracking-wider outline-none focus:border-secondary"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block font-body text-label-sm text-on-surface-variant">Vence</span>
              <input
                type="text"
                defaultValue="12/28"
                readOnly
                className="h-11 w-full rounded-lg border border-outline-variant/50 bg-surface-container-high px-3 font-body text-body-md text-outline"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-body text-label-sm text-on-surface-variant">CVV</span>
              <input
                type="text"
                defaultValue="123"
                readOnly
                className="h-11 w-full rounded-lg border border-outline-variant/50 bg-surface-container-high px-3 font-body text-body-md text-outline"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-outline-variant bg-surface p-4">
          <label className="block">
            <span className="mb-1 block font-body text-label-sm text-on-surface-variant">Celular Nequi</span>
            <input
              type="tel"
              defaultValue="300 123 4567"
              readOnly
              className="h-11 w-full rounded-lg border border-outline-variant/50 bg-surface-container-high px-3 font-body text-body-md text-outline"
            />
          </label>
          <p className="mt-2 font-body text-label-sm text-outline">
            En producción se abriría la app del banco; aquí solo simulamos la confirmación.
          </p>
        </div>
      )}
    </section>
  );
}

function PaymentMethodChip({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
        active
          ? "border-tertiary-container bg-tertiary-fixed/30"
          : "border-outline-variant bg-surface hover:bg-surface-container-high"
      }`}
    >
      <MaterialIcon name={icon} className={active ? "text-tertiary-container" : "text-outline"} />
      <span className="font-body text-label-sm text-on-surface">{label}</span>
    </button>
  );
}
