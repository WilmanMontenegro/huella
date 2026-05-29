"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { useChat } from "@/components/chat/ChatProvider";
import { MaterialIcon } from "@/components/icons/MaterialIcon";

function parseProductPath(text: string): string | null {
  const trimmed = text.trim();
  try {
    const url = trimmed.startsWith("http") ? new URL(trimmed) : new URL(trimmed, window.location.origin);
    const match = url.pathname.match(/^\/producto\/([^/]+)\/?$/);
    return match ? `/producto/${match[1]}` : null;
  } catch {
    const match = trimmed.match(/\/producto\/([^/\s]+)/);
    return match ? `/producto/${match[1]}` : null;
  }
}

export function ScanProductButton() {
  const router = useRouter();
  const { registerFabSuppress } = useChat();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = `huella-qr-${useId().replace(/:/g, "")}`;

  const close = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {
        // ignore cleanup errors
      }
    }
    setOpen(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    return registerFabSuppress("qr-scanner");
  }, [open, registerFabSuppress]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      const scanner = new Html5Qrcode(regionId);
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decoded) => {
            const path = parseProductPath(decoded);
            if (!path) return;

            scanner
              .stop()
              .then(() => {
                scanner.clear();
                scannerRef.current = null;
                setOpen(false);
                router.push(path);
              })
              .catch(() => router.push(path));
          },
          () => {}
        );
      } catch {
        if (!cancelled) {
          setError("Activa el permiso de cámara en tu celular para escanear el QR del producto.");
        }
      }
    })();

    return () => {
      cancelled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        scanner.stop().catch(() => {}).finally(() => scanner.clear());
      }
    };
  }, [open, regionId, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-primary font-body text-label-md text-on-primary shadow-lg transition-transform hover:bg-primary/90 active:scale-95 sm:w-auto sm:px-10"
      >
        <MaterialIcon name="qr_code_scanner" />
        Escanear producto
      </button>

      {open && (
        <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-card bg-surface-container-lowest shadow-organic-lg">
            <div className="flex items-center justify-between border-b border-outline-variant/30 p-4">
              <h2 className="font-display text-headline-md text-primary">Escanea el QR</h2>
              <button type="button" onClick={close} aria-label="Cerrar escáner">
                <MaterialIcon name="close" />
              </button>
            </div>

            <div className="p-4">
              <p className="mb-4 text-center font-body text-body-sm text-on-surface-variant">
                Apunta la cámara al código en el empaque o etiqueta del producto.
              </p>
              <div
                id={regionId}
                className="relative z-0 mx-auto overflow-hidden rounded-xl border border-outline-variant bg-black [&_video]:relative [&_video]:z-0 [&_video]:!rounded-xl"
              />
              {error && (
                <p className="mt-4 text-center font-body text-body-sm text-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
