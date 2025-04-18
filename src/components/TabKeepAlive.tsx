'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 탭 컨텐츠를 저장할 컨텍스트
interface TabCacheContextType {
  // 각 경로별 컴포넌트 인스턴스를 저장하는 맵
  tabs: Map<string, React.ReactNode>;
  // 새 탭 추가 메서드
  addTab: (path: string, content: React.ReactNode) => void;
  // 탭 제거 메서드
  removeTab: (path: string) => void;
  // 모든 탭 제거 메서드
  clearTabs: () => void;
}

const TabCacheContext = createContext<TabCacheContextType | null>(null);

// 탭 캐시 컨텍스트 사용을 위한 훅
export const useTabCache = () => {
  const context = useContext(TabCacheContext);
  if (!context) {
    throw new Error('useTabCache must be used within a TabCacheProvider');
  }
  return context;
};

// 탭 캐시 제공자 컴포넌트
export const TabCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // useRef를 사용하여 탭 컨텐츠를 메모리에 유지
  const tabsRef = useRef<Map<string, React.ReactNode>>(new Map());

  // 컨텍스트 값
  const value: TabCacheContextType = {
    tabs: tabsRef.current,
    addTab: (path, content) => {
      tabsRef.current.set(path, content);
    },
    removeTab: (path) => {
      tabsRef.current.delete(path);
    },
    clearTabs: () => {
      tabsRef.current.clear();
    }
  };

  return (
    <TabCacheContext.Provider value={value}>
      {children}
    </TabCacheContext.Provider>
  );
};

// props 타입 정의
interface TabKeepAliveProps {
  tabId: string;
  isActive: boolean;
  children: React.ReactNode;
}

// 개별 탭의 상태를 보존하는 컴포넌트
export const TabKeepAlive: React.FC<TabKeepAliveProps> = ({ tabId, isActive, children }) => {
  const { tabs, addTab } = useTabCache();
  const [hasRendered, setHasRendered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 처음 렌더링될 때 컨텐츠를 탭 캐시에 저장
  useEffect(() => {
    if (!hasRendered) {
      addTab(tabId, children);
      setHasRendered(true);
    }
  }, [tabId, children, addTab, hasRendered]);

  // 탭 스타일 - 활성 상태에 따라 표시 여부 결정
  const style = {
    display: isActive ? 'block' : 'none',
    height: '100%',
    overflow: 'auto',
  };

  // 캐시된 컨텐츠가 있으면 해당 컨텐츠를 사용, 없으면 children 사용
  const content = tabs.get(tabId) || children;

  return (
    <div ref={contentRef} style={style} className="tab-content">
      {content}
    </div>
  );
};

// 모든 탭 컨텐츠를 관리하는 컨테이너 컴포넌트
export const TabsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TabCacheProvider>
      {children}
    </TabCacheProvider>
  );
}; 