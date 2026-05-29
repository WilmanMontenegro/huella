import type { LotChainRegistration } from "@/types/blockchain";
import chainData from "@/data/blockchain/demo-lot-registration.json";
import type { TraceabilityStep } from "@/types";

function hasRealRegistration(data: typeof chainData): boolean {
  return Boolean(data?.registrationTx && data.registrationTx.length > 10);
}

export function isDemoBlockchainMode(): boolean {
  return !hasRealRegistration(chainData);
}

export function getDemoLotChainRegistration(): LotChainRegistration | null {
  if (!hasRealRegistration(chainData)) return null;
  return chainData as LotChainRegistration;
}

export function mergeTraceabilityWithChain(steps: TraceabilityStep[]): TraceabilityStep[] {
  const chain = getDemoLotChainRegistration();
  if (!chain?.steps?.length) return steps;

  return steps.map((step, i) => {
    const onChain = chain.steps.find((s) => s.index === i);
    return onChain ? { ...step, blockchainTx: onChain.tx } : step;
  });
}

export function getLotRegistrationTx(lotId: string): string | undefined {
  const chain = getDemoLotChainRegistration();
  if (!chain || chain.lotId !== lotId) return undefined;
  return chain.registrationTx;
}

export function getContractAddress(): string | undefined {
  const chain = getDemoLotChainRegistration();
  if (!chain?.contractAddress) return undefined;
  return chain.contractAddress;
}
