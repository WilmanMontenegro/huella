import { notFound } from "next/navigation";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { LotQrCode } from "@/components/product/LotQrCode";
import { getLotById } from "@/lib/data/lots-repository";
import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

interface PageProps {
  params: { id: string };
}

export default async function ProductorLotePage({ params }: PageProps) {
  const lot = await getLotById(params.id);
  if (!lot) notFound();

  return (
    <>
      <TopAppBar title="QR del lote" backHref="/productor/dashboard" />
      <main className="mx-auto max-w-md px-margin-mobile pb-24 pt-24 text-center md:px-margin-desktop">
        <h2 className="mb-2 font-display text-headline-md text-primary">{lot.farmName}</h2>
        <p className="mb-8 font-body text-body-md text-on-surface-variant">{lot.currentStatus}</p>

        <LotQrCode lotSlug={lot.id} size={200} label="Escanea para ver trazabilidad pública" />

        <div className="mt-10 space-y-3">
          <Link
            href={`/producto/${lot.id}`}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary"
          >
            <MaterialIcon name="visibility" />
            Vista turista
          </Link>
          <p className="font-body text-label-sm text-outline">
            Imprime este QR en bolsas, stand del operador turístico o diapositiva del pitch.
          </p>
        </div>
      </main>
    </>
  );
}
