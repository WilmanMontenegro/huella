import { TopAppBar } from "@/components/layout/TopAppBar";
import { ExportadorClient } from "@/components/exportador/ExportadorClient";
import { requirePanelRole } from "@/lib/auth/panel-access";
import { getPedidosExportacion } from "@/lib/data/lots-repository";

export const dynamic = "force-dynamic";

export default async function ExportadorDashboardPage() {
  await requirePanelRole("exportador", "/exportador/dashboard");

  const pedidos = await getPedidosExportacion();

  return (
    <>
      <TopAppBar title="Exportador" backHref="/" />
      <ExportadorClient pedidos={pedidos} />
    </>
  );
}
