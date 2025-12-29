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
      
      // 백엔드에서 받은 데이터를 억원 단위로 변환 (소수점 유지)
      return {
        actualSales: kpiData.ACTUAL_SALES / 100000000,
        actualSalesChange: (kpiData.ACTUAL_SALES_CHANGE || 0) / 100000000,
        actualPurchases: kpiData.ACTUAL_PURCHASES / 100000000,
        actualPurchasesChange: (kpiData.ACTUAL_PURCHASES_CHANGE || 0) / 100000000,
        actualOpProfit: kpiData.ACTUAL_OP_PROFIT / 100000000,
        actualOpProfitChange: (kpiData.ACTUAL_OP_PROFIT_CHANGE || 0) / 100000000,
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
      // 11월 조회 시 column13까지 사용, 10월 조회 시 column12까지 사용, 9월 조회 시 column11까지 사용
      const isNovember = month === 11;
      const isOctober = month === 10;
      const monthlyDetails = responseData.MIS030231.map((item: any) => {
        const baseData = {
          column1: item.COLUMN1 || '', // 구분 - 문자열
          column2: item.COLUMN2 || 0, // 1월 데이터
          column3: item.COLUMN3 || 0, // 2월 데이터
          column4: item.COLUMN4 || 0, // 3월 데이터
          column5: item.COLUMN5 || 0, // 4월 데이터
          column6: item.COLUMN6 || 0, // 5월 데이터
          column7: item.COLUMN7 || 0, // 6월 데이터
          column8: item.COLUMN8 || 0, // 7월 데이터
          column9: item.COLUMN9 || 0, // 8월 데이터
        };
        
        if (isNovember) {
          return {
            ...baseData,
            column10: item.COLUMN10 || 0, // 9월 데이터
            column11: item.COLUMN11 || 0, // 10월 데이터
            column12: item.COLUMN12 || 0, // 11월 데이터
            column13: item.COLUMN13 || 0 // 합계
          };
        } else if (isOctober) {
          return {
            ...baseData,
            column10: item.COLUMN10 || 0, // 9월 데이터
            column11: item.COLUMN11 || 0, // 10월 데이터
            column12: item.COLUMN12 || 0 // 합계
          };
        } else {
          return {
            ...baseData,
            column10: item.COLUMN10 || 0, // 9월 데이터
            column11: item.COLUMN11 || 0 // 합계
          };
        }
      });
      
      // 월 라벨 생성
      const monthLabels = isNovember
        ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월']
        : isOctober 
        ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월']
        : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월'];
      
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
        // 11월 조회 시 11월까지 표시, 10월 조회 시 10월까지 표시
        const isNovember = month === 11;
        const isOctober = month === 10;
        const monthLabels = isNovember
          ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월']
          : isOctober 
          ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월']
          : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월'];
      
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
              // 현재 월까지만 데이터 표시, 나머지는 null (소수점 유지)
              return index < month ? (revenueCurrent?.[monthKey] || 0) / 100000000 : null;
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
              // 1년전 데이터는 전체 12개월 표시 (소수점 유지)
              return (revenueLastYear?.[monthKey] || 0) / 100000000;
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
              // 현재 월까지만 데이터 표시, 나머지는 null (소수점 유지)
              return index < month ? (profitCurrent?.[monthKey] || 0) / 100000000 : null;
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
              // 1년전 데이터는 전체 12개월 표시 (소수점 유지)
              return (profitLastYear?.[monthKey] || 0) / 100000000;
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
      
        // ⭐ 9월 조건 체크 - 템프 데이터 사용
        if (currentMonth === 9) {
          console.log('🎯 9월 데이터: 템프 데이터를 사용합니다. (본사 성과)');
        
        const tempData: HQPerformanceData = {
          // 상단 4개 KPI 카드 (왼쪽 → 오른쪽)
          kpiMetrics: {
            actualSales: 1670,                    // 1: 매출
            actualSalesChange: -526,              // 2: 매출 변화
            actualPurchases: 1622,                // 3: 매입
            actualPurchasesChange: -504,          // 4: 매입 변화
            actualOpProfit: 3,                 // 5: 영업이익
            actualOpProfitChange: 5,           // 6: 영업이익 변화
            actualOpMargin: 0.2,                 // 7: 영업이익율
            actualOpMarginChange: 0.3            // 8: 영업이익율 변화
          },
          // 차트 데이터
          chartData: {
            revenueChart: {
              labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              datasets: [
                {
                  label: '매출 (올해)',
                  data: [175, 166, 195, 211, 189, 178, 187, 181, 189, null, null, null],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '매출 (직전년도)',
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
                  data: [1, -3, -0, -2, -0, 2, 1, 2, 3, null, null, null],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '영업이익 (직전년도)',
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
            monthLabels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월'],
            monthlyDetails: [
              {
                column1: '매출',           // 49
                column2: 175,               // 1월
                column3: 166,               // 2월
                column4: 195,               // 3월
                column5: 211,               // 4월
                column6: 189,               // 5월
                column7: 178,               // 6월
                column8: 187,               // 7월
                column9: 181,               // 8월
                column10: 189,              // 9월
                column11: 1670                // 합계
              },
              {
                column1: '매출원가',           // 57
                column2: 169,               // 1월
                column3: 163,               // 2월
                column4: 190,               // 3월
                column5: 208,               // 4월
                column6: 184,               // 5월
                column7: 172,               // 6월
                column8: 181,               // 7월
                column9: 173,               // 8월
                column10: 181,              // 9월
                column11: 1622                // 합계
              },
              {
                column1: '매출총이익',       // 65
                column2: 6,               // 1월
                column3: 2,               // 2월
                column4: 5,               // 3월
                column5: 3,               // 4월
                column6: 5,               // 5월
                column7: 7,               // 6월
                column8: 6,               // 7월
                column9: 7,               // 8월
                column10: 8,              // 9월
                column11: 48                // 합계
              },
              {
                column1: '판관비',         // 73
                column2: 5,               // 1월
                column3: 5,               // 2월
                column4: 5,               // 3월
                column5: 5,               // 4월
                column6: 5,               // 5월
                column7: 5,               // 6월
                column8: 5,               // 7월
                column9: 5,               // 8월
                column10: 5,              // 9월
                column11: 45               // 합계
              },
              {
                column1: '영업이익',       // 81
                column2: 1,               // 1월
                column3: -3,               // 2월
                column4: -0,               // 3월
                column5: -2,               // 4월
                column6: -0,               // 5월
                column7: 2,               // 6월
                column8: 1,               // 7월
                column9: 2,               // 8월
                column10: 3,              // 9월
                column11: 3                // 합계
              },
              {
                column1: '영업이익율',     // 89
                column2: 0,               // 1월
                column3: -2,               // 2월
                column4: -0,               // 3월
                column5: -1,               // 4월
                column6: -0,               // 5월
                column7: 1,               // 6월
                column8: 1,               // 7월
                column9: 1,               // 8월
                column10: 2,              // 9월
                column11: 0                // 합계
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      // ⭐ 10월 조건 체크 - 템프 데이터 사용 (1부터 시작해서 순차적으로 증가)
      if (currentMonth === 10) {
        console.log('🎯 10월 데이터: 템프 데이터를 사용합니다. (본사 성과)');
        
        const tempData: HQPerformanceData = {
          // 상단 4개 KPI 카드 (왼쪽 → 오른쪽)
          kpiMetrics: {
            actualSales: 1804,                    // 1: 매출
            actualSalesChange: -564,              // 2: 매출 변화
            actualPurchases: 1747,                // 3: 매입
            actualPurchasesChange: -548,          // 4: 매입 변화
            actualOpProfit: -25.1,                 // 5: 영업이익
            actualOpProfitChange: -7,           // 6: 영업이익 변화
            actualOpMargin: -1.39,                 // 7: 영업이익율
            actualOpMarginChange: -0.6            // 8: 영업이익율 변화
          },
          // 차트 데이터
          chartData: {
            revenueChart: {
              labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              datasets: [
                {
                  label: '매출 (올해)',
                  data: [170, 161, 191, 207, 185, 174, 183, 178, 186, 167, null, null],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '매출 (직전년도)',
                  data: [270,232,258,234,248,233,243,233,206,211,209,228],
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
                  data: [-5.5, -5.3, -2.2, -4.6, -2.3, -0.4, -0.9, 0.2, -1.7, -2.4, null, null],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '영업이익 (직전년도)',
                  data: [5,-6,1,-1,1,-4,4,-6,-8,-4,-4,-6],
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
            monthLabels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
            monthlyDetails: [
              {
                column1: '매출',           // 49
                column2: 170,               // 1월
                column3: 161,               // 2월
                column4: 191,               // 3월
                column5: 207,               // 4월
                column6: 185,               // 5월
                column7: 174,               // 6월
                column8: 183,               // 7월
                column9: 178,               // 8월
                column10: 186,              // 9월
                column11: 167,              // 10월
                column12: 1804                // 합계
              },
              {
                column1: '매출원가',           // 57
                column2: 167,               // 1월
                column3: 157,               // 2월
                column4: 185,               // 3월
                column5: 203,               // 4월
                column6: 179,               // 5월
                column7: 167,               // 6월
                column8: 176,               // 7월
                column9: 170,               // 8월
                column10: 180,              // 9월
                column11: 162,              // 10월
                column12: 1747                // 합계
              },
              {
                column1: '매출총이익',       // 65
                column2: 3.1,               // 1월
                column3: 3.7,               // 2월
                column4: 5.9,               // 3월
                column5: 3.7,               // 4월
                column6: 6.3,               // 5월
                column7: 7.2,               // 6월
                column8: 7.5,               // 7월
                column9: 7.7,               // 8월
                column10: 6.8,              // 9월
                column11: 4.8,              // 10월
                column12: 56.6                // 합계
              },
              {
                column1: '판관비',         // 73
                column2: 8.6,               // 1월
                column3: 9.0,               // 2월
                column4: 8.1,               // 3월
                column5: 8.3,               // 4월
                column6: 8.6,               // 5월
                column7: 7.6,               // 6월
                column8: 8.3,               // 7월
                column9: 7.4,               // 8월
                column10: 8.5,              // 9월
                column11: 7.2,              // 10월
                column12: 82               // 합계
              },
              {
                column1: '영업이익',       // 81
                column2: -5.5,               // 1월
                column3: -5.3,               // 2월
                column4: -2.2,               // 3월
                column5: -4.6,               // 4월
                column6: -2.3,               // 5월
                column7: -0.4,               // 6월
                column8: -0.9,               // 7월
                column9: 0.2,               // 8월
                column10: -1.7,              // 9월
                column11: -2.4,              // 10월
                column12: -25.1                // 합계
              },
              {
                column1: '영업이익율',     // 89
                column2: -3.24,               // 1월
                column3: -3.29,               // 2월
                column4: -1.17,               // 3월
                column5: -2.23,               // 4월
                column6: -1.25,               // 5월
                column7: -0.26,               // 6월
                column8: -0.47,               // 7월
                column9: 0.13,               // 8월
                column10: -0.89,              // 9월
                column11: -1.45,              // 10월
                column12: -1.39                // 합계
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      // ⭐ 11월 조건 체크 - 템프 데이터 사용 (10월과 동일한 값으로 시작)
      if (currentMonth === 11) {
        console.log('🎯 11월 데이터: 템프 데이터를 사용합니다. (본사 성과)');
        
        const tempData: HQPerformanceData = {
          // 상단 4개 KPI 카드 (왼쪽 → 오른쪽)
          kpiMetrics: {
            actualSales: 1987,                    // 1: 매출
            actualSalesChange: 0,              // 2: 매출 변화
            actualPurchases: 1925,                // 3: 매입
            actualPurchasesChange: 0,          // 4: 매입 변화
            actualOpProfit: -25.7,                 // 5: 영업이익
            actualOpProfitChange: 0,           // 6: 영업이익 변화
            actualOpMargin: -1.3,                 // 7: 영업이익율
            actualOpMarginChange: 0            // 8: 영업이익율 변화
          },
          // 차트 데이터
          chartData: {
            revenueChart: {
              labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
              datasets: [
                {
                  label: '매출 (올해)',
                  data: [170, 161, 191, 207, 185, 174, 183, 179, 187, 169, 180, null],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '매출 (직전년도)',
                  data: [270,232,258,234,248,233,243,233,206,211,209,228],
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
                  data: [-5.5, -5.3, -2.3, -4.6, -1.0, -0.4, -0.9, 0.2, -1.6, -2.5, -1.7, null],
                  borderColor: 'rgb(239, 68, 68)',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderWidth: 2,
                  spanGaps: false
                },
                {
                  label: '영업이익 (직전년도)',
                  data: [5,-6,1,-1,1,-4,4,-6,-8,-4,-4,-6],
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
            monthLabels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월'],
            monthlyDetails: [
              {
                column1: '매출',           // 49
                column2: 170,               // 1월
                column3: 161,               // 2월
                column4: 191,               // 3월
                column5: 207,               // 4월
                column6: 185,               // 5월
                column7: 174,               // 6월
                column8: 183,               // 7월
                column9: 179,               // 8월
                column10: 187,              // 9월
                column11: 169,              // 10월
                column12: 180,              // 11월
                column13: 1987                // 합계
              },
              {
                column1: '매출원가',           // 57
                column2: 167,               // 1월
                column3: 157,               // 2월
                column4: 185,               // 3월
                column5: 203,               // 4월
                column6: 179,               // 5월
                column7: 167,               // 6월
                column8: 176,               // 7월
                column9: 170,               // 8월
                column10: 180,              // 9월
                column11: 162,              // 10월
                column12: 164,              // 11월
                column13: 1747                // 합계
              },
              {
                column1: '매출총이익',       // 65
                column2: 3.1,               // 1월
                column3: 3.7,               // 2월
                column4: 5.9,               // 3월
                column5: 3.7,               // 4월
                column6: 6.3,               // 5월
                column7: 7.2,               // 6월
                column8: 7.5,               // 7월
                column9: 7.6,               // 8월
                column10: 6.8,              // 9월
                column11: 4.7,              // 10월
                column12: 5.4,              // 11월
                column13: 62                // 합계
              },
              {
                column1: '판관비',         // 73
                column2: 9,               // 1월
                column3: 9,               // 2월
                column4: 8,               // 3월
                column5: 8,               // 4월
                column6: 7,               // 5월
                column7: 8,               // 6월
                column8: 8,               // 7월
                column9: 7,               // 8월
                column10: 8,              // 9월
                column11: 7,              // 10월
                column12: 7,              // 11월
                column13: 87               // 합계
              },
              {
                column1: '영업이익',       // 81
                column2: -5.5,               // 1월
                column3: -5.3,               // 2월
                column4: -2.3,               // 3월
                column5: -4.6,               // 4월
                column6: -1.0,               // 5월
                column7: -0.4,               // 6월
                column8: -0.9,               // 7월
                column9: 0.2,               // 8월
                column10: -1.6,              // 9월
                column11: -2.5,              // 10월
                column12: -1.7,              // 11월
                column13: -25.7                // 합계
              },
              {
                column1: '영업이익율',     // 89
                column2: -3.2,               // 1월
                column3: -3.3,               // 2월
                column4: -1.2,               // 3월
                column5: -2.2,               // 4월
                column6: -0.5,               // 5월
                column7: -0.3,               // 6월
                column8: -0.5,               // 7월
                column9: 0.1,               // 8월
                column10: -0.9,              // 9월
                column11: -1.5,              // 10월
                column12: -1.0,              // 11월
                column13: -1.3                // 합계
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
