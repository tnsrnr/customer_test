'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { AppTabs } from '@/components/app-tabs';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppTabs />
          <main className="flex-1 overflow-auto p-2 md:p-4">
            <div className="h-full mx-auto container max-w-full">
              <div className="h-full rounded-lg border bg-card shadow-sm p-3 md:p-4">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 