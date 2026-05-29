/** True when the lot has a verifiable on-chain registration hash */
export function hasRealBlockchainVerification(registrationTx?: string | null): boolean {
  return Boolean(registrationTx && registrationTx.length > 10);
}

const PRODUCTION_APP_URL = "https://web-omega-lilac-31.vercel.app";

export function getProductPublicUrl(slug: string): string {
  let base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? PRODUCTION_APP_URL;
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    base = PRODUCTION_APP_URL;
  }
  return `${base}/producto/${slug}`;
}
