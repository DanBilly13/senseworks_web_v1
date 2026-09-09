import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Body copy — Inter stands in for a body-specific typeface, which
// hasn't been chosen yet.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
  title: "Senseworks",
  description: "Senseworks marketing site — block library calibration slice.",
  // Dev-only Vercel deployment isn't meant to be publicly discoverable —
  // keep it out of search indexes until it's ready to be real.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${aeonik.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
