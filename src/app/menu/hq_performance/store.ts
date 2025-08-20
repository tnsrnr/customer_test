import { create } from 'zustand';
import { HQPerformanceData } from './types';

// Mock 데이터 생성 함수들
const generateMockRevenueChart = (currentYear: number, currentMonth: number) => {
  // 선택월 기준으로 뒤로 5개월 (총 6개월) 라벨 생성
  const generateMonthLabels = (): string[] => {
    const labels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const label = year !== currentYear ? `${year}년 ${month}월` : `${month}월`;
      labels.push(label);
    }
    return labels;
  };

  const monthLabels = generateMonthLabels();
  
  return {
    labels: monthLabels,
    datasets: [
      {
        label: '매출 (올해)',
        data: Array.from({ length: 6 }, () => Math.round((Math.floor(Math.random() * 71) + 150) * 10000000 / 100000000)), // 억원 단위
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2
      },
      {
        label: '매출 (1년 전)',
        data: Array.from({ length: 6 }, () => Math.round((Math.floor(Math.random() * 61) + 120) * 10000000 / 100000000)), // 억원 단위
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  };
};

const generateMockProfitChart = (currentYear: number, currentMonth: number) => {
  const generateMonthLabels = (): string[] => {
    const labels: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const label = year !== currentYear ? `${year}년 ${month}월` : `${month}월`;
      labels.push(label);
    }
    return labels;
  };

  const monthLabels = generateMonthLabels();
  
  return {
    labels: monthLabels,
    datasets: [
      {
        label: '영업이익 (올해)',
        data: Array.from({ length: 6 }, () => Math.round((Math.random() * 20 - 10) * 10000000 / 100000000)), // 억원 단위
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2
      },
      {
        label: '영업이익 (1년 전)',
        data: Array.from({ length: 6 }, () => Math.round((Math.random() * 20 - 10) * 10000000 / 100000000)), // 억원 단위
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  };
};

const generateMockGridData = (currentYear: number, currentMonth: number) => {
  // 그리드 테이블용 월 라벨 생성 (선택월 기준으로 5개월)
  const generateGridMonthLabels = (): string[] => {
    const labels: string[] = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const label = year !== currentYear ? `${year}년 ${month}월` : `${month}월`;
      labels.push(label);
    }
    return labels;
  };

  const monthLabels = generateGridMonthLabels();
  
  const monthlyDetails = [
    {
      category: '매출',
      month1: Math.round((Math.floor(Math.random() * 71) + 150) * 10000000 / 100000000), // 억원 단위
      month2: Math.round((Math.floor(Math.random() * 71) + 150) * 10000000 / 100000000), // 억원 단위
      month3: Math.round((Math.floor(Math.random() * 71) + 150) * 10000000 / 100000000), // 억원 단위
      month4: Math.round((Math.floor(Math.random() * 71) + 150) * 10000000 / 100000000), // 억원 단위
      month5: Math.round((Math.floor(Math.random() * 71) + 150) * 10000000 / 100000000), // 억원 단위
      total: 9, // 억원 단위
      growth: '▼11%'
    },
    {
      category: '매입',
      month1: Math.round((Math.floor(Math.random() * 71) + 140) * 10000000 / 100000000), // 억원 단위
      month2: Math.round((Math.floor(Math.random() * 71) + 140) * 10000000 / 100000000), // 억원 단위
      month3: Math.round((Math.floor(Math.random() * 71) + 140) * 10000000 / 100000000), // 억원 단위
      month4: Math.round((Math.floor(Math.random() * 71) + 140) * 10000000 / 100000000), // 억원 단위
      month5: Math.round((Math.floor(Math.random() * 71) + 140) * 10000000 / 100000000), // 억원 단위
      total: 9, // 억원 단위
      growth: '▼13%'
    },
    {
      category: '매출총이익',
      month1: Math.round((Math.floor(Math.random() * 20) + 5) * 10000000 / 100000000), // 억원 단위
      month2: Math.round((Math.floor(Math.random() * 20) + 5) * 10000000 / 100000000), // 억원 단위
      month3: Math.round((Math.floor(Math.random() * 20) + 5) * 10000000 / 100000000), // 억원 단위
      month4: Math.round((Math.floor(Math.random() * 20) + 5) * 10000000 / 100000000), // 억원 단위
      month5: Math.round((Math.floor(Math.random() * 20) + 5) * 10000000 / 100000000), // 억원 단위
      total: 0, // 억원 단위
      growth: '▲50%'
    },
    {
      category: '관리비',
      month1: Math.round((Math.floor(Math.random() * 15) + 5) * 10000000 / 100000000), // 억원 단위
      month2: Math.round((Math.floor(Math.random() * 15) + 5) * 10000000 / 100000000), // 억원 단위
      month3: Math.round((Math.floor(Math.random() * 15) + 5) * 10000000 / 100000000), // 억원 단위
      month4: Math.round((Math.floor(Math.random() * 15) + 5) * 10000000 / 100000000), // 억원 단위
      month5: Math.round((Math.floor(Math.random() * 15) + 5) * 10000000 / 100000000), // 억원 단위
      total: 0, // 억원 단위
      growth: '▲3%'
    },
    {
      category: '영업이익',
      month1: Math.round((Math.floor(Math.random() * 20) - 10) * 10000000 / 100000000), // 억원 단위
      month2: Math.round((Math.floor(Math.random() * 20) - 10) * 10000000 / 100000000), // 억원 단위
      month3: Math.round((Math.floor(Math.random() * 20) - 10) * 10000000 / 100000000), // 억원 단위
      month4: Math.round((Math.floor(Math.random() * 20) - 10) * 10000000 / 100000000), // 억원 단위
      month5: Math.round((Math.floor(Math.random() * 20) - 10) * 10000000 / 100000000), // 억원 단위
      total: 0, // 억원 단위
      growth: '손익분기점'
    },
    {
      category: '영업이익율',
      month1: Math.floor(Math.random() * 400) / 100 - 2, // 비율은 그대로
      month2: Math.floor(Math.random() * 400) / 100 - 2, // 비율은 그대로
      month3: Math.floor(Math.random() * 400) / 100 - 2, // 비율은 그대로
      month4: Math.floor(Math.random() * 400) / 100 - 2, // 비율은 그대로
      month5: Math.floor(Math.random() * 400) / 100 - 2, // 비율은 그대로
      total: -0.92, // 비율은 그대로
      growth: '개선'
    }
  ];

  return {
    monthlyDetails,
    monthLabels
  };
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

// API 호출과 데이터 처리를 하나로 합친 함수들
const hq_performance_header = async (year: number, month: number): Promise<HQPerformanceData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/hq_performance_header`, {
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
      
      // 백엔드에서 받은 데이터를 억원 단위로 변환 (company_performance와 동일한 방식)
      return {
        actualSales: Math.round(kpiData.ACTUAL_SALES / 100000000),
        actualSalesChange: Math.round(kpiData.ACTUAL_SALES_CHANGE / 100000000) || 0,
        actualPurchases: Math.round(kpiData.ACTUAL_PURCHASES / 100000000),
        actualPurchasesChange: Math.round(kpiData.ACTUAL_PURCHASES_CHANGE / 100000000) || 0,
        actualOpProfit: Math.round(kpiData.ACTUAL_OP_PROFIT / 100000000),
        actualOpProfitChange: Math.round(kpiData.ACTUAL_OP_PROFIT_CHANGE / 100000000) || 0,
        actualOpMargin: kpiData.ACTUAL_OP_MARGIN || 0,
        actualOpMarginChange: kpiData.ACTUAL_OP_MARGIN_CHANGE || 0
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('KPI 데이터 조회 실패:', error);
    throw error;
  }
};

interface HQPerformanceStore {
  data: HQPerformanceData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: HQPerformanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useHQPerformanceStore = create<HQPerformanceStore>((set, get) => {
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
      const { year: currentYear, month: currentMonth } = getCurrentDate();
      
      set({ loading: true, error: null });
      
      try {
        // API를 병렬로 호출
        const [kpiMetrics, revenueChart, profitChart, gridData] = await Promise.all([
          hq_performance_header(currentYear, currentMonth),
          generateMockRevenueChart(currentYear, currentMonth),
          generateMockProfitChart(currentYear, currentMonth),
          generateMockGridData(currentYear, currentMonth)
        ]);

        const combinedData: HQPerformanceData = {
          kpiMetrics,
          chartData: {
            revenueChart,
            profitChart
          },
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
