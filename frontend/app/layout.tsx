import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VedaAI — AI-Powered Assignment Generator",
  description:
    "Create structured assignments and generate complete question papers using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full min-h-0 overflow-hidden font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
