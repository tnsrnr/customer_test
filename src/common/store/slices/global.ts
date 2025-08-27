import { create } from 'zustand';

interface GlobalStore {
  // 전역 조회 상태
  isRefreshing: boolean;
  currentPage: string;
  
  // 년/월 정보
  selectedYear: number;
  selectedMonth: number;
  
  // 액션
  setRefreshing: (refreshing: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  triggerGlobalRefresh: () => void;
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  // 초기 상태
  isRefreshing: false,
  currentPage: '',
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,
  
  // 상태 설정
  setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedYear: (year) => {
    console.log('📅 selectedYear 변경:', year);
    set({ selectedYear: year });
  },
  setSelectedMonth: (month) => {
    console.log('📅 selectedMonth 변경:', month);
    set({ selectedMonth: month });
  },
  
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