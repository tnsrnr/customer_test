import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AGGridProvider } from "@/components/ag-grid-provider";
import { Header } from "@/components/ui/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HTNS Dashboard",
  description: "HTNS Business Intelligence Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AGGridProvider>
          <Header />
          {children}
        </AGGridProvider>
      </body>
    </html>
  );
} 