import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/AuthContext";
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
        {/* Remove third-party scripts for cleaner UX */}
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="data:," />
      </head>
      <body className={`${inter.className} bg-[var(--bg)] text-[var(--text)]`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}


