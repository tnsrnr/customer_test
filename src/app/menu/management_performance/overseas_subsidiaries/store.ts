import { create } from 'zustand';
import { OverseasSubsidiariesData, ChartData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

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

// 단일 API 호출로 모든 데이터 처리
const overseas_subsidiaries = async (year: number, month: number): Promise<OverseasSubsidiariesData> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/overseas_subsidiaries`, {
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
      // KPI 데이터 추출 (첫 번째 행에서)
      const kpiData = responseData.MIS030231[0];
      const kpiMetrics = {
        actualSales: Math.round((kpiData.ACTUAL_SALES || 0) / 100000000),
        actualSalesChange: Math.round((kpiData.ACTUAL_SALES_CHANGE || 0) / 100000000),
        actualPurchases: Math.round((kpiData.ACTUAL_PURCHASES || 0) / 100000000),
        actualPurchasesChange: Math.round((kpiData.ACTUAL_PURCHASES_CHANGE || 0) / 100000000),
        actualOpProfit: Math.round((kpiData.ACTUAL_OP_PROFIT || 0) / 100000000),
        actualOpProfitChange: Math.round((kpiData.ACTUAL_OP_PROFIT_CHANGE || 0) / 100000000),
        actualOpMargin: kpiData.ACTUAL_OP_MARGIN || 0,
        actualOpMarginChange: kpiData.ACTUAL_OP_MARGIN_CHANGE || 0
      };

      // 그리드 데이터 추출 (COLUMN0~COLUMN8이 있는 행들)
      const gridRows = responseData.MIS030231.filter((item: any) => item.COLUMN0);
      const monthlyDetails = gridRows.map((item: any) => ({
        column0: item.COLUMN0 || '', // 구분 - 문자열
        column1: item.COLUMN1 || '', // 계정명 - 문자열
        column2: item.COLUMN2 || 0, // 첫 번째 월 데이터
        column3: item.COLUMN3 || 0, // 두 번째 월 데이터
        column4: item.COLUMN4 || 0, // 세 번째 월 데이터
        column5: item.COLUMN5 || 0, // 네 번째 월 데이터
        column6: item.COLUMN6 || 0, // 다섯 번째 월 데이터 (선택한 월)
        column7: item.COLUMN7 || 0, // 합계
        column8: item.COLUMN8 || '' // 전월대비 - 문자열
      }));
      
      // 월 라벨 생성 (선택월 기준으로 5개월: 이전 4개월 + 선택한 월)
      const monthLabels: string[] = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date(year, month - 1 - i, 1);
        const monthNum = date.getMonth() + 1;
        const yearNum = date.getFullYear();
        const label = yearNum !== year ? `${yearNum}년 ${monthNum}월` : `${monthNum}월`;
        monthLabels.push(label);
      }

      // 차트 데이터 추출 (DIVISION_TYPE이 있는 행들)
      const chartRows = responseData.MIS030231.filter((item: any) => item.DIVISION_TYPE);
      const monthLabelsForChart = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
      
      // 데이터 분리
      const revenueCurrent = chartRows.find((item: any) => item.DIVISION_TYPE === '매출_현재');
      const revenueLastYear = chartRows.find((item: any) => item.DIVISION_TYPE === '매출_1년전');
      const profitCurrent = chartRows.find((item: any) => item.DIVISION_TYPE === '영업이익_현재');
      const profitLastYear = chartRows.find((item: any) => item.DIVISION_TYPE === '영업이익_1년전');
      
      // 매출 차트 데이터
      const revenueChart: ChartData = {
        labels: monthLabelsForChart,
        datasets: [
          {
            label: '매출 (올해)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 현재 월까지만 데이터 표시, 나머지는 null
              return index < month ? Math.round((revenueCurrent?.[monthKey] || 0) / 100000000) : null;
            }),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            spanGaps: false
          },
          {
            label: '매출 (1년 전)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 1년전 데이터는 전체 12개월 표시
              return Math.round((revenueLastYear?.[monthKey] || 0) / 100000000);
            }),
            borderColor: 'rgb(156, 163, 175)',
            backgroundColor: 'rgba(156, 163, 175, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            spanGaps: false
          }
        ]
      };
      
      // 영업이익 차트 데이터
      const profitChart: ChartData = {
        labels: monthLabelsForChart,
        datasets: [
          {
            label: '영업이익 (올해)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 현재 월까지만 데이터 표시, 나머지는 null
              return index < month ? Math.round((profitCurrent?.[monthKey] || 0) / 100000000) : null;
            }),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            spanGaps: false
          },
          {
            label: '영업이익 (1년 전)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 1년전 데이터는 전체 12개월 표시
              return Math.round((profitLastYear?.[monthKey] || 0) / 100000000);
            }),
            borderColor: 'rgb(156, 163, 175)',
            backgroundColor: 'rgba(156, 163, 175, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            spanGaps: false
          }
        ]
      };

      return {
        kpiMetrics,
        chartData: { revenueChart, profitChart },
        gridData: { monthlyDetails, monthLabels }
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('데이터 조회 실패:', error);
    throw error;
  }
};


interface OverseasSubsidiariesStore {
  data: OverseasSubsidiariesData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: OverseasSubsidiariesData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useOverseasSubsidiariesStore = create<OverseasSubsidiariesStore>((set, get) => {
  const getCurrentDate = () => {
    // 전역 스토어에서 현재 선택된 날짜 가져오기
    const globalStore = useGlobalStore.getState();
    return { 
      year: globalStore.selectedYear || new Date().getFullYear(), 
      month: globalStore.selectedMonth || new Date().getMonth() + 1 
    };
  };

  return {
    data: null,
    loading: false,
    error: null,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    fetchAllData: async () => {
      const { year: currentYear, month: currentMonth } = getCurrentDate();
      
      // 현재 날짜를 store에 업데이트
      set({ currentYear, currentMonth });
      
      // 기존 데이터가 있으면 로딩 상태를 true로 설정하지 않음 (부드러운 갱신)
      const currentData = get().data;
      if (!currentData) {
        set({ loading: true, error: null });
      }
      
      try {
        // 단일 API 호출로 모든 데이터 가져오기
        const combinedData = await overseas_subsidiaries(currentYear, currentMonth);

        set({ 
          data: combinedData, 
          loading: false,
          error: null // 에러 상태 초기화
        });
      } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
        
        // API 호출 실패 시 에러 상태로 설정
        set({ 
          data: null,
          error: error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.',
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

