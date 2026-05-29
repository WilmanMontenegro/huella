import Image from "next/image";
import { notFound } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ExperienceProviderCard } from "@/components/product/ExperienceProviderCard";
import { getExperienceById, getLotById } from "@/lib/data/lots-repository";

interface PageProps {
  params: { id: string; experienceId: string };
}

export default async function ExperienciaDetailPage({ params }: PageProps) {
  const { id, experienceId } = params;
  const lot = await getLotById(id);
  const experience = await getExperienceById(id, experienceId);

  if (!lot || !experience) notFound();

  return (
    <>
      <TopAppBar title={experience.title} backHref={`/producto/${id}/experiencias`} />
      <main className="mx-auto max-w-3xl px-container-padding-mobile pb-16 pt-20 md:px-0">
        <div className="relative mb-6 h-48 overflow-hidden rounded-card sm:h-56">
          <Image src={experience.imageUrl} alt={experience.title} fill className="object-cover" sizes="768px" priority />
        </div>

        <div className="mb-8">
          <p className="font-body text-label-sm uppercase tracking-wider text-secondary">{lot.farmName}</p>
          <h2 className="mt-1 font-display text-headline-lg-mobile text-primary md:text-headline-lg">
            {experience.title}
          </h2>
          <p className="mt-3 font-body text-body-lg leading-relaxed text-on-surface-variant">
            {experience.description}
          </p>
        </div>

        <section>
          <h3 className="mb-4 font-display text-headline-sm text-primary">
            Agencias que ofrecen esta experiencia
          </h3>
          <div className="space-y-4">
            {experience.providers.map((provider) => (
              <ExperienceProviderCard
                key={provider.id}
                provider={provider}
                experienceTitle={experience.title}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
