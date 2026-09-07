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
  title: "TimePitch 👾 | Neon Cyberpunk Arcade",
  description: "High-octane musical game: scan audio snippets of 1s, 3s or 5s and decode the release year to reach the Global Network.",
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
      <body className="min-h-full flex flex-col text-stone-300 selection:bg-cyan-900/50 selection:text-cyan-400">
        {children}
      </body>
    </html>
  );
}
