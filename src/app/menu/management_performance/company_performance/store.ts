import { create } from 'zustand';
import { CompanyPerformanceData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

// API 호출과 데이터 처리를 하나로 합친 함수들
const company_performance_header = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['kpiMetrics']> => {
  try {
    const params = createParams(year, month, periodType);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/company_performance_header`, {
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
        ACTUAL_SALES: Math.round(kpiData.ACTUAL_SALES / 100000000),
        ACTUAL_OP_PROFIT: Math.round(kpiData.ACTUAL_OP_PROFIT / 100000000),
        ACTUAL_OP_MARGIN: kpiData.ACTUAL_OP_MARGIN,
        SALES_ACHIEVEMENT: kpiData.SALES_ACHIEVEMENT,
        ACTUAL_SALES_CHANGE: Math.round(kpiData.ACTUAL_SALES_CHANGE / 100000000) || 0,
        ACTUAL_OP_PROFIT_CHANGE: Math.round(kpiData.ACTUAL_OP_PROFIT_CHANGE / 100000000) || 0,
        ACTUAL_OP_MARGIN_CHANGE: kpiData.ACTUAL_OP_MARGIN_CHANGE || 0,
        SALES_ACHIEVEMENT_CHANGE: kpiData.SALES_ACHIEVEMENT_CHANGE || 0
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('KPI 데이터 조회 실패:', error);
    throw error;
  }
};

const company_performance_grid = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['gridData']> => {
  try {
    const params = createParams(year, month, periodType);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/company_performance_grid`, {
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
      const gridData = responseData.MIS030231.map((item: any) => ({
        name: item.DIVISION,
        plannedSales: Math.round(item.PLANNED_SALES / 100000000),
        plannedOpProfit: Math.round(item.PLANNED_OP_PROFIT / 100000000),
        plannedOpMargin: item.PLANNED_OP_MARGIN,
        actualSales: Math.round(item.ACTUAL_SALES / 100000000),
        actualOpProfit: Math.round(item.ACTUAL_OP_PROFIT / 100000000),
        actualOpMargin: item.ACTUAL_OP_MARGIN,
        salesAchievement: item.SALES_ACHIEVEMENT,
        opProfitAchievement: item.OP_PROFIT_ACHIEVEMENT
      }));
      
      return { divisions: gridData };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('그리드 데이터 조회 실패:', error);
    throw error;
  }
};

const company_performance_achievement_rate = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['chartData1']> => {
  try {
    const params = createParams(year, month, periodType);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/company_performance_achievement_rate`, {
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
      const chartData = responseData.MIS030231.map((item: any) => ({
        label: item.DIVISION || '기타',
        plannedSales: Math.round(item.PLANNED_SALES / 100000000),
        actualSales: Math.round(item.ACTUAL_SALES / 100000000),
        plannedOpProfit: Math.round(item.PLANNED_OP_PROFIT / 100000000),
        actualOpProfit: Math.round(item.ACTUAL_OP_PROFIT / 100000000)
      }));
      
      const firstItem = chartData[0];
      
      return {
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
        PLANNED_SALES: firstItem.plannedSales,
        ACTUAL_SALES: firstItem.actualSales,
        PLANNED_OP_PROFIT: firstItem.plannedOpProfit,
        ACTUAL_OP_PROFIT: firstItem.actualOpProfit
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('차트1 데이터 조회 실패:', error);
    throw error;
  }
};

const company_performance_sales_profit = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['chartData2']> => {
  try {
    const params = createParams(year, month, periodType);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/company_performance_sales_profit`, {
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
      const chartData = responseData.MIS030231[0];
      return {
        labels: ['본사', '국내자회사', '해외자회사'],
        datasets: [
          {
            label: '계획 매출액',
            data: [
              Math.round(chartData.HQ_PLANNED_SALES / 100000000),
              Math.round(chartData.DOMESTIC_PLANNED_SALES / 100000000),
              Math.round(chartData.OVERSEAS_PLANNED_SALES / 100000000)
            ],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgba(156, 163, 175, 1)'
          },
          {
            label: '실제 매출액',
            data: [
              Math.round(chartData.HQ_ACTUAL_SALES / 100000000),
              Math.round(chartData.DOMESTIC_ACTUAL_SALES / 100000000),
              Math.round(chartData.OVERSEAS_ACTUAL_SALES / 100000000)
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)'
          }
        ]
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('차트2 데이터 조회 실패:', error);
    throw error;
  }
};

const company_performance_operating_profit = async (year: number, month: number, periodType: 'monthly' | 'cumulative'): Promise<CompanyPerformanceData['chartData3']> => {
  try {
    const params = createParams(year, month, periodType);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/company_performance_operating_profit`, {
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
      const chartData = responseData.MIS030231[0];
      return {
        labels: ['본사', '국내자회사', '해외자회사'],
        datasets: [
          {
            label: '계획 영업이익',
            data: [
              Math.round(chartData.HQ_PLANNED_OP_PROFIT / 100000000),
              Math.round(chartData.DOMESTIC_PLANNED_OP_PROFIT / 100000000),
              Math.round(chartData.OVERSEAS_PLANNED_OP_PROFIT / 100000000)
            ],
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgba(156, 163, 175, 1)'
          },
          {
            label: '실제 영업이익',
            data: [
              Math.round(chartData.HQ_ACTUAL_OP_PROFIT / 100000000),
              Math.round(chartData.DOMESTIC_ACTUAL_OP_PROFIT / 100000000),
              Math.round(chartData.OVERSEAS_ACTUAL_OP_PROFIT / 100000000)
            ],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)'
          }
        ]
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('차트3 데이터 조회 실패:', error);
    throw error;
  }
};

// 공통 파라미터 생성 함수
function createParams(year: number, month: number, periodType: 'monthly' | 'cumulative') {
  return {
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
  };
}

// Zustand 스토어 정의
interface CompanyPerformanceStore {
  data: CompanyPerformanceData | null;
  loading: boolean;
  error: string | null;
  periodType: 'monthly' | 'cumulative';
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
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
    periodType: 'cumulative',  // 기본값을 누적조회로 변경
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    // 모든 데이터 조회
    fetchAllData: async () => {
      const { year, month } = getCurrentDate();
      const { periodType } = get();
      
      // 현재 날짜를 store에 업데이트
      set({ currentYear: year, currentMonth: month });
      
        // ⭐ 8월 조건 체크 - 템프 데이터 사용
        if (month === 8) {
          console.log('🎯 8월 데이터: 템프 데이터를 사용합니다.');
        
        const tempData: CompanyPerformanceData = {
          // 1번째 API: 상단 4개 KPI 카드 (왼쪽 -> 오른쪽)
          kpiMetrics: {
            ACTUAL_SALES: 4090,              // 1: 총 매출액
            ACTUAL_OP_PROFIT: 68,          // 2: 영업이익
            ACTUAL_OP_MARGIN: 1.7,          // 3: 영업이익률
            SALES_ACHIEVEMENT: 0,         // 4: 매출 달성률
            ACTUAL_SALES_CHANGE: -1158,       // 5: 전월대비 매출 증가액
            ACTUAL_OP_PROFIT_CHANGE: 35,   // 6: 전월대비 영업이익 증가액
            ACTUAL_OP_MARGIN_CHANGE: 0,   // 7: 전월대비 영업이익률 증가액
            SALES_ACHIEVEMENT_CHANGE: 0   // 8: 전월대비 매출 달성률 증가액
          },
          // 2번째 API: 중간 그리드 테이블 (상단 -> 하단, 왼쪽 -> 오른쪽)
          gridData: {
            divisions: [
              {
                name: '본사',
                plannedSales: 1752,            // 9
                plannedOpProfit: 60,        // 10
                plannedOpMargin: 3.4,        // 11
                actualSales: 1479,            // 12
                actualOpProfit: -2,         // 13
                actualOpMargin: -0.1,         // 14
                salesAchievement: 84,       // 15
                opProfitAchievement: 0     // 16
              },
              {
                name: '국내 자회사',
                plannedSales: 576,           // 17
                plannedOpProfit: 18,        // 18
                plannedOpMargin: 3.4,        // 19
                actualSales: 468,            // 20
                actualOpProfit: 13,         // 21
                actualOpMargin: 2.8,         // 22
                salesAchievement: 81,       // 23
                opProfitAchievement: 74     // 24
              },
              {
                name: '해외 자회사',
                plannedSales: 3410,           // 25
                plannedOpProfit: 73,        // 26
                plannedOpMargin: 2.1,        // 27
                actualSales: 2143,            // 28
                actualOpProfit: 57,         // 29
                actualOpMargin: 2.6,         // 30
                salesAchievement: 63,       // 31
                opProfitAchievement: 78     // 32
              },
              {
                name: '합계',
                plannedSales: 5738,           // 33
                plannedOpProfit: 150,        // 34
                plannedOpMargin: 2.6,        // 35
                actualSales: 4090,            // 36
                actualOpProfit: 68,         // 37
                actualOpMargin: 1.7,         // 38
                salesAchievement: 71,       // 39
                opProfitAchievement: 45     // 40
              }
            ]
          },
          // 3번째 API: 하단 첫 번째 카드 (달성율 도넛 차트)
          chartData1: {
            labels: ['본사'],  // 조건 체크용 더미 데이터
            datasets: [],
            PLANNED_SALES: 5738,         // 41
            ACTUAL_SALES: 4090,          // 42
            PLANNED_OP_PROFIT: 150,     // 43
            ACTUAL_OP_PROFIT: 68       // 44
          },
          // 4번째 API: 하단 두 번째 카드 (매출액 바 차트)
          chartData2: {
            labels: ['본사', '국내자회사', '해외자회사'],
            datasets: [
              {
                label: '계획 매출액',
                data: [1752, 576, 3410],
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
                borderColor: 'rgba(156, 163, 175, 1)'
              },
              {
                label: '실제 매출액',
                data: [1479, 468, 2143],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)'
              }
            ]
          },
          // 5번째 API: 하단 세 번째 카드 (영업이익 바 차트)
          chartData3: {
            labels: ['본사', '국내자회사', '해외자회사'],
            datasets: [
              {
                label: '계획 영업이익',
                data: [60, 18, 73],
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
                borderColor: 'rgba(156, 163, 175, 1)'
              },
              {
                label: '실제 영업이익',
                data: [-2, 13, 57],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)'
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      // ⭐ 9월 조건 체크 - 템프 데이터 사용 (8월과 동일한 값)
      if (month === 9) {
        console.log('🎯 9월 데이터: 템프 데이터를 사용합니다.');
        
        const tempData: CompanyPerformanceData = {
          // 1번째 API: 상단 4개 KPI 카드 (왼쪽 -> 오른쪽)
          kpiMetrics: {
            ACTUAL_SALES: 4633,              // 1: 총 매출액
            ACTUAL_OP_PROFIT: 76,          // 2: 영업이익
            ACTUAL_OP_MARGIN: 1.6,          // 3: 영업이익률
            SALES_ACHIEVEMENT: 0,         // 4: 매출 달성률
            ACTUAL_SALES_CHANGE: -1210,       // 5: 전월대비 매출 증가액
            ACTUAL_OP_PROFIT_CHANGE: 42,   // 6: 전월대비 영업이익 증가액
            ACTUAL_OP_MARGIN_CHANGE: 0,   // 7: 전월대비 영업이익률 증가액
            SALES_ACHIEVEMENT_CHANGE: 0   // 8: 전월대비 매출 달성률 증가액
          },
          // 2번째 API: 중간 그리드 테이블 (상단 -> 하단, 왼쪽 -> 오른쪽)
          gridData: {
            divisions: [
              {
                name: '본사',
                plannedSales: 1971,            // 9
                plannedOpProfit: 67,        // 10
                plannedOpMargin: 3.4,        // 11
                actualSales: 1670,            // 12
                actualOpProfit: 3,         // 13
                actualOpMargin: 0.2,         // 14
                salesAchievement: 85,       // 15
                opProfitAchievement: 4     // 16
              },
              {
                name: '국내 자회사',
                plannedSales: 648,           // 17
                plannedOpProfit: 20,        // 18
                plannedOpMargin: 3.1,        // 19
                actualSales: 524,            // 20
                actualOpProfit: 8,         // 21
                actualOpMargin: 1.6,         // 22
                salesAchievement: 81,       // 23
                opProfitAchievement: 42     // 24
              },
              {
                name: '해외 자회사',
                plannedSales: 3836,           // 25
                plannedOpProfit: 82,        // 26
                plannedOpMargin: 2.1,        // 27
                actualSales: 2439,            // 28
                actualOpProfit: 65,         // 29
                actualOpMargin: 2.7,         // 30
                salesAchievement: 64,       // 31
                opProfitAchievement: 79     // 32
              },
              {
                name: '합계',
                plannedSales: 6455,           // 33
                plannedOpProfit: 169,        // 34
                plannedOpMargin: 2.6,        // 35
                actualSales: 4633,            // 36
                actualOpProfit: 76,         // 37
                actualOpMargin: 1.6,         // 38
                salesAchievement: 72,       // 39
                opProfitAchievement: 45     // 40
              }
            ]
          },
          // 3번째 API: 하단 첫 번째 카드 (달성율 도넛 차트)
          chartData1: {
            labels: ['본사'],  // 조건 체크용 더미 데이터
            datasets: [],
            PLANNED_SALES: 6455,         // 41
            ACTUAL_SALES: 4633,          // 42
            PLANNED_OP_PROFIT: 169,     // 43
            ACTUAL_OP_PROFIT: 76       // 44
          },
          // 4번째 API: 하단 두 번째 카드 (매출액 바 차트)
          chartData2: {
            labels: ['본사', '국내자회사', '해외자회사'],
            datasets: [
              {
                label: '계획 매출액',
                data: [1971, 648, 3836],
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
                borderColor: 'rgba(156, 163, 175, 1)'
              },
              {
                label: '실제 매출액',
                data: [1670, 524, 2439],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)'
              }
            ]
          },
          // 5번째 API: 하단 세 번째 카드 (영업이익 바 차트)
          chartData3: {
            labels: ['본사', '국내자회사', '해외자회사'],
            datasets: [
              {
                label: '계획 영업이익',
                data: [67, 20, 83],
                backgroundColor: 'rgba(156, 163, 175, 0.5)',
                borderColor: 'rgba(156, 163, 175, 1)'
              },
              {
                label: '실제 영업이익',
                data: [3, 8, 65],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)'
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      // 기존 데이터가 있으면 로딩 상태를 true로 설정하지 않음 (부드러운 갱신)
      const currentData = get().data;
      if (!currentData) {
        set({ loading: true, error: null });
      }
      
      try {
        // 병렬로 모든 API 호출
        const [kpiData, gridData, chartData1, chartData2, chartData3] = await Promise.all([
          company_performance_header(year, month, periodType).catch(error => {
            console.error('❌ KPI 데이터 조회 실패:', error);
            return null;
          }),
          company_performance_grid(year, month, periodType).catch(error => {
            console.error('❌ Grid 데이터 조회 실패:', error);
            return null;
          }),
          company_performance_achievement_rate(year, month, periodType).catch(error => {
            console.error('❌ Chart1 데이터 조회 실패:', error);
            return null;
          }),
          company_performance_sales_profit(year, month, periodType).catch(error => {
            console.error('❌ Chart2 데이터 조회 실패:', error);
            return null;
          }),
          company_performance_operating_profit(year, month, periodType).catch(error => {
            console.error('❌ Chart3 데이터 조회 실패:', error);
            return null;
          })
        ]);
        
        // 성공한 API 개수 확인
        const successCount = [kpiData, gridData, chartData1, chartData2, chartData3].filter(Boolean).length;
        
        // 데이터가 하나라도 성공적으로 로드된 경우에만 상태 업데이트
        if (successCount > 0) {
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
            chartData1: chartData1 || { 
              labels: [], 
              datasets: [],
              PLANNED_SALES: 0,
              ACTUAL_SALES: 0,
              PLANNED_OP_PROFIT: 0,
              ACTUAL_OP_PROFIT: 0
            },
            chartData2: chartData2 || { labels: [], datasets: [] },
            chartData3: chartData3 || { labels: [], datasets: [] }
          };
          
          set({ 
            data: combinedData, 
            loading: false,
            error: null // 에러 상태 초기화
          });
          
          // 일부 API만 실패한 경우 콘솔에 경고만 출력
          if (successCount < 5) {
            console.warn(`⚠️ 일부 데이터만 로드됨 (${successCount}/5): 일부 차트나 데이터가 표시되지 않을 수 있습니다.`);
          }
        } else {
          throw new Error('모든 데이터 조회에 실패했습니다.');
        }
      } catch (error) {
        console.error('❌ Company Performance 데이터 로드 실패:', error);
        set({ 
          error: error instanceof Error ? error.message : '데이터 로드에 실패했습니다.',
          loading: false
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
      error: null
    })
  };
});
