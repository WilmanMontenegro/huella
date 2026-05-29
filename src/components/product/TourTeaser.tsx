import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { TourExperience } from "@/types";

interface TourTeaserProps {
  lotId: string;
  experiences: TourExperience[];
}

export function TourTeaser({ lotId, experiences }: TourTeaserProps) {
  if (!experiences.length) return null;

  const featured = experiences[0];
  const providerCount = experiences.reduce((sum, e) => sum + e.providers.length, 0);
  const prices = experiences.flatMap((e) =>
    e.providers.map((p) => p.price).filter((p): p is number => p !== undefined)
  );
  const minPrice = prices.length ? Math.min(...prices) : undefined;

  return (
    <section className="space-y-4">
      <div className="text-center">
        <h3 className="font-display text-headline-md text-primary">Tours y experiencias</h3>
        <p className="mt-1 font-body text-body-md text-on-surface-variant">
          Vive la finca en persona con operadores locales
        </p>
      </div>

      <article className="relative overflow-hidden rounded-card border border-[#E5E0D5] bg-surface-container-low organic-shadow">
        <div className="md:flex">
          <div className="relative h-48 md:h-auto md:min-h-[220px] md:w-2/5">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
          </div>

          <div className="flex flex-col justify-center p-6 md:w-3/5 md:p-8">
            <div className="mb-2 flex items-center gap-2 text-secondary">
              <MaterialIcon name="location_on" className="text-lg" />
              <span className="font-body text-label-sm uppercase tracking-wider">Experiencia destacada</span>
            </div>

            <h4 className="mb-2 font-display text-headline-sm text-primary">{featured.title}</h4>
            <p className="mb-4 font-body text-body-md leading-relaxed text-on-surface-variant">
              {featured.summary}
            </p>

            <p className="mb-5 font-body text-label-sm text-outline">
              {experiences.length} experiencia{experiences.length > 1 ? "s" : ""} · {providerCount} agencia
              {providerCount > 1 ? "s" : ""}
              {minPrice !== undefined && ` · desde USD ${minPrice}`}
            </p>

            <Link
              href={`/producto/${lotId}/experiencias`}
              className="inline-flex items-center gap-2 self-start rounded-full border border-primary-container px-6 py-3 font-body text-label-md text-primary-container transition-colors hover:bg-primary-container hover:text-on-primary-container"
            >
              Ver experiencias disponibles
              <MaterialIcon name="arrow_forward" />
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
