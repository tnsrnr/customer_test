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
    <div className="flex flex-col h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
        <div className="flex flex-col flex-1 overflow-hidden px-4 pt-2 pb-4">
          {/* 탭이 있을 때만 탭 네비게이션 표시 */}
          {hasActiveTabs && (
            <div className="rounded-xl border bg-card shadow-md py-1 px-4 mb-3">
              <AppTabs />
            </div>
          )}
          
          {/* 상태 유지형 탭 뷰 */}
          <PersistentTabView className="flex-1">
            <main className="h-full w-full">
              <div className="h-full">
                <div className="h-full rounded-xl border bg-card shadow-md px-4 py-3 overflow-auto">
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