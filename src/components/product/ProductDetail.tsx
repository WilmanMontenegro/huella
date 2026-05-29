import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { Lot } from "@/types";

interface ProductDetailProps {
  lot: Lot;
}

export function ProductDetail({ lot }: ProductDetailProps) {
  const detail = lot.productDetail;
  if (!detail) return null;

  return (
    <section className="rounded-card border border-[#E5E0D5] bg-surface-container-lowest p-6 md:p-8 organic-shadow">
      <div className="mb-4 flex items-center gap-2 text-tertiary-container">
        <MaterialIcon name="coffee" className="text-xl" />
        <span className="font-body text-label-sm uppercase tracking-wider">El producto que escaneaste</span>
      </div>

      <h3 className="mb-2 font-display text-headline-md text-primary">{detail.displayName}</h3>
      <p className="mb-6 font-body text-body-lg leading-relaxed text-on-surface-variant">{detail.summary}</p>

      <div className="flex flex-wrap gap-2">
        {detail.specs.map((spec) => (
          <span
            key={spec.label}
            className="rounded-full border border-outline-variant/40 bg-surface-container px-3 py-1.5 font-body text-label-sm text-on-surface-variant"
          >
            <span className="text-outline">{spec.label}:</span> {spec.value}
          </span>
        ))}
      </div>

      {detail.tastingNotes && (
        <p className="mt-5 border-t border-outline-variant/30 pt-5 font-body text-body-md italic text-on-surface-variant">
          {detail.tastingNotes}
        </p>
      )}
    </section>
  );
}
