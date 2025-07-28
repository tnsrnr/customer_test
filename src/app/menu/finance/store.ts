import { create } from 'zustand';
import { FinanceData } from './types';

// API 호출 함수
const fetchFinanceAPI = async () => {
  const sessionData = localStorage.getItem('htns-session');
  if (!sessionData) {
    throw new Error('세션이 없습니다.');
  }

  const session = JSON.parse(sessionData);
  
  const response = await fetch('/auth/api/proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'ajax': 'true'
    },
    body: JSON.stringify({
      url: '/MIS030231SVC/getTest1', // 실제 재무 API 엔드포인트로 변경 필요
      method: 'POST',
      data: {
        // API 요청 파라미터
        param1: 'value1',
        param2: 'value2'
      },
      jsessionId: session.jsessionId,
      csrfToken: session.csrfToken
    })
  });

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

// API 응답을 FinanceData로 파싱하는 함수
const parseFinanceData = (apiResponse: any): FinanceData => {
  // API 응답 구조에 따라 파싱 로직 구현
  // 예시: apiResponse.data를 FinanceData 형태로 변환
  return {
    topChart: {
      labels: apiResponse.data?.labels || ['1월', '2월', '3월', '4월', '5월'],
      capital: apiResponse.data?.capital || [1200, 1250, 1300, 1280, 1350],
      debt: apiResponse.data?.debt || [800, 850, 900, 880, 920],
      assets: apiResponse.data?.assets || [2000, 2100, 2200, 2160, 2270]
    },
    rightTopChart: {
      labels: apiResponse.data?.labels || ['1월', '2월', '3월', '4월', '5월'],
      shortTermLoan: apiResponse.data?.shortTermLoan || [300, 320, 350, 340, 360],
      longTermLoan: apiResponse.data?.longTermLoan || [500, 530, 550, 540, 560]
    },
    bottomChart: {
      labels: apiResponse.data?.labels || ['1월', '2월', '3월', '4월', '5월'],
      totalLoan: apiResponse.data?.totalLoan || [800, 850, 900, 880, 920],
      debtRatio: apiResponse.data?.debtRatio || [40, 40.5, 40.9, 40.7, 40.5]
    }
  };
};

// 임시 목 데이터 (API 개발 중일 때 사용)
const getMockFinanceData = (): FinanceData => {
  return {
    topChart: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      capital: [1200, 1250, 1300, 1280, 1350],
      debt: [800, 850, 900, 880, 920],
      assets: [2000, 2100, 2200, 2160, 2270]
    },
    rightTopChart: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      shortTermLoan: [300, 320, 350, 340, 360],
      longTermLoan: [500, 530, 550, 540, 560]
    },
    bottomChart: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      totalLoan: [800, 850, 900, 880, 920],
      debtRatio: [40, 40.5, 40.9, 40.7, 40.5]
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

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  // 초기 상태
  data: null,
  loading: false,
  error: null,
  
  // 재무 데이터 조회
  fetchFinanceData: async () => {
    try {
      set({ loading: true, error: null });
      
      // 실제 API 호출 (개발 완료 후 활성화)
      // const apiData = await fetchFinanceAPI();
      // const data = parseFinanceData(apiData);
      
      // 임시로 목 데이터 사용
      const data = getMockFinanceData();
      
      set({ data, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '데이터 조회에 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },
  
  // 데이터 설정
  setData: (data) => set({ data }),
  
  // 로딩 상태 설정
  setLoading: (loading) => set({ loading }),
  
  // 에러 설정
  setError: (error) => set({ error }),
  
  // 상태 초기화
  reset: () => set({ data: null, loading: false, error: null }),
})); 