import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { config } from "dotenv";
import { QR_PUBLIC_LOTS } from "../src/data/qr-lots";

config({ path: path.join(process.cwd(), ".env.local") });

const PRODUCTION_APP_URL = "https://web-omega-lilac-31.vercel.app";

function getProductUrl(slug: string): string {
  let base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? PRODUCTION_APP_URL;
  if (base.includes("localhost") || base.includes("127.0.0.1")) {
    base = PRODUCTION_APP_URL;
  }
  return `${base}/producto/${slug}`;
}

async function main() {
  const outDir = path.join(process.cwd(), "qr");
  await mkdir(outDir, { recursive: true });

  const manifest: Array<{
    slug: string;
    file: string;
    label: string;
    brandName: string;
    farmName: string;
    product: string;
    url: string;
  }> = [];

  for (const lot of QR_PUBLIC_LOTS) {
    const url = getProductUrl(lot.slug);
    const filePath = path.join(outDir, lot.fileName);

    await QRCode.toFile(filePath, url, {
      type: "png",
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#271310", light: "#ffffff" },
    });

    manifest.push({
      slug: lot.slug,
      file: lot.fileName,
      label: lot.label,
      brandName: lot.brandName,
      farmName: lot.farmName,
      product: lot.product,
      url,
    });

    console.log(`QR: ${lot.fileName} → ${url}`);
  }

  await writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), lots: manifest }, null, 2),
    "utf8"
  );

  console.log(`\n${manifest.length} QR en ${outDir} (cada uno = producto trazable de la finca).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
