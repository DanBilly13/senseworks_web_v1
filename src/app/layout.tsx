import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";
import { INDEXABLE, SITE_URL } from "@/lib/site";

// Body copy — Inter stands in for a body-specific typeface, which
// hasn't been chosen yet.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Numbers — step counters, numbered eyebrows, stat values. Applied with
// the font-mono utility (see --font-mono in globals.css).
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Headings only (D18) — Aeonik, the real licensed family, supplied by
// Dan. Two real cuts loaded at their own actual weights — Medium
// declared as 600 (Aeonik has no dedicated 600 cut, and every h2/h3
// uses font-semibold) and Bold as 700 (h1, font-bold) — so neither
// weight relies on the browser synthetically bolding a single face.
const aeonik = localFont({
  src: [
    { path: "./fonts/Aeonik-Medium.otf", weight: "600", style: "normal" },
    { path: "./fonts/Aeonik-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const metadata: Metadata = {
  // Relative canonical/alternate/share-image URLs resolve against the
  // real domain (lib/site.ts).
  metadataBase: new URL(SITE_URL),
  title: "Senseworks",
  // Shown for any page without its own SEO description in Studio.
  description: "Senseworks builds audit and analytics software for audit firms, with Ally, an AI fluent in audit.",
  // Only the production deployment may be indexed; previews and local
  // dev stay out (robots.txt keeps the vercel.app address out too).
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: "Senseworks", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${aeonik.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScrollProvider />
        {children}
      </body>
    </html>
  );
}
