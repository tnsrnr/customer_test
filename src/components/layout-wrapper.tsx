'use client';

import { Header } from '@/components/ui/header';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden px-4 pt-2 pb-4">
            <main className="h-full w-full">
              <div className="h-full">
                <div className="h-full rounded-xl border bg-card shadow-md px-4 py-3 overflow-auto">
                  {children}
                </div>
              </div>
            </main>
        </div>
      </div>
    </div>
  );
} 