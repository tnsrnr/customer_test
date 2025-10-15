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
      const monthlyDetails = responseData.MIS030231.map((item: any) => ({
        column1: item.COLUMN1 || '', // 구분 - 문자열
        column2: item.COLUMN2 || 0, // 첫 번째 월 데이터
        column3: item.COLUMN3 || 0, // 두 번째 월 데이터
        column4: item.COLUMN4 || 0, // 세 번째 월 데이터
        column5: item.COLUMN5 || 0, // 네 번째 월 데이터
        column6: item.COLUMN6 || 0, // 다섯 번째 월 데이터 (선택한 월)
        column7: item.COLUMN7 || 0, // 합계
        column8: item.COLUMN8 || '' // 성장률 - 문자열
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
        labels: monthLabels,
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
      
      // 현재 날짜를 store에 업데이트
      set({ currentYear, currentMonth });
      
      // ⭐ 8월 조건 체크 - 템프 데이터 사용
      if (currentMonth === 8) {
        console.log('🎯 8월 데이터: 템프 데이터를 사용합니다. (본사 성과)');
        
        const tempData: HQPerformanceData = {
          // 상단 4개 KPI 카드 (왼쪽 → 오른쪽)
          kpiMetrics: {
            actualSales: 179,                    // 1: 매출
            actualSalesChange: -8,              // 2: 매출 변화
            actualPurchases: 170,                // 3: 매입
            actualPurchasesChange: -7,          // 4: 매입 변화
            actualOpProfit: 1.8,                 // 5: 영업이익
            actualOpProfitChange: 0.9,           // 6: 영업이익 변화
            actualOpMargin: 0.99,                 // 7: 영업이익율
            actualOpMarginChange: 0.5            // 8: 영업이익율 변화
          },
          // 차트 데이터
          chartData: {
            revenueChart: {
              labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              datasets: [
                {
                  label: '매출 (올해)',
                  data: [175, 166, 195, 211, 189, 178, 187, 179, null, null, null, null],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '매출 (1년 전)',
                  data: [274, 236, 262, 239, 252, 237, 247, 238, 210, 215, 214, 232],
                  borderColor: 'rgb(156, 163, 175)',
                  backgroundColor: 'rgba(156, 163, 175, 0.1)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  spanGaps: false
                }
              ]
            },
            profitChart: {
              labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              datasets: [
                {
                  label: '영업이익 (올해)',
                  data: [0, -3, -0, -3, -1, 1, 1, 2, null, null, null, null],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '영업이익 (1년 전)',
                  data: [6, -6, -1, -3, -1, -5, 16, -3, -6, -2, -2, -3],
                  borderColor: 'rgb(156, 163, 175)',
                  backgroundColor: 'rgba(156, 163, 175, 0.1)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  spanGaps: false
                }
              ]
            }
          },
          // 그리드 테이블 데이터 (좌측 → 우측, 상단 → 하단)
          gridData: {
            monthLabels: ['4월', '5월', '6월', '7월', '8월'],
            monthlyDetails: [
              {
                column1: '매출',           // 49
                column2: 211,               // 4월
                column3: 189,               // 5월
                column4: 178,               // 6월
                column5: 187,               // 7월
                column6: 179,               // 8월
                column7: 0,               // 합계
                column8: '56%'             // 성장률
              },
              {
                column1: '매출원가',           // 57
                column2: 205,               // 4월
                column3: 181,               // 5월
                column4: 169,               // 6월
                column5: 177,               // 7월
                column6: 170,               // 8월
                column7: 0,               // 합계
                column8: '64%'             // 성장률
              },
              {
                column1: '매출총이익',       // 65
                column2: 5.7,               // 4월
                column3: 8.1,               // 5월
                column4: 8.8,               // 6월
                column5: 9.3,               // 7월
                column6: 9.2,               // 8월
                column7: 0,               // 합계
                column8: '72%'             // 성장률
              },
              {
                column1: '판관비',         // 73
                column2: 8,               // 4월
                column3: 9,               // 5월
                column4: 8,               // 6월
                column5: 8,               // 7월
                column6: 7,               // 8월
                column7: 0,               // 합계
                column8: '80%'             // 성장률
              },
              {
                column1: '영업이익',       // 81
                column2: -2.7,               // 4월
                column3: -0.5,               // 5월
                column4: 1.2,               // 6월
                column5: 0.9,               // 7월
                column6: 1.8,               // 8월
                column7: 0,               // 합계
                column8: '88%'             // 성장률
              },
              {
                column1: '영업이익율',     // 89
                column2: -1.27,               // 4월
                column3: -0.28,               // 5월
                column4: 0.68,               // 6월
                column5: 0.49,               // 7월
                column6: 0.99,               // 8월
                column7: 0,               // 합계
                column8: '96%'             // 성장률
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      set({ loading: true, error: null });
      
      try {
        // API를 병렬로 호출
        const [kpiMetrics, chartData, gridData] = await Promise.all([
          hq_performance_header(currentYear, currentMonth),
          hq_performance_chart(currentYear, currentMonth), // 실제 차트 API 호출
          hq_performance_grid(currentYear, currentMonth) // 실제 그리드 API 호출
        ]);

        const combinedData: HQPerformanceData = { 
          kpiMetrics, 
          chartData, 
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
