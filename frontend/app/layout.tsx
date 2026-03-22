import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} h-full antialiased`}
    >
      <body
        className="h-full min-h-0 overflow-hidden font-sans"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
