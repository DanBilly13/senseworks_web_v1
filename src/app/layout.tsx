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
// Dan. Only the Medium cut is loaded, mapped to font-weight 600 in
// globals.css's @font-face — every heading in the app uses
// font-semibold (600), and Aeonik doesn't have its own 600 cut, so
// declaring Medium's actual file at weight 600 avoids the browser
// synthetically bolding it to fake a 600 match.
const aeonik = localFont({
  src: "./fonts/Aeonik-Medium.otf",
  variable: "--font-aeonik",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Senseworks",
  description: "Senseworks marketing site — block library calibration slice.",
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
