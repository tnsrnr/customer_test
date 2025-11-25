import { create } from 'zustand';
import { PersonnelData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

// API 호출과 데이터 처리를 하나로 합친 함수들
const personnel_header = async (year: number, month: number): Promise<PersonnelData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/personnel_header`, {
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
        headquarters: kpiData.HEADQUARTERS || 0,
        domesticSubsidiaries: kpiData.DOMESTICSUBSIDIARIES || 0,
        overseasSubsidiaries: kpiData.OVERSEASSUBSIDIARIES || 0,
        total: kpiData.TOTAL || 0,
        headquartersChange: kpiData.HEADQUARTERSCHANGE || 0,
        domesticSubsidiariesChange: kpiData.DOMESTICSUBSIDIARIESCHANGE || 0,
        overseasSubsidiariesChange: kpiData.OVERSEASSUBSIDIARIESCHANGE || 0,
        totalChange: kpiData.TOTALCHANGE || 0
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('KPI 데이터 조회 실패:', error);
    throw error;
  }
};

const personnel_grid = async (year: number, month: number): Promise<PersonnelData['gridData']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/personnel_grid`, {
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
      const divisions = responseData.MIS030231.map((item: any) => ({
        company_name: item.COMPANY_NAME || '',
        q1: item.Q1 || 0,
        q2: item.Q2 || 0,
        q3: item.Q3 || 0,
        q4: item.Q4 || 0,
        currentLocal: item.CURRENTLOCAL || 0,
        currentKorean: item.CURRENTKOREAN || 0,
        previousMonth: item.PREVIOUSMONTH || 0,
        currentMonth: item.CURRENTMONTH || 0,
        change: item.CHANGE || 0,
        groupCategory: item.GROUPCATEGORY || ''
      }));
      
      // 첫 번째 행이 "소계"인 경우 제거 (실제 API 응답에서 불필요한 첫 번째 소계 행 제거)
      const filteredDivisions = divisions.filter((item, index) => {
        // 첫 번째 행이 "소계"이고 그룹 카테고리가 비어있거나 "국내"인 경우 제거
        if (index === 0 && item.company_name === '소계' && (!item.groupCategory || item.groupCategory === '국내')) {
          return false;
        }
        return true;
      });
      
      return { divisions: filteredDivisions };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('그리드 데이터 조회 실패:', error);
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

interface PersonnelStore {
  data: PersonnelData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: PersonnelData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const usePersonnelStore = create<PersonnelStore>((set, get) => {
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
      // global store에서 현재 선택된 날짜 가져오기
      const { selectedYear, selectedMonth } = useGlobalStore.getState();
      const currentYear = selectedYear || new Date().getFullYear();
      const currentMonth = selectedMonth || new Date().getMonth() + 1;
      
      // store의 현재 날짜도 업데이트
      set({ currentYear, currentMonth });
      
        // ⭐ 8월 조건 체크 - 템프 데이터 사용
        if (currentMonth === 8) {
          console.log('🎯 8월 데이터: 템프 데이터를 사용합니다. (인사 현황)');
        
        const tempData: PersonnelData = {
          // 상단 4개 KPI 카드 (우측 → 좌측 순서)
          kpiMetrics: {
            headquarters: 158,                    // 7: 본사 (좌측 끝)
            headquartersChange: 0,              // 8: 본사 변화
            domesticSubsidiaries: 758,            // 5: 국내 계열사 (우측에서 3번째)
            domesticSubsidiariesChange: 1,      // 6: 국내 계열사 변화
            overseasSubsidiaries: 893,            // 3: 해외 계열사 (우측에서 2번째)
            overseasSubsidiariesChange: -7,      // 4: 해외 계열사 변화
            total: 1809,                           // 1: 총 인원 (우측 끝)
            totalChange: -6                      // 2: 총 인원 변화
          },
          // 하단 테이블 (좌측 → 우측, 상단 → 하단) - 첫 번째 불필요한 "소계" 행 제거
          gridData: {
            divisions: [
              {
                company_name: '하나로TNS',
                q1: 185,
                q2: 174,
                q3: 178,
                q4: 175,
                currentLocal: 0,
                currentKorean: 158,
                previousMonth: 158,
                currentMonth: 158,
                change: 0,
                groupCategory: '국내'
              },
              {
                company_name: '하나로S',
                q1: 225,
                q2: 220,
                q3: 177,
                q4: 173,
                currentLocal: 0,
                currentKorean: 101,
                previousMonth: 100,
                currentMonth: 101,
                change: 1,
                groupCategory: '국내'
              },
              {
                company_name: '하나로넷',
                q1: 522,
                q2: 522,
                q3: 525,
                q4: 525,
                currentLocal: 0,
                currentKorean: 524,
                previousMonth: 524,
                currentMonth: 524,
                change: 0,
                groupCategory: '국내'
              },
              {
                company_name: '하나로에이',
                q1: 117,
                q2: 120,
                q3: 119,
                q4: 121,
                currentLocal: 0,
                currentKorean: 133,
                previousMonth: 113,
                currentMonth: 133,
                change: 0,
                groupCategory: '국내'
              },
              {
                company_name: '중국',
                q1: 370,
                q2: 371,
                q3: 377,
                q4: 365,
                currentLocal: 348,
                currentKorean: 11,
                previousMonth: 359,
                currentMonth: 359,
                change: 0,
                groupCategory: '해외'
              },
              {
                company_name: '유럽',
                q1: 168,
                q2: 163,
                q3: 161,
                q4: 168,
                currentLocal: 112,
                currentKorean: 57,
                previousMonth: 170,
                currentMonth: 169,
                change: -1,
                groupCategory: '해외'
              },
              {
                company_name: '아시아',
                q1: 407,
                q2: 400,
                q3: 386,
                q4: 378,
                currentLocal: 314,
                currentKorean: 27,
                previousMonth: 348,
                currentMonth: 341,
                change: -7,
                groupCategory: '해외'
              },
              {
                company_name: '기타(중동+미국)',
                q1: 28,
                q2: 27,
                q3: 26,
                q4: 26,
                currentLocal: 2,
                currentKorean: 22,
                previousMonth: 23,
                currentMonth: 24,
                change: 1,
                groupCategory: '해외'
              },
              {
                company_name: '소계',
                q1: 973,
                q2: 961,
                q3: 950,
                q4: 937,
                currentLocal: 776,
                currentKorean: 117,
                previousMonth: 900,
                currentMonth: 893,
                change: -7,
                groupCategory: '해외'
              },
              {
                company_name: '총계',
                q1: 2025,
                q2: 2000,
                q3: 1951,
                q4: 1933,
                currentLocal: 776,
                currentKorean: 1033,
                previousMonth: 1815,
                currentMonth: 1809,
                change: -6,
                groupCategory: ''
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      // ⭐ 9월 조건 체크 - 템프 데이터 사용 (8월과 동일한 값)
      if (currentMonth === 9) {
        console.log('🎯 9월 데이터: 템프 데이터를 사용합니다. (인사 현황)');
        
        const tempData: PersonnelData = {
          // 상단 4개 KPI 카드 (우측 → 좌측 순서)
          kpiMetrics: {
            headquarters: 158,                    // 7: 본사 (좌측 끝)
            headquartersChange: 0,              // 8: 본사 변화
            domesticSubsidiaries: 758,            // 5: 국내 계열사 (우측에서 3번째)
            domesticSubsidiariesChange: 1,      // 6: 국내 계열사 변화
            overseasSubsidiaries: 893,            // 3: 해외 계열사 (우측에서 2번째)
            overseasSubsidiariesChange: -7,      // 4: 해외 계열사 변화
            total: 1809,                           // 1: 총 인원 (우측 끝)
            totalChange: -6                      // 2: 총 인원 변화
          },
          // 하단 테이블 (좌측 → 우측, 상단 → 하단) - 첫 번째 불필요한 "소계" 행 제거
          gridData: {
            divisions: [
              {
                company_name: '하나로TNS',
                q1: 185,
                q2: 174,
                q3: 178,
                q4: 175,
                currentLocal: 0,
                currentKorean: 154,
                previousMonth: 158,
                currentMonth: 154,
                change: -4,
                groupCategory: '국내'
              },
              {
                company_name: '하나로S',
                q1: 225,
                q2: 220,
                q3: 177,
                q4: 173,
                currentLocal: 0,
                currentKorean: 103,
                previousMonth: 101,
                currentMonth: 103,
                change: 2,
                groupCategory: '국내'
              },
              {
                company_name: '하나로넷',
                q1: 522,
                q2: 522,
                q3: 525,
                q4: 525,
                currentLocal: 0,
                currentKorean: 525,
                previousMonth: 524,
                currentMonth: 525,
                change: 1,
                groupCategory: '국내'
              },
              {
                company_name: '하나로에이',
                q1: 117,
                q2: 120,
                q3: 119,
                q4: 121,
                currentLocal: 0,
                currentKorean: 132,
                previousMonth: 133,
                currentMonth: 132,
                change: -1,
                groupCategory: '국내'
              },
              {
                company_name: '소계',
                q1: 1049,
                q2: 1036,
                q3: 999,
                q4: 994,
                currentLocal: 0,
                currentKorean: 914,
                previousMonth: 916,
                currentMonth: 914,
                change: -2,
                groupCategory: '국내'
              },
              {
                company_name: '중국',
                q1: 370,
                q2: 371,
                q3: 377,
                q4: 365,
                currentLocal: 348,
                currentKorean: 12,
                previousMonth: 359,
                currentMonth: 360,
                change: 1,
                groupCategory: '해외'
              },
              {
                company_name: '유럽',
                q1: 168,
                q2: 163,
                q3: 161,
                q4: 168,
                currentLocal: 113,
                currentKorean: 57,
                previousMonth: 169,
                currentMonth: 170,
                change: 1,
                groupCategory: '해외'
              },
              {
                company_name: '아시아',
                q1: 407,
                q2: 400,
                q3: 386,
                q4: 378,
                currentLocal: 316,
                currentKorean: 27,
                previousMonth: 341,
                currentMonth: 343,
                change: 2,
                groupCategory: '해외'
              },
              {
                company_name: '기타(중동+미국)',
                q1: 28,
                q2: 27,
                q3: 26,
                q4: 26,
                currentLocal: 2,
                currentKorean: 22,
                previousMonth: 24,
                currentMonth: 24,
                change: 0,
                groupCategory: '해외'
              },
              {
                company_name: '소계',
                q1: 973,
                q2: 961,
                q3: 950,
                q4: 937,
                currentLocal: 779,
                currentKorean: 118,
                previousMonth: 893,
                currentMonth: 897,
                change: 4,
                groupCategory: '해외'
              },
              {
                company_name: '총계',
                q1: 2025,
                q2: 2000,
                q3: 1951,
                q4: 1933,
                currentLocal: 779,
                currentKorean: 1032,
                previousMonth: 1809,
                currentMonth: 1811,
                change: 2,
                groupCategory: ''
              }
            ]
          }
        };
        
        set({ data: tempData, loading: false, error: null });
        return; // API 호출 없이 리턴
      }
      
      // ⭐ 10월 조건 체크 - 템프 데이터 사용 (1부터 시작해서 순차적으로 증가)
      if (currentMonth === 10) {
        console.log('🎯 10월 데이터: 템프 데이터를 사용합니다. (인사 현황)');
        
        const tempData: PersonnelData = {
          // 상단 4개 KPI 카드 (우측 → 좌측 순서)
          kpiMetrics: {
            headquarters: 1,                    // 7: 본사 (좌측 끝)
            headquartersChange: 2,              // 8: 본사 변화
            domesticSubsidiaries: 3,            // 5: 국내 계열사 (우측에서 3번째)
            domesticSubsidiariesChange: 4,      // 6: 국내 계열사 변화
            overseasSubsidiaries: 5,            // 3: 해외 계열사 (우측에서 2번째)
            overseasSubsidiariesChange: 6,      // 4: 해외 계열사 변화
            total: 7,                           // 1: 총 인원 (우측 끝)
            totalChange: 8                      // 2: 총 인원 변화
          },
          // 하단 테이블 (좌측 → 우측, 상단 → 하단) - 첫 번째 불필요한 "소계" 행 제거
          gridData: {
            divisions: [
              {
                company_name: '하나로TNS',
                q1: 9,
                q2: 10,
                q3: 11,
                q4: 12,
                currentLocal: 13,
                currentKorean: 14,
                previousMonth: 15,
                currentMonth: 16,
                change: 17,
                groupCategory: '국내'
              },
              {
                company_name: '하나로S',
                q1: 18,
                q2: 19,
                q3: 20,
                q4: 21,
                currentLocal: 22,
                currentKorean: 23,
                previousMonth: 24,
                currentMonth: 25,
                change: 26,
                groupCategory: '국내'
              },
              {
                company_name: '하나로넷',
                q1: 27,
                q2: 28,
                q3: 29,
                q4: 30,
                currentLocal: 31,
                currentKorean: 32,
                previousMonth: 33,
                currentMonth: 34,
                change: 35,
                groupCategory: '국내'
              },
              {
                company_name: '하나로에이',
                q1: 36,
                q2: 37,
                q3: 38,
                q4: 39,
                currentLocal: 40,
                currentKorean: 41,
                previousMonth: 42,
                currentMonth: 43,
                change: 44,
                groupCategory: '국내'
              },
              {
                company_name: '소계',
                q1: 45,
                q2: 46,
                q3: 47,
                q4: 48,
                currentLocal: 49,
                currentKorean: 50,
                previousMonth: 51,
                currentMonth: 52,
                change: 53,
                groupCategory: '국내'
              },
              {
                company_name: '중국',
                q1: 54,
                q2: 55,
                q3: 56,
                q4: 57,
                currentLocal: 58,
                currentKorean: 59,
                previousMonth: 60,
                currentMonth: 61,
                change: 62,
                groupCategory: '해외'
              },
              {
                company_name: '유럽',
                q1: 63,
                q2: 64,
                q3: 65,
                q4: 66,
                currentLocal: 67,
                currentKorean: 68,
                previousMonth: 69,
                currentMonth: 70,
                change: 71,
                groupCategory: '해외'
              },
              {
                company_name: '아시아',
                q1: 72,
                q2: 73,
                q3: 74,
                q4: 75,
                currentLocal: 76,
                currentKorean: 77,
                previousMonth: 78,
                currentMonth: 79,
                change: 80,
                groupCategory: '해외'
              },
              {
                company_name: '기타(중동+미국)',
                q1: 81,
                q2: 82,
                q3: 83,
                q4: 84,
                currentLocal: 85,
                currentKorean: 86,
                previousMonth: 87,
                currentMonth: 88,
                change: 89,
                groupCategory: '해외'
              },
              {
                company_name: '소계',
                q1: 90,
                q2: 91,
                q3: 92,
                q4: 93,
                currentLocal: 94,
                currentKorean: 95,
                previousMonth: 96,
                currentMonth: 97,
                change: 98,
                groupCategory: '해외'
              },
              {
                company_name: '총계',
                q1: 99,
                q2: 100,
                q3: 101,
                q4: 102,
                currentLocal: 103,
                currentKorean: 104,
                previousMonth: 105,
                currentMonth: 106,
                change: 107,
                groupCategory: ''
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
        const [kpiMetrics, gridData] = await Promise.all([
          personnel_header(currentYear, currentMonth),
          personnel_grid(currentYear, currentMonth)
        ]);

        const combinedData: PersonnelData = {
          kpiMetrics,
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
