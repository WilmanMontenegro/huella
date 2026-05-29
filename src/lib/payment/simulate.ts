export type SimulatedPaymentMethod = "card" | "nequi";

export function simulatePaymentDelay(ms = 2000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateSimulatedTransactionId(): string {
  return `HUELLA-${Date.now().toString(36).toUpperCase()}`;
}

export function paymentMethodLabel(method: SimulatedPaymentMethod): string {
  return method === "card" ? "Tarjeta débito/crédito" : "Nequi / PSE";
}
