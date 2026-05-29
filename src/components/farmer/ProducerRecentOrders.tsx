import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ProductorPedidoRow } from "@/lib/data/productor-repository";

interface ProducerRecentOrdersProps {
  pedidos: ProductorPedidoRow[];
}

function estadoLabel(estado: string) {
  if (estado === "pagado") return { text: "Pagado", className: "bg-secondary/20 text-secondary" };
  if (estado === "aprobado") return { text: "Aprobado", className: "bg-tertiary-fixed text-on-tertiary-container" };
  return { text: estado, className: "bg-surface-container-high text-outline" };
}

export function ProducerRecentOrders({ pedidos }: ProducerRecentOrdersProps) {
  if (pedidos.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-6">
        <MaterialIcon name="shopping_cart" className="mb-2 text-3xl text-outline" />
        <p className="font-body text-body-md text-on-surface-variant">
          Aún no hay pedidos de compradores sobre tus lotes. Cuando alguien pague en Huella, aparecerán aquí.
        </p>
      </section>
    );
  }

  return (
    <ul className="space-y-3">
      {pedidos.map((p) => {
        const badge = estadoLabel(p.estado);
        return (
          <li
            key={p.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4"
          >
            <div>
              <p className="font-body text-label-md text-primary">
                {p.lotes?.producto ?? "Producto"} · {p.cantidad} uds.
              </p>
              <p className="mt-0.5 font-body text-label-sm text-outline">
                {p.lotes?.slug} · {p.tipo_envio === "export" ? "Exportación" : "Recogida local"}
              </p>
              <p className="mt-1 font-body text-label-sm text-outline">
                {new Date(p.created_at).toLocaleString("es-CO")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-headline-sm text-primary">
                ${Number(p.total_usd ?? 0).toFixed(2)}
              </p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 font-body text-label-sm ${badge.className}`}>
                {badge.text}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
