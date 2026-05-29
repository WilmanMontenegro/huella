import Image from "next/image";
import { resolveLotProductPhotoUrl } from "@/lib/media/lot-images";
import type { Lot } from "@/types";

interface ProductHeroProps {
  lot: Lot;
  title: string;
  subtitle: string;
}

export function ProductHero({ lot, title, subtitle }: ProductHeroProps) {
  const imageAlt = lot.productDetail?.displayName ?? title;
  const productPhoto = resolveLotProductPhotoUrl(lot);

  return (
    <section className="relative h-[530px] w-full overflow-hidden rounded-b-card md:mx-4 md:mt-8 md:h-[618px] md:rounded-card organic-shadow">
      <Image
        src={productPhoto}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-container-padding-mobile md:p-container-padding-desktop">
        <div className="mb-4 flex flex-wrap gap-2">
          {lot.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-on-tertiary/30 bg-surface/20 px-3 py-1 font-body text-label-sm text-on-tertiary backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mb-1 font-body text-label-md uppercase tracking-wider text-on-tertiary/80">
          El producto que escaneaste
        </p>
        <h2 className="font-display text-display-lg text-on-tertiary">{title}</h2>
        <p className="max-w-2xl font-body text-body-lg text-on-tertiary/90">{subtitle}</p>
      </div>
    </section>
  );
}
