"use client";

import { REFERRAL_COOKIE } from "@/lib/constants/operador";

const MAX_AGE_DAYS = 30;

export function persistReferralSlug(slug: string) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + MAX_AGE_DAYS);
  document.cookie = `${REFERRAL_COOKIE}=${encodeURIComponent(slug)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function readReferralSlug(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearReferralSlug() {
  if (typeof document === "undefined") return;
  document.cookie = `${REFERRAL_COOKIE}=; path=/; max-age=0`;
}
