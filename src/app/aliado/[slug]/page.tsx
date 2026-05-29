import Link from "next/link";
import { notFound } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ExperienceProviderCard } from "@/components/product/ExperienceProviderCard";
import { OperadorLoginPrompt } from "@/components/operador/OperadorLoginPrompt";
import { getAgenciaBySlug, getAgenciaExperiences } from "@/lib/data/agencia-repository";
import { QR_PUBLIC_LOTS } from "@/data/qr-lots";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export default async function AliadoPage({ params }: PageProps) {
  const agencia = await getAgenciaBySlug(params.slug);
  if (!agencia) notFound();

  const experiences = await getAgenciaExperiences(agencia.id);
  const featuredLot = QR_PUBLIC_LOTS[0];

  return (
    <>
      <TopAppBar title="Aliado Huella" backHref="/" />
      <main className="mx-auto max-w-prose px-margin-mobile pb-24 pt-24 md:px-margin-desktop">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container font-display text-headline-md text-on-primary-container">
            {agencia.name.charAt(0)}
          </div>
          <h1 className="font-display text-headline-lg text-primary">{agencia.name}</h1>
          <p className="mt-2 font-body text-body-md text-secondary">Operador turístico aliado · Magdalena</p>
          {agencia.tagline && (
            <p className="mt-3 font-body text-body-lg text-on-surface-variant">{agencia.tagline}</p>
          )}
          {agencia.description && (
            <p className="mt-2 font-body text-body-md leading-relaxed text-on-surface-variant">
              {agencia.description}
            </p>
          )}
        </header>

        <section className="mb-8 space-y-3 rounded-xl border border-tertiary-fixed/40 bg-tertiary-fixed/20 p-5">
          <h2 className="font-display text-headline-md text-primary">Comparte el origen</h2>
          <p className="font-body text-body-sm text-on-surface-variant">
            Envía a tus turistas al producto trazable. Cada visita con{" "}
            <code className="rounded bg-surface px-1">?ref={agencia.slug}</code> cuenta para tu agencia.
          </p>
          <Link
            href={`/producto/${featuredLot.slug}?ref=${agencia.slug}`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary"
          >
            <MaterialIcon name="qr_code_scanner" />
            Abrir producto demo ({featuredLot.product})
          </Link>
          <Link
            href={`/api/qr/${featuredLot.slug}`}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-secondary font-body text-label-md text-secondary"
            download
          >
            <MaterialIcon name="download" />
            Descargar QR para imprimir
          </Link>
        </section>

        {experiences.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-display text-headline-md text-primary">Tours que ofreces en Huella</h2>
            <ul className="space-y-4">
              {experiences.map((exp) => (
                <li key={exp.experienceId}>
                  <ExperienceProviderCard
                    provider={exp.provider}
                    experienceTitle={exp.title}
                  />
                  <Link
                    href={`/producto/${exp.lotSlug}/experiencias/${exp.experienceSlug}`}
                    className="mt-2 inline-block font-body text-label-sm text-secondary hover:underline"
                  >
                    Ver en ficha del producto →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center">
          <MaterialIcon name="admin_panel_settings" className="mb-3 text-3xl text-primary-container" />
          <h2 className="mb-2 font-display text-headline-md text-primary">¿Eres de {agencia.name}?</h2>
          <p className="mb-4 font-body text-body-md text-on-surface-variant">
            Entra con Google para ver escaneos, pedidos referidos y tu kit QR.
          </p>
          <OperadorLoginPrompt agenciaSlug={agencia.slug} />
        </section>
      </main>
    </>
  );
}
