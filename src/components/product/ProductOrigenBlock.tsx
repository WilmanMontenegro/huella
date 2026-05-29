import Image from "next/image";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { FarmMap } from "@/components/product/FarmMap";
import { ProductOrigin } from "@/components/product/ProductOrigin";
import type { ProductOrigin as ProductOriginData } from "@/lib/product-origin";
import type { Producer } from "@/types";

interface ProductOrigenBlockProps {
  origin: ProductOriginData;
  producer: Producer;
  farmLabel: string;
}

/** Origen unificado: finca/empresa → mapa → quien cultiva. */
export function ProductOrigenBlock({ origin, producer, farmLabel }: ProductOrigenBlockProps) {
  return (
    <>
      <div data-chat-section="product-origin">
        <ProductOrigin origin={origin} />
      </div>

      <div data-chat-section="product-map" className="space-y-3">
        <h3 className="text-center font-display text-headline-md text-primary">Ubicación</h3>
        <FarmMap lat={producer.lat} lng={producer.lng} label={farmLabel} />
        <p className="text-center font-body text-label-sm text-outline">{producer.municipality}</p>
      </div>

      <article
        data-chat-section="product-producer"
        className="rounded-card border border-[#E5E0D5] bg-surface-container-lowest p-6 text-center organic-shadow md:p-8"
      >
        <div className="mx-auto mb-4 flex justify-center">
          {producer.photoUrl ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-secondary/30">
              <Image
                src={producer.photoUrl}
                alt={producer.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : (
            <MaterialIcon name="eco" className="text-4xl text-primary-container" />
          )}
        </div>
        <h3 className="mb-1 font-display text-headline-md text-primary">{producer.name}</h3>
        <p className="mb-4 font-body text-label-md text-secondary">
          {producer.yearsOfExperience > 0
            ? `${producer.yearsOfExperience} años en el campo`
            : "Productor en la Sierra Nevada"}
        </p>
        <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">{producer.story}</p>
      </article>
    </>
  );
}
