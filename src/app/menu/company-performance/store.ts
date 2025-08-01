import { create } from 'zustand';
import { CompanyPerformanceData } from './types';

// API 호출 함수들
const fetchKpiMetrics = async (): Promise<CompanyPerformanceData['kpiMetrics']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/getTest2&server=spring', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MIS030231F1: {
          BASE_YEAR: "2025",
          crudState: "I"
        },
        page: 1,
        start: 0,
        limit: 25,
        pageId: "MIS030231V"
      })
    });
    
    const responseData = await response.json();
    
    // HTML 응답이 오는 경우 (세션 만료)
    if (responseData.data && responseData.data.includes('<!DOCTYPE html')) {
      console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      throw new Error('KPI 메트릭 데이터 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231T2 && responseData.MIS030231T2.length > 0) {
      const kpiData = responseData.MIS030231T2[0];
      return {
        ACTUAL_SALES: Math.round(kpiData.ACTUAL_SALES / 100000000), // 억원 단위로 변환
        ACTUAL_OP_PROFIT: Math.round(kpiData.ACTUAL_OP_PROFIT / 100000000), // 억원 단위로 변환
        ACTUAL_OP_MARGIN: kpiData.ACTUAL_OP_MARGIN,
        SALES_ACHIEVEMENT: kpiData.SALES_ACHIEVEMENT
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패, 목 데이터 사용:', error);
    // API 호출 실패 시 목 데이터 반환
    return {
      ACTUAL_SALES: 2619,        // 총 매출액
      ACTUAL_OP_PROFIT: 26,      // 영업이익
      ACTUAL_OP_MARGIN: 0.99,    // 영업이익률
      SALES_ACHIEVEMENT: 73      // 매출 달성률
    };
  }
};

const fetchGridData = async (): Promise<CompanyPerformanceData['gridData']> => {
  try {
    // 실제 API 호출 시에는 여기에 실제 엔드포인트를 사용
    // const response = await fetch('/api/company-performance/grid-data');
    // if (!response.ok) {
    //   throw new Error('그리드 데이터 조회에 실패했습니다.');
    // }
    // return response.json();
    
    // 임시로 목 데이터 반환
    return {
      divisions: [
        { name: '수출', revenue: 123, profit: 12, margin: 9.8, growth: 15.2, change: 5.3 },
        { name: '해상', revenue: 41, profit: 0.1, margin: 0.2, growth: 1.0, change: -0.5 },
        { name: '운송', revenue: 26, profit: 0.5, margin: 1.9, growth: -4.0, change: -2.1 },
        { name: '창고', revenue: 16, profit: -1.7, margin: -10.6, growth: 3.0, change: 59.0 },
        { name: '도급', revenue: 20, profit: 0.6, margin: 3.0, growth: 5.0, change: -17.0 },
        { name: '기타', revenue: 17, profit: 3.0, margin: 17.6, growth: 59.0, change: 3.0 }
      ]
    };
  } catch (error) {
    throw new Error('그리드 데이터 조회에 실패했습니다.');
  }
};

const fetchChartData1 = async (): Promise<CompanyPerformanceData['chartData1']> => {
  try {
    // 실제 API 호출 시에는 여기에 실제 엔드포인트를 사용
    // const response = await fetch('/api/company-performance/chart-data-1');
    // if (!response.ok) {
    //   throw new Error('차트 데이터 1 조회에 실패했습니다.');
    // }
    // return response.json();
    
    // 임시로 목 데이터 반환
    return {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      datasets: [{
        label: '매출',
        data: [123, 41, 26, 16, 20],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }]
    };
  } catch (error) {
    throw new Error('차트 데이터 1 조회에 실패했습니다.');
  }
};

const fetchChartData2 = async (): Promise<CompanyPerformanceData['chartData2']> => {
  try {
    // 실제 API 호출 시에는 여기에 실제 엔드포인트를 사용
    // const response = await fetch('/api/company-performance/chart-data-2');
    // if (!response.ok) {
    //   throw new Error('차트 데이터 2 조회에 실패했습니다.');
    // }
    // return response.json();
    
    // 임시로 목 데이터 반환
    return {
      labels: ['수출', '해상', '운송', '창고', '도급', '기타'],
      datasets: [{
        label: '영업이익',
        data: [12, 0.1, 0.5, -1.7, 0.6, 3.0],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)'
      }]
    };
  } catch (error) {
    throw new Error('차트 데이터 2 조회에 실패했습니다.');
  }
};

const fetchChartData3 = async (): Promise<CompanyPerformanceData['chartData3']> => {
  try {
    // 실제 API 호출 시에는 여기에 실제 엔드포인트를 사용
    // const response = await fetch('/api/company-performance/chart-data-3');
    // if (!response.ok) {
    //   throw new Error('차트 데이터 3 조회에 실패했습니다.');
    // }
    // return response.json();
    
    // 임시로 목 데이터 반환
    return {
      labels: ['수출', '해상', '운송', '창고', '도급', '기타'],
      datasets: [{
        label: '성장률',
        data: [15.2, 1.0, -4.0, 3.0, 5.0, 59.0],
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)'
      }]
    };
  } catch (error) {
    throw new Error('차트 데이터 3 조회에 실패했습니다.');
  }
};

// 임시 목 데이터 (API가 준비되지 않은 경우 사용)
const getMockData = (): CompanyPerformanceData => {
  return {
    kpiMetrics: {
      ACTUAL_SALES: 2619,        // 총 매출액
      ACTUAL_OP_PROFIT: 26,      // 영업이익
      ACTUAL_OP_MARGIN: 0.99,    // 영업이익률
      SALES_ACHIEVEMENT: 73      // 매출 달성률
    },
    gridData: {
      divisions: [
        { name: '수출', revenue: 123, profit: 12, margin: 9.8, growth: 15.2, change: 5.3 },
        { name: '해상', revenue: 41, profit: 0.1, margin: 0.2, growth: 1.0, change: -0.5 },
        { name: '운송', revenue: 26, profit: 0.5, margin: 1.9, growth: -4.0, change: -2.1 },
        { name: '창고', revenue: 16, profit: -1.7, margin: -10.6, growth: 3.0, change: 59.0 },
        { name: '도급', revenue: 20, profit: 0.6, margin: 3.0, growth: 5.0, change: -17.0 },
        { name: '기타', revenue: 17, profit: 3.0, margin: 17.6, growth: 59.0, change: 3.0 }
      ]
    },
    chartData1: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      datasets: [{
        label: '매출',
        data: [123, 41, 26, 16, 20],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }]
    },
    chartData2: {
      labels: ['수출', '해상', '운송', '창고', '도급', '기타'],
      datasets: [{
        label: '영업이익',
        data: [12, 0.1, 0.5, -1.7, 0.6, 3.0],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)'
      }]
    },
    chartData3: {
      labels: ['수출', '해상', '운송', '창고', '도급', '기타'],
      datasets: [{
        label: '성장률',
        data: [15.2, 1.0, -4.0, 3.0, 5.0, 59.0],
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)'
      }]
    }
  };
};

interface CompanyPerformanceStore {
  data: CompanyPerformanceData | null;
  loading: boolean;
  error: string | null;
  periodType: 'monthly' | 'cumulative';
  
  // 개별 API 로딩 상태
  kpiLoading: boolean;
  gridLoading: boolean;
  chart1Loading: boolean;
  chart2Loading: boolean;
  chart3Loading: boolean;
  
  fetchAllData: () => Promise<void>;
  fetchKpiData: () => Promise<void>;
  fetchGridData: () => Promise<void>;
  fetchChartData1: () => Promise<void>;
  fetchChartData2: () => Promise<void>;
  fetchChartData3: () => Promise<void>;
  setData: (data: CompanyPerformanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPeriodType: (type: 'monthly' | 'cumulative') => void;
  reset: () => void;
}

export const useCompanyPerformanceStore = create<CompanyPerformanceStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  periodType: 'cumulative',
  kpiLoading: false,
  gridLoading: false,
  chart1Loading: false,
  chart2Loading: false,
  chart3Loading: false,
  
  fetchAllData: async () => {
    try {
      set({ loading: true, error: null });
      
      // 모든 API를 병렬로 호출
      const [kpiData, gridData, chart1Data, chart2Data, chart3Data] = await Promise.all([
        fetchKpiMetrics(),
        fetchGridData(),
        fetchChartData1(),
        fetchChartData2(),
        fetchChartData3()
      ]);
      
      const combinedData: CompanyPerformanceData = {
        kpiMetrics: kpiData,
        gridData: gridData,
        chartData1: chart1Data,
        chartData2: chart2Data,
        chartData3: chart3Data
      };
      
      // 부드러운 데이터 갱신을 위해 기존 데이터가 있으면 점진적으로 업데이트
      set({ data: combinedData, loading: false });
    } catch (error) {
      // API 호출 실패 시 목 데이터 사용
      console.warn('API 호출 실패, 목 데이터 사용:', error);
      const mockData = getMockData();
      set({ data: mockData, loading: false });
    }
  },
  
  fetchKpiData: async () => {
    try {
      set({ kpiLoading: true });
      const kpiData = await fetchKpiMetrics();
      const currentData = get().data;
      set({ 
        data: currentData ? { ...currentData, kpiMetrics: kpiData } : null,
        kpiLoading: false 
      });
    } catch (error) {
      console.warn('KPI API 호출 실패:', error);
      set({ kpiLoading: false });
    }
  },
  
  fetchGridData: async () => {
    try {
      set({ gridLoading: true });
      const gridData = await fetchGridData();
      const currentData = get().data;
      set({ 
        data: currentData ? { ...currentData, gridData: gridData } : null,
        gridLoading: false 
      });
    } catch (error) {
      console.warn('Grid API 호출 실패:', error);
      set({ gridLoading: false });
    }
  },
  
  fetchChartData1: async () => {
    try {
      set({ chart1Loading: true });
      const chartData = await fetchChartData1();
      const currentData = get().data;
      set({ 
        data: currentData ? { ...currentData, chartData1: chartData } : null,
        chart1Loading: false 
      });
    } catch (error) {
      console.warn('Chart1 API 호출 실패:', error);
      set({ chart1Loading: false });
    }
  },
  
  fetchChartData2: async () => {
    try {
      set({ chart2Loading: true });
      const chartData = await fetchChartData2();
      const currentData = get().data;
      set({ 
        data: currentData ? { ...currentData, chartData2: chartData } : null,
        chart2Loading: false 
      });
    } catch (error) {
      console.warn('Chart2 API 호출 실패:', error);
      set({ chart2Loading: false });
    }
  },
  
  fetchChartData3: async () => {
    try {
      set({ chart3Loading: true });
      const chartData = await fetchChartData3();
      const currentData = get().data;
      set({ 
        data: currentData ? { ...currentData, chartData3: chartData } : null,
        chart3Loading: false 
      });
    } catch (error) {
      console.warn('Chart3 API 호출 실패:', error);
      set({ chart3Loading: false });
    }
  },
  
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPeriodType: (periodType) => set({ periodType }),
  reset: () => set({ 
    data: null, 
    loading: false, 
    error: null, 
    periodType: 'cumulative',
    kpiLoading: false,
    gridLoading: false,
    chart1Loading: false,
    chart2Loading: false,
    chart3Loading: false
  }),
})); 