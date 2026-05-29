import { isAuthDisabled } from "@/lib/auth/presentation";

/** Aviso discreto cuando el login está desactivado para la pitch. */
export function PresentationModeBar() {
  if (!isAuthDisabled()) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[90] border-t border-tertiary-container/40 bg-tertiary-fixed/95 px-4 py-2 text-center font-body text-label-sm text-on-tertiary-container backdrop-blur-sm"
      role="status"
    >
      Modo presentación — sin inicio de sesión. Vuelve a activar login después del pitch.
    </div>
  );
}
