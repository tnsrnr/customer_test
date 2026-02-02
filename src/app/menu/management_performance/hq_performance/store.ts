import { create } from 'zustand';
import { HQPerformanceData, ChartData } from './types';
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

// API 호출과 데이터 처리를 하나로 합친 함수들
const hq_performance_header = async (year: number, month: number): Promise<HQPerformanceData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    console.log('📤 hq_performance_header API 호출 파라미터:', params);
    
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/hq_performance_header`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const responseData = await response.json();
    console.log('📥 hq_performance_header API 응답:', responseData);
    
    if (responseData.data && responseData.data.includes('<!DOCTYPE html>')) {
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    // 데이터 처리
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const kpiData = responseData.MIS030231[0];
      console.log('📊 hq_performance_header 원본 데이터:', kpiData);
      
      // 서버에서 받은 데이터를 그대로 사용
      const result = {
        actualSales: kpiData.ACTUAL_SALES || 0,
        actualSalesChange: kpiData.ACTUAL_SALES_CHANGE || 0,
        actualPurchases: kpiData.ACTUAL_PURCHASES || 0,
        actualPurchasesChange: kpiData.ACTUAL_PURCHASES_CHANGE || 0,
        actualOpProfit: kpiData.ACTUAL_OP_PROFIT || 0,
        actualOpProfitChange: kpiData.ACTUAL_OP_PROFIT_CHANGE || 0,
        actualOpMargin: kpiData.ACTUAL_OP_MARGIN || 0,
        actualOpMarginChange: kpiData.ACTUAL_OP_MARGIN_CHANGE || 0
      };
      
      console.log('✅ hq_performance_header 변환된 데이터:', result);
      return result;
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('❌ KPI 데이터 조회 실패:', error);
    throw error;
  }
};

const hq_performance_grid = async (year: number, month: number): Promise<HQPerformanceData['gridData']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/hq_performance_grid`, {
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
      // 매출과 영업이익 데이터를 먼저 찾아서 영업이익률 계산에 사용
      const revenueItem = responseData.MIS030231.find((item: any) => item.DIVISION_TYPE === '매출');
      const profitItem = responseData.MIS030231.find((item: any) => item.DIVISION_TYPE === '영업이익');
      
      // 조회한 월 이후의 데이터는 0으로 처리하고 합계는 조회한 월까지만 계산
      // 매출과 영업이익의 조회한 월까지 합계 계산
      const revenueMonthValues = revenueItem 
        ? [
            revenueItem.MONTH1 || 0,
            revenueItem.MONTH2 || 0,
            revenueItem.MONTH3 || 0,
            revenueItem.MONTH4 || 0,
            revenueItem.MONTH5 || 0,
            revenueItem.MONTH6 || 0,
            revenueItem.MONTH7 || 0,
            revenueItem.MONTH8 || 0,
            revenueItem.MONTH9 || 0,
            revenueItem.MONTH10 || 0,
            revenueItem.MONTH11 || 0,
            revenueItem.MONTH12 || 0
          ]
        : Array(12).fill(0);
      
      const profitMonthValues = profitItem 
        ? [
            profitItem.MONTH1 || 0,
            profitItem.MONTH2 || 0,
            profitItem.MONTH3 || 0,
            profitItem.MONTH4 || 0,
            profitItem.MONTH5 || 0,
            profitItem.MONTH6 || 0,
            profitItem.MONTH7 || 0,
            profitItem.MONTH8 || 0,
            profitItem.MONTH9 || 0,
            profitItem.MONTH10 || 0,
            profitItem.MONTH11 || 0,
            profitItem.MONTH12 || 0
          ]
        : Array(12).fill(0);
      
      // 조회한 월 이후의 데이터는 0으로 처리
      for (let i = month; i < 12; i++) {
        revenueMonthValues[i] = 0;
        profitMonthValues[i] = 0;
      }
      
      // 조회한 월까지의 합계 계산
      const revenueTotal = revenueMonthValues.slice(0, month).reduce((sum, val) => sum + val, 0);
      const profitTotal = profitMonthValues.slice(0, month).reduce((sum, val) => sum + val, 0);
      
      // 영업이익률 합계 계산: (총 영업이익 / 총 매출) × 100
      const profitRateTotal = revenueTotal !== 0 ? (profitTotal / revenueTotal) * 100 : 0;
      
      // 1~12월 고정 컬럼 + 합계(COLUMN13) - 프론트에서 계산
      const monthlyDetails = responseData.MIS030231.map((item: any) => {
        const monthValues = [
          item.MONTH1 || 0, // 1월
          item.MONTH2 || 0, // 2월
          item.MONTH3 || 0, // 3월
          item.MONTH4 || 0, // 4월
          item.MONTH5 || 0, // 5월
          item.MONTH6 || 0, // 6월
          item.MONTH7 || 0, // 7월
          item.MONTH8 || 0, // 8월
          item.MONTH9 || 0, // 9월
          item.MONTH10 || 0, // 10월
          item.MONTH11 || 0, // 11월
          item.MONTH12 || 0 // 12월
        ];
        
        // 조회한 월 이후의 데이터는 0으로 처리
        for (let i = month; i < 12; i++) {
          monthValues[i] = 0;
        }
        
        // 영업이익률의 경우 합계를 특별 계산, 나머지는 조회한 월까지만 합계
        let total: number;
        if (item.DIVISION_TYPE === '영업이익률') {
          total = profitRateTotal; // (총 영업이익 / 총 매출) × 100
        } else {
          total = monthValues.slice(0, month).reduce((sum, val) => sum + val, 0); // 조회한 월까지 합계
        }
        
        console.log(`📊 ${item.DIVISION_TYPE} 합계 계산:`, {
          divisionType: item.DIVISION_TYPE,
          monthValues,
          total,
          isProfitRate: item.DIVISION_TYPE === '영업이익률'
        });
        
        return {
          column1: item.DIVISION_TYPE || '', // 구분 - 문자열
          column2: monthValues[0], // 1월 데이터 (MONTH1)
          column3: monthValues[1], // 2월 데이터 (MONTH2)
          column4: monthValues[2], // 3월 데이터 (MONTH3)
          column5: monthValues[3], // 4월 데이터 (MONTH4)
          column6: monthValues[4], // 5월 데이터 (MONTH5)
          column7: monthValues[5], // 6월 데이터 (MONTH6)
          column8: monthValues[6], // 7월 데이터 (MONTH7)
          column9: monthValues[7], // 8월 데이터 (MONTH8)
          column10: monthValues[8], // 9월 데이터 (MONTH9)
          column11: monthValues[9], // 10월 데이터 (MONTH10)
          column12: monthValues[10], // 11월 데이터 (MONTH11)
          column13: monthValues[11], // 12월 데이터 (MONTH12)
          column14: total // 합계 (영업이익률은 특별 계산, 나머지는 1~12월 합계)
        };
      });
      
      // 월 라벨 생성 (1~12월 고정)
      const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
      
      return { 
        monthlyDetails,
        monthLabels
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('그리드 데이터 조회 실패:', error);
    throw error;
  }
};

const hq_performance_chart = async (year: number, month: number): Promise<{ revenueChart: ChartData; profitChart: ChartData }> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/hq_performance_chart`, {
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
        // 1~12월 고정 라벨
        const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
      
      // 데이터 분리
      const revenueCurrent = responseData.MIS030231.find((item: any) => item.DIVISION_TYPE === '매출_현재');
      const revenueLastYear = responseData.MIS030231.find((item: any) => item.DIVISION_TYPE === '매출_1년전');
      const profitCurrent = responseData.MIS030231.find((item: any) => item.DIVISION_TYPE === '영업이익_현재');
      const profitLastYear = responseData.MIS030231.find((item: any) => item.DIVISION_TYPE === '영업이익_1년전');
      
      // 매출 차트 데이터
      const revenueChart: ChartData = {
        labels: monthLabels,
        datasets: [
          {
            label: '매출 (올해)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 조회한 월까지만 데이터 표시, 나머지는 null (표시 안 함)
              return index < month ? (revenueCurrent?.[monthKey] || 0) : null;
            }),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            spanGaps: false
          },
          {
            label: '매출 (직전년도)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 1년전 데이터는 전체 12개월 표시
              return (revenueLastYear?.[monthKey] || 0);
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
        labels: monthLabels,
        datasets: [
          {
            label: '영업이익 (올해)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 조회한 월까지만 데이터 표시, 나머지는 null (표시 안 함)
              return index < month ? (profitCurrent?.[monthKey] || 0) : null;
            }),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            spanGaps: false
          },
          {
            label: '영업이익 (직전년도)',
            data: Array.from({ length: 12 }, (_, index) => {
              const monthKey = `MONTH${index + 1}`;
              // 1년전 데이터는 전체 12개월 표시
              return (profitLastYear?.[monthKey] || 0);
            }),
            borderColor: 'rgb(156, 163, 175)',
            backgroundColor: 'rgba(156, 163, 175, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5],
            spanGaps: false
          }
        ]
      };
      
      return { revenueChart, profitChart };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('차트 데이터 조회 실패:', error);
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
      
      console.log('🔍 hq_performance fetchAllData 호출:', { currentYear, currentMonth });
      
      // 현재 날짜를 store에 업데이트
      set({ currentYear, currentMonth });
      
      set({ loading: true, error: null });
      
      try {
        // API를 병렬로 호출
        const [kpiMetrics, chartData, gridData] = await Promise.all([
          hq_performance_header(currentYear, currentMonth),
          hq_performance_chart(currentYear, currentMonth), // 실제 차트 API 호출
          hq_performance_grid(currentYear, currentMonth) // 실제 그리드 API 호출
        ]);

        console.log('✅ hq_performance 모든 API 호출 완료:', { kpiMetrics, chartData, gridData });

        const combinedData: HQPerformanceData = { 
          kpiMetrics, 
          chartData, 
          gridData 
        };

        console.log('✅ hq_performance 최종 데이터:', combinedData);
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
