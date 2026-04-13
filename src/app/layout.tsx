import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientRegistry from "@/components/ClientRegistry";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Saptarshi Mukherjee | Robust ML & Computer Vision Research",
  description: "Researcher specializing in Robust Machine Learning, Computer Vision, and Multimodal AI. Exploring model limits under noise and uncertainty.",
  keywords: ["Machine Learning", "Computer Vision", "Robustness", "Multimodal AI", "Deepfakes", "RAG", "Research Portfolio"],
  authors: [{ name: "Saptarshi Mukherjee" }],
  openGraph: {
    title: "Saptarshi Mukherjee | Research Portfolio",
    description: "Robust Multimodal Intelligence under Real-World Uncertainty.",
    type: "website",
  }
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
