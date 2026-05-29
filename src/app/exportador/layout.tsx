import type { ReactNode } from "react";
import { requirePanelRole } from "@/lib/auth/panel-access";

export default async function ExportadorLayout({ children }: { children: ReactNode }) {
  await requirePanelRole("exportador", "/exportador/dashboard");
  return children;
}
