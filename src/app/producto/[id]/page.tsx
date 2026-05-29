import { notFound } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { ProductSectionObserver } from "@/components/chat/ProductSectionObserver";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Certifications } from "@/components/product/Certifications";
import { FarmMap } from "@/components/product/FarmMap";
import { LotQrCode } from "@/components/product/LotQrCode";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductHero } from "@/components/product/ProductHero";
import { ShareButton } from "@/components/product/ShareButton";
import { Timeline } from "@/components/product/Timeline";
import { TourTeaser } from "@/components/product/TourTeaser";
import { getLotById, getProducerForLot, getExperiencesForLot } from "@/lib/data/lots-repository";
import { hasRealBlockchainVerification } from "@/lib/blockchain/verification";

interface PageProps {
  params: { id: string };
}

export default async function ProductoPage({ params }: PageProps) {
  const { id } = params;
  const lot = await getLotById(id);

  if (!lot) notFound();

  const producer = await getProducerForLot(lot);
  const subtitle = `Cultivado por ${producer.name} y su familia • ${lot.elevation ?? ""} de altitud`;
  const experiences = await getExperiencesForLot(id);
  const hasBlockchain = hasRealBlockchainVerification(lot.blockchainHash);

  return (
    <>
      <ProductSectionObserver />
      <TopAppBar
        backHref="/"
        rightAction={<ShareButton lotSlug={id} title={lot.farmName} />}
      />
      <main className="mx-auto max-w-5xl pb-32 pt-16">
        <div data-chat-section="product-hero">
          <ProductHero lot={lot} subtitle={subtitle} />
        </div>

        <div className="mt-section-gap space-y-section-gap px-container-padding-mobile md:px-0">
          <div data-chat-section="product-detail">
            <ProductDetail lot={lot} />
          </div>

          <section data-chat-section="product-map" className="mx-auto max-w-prose">
            <h3 className="mb-4 text-center font-display text-headline-md text-primary">Ubicación de la finca</h3>
            <FarmMap lat={producer.lat} lng={producer.lng} label={lot.farmName} />
            <p className="mt-3 text-center font-body text-label-sm text-outline">{producer.municipality}</p>
          </section>

          <section data-chat-section="product-producer" className="mx-auto max-w-prose text-center">
            <MaterialIcon name="eco" className="mb-4 text-4xl text-primary-container" />
            <h3 className="mb-6 font-display text-headline-lg-mobile text-primary md:text-headline-lg">
              Quién lo cultiva
            </h3>
            <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">{producer.story}</p>
          </section>

          <div data-chat-section="product-certifications">
            <Certifications items={lot.certifications} />
          </div>

          <div data-chat-section="product-timeline">
            <Timeline
              steps={lot.traceability}
              title="El camino de tu café"
              verification={{
                registrationTx: lot.blockchainHash ?? "",
                contractAddress: lot.contractAddress,
                isDemoMode: !hasBlockchain,
              }}
            />
          </div>

          <section className="mx-auto max-w-xs rounded-card border border-[#E5E0D5] bg-surface-container-lowest p-6 organic-shadow">
            <LotQrCode lotSlug={id} size={140} label="Código QR del lote" showUrl={false} />
          </section>

          <div data-chat-section="product-tours">
            <TourTeaser lotId={id} experiences={experiences} />
          </div>
        </div>
      </main>

      <ProductActions lot={lot} />
    </>
  );
}
