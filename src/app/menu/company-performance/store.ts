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
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
};

const fetchGridData = async (): Promise<CompanyPerformanceData['gridData']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/getTest3&server=spring', {
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
      throw new Error('그리드 데이터 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231T3 && responseData.MIS030231T3.length > 0) {
      const gridData = responseData.MIS030231T3.map((item: any) => ({
        name: item.DIVISION,
        plannedSales: Math.round(item.PLANNED_SALES / 100000000), // 억원 단위로 변환
        plannedOpProfit: Math.round(item.PLANNED_OP_PROFIT / 100000000), // 억원 단위로 변환
        plannedOpMargin: item.PLANNED_OP_MARGIN,
        actualSales: Math.round(item.ACTUAL_SALES / 100000000), // 억원 단위로 변환
        actualOpProfit: Math.round(item.ACTUAL_OP_PROFIT / 100000000), // 억원 단위로 변환
        actualOpMargin: item.ACTUAL_OP_MARGIN,
        salesAchievement: item.SALES_ACHIEVEMENT,
        opProfitAchievement: item.OP_PROFIT_ACHIEVEMENT
      }));
      
      return {
        divisions: gridData
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
};

// 차트 데이터는 현재 사용하지 않으므로 제거
const fetchChartData1 = async (): Promise<CompanyPerformanceData['chartData1']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/getTest4&server=spring', {
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
      throw new Error('차트 데이터 1 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231T4 && responseData.MIS030231T4.length > 0) {
      const chartData = responseData.MIS030231T4[0];
      return {
        labels: ['계획', '실적'],
        datasets: [
          {
            label: '매출액',
            data: [
              Math.round(chartData.PLANNED_SALES / 100000000), // 억원 단위로 변환
              Math.round(chartData.ACTUAL_SALES / 100000000)   // 억원 단위로 변환
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)'
          },
          {
            label: '영업이익',
            data: [
              Math.round(chartData.PLANNED_OP_PROFIT / 100000000), // 억원 단위로 변환
              Math.round(chartData.ACTUAL_OP_PROFIT / 100000000)   // 억원 단위로 변환
            ],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)'
          }
        ]
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
};

const fetchChartData2 = async (): Promise<CompanyPerformanceData['chartData2']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/getTest5&server=spring', {
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
      throw new Error('차트 데이터 2 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231T5 && responseData.MIS030231T5.length > 0) {
      const chartData = responseData.MIS030231T5[0];
      return {
        labels: ['본사', '국내자회사', '해외자회사'],
        datasets: [
          {
            label: '계획 매출액',
            data: [
              Math.round(chartData.HQ_PLANNED_SALES / 100000000),      // 본사 계획 매출액
              Math.round(chartData.DOMESTIC_PLANNED_SALES / 100000000), // 국내자회사 계획 매출액
              Math.round(chartData.OVERSEAS_PLANNED_SALES / 100000000)  // 해외자회사 계획 매출액
            ],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgba(156, 163, 175, 1)'
          },
          {
            label: '실제 매출액',
            data: [
              Math.round(chartData.HQ_ACTUAL_SALES / 100000000),      // 본사 실제 매출액
              Math.round(chartData.DOMESTIC_ACTUAL_SALES / 100000000), // 국내자회사 실제 매출액
              Math.round(chartData.OVERSEAS_ACTUAL_SALES / 100000000)  // 해외자회사 실제 매출액
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)'
          }
        ]
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
};

const fetchChartData3 = async (): Promise<CompanyPerformanceData['chartData3']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/getTest6&server=spring', {
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
      throw new Error('차트 데이터 3 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231T6 && responseData.MIS030231T6.length > 0) {
      const chartData = responseData.MIS030231T6[0];
      return {
        labels: ['본사', '국내자회사', '해외자회사'],
        datasets: [
          {
            label: '계획 영업이익',
            data: [
              Math.round(chartData.HQ_PLANNED_OP_PROFIT / 100000000),      // 본사 계획 영업이익
              Math.round(chartData.DOMESTIC_PLANNED_OP_PROFIT / 100000000), // 국내자회사 계획 영업이익
              Math.round(chartData.OVERSEAS_PLANNED_OP_PROFIT / 100000000)  // 해외자회사 계획 영업이익
            ],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgba(156, 163, 175, 1)'
          },
          {
            label: '실제 영업이익',
            data: [
              Math.round(chartData.HQ_ACTUAL_OP_PROFIT / 100000000),      // 본사 실제 영업이익
              Math.round(chartData.DOMESTIC_ACTUAL_OP_PROFIT / 100000000), // 국내자회사 실제 영업이익
              Math.round(chartData.OVERSEAS_ACTUAL_OP_PROFIT / 100000000)  // 해외자회사 실제 영업이익
            ],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)'
          }
        ]
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
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
      
      set({ data: combinedData, loading: false });
    } catch (error) {
      console.warn('API 호출 실패:', error);
      set({ loading: false, error: '데이터 로딩에 실패했습니다.' });
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