import { create } from 'zustand';
import { CompanyPerformanceData } from './types';
import { getCompanyPerformance } from './api';

interface CompanyPerformanceStore {
  data: CompanyPerformanceData | null;
  loading: boolean;
  error: string | null;
  
  fetchData: () => Promise<void>;
  setData: (data: CompanyPerformanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCompanyPerformanceStore = create<CompanyPerformanceStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getCompanyPerformance();
      set({ data: response.data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '데이터 조회에 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },
  
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ data: null, loading: false, error: null }),
})); 