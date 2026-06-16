import type { Metadata } from "next";
import { ThemeInitScript } from "@/components/theme/theme-init-script";
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
    <html lang="zh-Hant" suppressHydrationWarning>
      <body>
        <ThemeInitScript />
        {children}
      </body>
    </html>
  );
}
