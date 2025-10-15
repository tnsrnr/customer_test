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
                company_name: '하나로인터내셔널',
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
                company_name: '소계',
                q1: 54,
                q2: 55,
                q3: 56,
                q4: 57,
                currentLocal: 58,
                currentKorean: 59,
                previousMonth: 60,
                currentMonth: 61,
                change: 62,
                groupCategory: '국내'
              },
              {
                company_name: '중국',
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
                company_name: '유럽',
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
                company_name: '아시아',
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
                company_name: '기타(중국+미국)',
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
                company_name: '소계',
                q1: 99,
                q2: 100,
                q3: 101,
                q4: 102,
                currentLocal: 103,
                currentKorean: 104,
                previousMonth: 105,
                currentMonth: 106,
                change: 107,
                groupCategory: '해외'
              },
              {
                company_name: '총계',
                q1: 108,
                q2: 109,
                q3: 110,
                q4: 111,
                currentLocal: 112,
                currentKorean: 113,
                previousMonth: 114,
                currentMonth: 115,
                change: 116,
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
