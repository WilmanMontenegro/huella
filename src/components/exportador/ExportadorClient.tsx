"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export function ExportadorClient({
  pedidos,
}: {
  pedidos: Array<{
    id: string;
    cantidad: number;
    pais_destino: string | null;
    estado: string;
    total_usd: number | null;
    created_at: string;
    lotes?: { slug: string; finca_nombre: string | null; producto: string } | null;
  }>;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    await fetch("/api/pedidos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, estado }),
    });
    setUpdating(null);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-content px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
      <header className="mb-8">
        <h2 className="font-display text-headline-lg-mobile text-primary md:text-display-lg">
          Solicitudes de exportación
        </h2>
        <p className="mt-2 font-body text-body-md text-on-surface-variant">
          Aprueba pedidos internacionales vinculados a lotes trazables Huella.
        </p>
      </header>

      {pedidos.length === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center">
          <MaterialIcon name="inventory_2" className="mb-4 text-4xl text-outline" />
          <p className="font-body text-body-md text-on-surface-variant">
            No hay solicitudes de exportación pendientes. Completa un checkout con envío internacional.
          </p>
          <Link href="/producto/finca-la-esperanza" className="mt-4 inline-block font-body text-label-md text-secondary">
            Ir al lote
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {pedidos.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-organic-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-body text-label-md text-primary">
                    {p.lotes?.finca_nombre ?? "Lote"} · {p.lotes?.producto ?? "Producto"}
                  </p>
                  <p className="mt-1 font-body text-body-md text-on-surface-variant">
                    {p.cantidad} unidad(es) → {p.pais_destino ?? "Internacional"}
                  </p>
                  <p className="mt-1 font-body text-label-sm text-outline">
                    {new Date(p.created_at).toLocaleString("es-CO")} ·{" "}
                    <Link href={`/producto/${p.lotes?.slug}`} className="text-secondary hover:underline">
                      Ver trazabilidad
                    </Link>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-display text-headline-sm text-primary">
                    ${Number(p.total_usd ?? 0).toFixed(2)}
                  </span>
                  <span className="rounded-full bg-tertiary-fixed px-3 py-1 font-body text-label-sm text-on-tertiary-container">
                    {p.estado}
                  </span>
                  {p.estado === "pendiente" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={updating === p.id}
                        onClick={() => updateEstado(p.id, "aprobado")}
                        className="rounded-full bg-secondary px-4 py-2 font-body text-label-sm text-on-secondary"
                      >
                        Aprobar
                      </button>
                      <button
                        type="button"
                        disabled={updating === p.id}
                        onClick={() => updateEstado(p.id, "rechazado")}
                        className="rounded-full border border-outline px-4 py-2 font-body text-label-sm text-outline"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
