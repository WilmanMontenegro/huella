import type { ReactNode } from "react";
import { HuellaLogo } from "@/components/brand/HuellaLogo";

interface AuthFormCardProps {
  children: ReactNode;
}

/** Contenedor visual unificado para pantallas de acceso. */
export function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-organic-lg">
      <div className="mb-6 flex justify-center">
        <HuellaLogo variant="vertical" href={undefined} priority />
      </div>
      {children}
    </div>
  );
}
