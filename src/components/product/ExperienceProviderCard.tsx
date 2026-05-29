"use client";

import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { TourProvider } from "@/types";

interface ExperienceProviderCardProps {
  provider: TourProvider;
  experienceTitle?: string;
}

function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const MOCK_WHATSAPP: Record<string, string> = {
  "Experiencias Don José": "573001234567",
  "Huella Tours": "573009876543",
  "Magdalena Roots Travel": "573001112233",
};

export function ExperienceProviderCard({ provider, experienceTitle }: ExperienceProviderCardProps) {
  const phone = provider.whatsapp ?? MOCK_WHATSAPP[provider.agencyName];
  const waMessage = `Hola ${provider.agencyName}, vi en Huella la experiencia "${experienceTitle ?? "tour en la finca"}" y me gustaría reservar.`;
  const waUrl = phone ? buildWhatsAppUrl(phone, waMessage) : null;

  return (
    <article className="rounded-card border border-[#E5E0D5] bg-surface-container-lowest p-5 organic-shadow">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-body text-label-md text-primary">{provider.agencyName}</h3>
          {provider.description && (
            <p className="mt-1 font-body text-body-md text-on-surface-variant">{provider.description}</p>
          )}
        </div>
        {provider.price !== undefined && (
          <span className="shrink-0 rounded-full bg-secondary-fixed px-3 py-1 font-body text-label-sm text-on-secondary-fixed">
            USD {provider.price}
          </span>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {provider.duration && <SpecChip icon="schedule" label={provider.duration} />}
        {provider.capacity && <SpecChip icon="groups" label={provider.capacity} />}
        {provider.languages && provider.languages.length > 0 && (
          <SpecChip icon="translate" label={provider.languages.join(" · ")} />
        )}
      </div>

      {provider.meetingPoint && (
        <p className="mb-4 flex items-center gap-1.5 font-body text-label-sm text-outline">
          <MaterialIcon name="location_on" className="shrink-0 text-base leading-none" />
          <span>{provider.meetingPoint}</span>
        </p>
      )}

      {waUrl ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-primary-container py-2.5 font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container"
        >
          <MaterialIcon name="chat" />
          Reservar por WhatsApp
        </a>
      ) : (
        <button
          type="button"
          className="w-full rounded-full border border-primary-container py-2.5 font-body text-label-md text-primary-container"
        >
          Reservar con {provider.agencyName}
        </button>
      )}
    </article>
  );
}

function SpecChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface px-2.5 py-1 font-body text-label-sm text-on-surface-variant">
      <MaterialIcon name={icon} className="text-sm" />
      {label}
    </span>
  );
}
