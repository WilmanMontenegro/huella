import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { OperadorShareKit } from "@/components/operador/OperadorShareKit";
import { createClientIfConfigured } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { buildAccederUrl, buildAccederUrlForRole, getOperadorDashboardPath } from "@/lib/auth";
import {
  getAgenciaExperiences,
  getOperadorStats,
  resolveOperadorAgencia,
} from "@/lib/data/agencia-repository";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { agencia?: string };
}

export default async function OperadorDashboardPage({ searchParams }: PageProps) {
  const agenciaParam = searchParams.agencia;
  const loginNext = getOperadorDashboardPath(agenciaParam);

  if (!isSupabaseConfigured()) {
    return (
      <OperadorDashboardContent
        agenciaSlug={agenciaParam ?? "huella-tours"}
        agenciaName="Huella Tours"
        agenciaId="33333333-3333-3333-3333-333333333302"
        userEmail={null}
        demoMode
      />
    );
  }

  const supabase = await createClientIfConfigured();
  if (!supabase) redirect(buildAccederUrl({ next: loginNext }));

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(buildAccederUrlForRole("operador", loginNext));

  const agencia =
    (await resolveOperadorAgencia(user.id, agenciaParam)) ??
    (await resolveOperadorAgencia(user.id, "huella-tours"));
  if (!agencia) {
    redirect(buildAccederUrl({ role: "operador", next: loginNext, authError: true }));
  }

  return (
    <OperadorDashboardContent
      agenciaSlug={agencia.slug}
      agenciaName={agencia.name}
      agenciaId={agencia.id}
      userEmail={user.email ?? null}
      demoMode={false}
    />
  );
}

async function OperadorDashboardContent({
  agenciaSlug,
  agenciaName,
  agenciaId,
  userEmail,
  demoMode,
}: {
  agenciaSlug: string;
  agenciaName: string;
  agenciaId: string;
  userEmail: string | null;
  demoMode: boolean;
}) {
  const [stats, experiences] = await Promise.all([
    getOperadorStats(agenciaId),
    getAgenciaExperiences(agenciaId),
  ]);

  return (
    <>
      <TopAppBar
        title="Panel operador"
        backHref="/operador"
        rightAction={<SignOutButton redirectTo="/operador" />}
      />
      <main className="mx-auto max-w-content px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <header className="mb-8">
          <p className="font-body text-label-sm uppercase tracking-wider text-secondary">Operador turístico</p>
          <h1 className="font-display text-headline-lg text-primary">{agenciaName}</h1>
          {userEmail && (
            <p className="mt-1 font-body text-body-sm text-outline">Sesión: {userEmail}</p>
          )}
          {demoMode && (
            <p className="mt-2 font-body text-label-sm text-error">Modo demo sin Supabase</p>
          )}
        </header>

        <section className="mb-8 grid grid-cols-3 gap-3">
          <StatCard label="Escaneos QR" value={String(stats.escaneos)} icon="qr_code_scanner" />
          <StatCard label="Pedidos ref." value={String(stats.pedidos)} icon="shopping_bag" />
          <StatCard label="Ventas ref." value={`$${stats.ingresosUsd.toFixed(0)}`} icon="payments" />
        </section>

        <div className="mb-8">
          <OperadorShareKit agenciaSlug={agenciaSlug} agenciaName={agenciaName} />
        </div>

        {experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-display text-headline-md text-primary">Tus experiencias en Huella</h2>
            <ul className="space-y-3">
              {experiences.map((exp) => (
                <li
                  key={exp.experienceId}
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4"
                >
                  <p className="font-body text-label-md text-primary">{exp.title}</p>
                  <p className="font-body text-body-sm text-outline">{exp.summary}</p>
                  <Link
                    href={`/producto/${exp.lotSlug}?ref=${agenciaSlug}`}
                    className="mt-2 inline-block font-body text-label-sm text-secondary hover:underline"
                  >
                    Enlace con referido →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link
          href={`/aliado/${agenciaSlug}`}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-secondary font-body text-label-md text-secondary"
        >
          <MaterialIcon name="public" />
          Ver vitrina pública
        </Link>
      </main>
    </>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-center">
      <MaterialIcon name={icon} className="mb-1 text-2xl text-secondary" />
      <p className="font-display text-headline-sm text-primary">{value}</p>
      <p className="font-body text-label-sm text-outline">{label}</p>
    </div>
  );
}
