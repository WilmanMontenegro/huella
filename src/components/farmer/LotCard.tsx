import Image from "next/image";
import Link from "next/link";
import { TraceabilityStepIcon, TraceabilityStepLabel } from "@/components/shared/TraceabilityStepIcon";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { LotSummary } from "@/types";

interface LotCardProps {
  lot: LotSummary;
}

export function LotCard({ lot }: LotCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-organic-lg transition-colors hover:border-secondary-fixed">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high">
            <Image src={lot.photoUrl} alt={lot.name} width={56} height={56} className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <div>
            <h4 className="font-body text-label-md text-primary">{lot.name}</h4>
            <span className="mt-0.5 flex items-center gap-1 font-body text-label-sm text-on-surface-variant">
              <MaterialIcon name="location_on" className="text-[14px]" />
              {lot.location}
            </span>
          </div>
        </div>
        <span className="rounded-full border border-tertiary-fixed-dim/50 bg-tertiary-fixed px-3 py-1 font-body text-label-sm tracking-wide text-on-tertiary-container">
          {lot.statusLabel}
        </span>
      </div>

      <div className="relative px-2 pt-2">
        <div className="absolute left-6 right-6 top-5 -z-10 h-px bg-outline-variant/30" />
        <div className="flex items-start justify-between gap-1">
          {lot.steps.map((step, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <StepDot label={step.label} status={step.status} isBanana={lot.status === "inspection"} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          href={`/productor/lote/${lot.id}`}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary"
        >
          <MaterialIcon name="qr_code_2" className="text-[18px]" />
          QR del lote
        </Link>
        <Link
          href={`/producto/${lot.id}`}
          className="flex h-11 items-center justify-center gap-2 rounded-full border border-secondary font-body text-label-md text-secondary"
        >
          <MaterialIcon name="visibility" className="text-[18px]" />
          Vista turista
        </Link>
      </div>
    </article>
  );
}

function StepDot({
  label,
  status,
  isBanana,
}: {
  label: string;
  status: "completed" | "current" | "pending";
  isBanana?: boolean;
}) {
  return (
    <>
      <TraceabilityStepIcon
        label={label}
        status={status}
        size="sm"
        variant={isBanana ? "banana" : "coffee"}
      />
      <TraceabilityStepLabel label={label} status={status} variant={isBanana ? "banana" : "coffee"} />
    </>
  );
}

interface FarmerFabProps {
  href?: string;
}

export function FarmerFab({ href = "/productor/nuevo-lote" }: FarmerFabProps) {
  return (
    <Link
      href={href}
      className="fixed bottom-24 right-margin-mobile z-40 flex items-center gap-2 rounded-2xl bg-tertiary-fixed py-3.5 pl-4 pr-5 text-on-tertiary-container shadow-fab-yellow transition-all duration-300 hover:scale-105 hover:bg-tertiary-fixed-dim active:scale-95 md:bottom-12 md:right-margin-desktop"
    >
      <MaterialIcon name="add" filled className="text-[20px]" />
      <span className="mt-px font-body text-label-md">Registrar nuevo lote</span>
    </Link>
  );
}
