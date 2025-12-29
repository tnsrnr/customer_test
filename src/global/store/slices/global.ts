import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { menuItems, MenuItem } from '@/common/components/layout/menu_config';

interface GlobalStore {
  // 전역 조회 상태
  isRefreshing: boolean;
  currentPage: 'page1' | 'page2' | 'page3';
  
  // 년/월 정보
  selectedYear: number;
  selectedMonth: number;
  
  // 메뉴 순서 관리
  menuOrder: string[]; // 메뉴 path들의 순서
  isMenuEditMode: boolean; // 메뉴 편집 모드
  
  // 액션
  setRefreshing: (refreshing: boolean) => void;
  setCurrentPage: (page: 'page1' | 'page2' | 'page3') => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  triggerGlobalRefresh: () => void;
  
  // 메뉴 순서 관리 액션
  setMenuOrder: (order: string[]) => void;
  toggleMenuEditMode: () => void;
  resetMenuOrder: () => void;
  getOrderedMenus: () => MenuItem[];
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isRefreshing: false,
      currentPage: 'page1',
      selectedYear: new Date().getFullYear(),
      selectedMonth: 11, // 기본값을 11월로 고정
      menuOrder: menuItems.map(item => item.path), // 모든 메뉴들의 기본 순서
      isMenuEditMode: false,
      
      // 상태 설정
      setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },
      setSelectedYear: (year) => {
        set({ selectedYear: year });
      },
      setSelectedMonth: (month) => {
        set({ selectedMonth: month });
      },
      
      // 전역 조회 트리거
      triggerGlobalRefresh: () => {
        set({ isRefreshing: true });
        
        // 현재 페이지에 따라 다른 조회 로직 실행
        const currentPage = get().currentPage;
        
        // 1초 후 상태 초기화
        setTimeout(() => {
          set({ isRefreshing: false });
        }, 1000);
      },
      
      // 메뉴 순서 관리 액션
      setMenuOrder: (order) => set({ menuOrder: order }),
      toggleMenuEditMode: () => set((state) => ({ isMenuEditMode: !state.isMenuEditMode })),
      resetMenuOrder: () => set({ menuOrder: menuItems.map(item => item.path) }),
      getOrderedMenus: () => {
        const { menuOrder } = get();
        
        // menuOrder에 없는 새로운 메뉴들을 찾아서 원래 위치에 추가
        const newMenuPaths = menuItems.filter(menu => !menuOrder.includes(menu.path));
        
        if (newMenuPaths.length > 0) {
          // 새로운 메뉴가 있으면 menuOrder를 업데이트
          const updatedMenuOrder = [...menuOrder];
          
          newMenuPaths.forEach(newMenu => {
            const originalIndex = menuItems.findIndex(item => item.path === newMenu.path);
            // 원래 위치를 찾아서 삽입
            let insertIndex = 0;
            for (let i = 0; i < updatedMenuOrder.length; i++) {
              const currentPath = updatedMenuOrder[i];
              const currentOriginalIndex = menuItems.findIndex(item => item.path === currentPath);
              if (currentOriginalIndex < originalIndex) {
                insertIndex = i + 1;
              }
            }
            updatedMenuOrder.splice(insertIndex, 0, newMenu.path);
          });
          
          // menuOrder 업데이트
          set({ menuOrder: updatedMenuOrder });
        }
        
        const finalMenuOrder = get().menuOrder;
        const orderedMenus: MenuItem[] = [];
        
        // menuOrder에 따라 메뉴들을 정렬
        finalMenuOrder.forEach(path => {
          const menu = menuItems.find(item => item.path === path);
          if (menu) {
            orderedMenus.push(menu);
          }
        });
        
        return orderedMenus;
      }
    }),
    {
      name: 'htns-global-store',
      version: 2, // 버전 업데이트하여 localStorage 초기화 (권역실적 추가)
      partialize: (state) => ({
        selectedYear: state.selectedYear,
        // selectedMonth는 persist에서 제외 - 항상 기본값(11월)으로 시작
        menuOrder: state.menuOrder,
        currentPage: state.currentPage,
      }),
    }
  )
); 