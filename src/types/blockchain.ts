export interface LotChainStep {
  index: number;
  stage: string;
  tx: string;
}

export interface LotChainRegistration {
  network: string;
  chainId: number;
  contractAddress: string;
  lotId: string;
  registrationTx: string;
  lotDataHash: string;
  steps: LotChainStep[];
  registeredAt: string;
  explorerBase: string;
}
