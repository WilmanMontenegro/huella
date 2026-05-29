import type { ReactNode } from "react";
import { requirePanelRole } from "@/lib/auth/panel-access";

export default async function ProductorLayout({ children }: { children: ReactNode }) {
  await requirePanelRole("productor", "/productor/dashboard");
  return children;
}
