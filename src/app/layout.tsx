import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/global/styles/globals.css';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HTNS 경영정보시스템',
  description: 'HTNS 경영정보시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 