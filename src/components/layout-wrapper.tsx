'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Header } from '@/components/ui/header';
import { AppTabs } from '@/components/app-tabs';
import { useTabsStore } from '@/lib/store/tabsStore';
import { usePathname } from 'next/navigation';
import { PersistentTabView } from './PersistentTabView';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { tabs, activeTabId } = useTabsStore();
  const pathname = usePathname();
  
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // 활성 탭이 있는지 확인
  const hasActiveTabs = tabs.length > 0;

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppTabs />
          
          {/* 상태 유지형 탭 뷰 */}
          <PersistentTabView className="flex-1">
            <main className="h-full w-full">
              <div className="h-full mx-auto container max-w-full">
                <div className="h-full rounded-lg border bg-card shadow-sm p-3 md:p-4">
                  {children}
                </div>
              </div>
            </main>
          </PersistentTabView>
        </div>
      </div>
    </div>
  );
} 