/** True when the lot has a verifiable on-chain registration hash */
export function hasRealBlockchainVerification(registrationTx?: string | null): boolean {
  return Boolean(registrationTx && registrationTx.length > 10);
}

export function getProductPublicUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
  return `${base}/producto/${slug}`;
}
