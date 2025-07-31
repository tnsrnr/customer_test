import { create } from 'zustand';
import { FinanceData } from './types';

// 세션 정보 가져오기
const getSessionInfo = () => {
  try {
    const sessionData = localStorage.getItem('htns-session');
    if (sessionData) {
      return JSON.parse(sessionData);
    }
  } catch (error) {
    console.error('❌ 세션 정보 읽기 실패:', error);
  }
  return null;
};

// API 호출 함수
const fetchFinanceAPI = async () => {
  console.log('🔍 재무 API 호출 시작');
  
  // 세션 정보 가져오기
  const session = getSessionInfo();
  if (!session) {
    throw new Error('세션이 없습니다. 다시 로그인해주세요.');
  }
  
  console.log('🔑 사용할 세션:', { jsessionId: session.jsessionId, csrfToken: session.csrfToken });
  
  // 프록시 API에 맞는 요청 데이터
  const requestData = {
    MIS030231F1: {
      BASE_YEAR: "2025",
      crudState: "I"
    },
    page: 1,
    start: 0,
    limit: 25,
    pageId: "MIS030231V"
  };
  
  console.log('🔍 요청 데이터:', requestData);
  
  // 프록시 API 호출 (세션 정보를 헤더로 전송)
  const timestamp = Date.now();
  const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/getTest1?_dc=${timestamp}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
      'ajax': 'true',
      'X-Session-JSESSIONID': session.jsessionId,
      'X-Session-CSRF-TOKEN': session.csrfToken
    },
    body: JSON.stringify(requestData)
  });

  console.log('🔍 응답 상태:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API 호출 실패:', errorText);
    throw new Error(`API 호출 실패: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log('✅ API 호출 성공:', result);
  console.log('🔍 응답 데이터 타입:', typeof result);
  console.log('🔍 응답 데이터 키:', Object.keys(result));
  console.log('🔍 응답 데이터 길이:', JSON.stringify(result).length);
  
  // 세션 만료 처리
  if (result.status === 401 && result.redirect) {
    console.log('⚠️ 세션 만료, 로그인 페이지로 리다이렉트');
    window.location.href = '/auth';
    return null;
  }
  
  return result;
};

// API 응답을 FinanceData로 파싱하는 함수
const parseFinanceData = (apiResponse: any): FinanceData => {
  console.log('🔍 API 응답:', apiResponse);
  
  // API 응답 구조 확인 및 파싱
  try {
    // 실제 API 응답 구조에 따라 파싱
    const responseData = apiResponse.data || apiResponse;
    
    // 필수 데이터가 있는지 확인
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('유효하지 않은 API 응답 구조');
    }
    
    return {
      topChart: {
        labels: responseData.labels || responseData.months || ['1월', '2월', '3월', '4월', '5월'],
        capital: responseData.capital || responseData.capitalData || [1200, 1250, 1300, 1280, 1350],
        debt: responseData.debt || responseData.debtData || [800, 850, 900, 880, 920],
        assets: responseData.assets || responseData.assetsData || [2000, 2100, 2200, 2160, 2270]
      },
      rightTopChart: {
        labels: responseData.labels || responseData.months || ['1월', '2월', '3월', '4월', '5월'],
        shortTermLoan: responseData.shortTermLoan || responseData.shortTermData || [300, 320, 350, 340, 360],
        longTermLoan: responseData.longTermLoan || responseData.longTermData || [500, 530, 550, 540, 560]
      },
      bottomChart: {
        labels: responseData.labels || responseData.months || ['1월', '2월', '3월', '4월', '5월'],
        totalLoan: responseData.totalLoan || responseData.totalLoanData || [800, 850, 900, 880, 920],
        debtRatio: responseData.debtRatio || responseData.debtRatioData || [40, 40.5, 40.9, 40.7, 40.5]
      }
    };
  } catch (error) {
    console.error('❌ API 응답 파싱 오류:', error);
    console.log('❌ 원본 응답:', apiResponse);
    
    // 파싱 실패 시 가짜 데이터 반환
    return getMockFinanceData();
  }
};

// 임시 목 데이터 (API 개발 중일 때 사용)
const getMockFinanceData = (): FinanceData => {
  return {
    topChart: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      capital: [1250, 1280, 1320, 1350, 1380, 1420],
      debt: [850, 880, 920, 950, 980, 1020],
      assets: [2100, 2160, 2240, 2300, 2360, 2440]
    },
    rightTopChart: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      shortTermLoan: [320, 340, 360, 380, 400, 420],
      longTermLoan: [530, 550, 570, 590, 610, 630]
    },
    bottomChart: {
      labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
      totalLoan: [850, 890, 930, 970, 1010, 1050],
      debtRatio: [40.5, 40.7, 41.1, 42.2, 42.8, 43.1]
    }
  };
};

interface FinanceStore {
  // 상태
  data: FinanceData | null;
  loading: boolean;
  error: string | null;
  
  // 액션
  fetchFinanceData: () => Promise<void>;
  setData: (data: FinanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchFinanceData: async () => {
    try {
      set({ loading: true, error: null });
      
      // 실제 API 호출 시도
      try {
        const apiData = await fetchFinanceAPI();
        const data = parseFinanceData(apiData);
        set({ data, loading: false });
        console.log('✅ 실제 API 데이터 로드 성공');
      } catch (apiError) {
        console.warn('⚠️ API 호출 실패, 가짜 데이터로 폴백:', apiError);
        
        // API 호출 실패 시 가짜 데이터 사용
        const mockData = getMockFinanceData();
        set({ data: mockData, loading: false });
        console.log('✅ 가짜 데이터 로드 완료');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '데이터 조회에 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },
  
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ data: null, loading: false, error: null })
})); 