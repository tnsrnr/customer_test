import { create } from 'zustand';

interface GlobalStore {
  // 전역 조회 상태
  isRefreshing: boolean;
  currentPage: string;
  
  // 액션
  setRefreshing: (refreshing: boolean) => void;
  setCurrentPage: (page: string) => void;
  triggerGlobalRefresh: () => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  // 초기 상태
  isRefreshing: false,
  currentPage: '',
  
  // 상태 설정
  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // 전역 조회 트리거
  triggerGlobalRefresh: () => {
    set({ isRefreshing: true });
    
    // 현재 페이지에 따라 다른 조회 로직 실행
    const currentPage = get().currentPage;
    console.log('🔍 전역 조회 트리거:', currentPage);
    
    // 1초 후 상태 초기화
    setTimeout(() => {
      set({ isRefreshing: false });
    }, 1000);
  },
})); 