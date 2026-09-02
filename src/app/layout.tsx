import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Placeholder typeface — Aeonik is the required typeface (see
// solution-spec.md → Design Tokens & Styling Architecture) but is not
// yet installed as a web font. Inter stands in until that lands.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Senseworks",
  description: "Senseworks marketing site — block library calibration slice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
