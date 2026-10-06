import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cellphone",
  description: "A Next.js application built with TypeScript and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
