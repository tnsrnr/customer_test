import { create } from 'zustand';

interface GlobalStore {
  // 전역 조회 상태
  isRefreshing: boolean;
  
  // 액션
  setRefreshing: (refreshing: boolean) => void;
  triggerGlobalRefresh: () => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  // 초기 상태
  isRefreshing: false,
  
  // 상태 설정
  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  
  // 전역 조회 트리거
  triggerGlobalRefresh: () => {
    set({ isRefreshing: true });
    
    // 1초 후 상태 초기화 (실제로는 각 페이지에서 이벤트를 감지)
    setTimeout(() => {
      set({ isRefreshing: false });
    }, 1000);
  },
})); 