import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { QR_PUBLIC_LOTS } from "@/data/qr-lots";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const lot = QR_PUBLIC_LOTS.find((l) => l.slug === params.slug);
  if (!lot) {
    return NextResponse.json({ error: "QR not found" }, { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "qr", lot.fileName);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${lot.fileName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "QR file missing on server" }, { status: 404 });
  }
}
