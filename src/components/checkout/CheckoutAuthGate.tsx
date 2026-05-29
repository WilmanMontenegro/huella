"use client";

import { ClientAuthGate } from "@/components/auth/ClientAuthGate";

interface CheckoutAuthGateProps {
  lotId: string;
  children: React.ReactNode;
}

export function CheckoutAuthGate({ lotId, children }: CheckoutAuthGateProps) {
  return (
    <ClientAuthGate
      nextPath={`/checkout/${lotId}`}
      role="turista"
      loadingMessage="Verificando sesión para comprar…"
    >
      {children}
    </ClientAuthGate>
  );
}
