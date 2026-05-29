import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { FarmerFab, LotCard } from "@/components/farmer/LotCard";
import { ProducerRecentOrders } from "@/components/farmer/ProducerRecentOrders";
import { getPedidosForProductor, getProducerDashboard } from "@/lib/data/lots-repository";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function ProductorDashboardPage() {
  const [data, pedidosRecientes] = await Promise.all([
    getProducerDashboard(),
    getPedidosForProductor(),
  ]);
  const supabaseReady = isSupabaseConfigured();

  return (
    <>
      <TopAppBar
        rightAction={
          <span className="relative text-primary">
            <MaterialIcon name="notifications" />
            <span className="absolute right-0 top-0.5 h-2 w-2 rounded-full border border-surface bg-error" />
          </span>
        }
      />

      <main className="mx-auto max-w-content px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <header className="mb-[40px] pt-4">
          <h2 className="font-display text-headline-lg-mobile text-primary md:text-display-lg">
            Bienvenido de nuevo,
            <br />
            <span className="italic text-secondary">{data.name}</span>
          </h2>
          <p className="mt-2 max-w-md font-body text-body-md text-on-surface-variant">
            {data.fromSupabase
              ? "Datos en vivo desde Supabase: lotes, etapas y ventas del mes."
              : supabaseReady
                ? "No se pudo cargar el productor en Supabase. Revisa el seed o las variables de entorno."
                : "Modo demo local (sin Supabase). Configura NEXT_PUBLIC_SUPABASE_URL en .env.local."}
          </p>
        </header>

        <section className="mb-[40px] grid grid-cols-2 gap-gutter">
          <StatCard
            label="Ventas del mes"
            icon="payments"
            value={`$${data.monthlySalesUsd.toLocaleString("es-CO")}`}
            suffix="USD"
            accent="secondary"
          />
          <StatCard
            label="Lotes activos"
            icon="local_florist"
            value={String(data.activeLots).padStart(2, "0")}
            suffix="En proceso"
            accent="tertiary"
          />
        </section>

        <section className="mb-[40px]">
          <h3 className="mb-4 font-display text-headline-md text-primary">Pedidos recientes</h3>
          <p className="mb-4 font-body text-body-sm text-on-surface-variant">
            Compras de turistas o mayoristas vinculadas a tus lotes en Supabase.
          </p>
          <ProducerRecentOrders pedidos={pedidosRecientes} />
        </section>

        <section className="mb-[40px]">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="font-display text-headline-md text-primary">Lotes registrados</h3>
            <button type="button" className="flex items-center gap-1 font-body text-label-md text-secondary transition-colors hover:text-primary">
              Filtrar <MaterialIcon name="filter_list" className="text-[16px]" />
            </button>
          </div>
          {data.lots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
              <MaterialIcon name="inventory_2" className="mb-3 text-4xl text-outline" />
              <p className="font-body text-body-md text-on-surface-variant">
                Aún no hay lotes en la base de datos para este productor.
              </p>
              <Link
                href="/productor/nuevo-lote"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-tertiary-fixed px-6 font-body text-label-md text-on-tertiary-container"
              >
                Registrar primer lote
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-gutter">
              {data.lots.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))}
            </div>
          )}
        </section>
      </main>

      <FarmerFab />
      <BottomNav active="crops" />
    </>
  );
}

function StatCard({
  label,
  icon,
  value,
  suffix,
  accent,
}: {
  label: string;
  icon: string;
  value: string;
  suffix: string;
  accent: "secondary" | "tertiary";
}) {
  return (
    <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-organic-lg transition-transform duration-300 hover:-translate-y-1">
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl ${
          accent === "secondary" ? "bg-surface-container-high opacity-40" : "bg-tertiary-fixed opacity-20"
        }`}
      />
      <div className="z-10 flex items-center justify-between">
        <span className="font-body text-label-sm uppercase tracking-widest text-on-surface-variant">{label}</span>
        <MaterialIcon name={icon} className={`text-[18px] opacity-50 ${accent === "secondary" ? "text-secondary" : "text-tertiary-container"}`} />
      </div>
      <div className="z-10">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-headline-md text-primary">{value}</span>
          {accent === "secondary" && <span className="font-body text-label-sm text-on-surface-variant">{suffix}</span>}
        </div>
        {accent === "tertiary" && (
          <span className="mt-1 flex items-center gap-1 font-body text-label-sm text-tertiary-container">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container" />
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
