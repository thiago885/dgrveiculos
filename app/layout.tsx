import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "DGR Veículos — Elite em Seminovos",
  description:
    "Especialistas em seminovos de alto padrão. Qualidade, procedência e transparência em cada negócio. Encontre seu veículo ideal.",
  keywords: "seminovos, carros usados, veículos, DGR Veículos",
  openGraph: {
    title: "DGR Veículos — Elite em Seminovos",
    description: "Seminovos de alto padrão com procedência garantida.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
