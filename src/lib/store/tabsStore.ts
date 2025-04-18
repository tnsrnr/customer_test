import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ReactNode } from 'react';

export interface Tab {
  id: string;
  title: string;
  path: string;
  iconName?: string;
  // 탭 인스턴스 인덱스 (중복 탭 방지와 인스턴스 관리용)
  instanceId?: string;
  // 메타데이터 (사용자가 정의한 추가 정보 저장용)
  metadata?: Record<string, any>;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
  // 각 탭의 content 캐싱 맵 (실제 컴포넌트는 저장할 수 없으므로 별도 관리)
  tabComponentMap: Record<string, boolean>;
  // 탭 추가
  addTab: (tab: Tab) => void;
  // 탭 제거
  removeTab: (id: string) => void;
  // 활성 탭 설정
  setActiveTab: (id: string) => void;
  // 모든 탭 제거
  removeAllTabs: () => void;
  // 탭 순서 변경
  reorderTabs: (sourceId: string, targetId: string) => void;
  // 탭 메타데이터 업데이트
  updateTabMetadata: (id: string, metadata: Record<string, any>) => void;
  // 탭 컴포넌트 캐시 여부 설정
  setTabCached: (path: string, isCached: boolean) => void;
  // 탭 컴포넌트 캐시 여부 확인
  isTabCached: (path: string) => boolean;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      tabComponentMap: {},
      
      addTab: (tab: Tab) => {
        const { tabs } = get();
        const existingTab = tabs.find(t => t.id === tab.id);
        
        if (existingTab) {
          // 이미 존재하는 탭인 경우 활성 탭만 변경
          set({ activeTabId: tab.id });
        } else {
          // 새 탭 추가 시 instanceId 생성 (타임스탬프 사용)
          const newTab = {
            ...tab,
            instanceId: `${tab.id}-${Date.now()}`
          };
          
          set(state => ({
            tabs: [...state.tabs, newTab],
            activeTabId: newTab.id
          }));
        }
      },
      
      removeTab: (id: string) => {
        const { tabs, activeTabId, tabComponentMap } = get();
        const tabToRemove = tabs.find(tab => tab.id === id);
        const newTabs = tabs.filter(tab => tab.id !== id);
        
        // 활성 탭이 제거된 경우, 가장 최근 탭을 활성화
        let newActiveTabId = activeTabId;
        if (activeTabId === id && newTabs.length > 0) {
          newActiveTabId = newTabs[newTabs.length - 1].id;
        } else if (newTabs.length === 0) {
          newActiveTabId = null;
        }
        
        // 컴포넌트 캐시 맵에서 제거
        const newTabComponentMap = { ...tabComponentMap };
        if (tabToRemove) {
          delete newTabComponentMap[tabToRemove.path];
        }
        
        set({
          tabs: newTabs,
          activeTabId: newActiveTabId,
          tabComponentMap: newTabComponentMap
        });
      },
      
      setActiveTab: (id: string) => {
        set({ activeTabId: id });
      },
      
      removeAllTabs: () => {
        set({ 
          tabs: [], 
          activeTabId: null,
          tabComponentMap: {}
        });
      },
      
      reorderTabs: (sourceId: string, targetId: string) => {
        const { tabs } = get();
        const sourceIndex = tabs.findIndex(tab => tab.id === sourceId);
        const targetIndex = tabs.findIndex(tab => tab.id === targetId);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
          const newTabs = [...tabs];
          const [movedTab] = newTabs.splice(sourceIndex, 1);
          newTabs.splice(targetIndex, 0, movedTab);
          
          set({ tabs: newTabs });
        }
      },
      
      updateTabMetadata: (id: string, metadata: Record<string, any>) => {
        const { tabs } = get();
        const newTabs = tabs.map(tab => 
          tab.id === id 
            ? { ...tab, metadata: { ...tab.metadata, ...metadata } } 
            : tab
        );
        
        set({ tabs: newTabs });
      },
      
      setTabCached: (path: string, isCached: boolean) => {
        set(state => ({
          tabComponentMap: {
            ...state.tabComponentMap,
            [path]: isCached
          }
        }));
      },
      
      isTabCached: (path: string) => {
        return !!get().tabComponentMap[path];
      }
    }),
    {
      name: 'erp-tabs',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
        // tabComponentMap은 저장하지 않음 (컴포넌트 인스턴스는 세션 간 유지할 수 없음)
      }),
    }
  )
); 