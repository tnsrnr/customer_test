import { create } from 'zustand';
import { FinanceData } from './types';
import { getFinanceStatus } from './api';

interface FinanceStore {
  // 상태
  data: FinanceData | null;
  loading: boolean;
  error: string | null;
  
  // 액션
  fetchFinanceData: () => Promise<void>;
  setData: (data: FinanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  // 초기 상태
  data: null,
  loading: false,
  error: null,
  
  // 재무 데이터 조회
  fetchFinanceData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await getFinanceStatus();
      set({ data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '데이터 조회에 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },
  
  // 데이터 설정
  setData: (data) => set({ data }),
  
  // 로딩 상태 설정
  setLoading: (loading) => set({ loading }),
  
  // 에러 설정
  setError: (error) => set({ error }),
  
  // 상태 초기화
  reset: () => set({ data: null, loading: false, error: null }),
})); 