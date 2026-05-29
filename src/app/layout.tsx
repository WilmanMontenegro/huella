import type { Metadata } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { ChatRoot } from "@/components/chat/ChatRoot";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Huella — Trazabilidad agro-turística del Magdalena",
  description:
    "Conecta productor, turista y exportador con trazabilidad verificable, QR y agente IA del producto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <body
        className={`${ebGaramond.variable} ${manrope.variable} bg-background font-body text-on-background antialiased`}
      >
        <ChatRoot>{children}</ChatRoot>
      </body>
    </html>
  );
}
