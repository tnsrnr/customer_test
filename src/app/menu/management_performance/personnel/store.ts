import { create } from 'zustand';
import { PersonnelData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

// API 호출과 데이터 처리를 하나로 합친 함수들
const personnel_header = async (year: number, month: number): Promise<PersonnelData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/personnel_header`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const responseData = await response.json();
    
    if (responseData.data && responseData.data.includes('<!DOCTYPE html>')) {
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    // 데이터 처리
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const kpiData = responseData.MIS030231[0];
      
      return {
        headquarters: kpiData.HEADQUARTERS || 0,
        domesticSubsidiaries: kpiData.DOMESTICSUBSIDIARIES || 0,
        overseasSubsidiaries: kpiData.OVERSEASSUBSIDIARIES || 0,
        total: kpiData.TOTAL || 0,
        headquartersChange: kpiData.HEADQUARTERSCHANGE || 0,
        domesticSubsidiariesChange: kpiData.DOMESTICSUBSIDIARIESCHANGE || 0,
        overseasSubsidiariesChange: kpiData.OVERSEASSUBSIDIARIESCHANGE || 0,
        totalChange: kpiData.TOTALCHANGE || 0
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('KPI 데이터 조회 실패:', error);
    throw error;
  }
};

const personnel_grid = async (year: number, month: number): Promise<PersonnelData['gridData']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/personnel_grid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const responseData = await response.json();
    
    if (responseData.data && responseData.data.includes('<!DOCTYPE html>')) {
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    // 데이터 처리
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const divisions = responseData.MIS030231.map((item: any) => ({
        company_name: item.COMPANY_NAME || '',
        q1: item.Q1 || 0,
        q2: item.Q2 || 0,
        q3: item.Q3 || 0,
        q4: item.Q4 || 0,
        currentLocal: item.CURRENTLOCAL || 0,
        currentKorean: item.CURRENTKOREAN || 0,
        previousMonth: item.PREVIOUSMONTH || 0,
        currentMonth: item.CURRENTMONTH || 0,
        change: item.CHANGE || 0,
        groupCategory: item.GROUPCATEGORY || ''
      }));
      
      return { divisions };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('그리드 데이터 조회 실패:', error);
    throw error;
  }
};

// 공통 파라미터 생성 함수
function createParams(year: number, month: number) {
  return {
    MIS030231F1: {
      BASE_YEAR: year.toString(),
      BASE_MONTH: month.toString().padStart(2, '0'),
      crudState: "I"
    },
    page: 1,
    start: 0,
    limit: 25,
    pageId: "MIS030231V"
  };
}

interface PersonnelStore {
  data: PersonnelData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: PersonnelData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const usePersonnelStore = create<PersonnelStore>((set, get) => {
  const getCurrentDate = () => {
    const state = get();
    return { year: state.currentYear, month: state.currentMonth };
  };

  return {
    data: null,
    loading: false,
    error: null,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    fetchAllData: async () => {
      // global store에서 현재 선택된 날짜 가져오기
      const { selectedYear, selectedMonth } = useGlobalStore.getState();
      const currentYear = selectedYear || new Date().getFullYear();
      const currentMonth = selectedMonth || new Date().getMonth() + 1;
      
      // store의 현재 날짜도 업데이트
      set({ currentYear, currentMonth });
      
      set({ loading: true, error: null });
      
      try {
        // API를 병렬로 호출
        const [kpiMetrics, gridData] = await Promise.all([
          personnel_header(currentYear, currentMonth),
          personnel_grid(currentYear, currentMonth)
        ]);

        const combinedData: PersonnelData = {
          kpiMetrics,
          gridData
        };

        set({ data: combinedData, loading: false });
      } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : '데이터 로드 중 오류가 발생했습니다.', 
          loading: false 
        });
      }
    },

    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCurrentDate: (year, month) => set({ currentYear: year, currentMonth: month }),
    reset: () => set({ data: null, loading: false, error: null })
  };
});
