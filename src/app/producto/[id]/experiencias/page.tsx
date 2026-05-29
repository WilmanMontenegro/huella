import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { getExperiencesForLot, getLotById } from "@/lib/data/lots-repository";

interface PageProps {
  params: { id: string };
}

export default async function ExperienciasPage({ params }: PageProps) {
  const { id } = params;
  const lot = await getLotById(id);
  if (!lot) notFound();

  const experiences = await getExperiencesForLot(id);

  return (
    <>
      <TopAppBar title="Experiencias" backHref={`/producto/${id}`} />
      <main className="mx-auto max-w-3xl px-container-padding-mobile pb-16 pt-20 md:px-0">
        <div className="mb-8 text-center">
          <p className="font-body text-label-sm uppercase tracking-wider text-secondary">Huellas</p>
          <h2 className="mt-2 font-display text-headline-lg-mobile text-primary md:text-headline-lg">
            Tours en {lot.farmName}
          </h2>
          <p className="mt-2 font-body text-body-md text-on-surface-variant">
            Elige una experiencia y compara agencias
          </p>
        </div>

        <div className="space-y-4">
          {experiences.map((experience) => {
            const prices = experience.providers
              .map((p) => p.price)
              .filter((p): p is number => p !== undefined);
            const minPrice = prices.length ? Math.min(...prices) : undefined;

            return (
              <Link
                key={experience.id}
                href={`/producto/${id}/experiencias/${experience.id}`}
                className="group flex overflow-hidden rounded-card border border-[#E5E0D5] bg-surface-container-lowest organic-shadow transition-shadow hover:shadow-md"
              >
                <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-36">
                  <Image
                    src={experience.imageUrl}
                    alt={experience.title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-4">
                  <h3 className="font-display text-headline-sm text-primary group-hover:text-primary-container">
                    {experience.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-body text-body-md text-on-surface-variant">
                    {experience.summary}
                  </p>
                  <p className="mt-2 font-body text-label-sm text-outline">
                    {experience.providers.length} agencia{experience.providers.length > 1 ? "s" : ""}
                    {Number.isFinite(minPrice) && minPrice !== undefined && ` · desde USD ${minPrice}`}
                  </p>
                </div>
                <div className="flex items-center pr-4 text-outline group-hover:text-primary">
                  <MaterialIcon name="chevron_right" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
