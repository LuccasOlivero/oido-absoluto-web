import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oído Absoluto 🎧 | Adivina el Año Musical",
  description: "Juego musical minimalista: escucha fragmentos de 1s, 3s o 5s y adivina el año de lanzamiento para llegar al Ranking Mundial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-stone-800 selection:bg-purple-200 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
