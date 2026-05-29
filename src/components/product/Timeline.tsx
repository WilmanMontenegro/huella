import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TraceabilityStepIcon } from "@/components/shared/TraceabilityStepIcon";
import type { TraceabilityStep } from "@/types";
import { getExplorerTxUrl, getExplorerAddressUrl } from "@/lib/blockchain/config";

export interface LotVerification {
  registrationTx: string;
  contractAddress?: string;
  isDemoMode?: boolean;
}

interface TimelineProps {
  steps: TraceabilityStep[];
  title?: string;
  verification?: LotVerification;
}

export function Timeline({ steps, title = "El camino de tu café", verification }: TimelineProps) {
  const hasRealLinks =
    Boolean(verification?.registrationTx && verification.registrationTx.length > 10) &&
    !verification?.isDemoMode;

  return (
    <section className="rounded-card border border-[#E5E0D5] bg-surface-container-lowest p-8 organic-shadow">
      <h3 className="mb-2 text-center font-display text-headline-md text-primary">{title}</h3>
      <p className="mb-8 text-center font-body text-body-md text-on-surface-variant">
        Del árbol a tu taza — cada paso documentado
      </p>

      <div className="relative mx-auto max-w-md">
        <div className="absolute bottom-5 left-5 top-5 w-0.5 bg-outline-variant/30" />
        <div className="relative space-y-8">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-6">
              <TraceabilityStepIcon label={step.title} status={step.status} size="md" />
              <div className={step.status === "pending" ? "pt-1 opacity-50" : "pt-1"}>
                <h4 className="mb-1 font-body text-label-md text-primary">{step.title}</h4>
                <p className="font-body text-body-md text-on-surface-variant">{step.description}</p>
                {step.date && (
                  <span className="mt-2 block font-body text-label-sm text-outline">{step.date}</span>
                )}
                {step.status === "current" && (
                  <span className="mt-2 block font-body text-label-sm text-tertiary-container">
                    En progreso
                  </span>
                )}
                {hasRealLinks && step.blockchainTx && step.status !== "pending" && (
                  <Link
                    href={getExplorerTxUrl(step.blockchainTx)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex flex-col items-start gap-0.5 font-body text-label-sm text-secondary hover:underline"
                  >
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="verified" className="text-sm" />
                      Ver comprobante de este paso
                    </span>
                    <span className="text-label-sm text-outline">Registro blockchain · público e inalterable</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {verification && (
        <div className="mx-auto mt-10 max-w-md border-t border-outline-variant/30 pt-8 text-center">
          <MaterialIcon name="shield" className="mb-2 text-2xl text-secondary" />
          <h4 className="mb-2 font-body text-label-md text-primary">¿Cómo sabemos que es real?</h4>
          <p className="mb-4 font-body text-body-md leading-relaxed text-on-surface-variant">
            Los datos de este lote quedan respaldados en un registro público que nadie puede
            modificar después. Así puedes comprobar que lo que lees aquí coincide con lo que
            ocurrió en la finca.
          </p>
          {verification.isDemoMode ? (
            <p className="font-body text-label-sm text-outline">
              Próximamente: comprobantes verificables en blockchain (Polygon Amoy). Por ahora
              ves la trazabilidad documentada; los enlaces al registro se activan al registrar el
              lote on-chain.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <a
                href={getExplorerTxUrl(verification.registrationTx)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-secondary/60 px-5 py-2.5 font-body text-label-sm text-secondary transition-colors hover:bg-secondary/10"
              >
                <MaterialIcon name="open_in_new" className="text-base" />
                Ver registro completo del lote
              </a>
              {verification.contractAddress && (
                <a
                  href={getExplorerAddressUrl(verification.contractAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-label-sm text-outline hover:text-primary"
                >
                  Detalle técnico · contrato Huellas (blockchain)
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
