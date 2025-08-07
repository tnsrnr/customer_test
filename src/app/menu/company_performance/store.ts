import { create } from 'zustand';
import { CompanyPerformanceData } from './types';
import { useGlobalStore } from '@/store/global';

// API 호출 함수들
const fetchKpiMetrics = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['kpiMetrics']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/company_performance_header', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MIS030231F1: {
          BASE_YEAR: year.toString(),
          BASE_MONTH: month.toString().padStart(2, '0'),
          PERIOD_TYPE: periodType,
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
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const kpiData = responseData.MIS030231[0];
      return {
        ACTUAL_SALES: Math.round(kpiData.ACTUAL_SALES / 100000000), // 억원 단위로 변환
        ACTUAL_OP_PROFIT: Math.round(kpiData.ACTUAL_OP_PROFIT / 100000000), // 억원 단위로 변환
        ACTUAL_OP_MARGIN: kpiData.ACTUAL_OP_MARGIN,
        SALES_ACHIEVEMENT: kpiData.SALES_ACHIEVEMENT,
        // 실시간 전월대비 증가액 데이터
        ACTUAL_SALES_CHANGE: Math.round(kpiData.ACTUAL_SALES_CHANGE / 100000000) || 0, // 전월대비 매출 증가액
        ACTUAL_OP_PROFIT_CHANGE: Math.round(kpiData.ACTUAL_OP_PROFIT_CHANGE / 100000000) || 0, // 전월대비 영업이익 증가액
        ACTUAL_OP_MARGIN_CHANGE: kpiData.ACTUAL_OP_MARGIN_CHANGE || 0, // 전월대비 영업이익률 증가액
        SALES_ACHIEVEMENT_CHANGE: kpiData.SALES_ACHIEVEMENT_CHANGE || 0 // 전월대비 매출 달성률 증가액
      };
    }
    
    console.error('❌ KPI 데이터 구조가 올바르지 않습니다:', responseData);
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
};

const fetchGridData = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['gridData']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/company_performance_grid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MIS030231F1: {
          BASE_YEAR: year.toString(),
          BASE_MONTH: month.toString().padStart(2, '0'),
          PERIOD_TYPE: periodType,
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
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const gridData = responseData.MIS030231.map((item: any) => ({
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
const fetchChartData1 = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['chartData1']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/company_performance_achievement_rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MIS030231F1: {
          BASE_YEAR: year.toString(),
          BASE_MONTH: month.toString().padStart(2, '0'),
          PERIOD_TYPE: periodType,
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
      throw new Error('차트 데이터1 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const chartData = responseData.MIS030231.map((item: any) => ({
        label: item.DIVISION || '기타',
        // 4개 필드 사용: PLANNED_SALES, ACTUAL_SALES, PLANNED_OP_PROFIT, ACTUAL_OP_PROFIT
        plannedSales: Math.round(item.PLANNED_SALES / 100000000), // 억원 단위로 변환
        actualSales: Math.round(item.ACTUAL_SALES / 100000000), // 억원 단위로 변환
        plannedOpProfit: Math.round(item.PLANNED_OP_PROFIT / 100000000), // 억원 단위로 변환
        actualOpProfit: Math.round(item.ACTUAL_OP_PROFIT / 100000000) // 억원 단위로 변환
      }));
      
      // kpiMetrics와 동일한 구조로 반환
      const firstItem = chartData[0]; // 첫 번째 아이템의 데이터 사용
      
      return {
        // Chart.js 호환성을 위한 기존 구조 유지
        labels: chartData.map(item => item.label),
        datasets: [
          {
            label: '계획 매출',
            data: chartData.map(item => item.plannedSales),
            backgroundColor: '#64748b',
            borderColor: '#64748b'
          },
          {
            label: '실제 매출',
            data: chartData.map(item => item.actualSales),
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6'
          },
          {
            label: '계획 영업이익',
            data: chartData.map(item => item.plannedOpProfit),
            backgroundColor: '#10b981',
            borderColor: '#10b981'
          },
          {
            label: '실제 영업이익',
            data: chartData.map(item => item.actualOpProfit),
            backgroundColor: '#f59e0b',
            borderColor: '#f59e0b'
          }
        ],
        // kpiMetrics와 동일한 구조로 명시적 필드명 제공
        PLANNED_SALES: firstItem.plannedSales,
        ACTUAL_SALES: firstItem.actualSales,
        PLANNED_OP_PROFIT: firstItem.plannedOpProfit,
        ACTUAL_OP_PROFIT: firstItem.actualOpProfit
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('서버 API 호출 실패:', error);
    throw error;
  }
};

const fetchChartData2 = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['chartData2']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/company_performance_sales_profit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MIS030231F1: {
          BASE_YEAR: year.toString(),
          BASE_MONTH: month.toString().padStart(2, '0'),
          PERIOD_TYPE: periodType,
          crudState: "I"
        },
        page: 1,
        start: 0,
        limit: 25,
        pageId: "MIS030231V"
      })
    });
    
    const responseData = await response.json();
    
    // 디버깅: API 응답 구조 확인
    console.log('🔍 Chart2 API 응답 데이터:', responseData);
    console.log('🔍 Chart2 API 응답 키들:', Object.keys(responseData));
    console.log('🔍 Chart2 API MIS030231 데이터:', responseData.MIS030231);
    
    // HTML 응답이 오는 경우 (세션 만료)
    if (responseData.data && responseData.data.includes('<!DOCTYPE html')) {
      console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      throw new Error('차트 데이터2 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const chartData = responseData.MIS030231[0];
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

const fetchChartData3 = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['chartData3']> => {
  try {
    // 실제 서버 API 호출 (Spring 서버 사용, POST 메서드)
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/company_performance_operating_profit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MIS030231F1: {
          BASE_YEAR: year.toString(),
          BASE_MONTH: month.toString().padStart(2, '0'),
          PERIOD_TYPE: periodType,
          crudState: "I"
        },
        page: 1,
        start: 0,
        limit: 25,
        pageId: "MIS030231V"
      })
    });
    
    const responseData = await response.json();
    
    // 디버깅: API 응답 구조 확인
    console.log('🔍 Chart3 API 응답 데이터:', responseData);
    console.log('🔍 Chart3 API 응답 키들:', Object.keys(responseData));
    console.log('🔍 Chart3 API MIS030231 데이터:', responseData.MIS030231);
    
    // HTML 응답이 오는 경우 (세션 만료)
    if (responseData.data && responseData.data.includes('<!DOCTYPE html')) {
      console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      throw new Error('차트 데이터3 조회에 실패했습니다.');
    }
    
    // 실제 서버 응답 구조에서 데이터 추출
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const chartData = responseData.MIS030231[0];
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

// Zustand 스토어 정의
interface CompanyPerformanceStore {
  data: CompanyPerformanceData | null;
  loading: boolean;
  error: string | null;
  periodType: 'monthly' | 'cumulative';
  currentYear: number;
  currentMonth: number;
  
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
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useCompanyPerformanceStore = create<CompanyPerformanceStore>((set, get) => {
  // 전역 스토어에서 현재 날짜 가져오기
  const getCurrentDate = () => {
    const globalStore = useGlobalStore.getState();
    return {
      year: globalStore.selectedYear,
      month: globalStore.selectedMonth
    };
  };

  return {
    // 초기 상태
    data: null,
    loading: false,
    error: null,
    periodType: 'monthly',
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    
    // 개별 API 로딩 상태
    kpiLoading: false,
    gridLoading: false,
    chart1Loading: false,
    chart2Loading: false,
    chart3Loading: false,

    // 모든 데이터 조회
    fetchAllData: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      // 현재 날짜를 store에 업데이트
      set({ currentYear: year, currentMonth: month });
      
      set({ loading: true, error: null });
      
      try {
        // 병렬로 모든 API 호출
        const [kpiData, gridData, chartData1, chartData2, chartData3] = await Promise.all([
          fetchKpiMetrics(year, month, periodType).catch(error => {
            console.error('❌ KPI 데이터 조회 실패:', error);
            return null;
          }),
          fetchGridData(year, month, periodType).catch(error => {
            console.error('❌ Grid 데이터 조회 실패:', error);
            return null;
          }),
          fetchChartData1(year, month, periodType).catch(error => {
            console.error('❌ Chart1 데이터 조회 실패:', error);
            return null;
          }),
          fetchChartData2(year, month, periodType).catch(error => {
            console.error('❌ Chart2 데이터 조회 실패:', error);
            return null;
          }),
          fetchChartData3(year, month, periodType).catch(error => {
            console.error('❌ Chart3 데이터 조회 실패:', error);
            return null;
          })
        ]);
        
        // 데이터가 하나라도 성공적으로 로드된 경우에만 상태 업데이트
        if (kpiData || gridData || chartData1 || chartData2 || chartData3) {
          const combinedData: CompanyPerformanceData = {
            kpiMetrics: kpiData || {
              ACTUAL_SALES: 0,
              ACTUAL_OP_PROFIT: 0,
              ACTUAL_OP_MARGIN: 0,
              SALES_ACHIEVEMENT: 0,
              ACTUAL_SALES_CHANGE: 0,
              ACTUAL_OP_PROFIT_CHANGE: 0,
              ACTUAL_OP_MARGIN_CHANGE: 0,
              SALES_ACHIEVEMENT_CHANGE: 0
            },
            gridData: gridData || { divisions: [] },
            chartData1: chartData1 || { labels: [], datasets: [] },
            chartData2: chartData2 || { labels: [], datasets: [] },
            chartData3: chartData3 || { labels: [], datasets: [] }
          };
          
          set({ 
            data: combinedData, 
            loading: false,
            kpiLoading: false,
            gridLoading: false,
            chart1Loading: false,
            chart2Loading: false,
            chart3Loading: false
          });
          
  
        } else {
          throw new Error('모든 데이터 조회에 실패했습니다.');
        }
      } catch (error) {
        console.error('❌ Company Performance 데이터 로드 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : '데이터 로드에 실패했습니다.',
          loading: false,
          kpiLoading: false,
          gridLoading: false,
          chart1Loading: false,
          chart2Loading: false,
          chart3Loading: false
        });
      }
    },

    // 개별 API 조회 함수들
    fetchKpiData: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      set({ kpiLoading: true });
      
      try {
        const kpiData = await fetchKpiMetrics(year, month, periodType);
        const currentData = get().data;
        
        if (currentData) {
          set({ 
            data: { ...currentData, kpiMetrics: kpiData },
            kpiLoading: false 
          });
        } else {
          set({ 
            data: { 
              kpiMetrics: kpiData,
              gridData: { divisions: [] },
              chartData1: { labels: [], datasets: [] },
              chartData2: { labels: [], datasets: [] },
              chartData3: { labels: [], datasets: [] }
            },
            kpiLoading: false 
          });
        }
      } catch (error) {
        console.error('❌ KPI 데이터 조회 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : 'KPI 데이터 조회에 실패했습니다.',
          kpiLoading: false 
        });
      }
    },

    fetchGridData: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      set({ gridLoading: true });
      
      try {
        const gridData = await fetchGridData(year, month, periodType);
        const currentData = get().data;
        
        if (currentData) {
          set({ 
            data: { ...currentData, gridData },
            gridLoading: false 
          });
        } else {
          set({ 
            data: { 
              kpiMetrics: {
                ACTUAL_SALES: 0,
                ACTUAL_OP_PROFIT: 0,
                ACTUAL_OP_MARGIN: 0,
                SALES_ACHIEVEMENT: 0,
                ACTUAL_SALES_CHANGE: 0,
                ACTUAL_OP_PROFIT_CHANGE: 0,
                ACTUAL_OP_MARGIN_CHANGE: 0,
                SALES_ACHIEVEMENT_CHANGE: 0
              },
              gridData,
              chartData1: { labels: [], datasets: [] },
              chartData2: { labels: [], datasets: [] },
              chartData3: { labels: [], datasets: [] }
            },
            gridLoading: false 
          });
        }
      } catch (error) {
        console.error('❌ Grid 데이터 조회 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Grid 데이터 조회에 실패했습니다.',
          gridLoading: false 
        });
      }
    },

    fetchChartData1: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      set({ chart1Loading: true });
      
      try {
        const chartData1 = await fetchChartData1(year, month, periodType);
        const currentData = get().data;
        
        if (currentData) {
          set({ 
            data: { ...currentData, chartData1 },
            chart1Loading: false 
          });
        } else {
          set({ 
            data: { 
              kpiMetrics: {
                ACTUAL_SALES: 0,
                ACTUAL_OP_PROFIT: 0,
                ACTUAL_OP_MARGIN: 0,
                SALES_ACHIEVEMENT: 0,
                ACTUAL_SALES_CHANGE: 0,
                ACTUAL_OP_PROFIT_CHANGE: 0,
                ACTUAL_OP_MARGIN_CHANGE: 0,
                SALES_ACHIEVEMENT_CHANGE: 0
              },
              gridData: { divisions: [] },
              chartData1,
              chartData2: { labels: [], datasets: [] },
              chartData3: { labels: [], datasets: [] }
            },
            chart1Loading: false 
          });
        }
      } catch (error) {
        console.error('❌ Chart1 데이터 조회 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Chart1 데이터 조회에 실패했습니다.',
          chart1Loading: false 
        });
      }
    },

    fetchChartData2: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      set({ chart2Loading: true });
      
      try {
        const chartData2 = await fetchChartData2(year, month, periodType);
        const currentData = get().data;
        
        if (currentData) {
          set({ 
            data: { ...currentData, chartData2 },
            chart2Loading: false 
          });
        } else {
          set({ 
            data: { 
              kpiMetrics: {
                ACTUAL_SALES: 0,
                ACTUAL_OP_PROFIT: 0,
                ACTUAL_OP_MARGIN: 0,
                SALES_ACHIEVEMENT: 0,
                ACTUAL_SALES_CHANGE: 0,
                ACTUAL_OP_PROFIT_CHANGE: 0,
                ACTUAL_OP_MARGIN_CHANGE: 0,
                SALES_ACHIEVEMENT_CHANGE: 0
              },
              gridData: { divisions: [] },
              chartData1: { labels: [], datasets: [] },
              chartData2,
              chartData3: { labels: [], datasets: [] }
            },
            chart2Loading: false 
          });
        }
      } catch (error) {
        console.error('❌ Chart2 데이터 조회 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Chart2 데이터 조회에 실패했습니다.',
          chart2Loading: false 
        });
      }
    },

    fetchChartData3: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      set({ chart3Loading: true });
      
      try {
        const chartData3 = await fetchChartData3(year, month, periodType);
        const currentData = get().data;
        
        if (currentData) {
          set({ 
            data: { ...currentData, chartData3 },
            chart3Loading: false 
          });
        } else {
          set({ 
            data: { 
              kpiMetrics: {
                ACTUAL_SALES: 0,
                ACTUAL_OP_PROFIT: 0,
                ACTUAL_OP_MARGIN: 0,
                SALES_ACHIEVEMENT: 0,
                ACTUAL_SALES_CHANGE: 0,
                ACTUAL_OP_PROFIT_CHANGE: 0,
                ACTUAL_OP_MARGIN_CHANGE: 0,
                SALES_ACHIEVEMENT_CHANGE: 0
              },
              gridData: { divisions: [] },
              chartData1: { labels: [], datasets: [] },
              chartData2: { labels: [], datasets: [] },
              chartData3
            },
            chart3Loading: false 
          });
        }
      } catch (error) {
        console.error('❌ Chart3 데이터 조회 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Chart3 데이터 조회에 실패했습니다.',
          chart3Loading: false 
        });
      }
    },

    // 상태 업데이트 함수들
    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setPeriodType: (periodType) => set({ periodType }),
    setCurrentDate: (year: number, month: number) => set({ currentYear: year, currentMonth: month }),
    reset: () => set({ 
      data: null, 
      loading: false, 
      error: null,
      kpiLoading: false,
      gridLoading: false,
      chart1Loading: false,
      chart2Loading: false,
      chart3Loading: false
    })
  };
});
