/** Polygon Amoy testnet — Etapa 2 blockchain */
export const BLOCKCHAIN_CONFIG = {
  chainId: 80002,
  chainName: "Polygon Amoy",
  explorerUrl: "https://amoy.polygonscan.com",
  rpcUrl: process.env.POLYGON_AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
} as const;

export function getExplorerTxUrl(txHash: string): string {
  return `${BLOCKCHAIN_CONFIG.explorerUrl}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${BLOCKCHAIN_CONFIG.explorerUrl}/address/${address}`;
}
