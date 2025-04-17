import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Tab {
  id: string;
  title: string;
  path: string;
  iconName?: string;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  removeAllTabs: () => void;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      
      addTab: (tab: Tab) => {
        const { tabs } = get();
        const existingTab = tabs.find(t => t.id === tab.id);
        
        if (existingTab) {
          set({ activeTabId: tab.id });
        } else {
          set(state => ({
            tabs: [...state.tabs, tab],
            activeTabId: tab.id
          }));
        }
      },
      
      removeTab: (id: string) => {
        const { tabs, activeTabId } = get();
        const newTabs = tabs.filter(tab => tab.id !== id);
        
        // 활성 탭이 제거된 경우, 가장 최근 탭을 활성화
        let newActiveTabId = activeTabId;
        if (activeTabId === id && newTabs.length > 0) {
          newActiveTabId = newTabs[newTabs.length - 1].id;
        } else if (newTabs.length === 0) {
          newActiveTabId = null;
        }
        
        set({
          tabs: newTabs,
          activeTabId: newActiveTabId
        });
      },
      
      setActiveTab: (id: string) => {
        set({ activeTabId: id });
      },
      
      removeAllTabs: () => {
        set({ tabs: [], activeTabId: null });
      }
    }),
    {
      name: 'erp-tabs',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
); 