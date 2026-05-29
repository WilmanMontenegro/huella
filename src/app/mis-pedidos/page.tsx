"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { getPedidosLocal, type StoredPedido } from "@/lib/pedidos-local";

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState<StoredPedido[]>([]);

  useEffect(() => {
    setPedidos(getPedidosLocal());
  }, []);

  return (
    <>
      <TopAppBar title="Mis pedidos" backHref="/" />
      <main className="mx-auto max-w-content px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <h2 className="mb-6 font-display text-headline-md text-primary">Tus compras Huellas</h2>

        {pedidos.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 text-center">
            <MaterialIcon name="shopping_bag" className="mb-4 text-4xl text-outline" />
            <p className="font-body text-body-md text-on-surface-variant">
              Aún no tienes pedidos. Escanea un producto y completa el checkout.
            </p>
            <Link
              href="/producto/finca-la-esperanza"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-body text-label-md text-on-primary"
            >
              Ver demo Finca La Esperanza
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {pedidos.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-organic-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body text-label-md text-primary">Pedido #{p.id.slice(0, 8)}</p>
                    <p className="mt-1 font-body text-body-md text-on-surface-variant">Lote: {p.lotSlug}</p>
                    <p className="mt-1 font-body text-label-sm text-outline">
                      {new Date(p.createdAt).toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-headline-sm text-primary">${p.totalUsd.toFixed(2)}</p>
                    <span className="mt-1 inline-block rounded-full bg-tertiary-fixed px-2 py-0.5 font-body text-label-sm text-on-tertiary-container">
                      {p.estado}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
