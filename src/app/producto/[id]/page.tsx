import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductSectionObserver } from "@/components/chat/ProductSectionObserver";
import { ReferralBanner } from "@/components/operador/ReferralBanner";
import { ReferralCapture } from "@/components/operador/ReferralCapture";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { Certifications } from "@/components/product/Certifications";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductOrigenBlock } from "@/components/product/ProductOrigenBlock";
import { ProductPageSection } from "@/components/product/ProductPageSection";
import { ShareButton } from "@/components/product/ShareButton";
import { Timeline } from "@/components/product/Timeline";
import { TourTeaser } from "@/components/product/TourTeaser";
import { getLotById, getProducerForLot, getExperiencesForLot } from "@/lib/data/lots-repository";
import { hasRealBlockchainVerification } from "@/lib/blockchain/verification";
import { getProductCopy } from "@/lib/product-copy";
import { resolveProductOrigin } from "@/lib/product-origin";

interface PageProps {
  params: { id: string };
  searchParams: { ref?: string };
}

export default async function ProductoPage({ params, searchParams }: PageProps) {
  const { id } = params;
  const refSlug = searchParams.ref;
  const lot = await getLotById(id);

  if (!lot) notFound();

  const producer = await getProducerForLot(lot);
  const origin = resolveProductOrigin(lot, producer);
  const copy = getProductCopy(lot.product);
  const heroTitle =
    lot.productDetail?.displayName ?? [lot.product, lot.variety].filter(Boolean).join(" · ");
  const heroSubtitle =
    lot.productDetail?.brand?.tagline ??
    lot.currentStatus ??
    [lot.product, lot.variety].filter(Boolean).join(" · ");
  const experiences = await getExperiencesForLot(id);
  const hasBlockchain = hasRealBlockchainVerification(lot.blockchainHash);

  return (
    <>
      <Suspense fallback={null}>
        <ReferralCapture loteSlug={id} />
      </Suspense>
      <ProductSectionObserver />
      <TopAppBar
        backHref="/"
        rightAction={<ShareButton lotSlug={id} title={heroTitle} />}
      />
      <main className="mx-auto max-w-5xl space-y-section-gap pb-32 pt-16">
        {refSlug && <ReferralBanner agenciaSlug={refSlug} />}
        {/* 1. Qué es (foto + ficha) */}
        <ProductPageSection
          title="El producto"
          subtitle="Lo que escaneaste: nombre, marca y características del lote"
        >
          <div data-chat-section="product-hero" className="-mx-container-padding-mobile md:mx-0">
            <ProductHero lot={lot} title={heroTitle} subtitle={heroSubtitle} />
          </div>
          <div data-chat-section="product-detail">
            <ProductDetail lot={lot} />
          </div>
        </ProductPageSection>

        {/* 2. De dónde viene */}
        <ProductPageSection
          title="Origen"
          subtitle={`Finca, empresa y productor detrás de ${heroTitle}`}
        >
          <ProductOrigenBlock origin={origin} producer={producer} farmLabel={lot.farmName} />
        </ProductPageSection>

        {/* 3. Confianza */}
        <ProductPageSection
          title="Trazabilidad"
          subtitle="Certificaciones y recorrido verificable del lote"
        >
          <div data-chat-section="product-certifications">
            <Certifications items={lot.certifications} />
          </div>
          <div data-chat-section="product-timeline">
            <Timeline
              steps={lot.traceability}
              title={copy.timelineTitle}
              timelineSubtitle={copy.timelineSubtitle}
              verification={{
                registrationTx: lot.blockchainHash ?? "",
                contractAddress: lot.contractAddress,
                isDemoMode: !hasBlockchain,
              }}
            />
          </div>
        </ProductPageSection>

        {/* 4. Turismo */}
        {(experiences.length > 0 || lot.tour || lot.tours?.length) && (
          <ProductPageSection title="Vive el origen" subtitle="Tours y experiencias en la finca">
            <div data-chat-section="product-tours">
              <TourTeaser lotId={id} experiences={experiences} />
            </div>
          </ProductPageSection>
        )}
      </main>

      <ProductActions lot={lot} />
    </>
  );
}
