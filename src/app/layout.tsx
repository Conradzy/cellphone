import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], display: "swap", variable: "--font-inter-tight" });

export const metadata: Metadata = {
  title: "FORM — A study in possibility",
  description: "An independent iPhone concept. A cinematic exploration of considered design, precision, and what comes next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={interTight.variable}>{children}</body>
    </html>
  );
}
