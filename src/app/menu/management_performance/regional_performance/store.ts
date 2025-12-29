import { create } from 'zustand';
import { RegionalPerformanceData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

// API 호출 함수들 (나중에 서버 API 연결 시 사용)
const regional_performance_kpi = async (year: number, month: number): Promise<RegionalPerformanceData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/regional_performance_kpi`, {
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
    
    // 데이터 처리 (API 응답 구조에 맞게 수정 필요)
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const kpiData = responseData.MIS030231[0];
      return {
        totalSales: Math.round(kpiData.TOTAL_SALES / 100000000),
        totalProfit: Math.round(kpiData.TOTAL_PROFIT / 100000000),
        totalOpProfit: Math.round(kpiData.TOTAL_OP_PROFIT / 100000000),
        totalOpMargin: kpiData.TOTAL_OP_MARGIN
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('KPI 데이터 조회 실패:', error);
    throw error;
  }
};

const regional_performance_regions = async (year: number, month: number): Promise<RegionalPerformanceData['regions']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/regional_performance_regions`, {
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
    
    // 데이터 처리 (API 응답 구조에 맞게 수정 필요)
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      return responseData.MIS030231.map((item: any) => ({
        name: item.REGION_NAME,
        icon: item.ICON || '🌍',
        variant: item.VARIANT || 'asia',
        monthlyData: {
          sales: Math.round(item.MONTHLY_SALES / 100000000),
          profit: Math.round(item.MONTHLY_PROFIT / 100000000)
        },
        achievement: {
          sales: item.SALES_ACHIEVEMENT || 0,
          profit: item.PROFIT_ACHIEVEMENT || 0
        },
        totalData: {
          sales: Math.round(item.TOTAL_SALES / 100000000),
          profit: Math.round(item.TOTAL_PROFIT / 100000000)
        }
      }));
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('권역 데이터 조회 실패:', error);
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

// Zustand 스토어 정의
interface RegionalPerformanceStore {
  data: RegionalPerformanceData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: RegionalPerformanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useRegionalPerformanceStore = create<RegionalPerformanceStore>((set, get) => {
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
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    // 모든 데이터 조회
    fetchAllData: async () => {
      const { year, month } = getCurrentDate();
      
      // 현재 날짜를 store에 업데이트
      set({ currentYear: year, currentMonth: month, loading: true, error: null });
      
      try {
        // TODO: 서버 API 연결 시 아래 주석 해제하고 하드코딩 데이터 제거
        // const [kpiMetrics, regions] = await Promise.all([
        //   regional_performance_kpi(year, month),
        //   regional_performance_regions(year, month)
        // ]);
        
        // ⭐ 10월 조건 체크 - 템프 데이터 사용
        if (month === 10) {
          console.log('🎯 10월 데이터: 템프 데이터를 사용합니다. (권역별 실적)');
          
          const tempData: RegionalPerformanceData = {
            kpiMetrics: {
              totalSales: 2682,        // 1
              totalProfit: 534,      // 2
              totalOpProfit: 70,     // 3
              totalOpMargin: 3      // 4
            },
            regions: [
              {
                name: '중국권역',
                icon: '🇨🇳',
                variant: 'china',
                monthlyData: {
                  sales: 47,         // 5
                  profit: 0         // 6
                },
                achievement: {
                  sales: 42,         // 7
                  profit: 166         // 8
                },
                totalData: {
                  sales: 678,         // 9
                  profit: 44        // 10
                }
              },
              {
                name: '아시아권역',
                icon: '🌏',
                variant: 'asia',
                monthlyData: {
                  sales: 65,        // 11
                  profit: -0.1        // 12
                },
                achievement: {
                  sales: 69,        // 13
                  profit: 0        // 14
                },
                totalData: {
                  sales: 730,        // 15
                  profit: -7.9        // 16
                }
              },
              {
                name: '유럽권역',
                icon: '🇪🇺',
                variant: 'europe',
                monthlyData: {
                  sales: 127,        // 17
                  profit: 1.3        // 18
                },
                achievement: {
                  sales: 81,        // 19
                  profit: 91        // 20
                },
                totalData: {
                  sales: 1127,        // 21
                  profit: 28        // 22
                }
              },
              {
                name: '미국권역',
                icon: '🇺🇸',
                variant: 'usa',
                monthlyData: {
                  sales: 22,        // 23
                  profit: 2        // 24
                },
                achievement: {
                  sales: 60,        // 25
                  profit: 163        // 26
                },
                totalData: {
                  sales: 197,        // 27
                  profit: 6        // 28
                }
              }
            ]
          };
          
          set({ 
            data: tempData,
            loading: false 
          });
          return; // API 호출 없이 리턴
        }
        
        // ⭐ 11월 조건 체크 - 템프 데이터 사용 (1부터 시작해서 순차적으로 증가)
        if (month === 11) {
          console.log('🎯 11월 데이터: 템프 데이터를 사용합니다. (권역별 실적)');
          
          const tempData: RegionalPerformanceData = {
            kpiMetrics: {
              totalSales: 2938,        // 1
              totalProfit: 587,      // 2
              totalOpProfit: 72,     // 3
              totalOpMargin: 2.5      // 4
            },
            regions: [
              {
                name: '중국권역',
                icon: '🇨🇳',
                variant: 'china',
                monthlyData: {
                  sales: 47,         // 5
                  profit: 0         // 6
                },
                achievement: {
                  sales: 41,         // 7
                  profit: 135         // 8
                },
                totalData: {
                  sales: 671,         // 9
                  profit: 39        // 10
                }
              },
              {
                name: '아시아권역',
                icon: '🌏',
                variant: 'asia',
                monthlyData: {
                  sales: 76,        // 11
                  profit: 1        // 12
                },
                achievement: {
                  sales: 70,        // 13
                  profit: -23        // 14
                },
                totalData: {
                  sales: 819,        // 15
                  profit: -8        // 16
                }
              },
              {
                name: '유럽권역',
                icon: '🇪🇺',
                variant: 'europe',
                monthlyData: {
                  sales: 110,        // 17
                  profit: 2        // 18
                },
                achievement: {
                  sales: 80,        // 19
                  profit: 95        // 20
                },
                totalData: {
                  sales: 1229,        // 21
                  profit: 32        // 22
                }
              },
              {
                name: '미국권역',
                icon: '🇺🇸',
                variant: 'usa',
                monthlyData: {
                  sales: 23,        // 23
                  profit: 2        // 24
                },
                achievement: {
                  sales: 61,        // 25
                  profit: 208        // 26
                },
                totalData: {
                  sales: 220,        // 27
                  profit: 8        // 28
                }
              }
            ]
          };
          
          set({ 
            data: tempData,
            loading: false 
          });
          return; // API 호출 없이 리턴
        }
        
        // 임시 하드코딩 데이터 (서버 API 연결 전까지 사용)
        // 1부터 시작해서 1씩 순서대로 증감하는 값
        const tempData: RegionalPerformanceData = {
          kpiMetrics: {
            totalSales: 2682,        // 1
            totalProfit: 534,      // 2
            totalOpProfit: 70,     // 3
            totalOpMargin: 3      // 4
          },
          regions: [
            {
              name: '중국권역',
              icon: '🇨🇳',
              variant: 'china',
              monthlyData: {
                sales: 47,         // 5
                profit: 0         // 6
              },
              achievement: {
                sales: 42,         // 7
                profit: 166         // 8
              },
              totalData: {
                sales: 678,         // 9
                profit: 44        // 10
              }
            },
            {
              name: '아시아권역',
              icon: '🌏',
              variant: 'asia',
              monthlyData: {
                sales: 65,        // 11
                profit: -0.1        // 12
              },
              achievement: {
                sales: 69,        // 13
                profit: 0        // 14
              },
              totalData: {
                sales: 730,        // 15
                profit: -7.9        // 16
              }
            },
            {
              name: '유럽권역',
              icon: '🇪🇺',
              variant: 'europe',
              monthlyData: {
                sales: 127,        // 17
                profit: 1.3        // 18
              },
              achievement: {
                sales: 81,        // 19
                profit: 91        // 20
              },
              totalData: {
                sales: 1127,        // 21
                profit: 28        // 22
              }
            },
            {
              name: '미국권역',
              icon: '🇺🇸',
              variant: 'usa',
              monthlyData: {
                sales: 22,        // 23
                profit: 2        // 24
              },
              achievement: {
                sales: 60,        // 25
                profit: 163        // 26
              },
              totalData: {
                sales: 197,        // 27
                profit: 6        // 28
              }
            }
          ]
        };
        
        set({ 
          data: tempData,
          loading: false 
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.';
        set({ 
          error: errorMessage,
          loading: false 
        });
      }
    },

    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCurrentDate: (year, month) => set({ currentYear: year, currentMonth: month }),
    reset: () => set({ 
      data: null, 
      loading: false, 
      error: null,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    })
  };
});

