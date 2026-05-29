import { TopAppBar } from "@/components/layout/TopAppBar";
import { ExportadorClient } from "@/components/exportador/ExportadorClient";
import { getPedidosExportacion } from "@/lib/data/lots-repository";

export const dynamic = "force-dynamic";

export default async function ExportadorDashboardPage() {
  const pedidos = await getPedidosExportacion();

  return (
    <>
      <TopAppBar title="Exportador" backHref="/" />
      <ExportadorClient pedidos={pedidos} />
    </>
  );
}
