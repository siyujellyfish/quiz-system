import type { Metadata } from "next";
import { productCopy } from "@/lib/quiz/product-copy";
import "./globals.css";

export const metadata: Metadata = {
  title: productCopy.title,
  description: productCopy.metadataDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
