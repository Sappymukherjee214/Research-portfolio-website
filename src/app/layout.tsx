import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientRegistry from "@/components/ClientRegistry";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Saptarshi Mukherjee | ML/CV Research",
  description: "Research portfolio focusing on Robust Multimodal Intelligence under Real-World Uncertainty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased selection:bg-neutral-800`}>
        <ClientRegistry>
          {children}
        </ClientRegistry>
      </body>
    </html>
  );
}
