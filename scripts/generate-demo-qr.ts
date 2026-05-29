import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { config } from "dotenv";

config({ path: path.join(process.cwd(), ".env.local") });

const DEMO_LOT_SLUG = "finca-la-esperanza";
const PRODUCTION_APP_URL = "https://web-omega-lilac-31.vercel.app";

function getProductUrl(slug: string): string {
  let base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? PRODUCTION_APP_URL;
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    base = PRODUCTION_APP_URL;
  }
  return `${base}/producto/${slug}`;
}

async function main() {
  /** Fuera de public/: asset de demo para imprimir/compartir, no servido por Next.js */
  const outDir = path.join(process.cwd(), "qr");
  await mkdir(outDir, { recursive: true });

  const url = getProductUrl(DEMO_LOT_SLUG);
  const filePath = path.join(outDir, `${DEMO_LOT_SLUG}.png`);

  await QRCode.toFile(filePath, url, {
    type: "png",
    width: 1024,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#271310", light: "#ffffff" },
  });

  console.log(`QR generado: ${filePath}`);
  console.log(`Apunta a: ${url}`);
  console.log("Escaneable desde la cámara del celular — no requiere abrir la web antes.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
