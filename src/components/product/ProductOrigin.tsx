import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ProductOrigin as ProductOriginData } from "@/lib/product-origin";

interface ProductOriginProps {
  origin: ProductOriginData;
}

/** Finca y empresa — se muestra después del detalle del producto. */
export function ProductOrigin({ origin }: ProductOriginProps) {
  const { farm } = origin;

  return (
    <article className="overflow-hidden rounded-card border border-[#E5E0D5] bg-surface-container-lowest organic-shadow md:p-0">
      {farm.imageUrl && (
        <div className="relative h-44 w-full md:h-52">
          <Image
            src={farm.imageUrl}
            alt={`${farm.name} — finca y cultivo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <div className="p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2 text-tertiary-container">
          <MaterialIcon name="agriculture" className="text-xl" />
          <span className="font-body text-label-sm uppercase tracking-wider">Finca y empresa</span>
        </div>
        <h3 className="font-display text-headline-md text-primary">{farm.name}</h3>
        {farm.companyName && farm.companyName !== farm.name && (
          <p className="mt-1 font-body text-body-md font-medium text-on-surface">{farm.companyName}</p>
        )}
        {(farm.municipality || farm.region) && (
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-label-md text-outline">
            <MaterialIcon name="location_on" className="text-base text-secondary" />
            {[farm.municipality, farm.region].filter(Boolean).join(" · ")}
          </p>
        )}
        {farm.description && (
          <p className="mt-3 font-body text-body-md leading-relaxed text-on-surface-variant">{farm.description}</p>
        )}
      </div>
    </article>
  );
}
