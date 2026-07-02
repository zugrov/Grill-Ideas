import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "GRILL IDEAS — maxima consulting",
  description: "Жёсткая валидация бизнес-идей. Этапы 0–1 бесплатно.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-mc-bg text-mc-text">
        {children}
      </body>
    </html>
  );
}
