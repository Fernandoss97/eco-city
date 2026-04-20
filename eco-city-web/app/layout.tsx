import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EcoCity — Cornélio Procópio",
    template: "%s · EcoCity",
  },
  description:
    "Consulte o calendário de coletas, encontre pontos de reciclagem e receba lembretes de coleta pelo WhatsApp em Cornélio Procópio.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geist.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-page text-ink">
        {children}
      </body>
    </html>
  );
}
