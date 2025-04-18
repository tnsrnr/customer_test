'use client';

import { useTabsStore, Tab } from '@/lib/store/tabsStore';
import { useEffect, useRef, memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TabsContainer, TabKeepAlive } from './TabKeepAlive';
import { cn } from '@/lib/utils';

// 성능 최적화를 위해 메모이제이션된 탭 컨텐츠 컴포넌트
const MemoizedTabContent = memo<{
  tabId: string;
  children: React.ReactNode;
  isActive: boolean;
}>(({ tabId, children, isActive }) => {
  return (
    <TabKeepAlive tabId={tabId} isActive={isActive}>
      {children}
    </TabKeepAlive>
  );
});
MemoizedTabContent.displayName = 'MemoizedTabContent';

interface PersistentTabViewProps {
  children: React.ReactNode;
  className?: string;
}

export function PersistentTabView({ children, className }: PersistentTabViewProps) {
  const { tabs, activeTabId, setTabCached, isTabCached } = useTabsStore();
  const pathname = usePathname();
  const initialRenderRef = useRef(true);
  const router = useRouter();

  // 초기 렌더링 시 현재 경로가 탭에 없으면 탭 컴포넌트 캐시 초기화
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      const currentTab = tabs.find(tab => tab.path === pathname);
      if (currentTab) {
        setTabCached(pathname, true);
      }
    }
  }, [pathname, tabs, setTabCached]);

  // 현재 활성화된 탭
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  // 활성 탭이 없고 현재 경로가 있는 경우 children을 표시
  if (!activeTab) {
    return <div className={cn("h-full flex-1 overflow-auto", className)}>{children}</div>;
  }

  return (
    <TabsContainer>
      <div className={cn("h-full flex-1 overflow-hidden", className)}>
        {/* 모든 탭의 컨텐츠를 렌더링하되 활성 탭만 보이게 함 */}
        {tabs.map(tab => (
          <MemoizedTabContent
            key={tab.instanceId || tab.id}
            tabId={tab.id}
            isActive={tab.id === activeTabId}
          >
            {/* 현재 경로와 일치하는 탭에는 현재 컨텐츠를 표시 */}
            {tab.path === pathname ? children : null}
          </MemoizedTabContent>
        ))}
      </div>
    </TabsContainer>
  );
}

// 개별 탭의 스크롤 위치, 폼 상태 등을 보존하는 래퍼 컴포넌트
export const TabStateWrapper = memo<{
  tabId: string;
  children: React.ReactNode;
}>(({ tabId, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { updateTabMetadata } = useTabsStore();
  
  // 스크롤 위치 저장
  useEffect(() => {
    if (!contentRef.current) return;
    
    const saveScrollPosition = () => {
      if (contentRef.current) {
        const { scrollTop } = contentRef.current;
        updateTabMetadata(tabId, { scrollPosition: scrollTop });
      }
    };
    
    // 스크롤 이벤트 리스너 등록
    contentRef.current.addEventListener('scroll', saveScrollPosition);
    
    return () => {
      contentRef.current?.removeEventListener('scroll', saveScrollPosition);
    };
  }, [tabId, updateTabMetadata]);
  
  return (
    <div ref={contentRef} className="h-full overflow-auto">
      {children}
    </div>
  );
});
TabStateWrapper.displayName = 'TabStateWrapper'; 