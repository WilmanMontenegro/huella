import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { getAgenciaBySlug } from "@/lib/data/agencia-repository";

interface ReferralBannerProps {
  agenciaSlug: string;
}

export async function ReferralBanner({ agenciaSlug }: ReferralBannerProps) {
  const agencia = await getAgenciaBySlug(agenciaSlug);
  if (!agencia) return null;

  return (
    <div className="mx-auto mb-4 max-w-prose px-container-padding-mobile md:px-0">
      <div className="flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3">
        <MaterialIcon name="hiking" className="mt-0.5 shrink-0 text-secondary" />
        <div className="min-w-0 flex-1">
          <p className="font-body text-label-sm text-outline">Te recomienda</p>
          <p className="font-body text-label-md text-primary">{agencia.name}</p>
          {agencia.tagline && (
            <p className="mt-0.5 font-body text-body-sm text-on-surface-variant">{agencia.tagline}</p>
          )}
        </div>
        <Link
          href={`/aliado/${agencia.slug}`}
          className="shrink-0 font-body text-label-sm text-secondary hover:underline"
        >
          Ver aliado
        </Link>
      </div>
    </div>
  );
}
