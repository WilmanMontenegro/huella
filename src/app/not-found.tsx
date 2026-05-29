import Link from "next/link";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-container-padding-mobile text-center">
      <MaterialIcon name="search_off" className="mb-4 text-5xl text-outline" />
      <h1 className="mb-2 font-display text-headline-lg text-primary">No encontrado</h1>
      <p className="mb-8 font-body text-body-md text-on-surface-variant">
        Este lote o página no existe.
      </p>
      <Link
        href="/"
        className="rounded-full bg-primary px-8 py-3 font-body text-label-md text-on-primary"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
