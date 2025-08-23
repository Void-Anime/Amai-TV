import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMAI TV - Watch Anime Online",
  description: "Stream your favorite anime series and movies on AMAI TV. High quality, fast streaming experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src="//nervousnormgaze.com/ee/fc/64/eefc6462a378d15c01af2930a05e574b.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


