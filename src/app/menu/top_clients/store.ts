import { create } from 'zustand';
import { TransportType, TransportData, BackendClientData } from './types';
import { useGlobalStore } from '@/store/slices/global';

interface TopClientsStore {
  selectedTab: TransportType;
  selectedClient: string;
  showCharts: boolean;
  isInitialLoad: boolean;
  animatingTab: string | null;
  backendData: BackendClientData[] | null;
  loading: boolean;
  error: string | null;
  setSelectedTab: (tab: TransportType) => void;
  setSelectedClient: (client: string) => void;
  setShowCharts: (show: boolean) => void;
  setIsInitialLoad: (load: boolean) => void;
  setAnimatingTab: (tab: string | null) => void;
  fetchTopClientsData: () => Promise<void>;
  transportData: Record<TransportType, Omit<TransportData, 'icon'> & { iconName: string }>;
}

// 현재월 기준 12개월 생성 함수 (탑네비게이션 월에 따라 동적 생성)
const generateCurrentMonths = (selectedYear?: number, selectedMonth?: number): string[] => {
  const currentDate = new Date();
  const currentMonth = selectedMonth ? selectedMonth - 1 : currentDate.getMonth(); // 0-11
  const currentYear = selectedYear || currentDate.getFullYear();
  
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const months: string[] = [];
  
  // 선택된 월부터 12개월 전까지 역순으로 생성
  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const month = targetDate.getMonth();
    months.push(monthNames[month]);
  }
  
  return months;
};

// API 호출 함수
const fetchTopClientsAPI = async (year: number, month: number, funcCode: string) => {
  try {
    const params = createParams(year, month, funcCode);
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/top_clients', {
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
      return responseData.MIS030231;
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.warn('탑클라이언트 데이터 조회 실패:', error);
    throw error;
  }
};

// 공통 파라미터 생성 함수
function createParams(year: number, month: number, funcCode: string) {
  return {
    MIS030231F1: {
      BASE_YEAR: year.toString(),
      BASE_MONTH: month.toString().padStart(2, '0'),
      S_FUNC_CODE: funcCode,
      crudState: "I"
    },
    page: 1,
    start: 0,
    limit: 25,
    pageId: "MIS030231V"
  };
}

// TransportType을 S_FUNC_CODE로 매핑하는 함수
const getFuncCodeByTransportType = (transportType: TransportType): string => {
  const funcCodeMap = {
    '항공수출': 'AE',
    '항공수입': 'AI', 
    '해상수출': 'OE',
    '해상수입': 'OI',
    '운송': 'NT',
    '철도': 'RT'
  };
  return funcCodeMap[transportType];
};

// 백엔드 데이터를 프론트엔드 데이터로 변환하는 함수
const transformBackendDataToFrontend = (backendData: BackendClientData[], selectedYear: number, selectedMonth: number): Record<TransportType, Omit<TransportData, 'icon'> & { iconName: string }> => {
  // 탑네비게이션 월에 맞는 데이터 인덱스 계산
  const monthIndex = selectedMonth - 1; // 0-11 인덱스로 변환
  
  // 월별 데이터 매핑 (REV_MONTH1~12, PRF_MONTH1~12, CNT_MONTH1~12)
  const monthDataMapping = {
    REV: ['REV_MONTH1', 'REV_MONTH2', 'REV_MONTH3', 'REV_MONTH4', 'REV_MONTH5', 'REV_MONTH6', 
          'REV_MONTH7', 'REV_MONTH8', 'REV_MONTH9', 'REV_MONTH10', 'REV_MONTH11', 'REV_MONTH12'],
    PRF: ['PRF_MONTH1', 'PRF_MONTH2', 'PRF_MONTH3', 'PRF_MONTH4', 'PRF_MONTH5', 'PRF_MONTH6', 
          'PRF_MONTH7', 'PRF_MONTH8', 'PRF_MONTH9', 'PRF_MONTH10', 'PRF_MONTH11', 'PRF_MONTH12'],
    CNT: ['CNT_MONTH1', 'CNT_MONTH2', 'CNT_MONTH3', 'CNT_MONTH4', 'CNT_MONTH5', 'CNT_MONTH6', 
          'CNT_MONTH7', 'CNT_MONTH8', 'CNT_MONTH9', 'CNT_MONTH10', 'CNT_MONTH11', 'CNT_MONTH12']
  };

  // 백단 데이터를 백만원 단위로 변환하는 함수
  const convertToMillionWon = (value: number): number => {
    return Math.round((value || 0) / 1000000); // 백단 데이터를 1,000,000으로 나누어 백만 단위로 변환
  };

  // 현재 월 데이터와 이전 월 데이터 가져오기
  const currentMonthData = backendData.map(client => ({
    name: client.CUSTOMER_NAME,
    sales: convertToMillionWon(client[monthDataMapping.REV[monthIndex] as keyof BackendClientData] as number),
    profit: convertToMillionWon(client[monthDataMapping.PRF[monthIndex] as keyof BackendClientData] as number),
    progressCount: client[monthDataMapping.CNT[monthIndex] as keyof BackendClientData] as number || 0,
    salesManager: client.SALES_NAME_MASTER,
    trend: "증가", // 백엔드에서 제공되면 사용, 아니면 기본값
    mainItems: "기타", // 백엔드에서 제공되면 사용, 아니면 기본값
    comparison: {
      prevMonth: {
        sales: convertToMillionWon(client[monthDataMapping.REV[Math.max(0, monthIndex - 1)] as keyof BackendClientData] as number),
        profit: convertToMillionWon(client[monthDataMapping.PRF[Math.max(0, monthIndex - 1)] as keyof BackendClientData] as number),
        progressCount: client[monthDataMapping.CNT[Math.max(0, monthIndex - 1)] as keyof BackendClientData] as number || 0,
        salesManager: client.SALES_NAME_MASTER
      },
      prevYear: {
        sales: convertToMillionWon(client[monthDataMapping.REV[monthIndex] as keyof BackendClientData] as number), // 같은 월 작년 데이터
        profit: convertToMillionWon(client[monthDataMapping.PRF[monthIndex] as keyof BackendClientData] as number),
        progressCount: client[monthDataMapping.CNT[monthIndex] as keyof BackendClientData] as number || 0,
        salesManager: client.SALES_NAME_MASTER
      }
    },
    monthlyData: {
      sales: monthDataMapping.REV.map(key => convertToMillionWon(client[key as keyof BackendClientData] as number)),
      profit: monthDataMapping.PRF.map(key => convertToMillionWon(client[key as keyof BackendClientData] as number)),
      salesManager: Array(12).fill(client.SALES_NAME_MASTER)
    }
  }));

  // 매출 기준으로 상위 5개 정렬
  const top5Data = currentMonthData
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // TransportType별로 데이터 분류 (현재는 모든 데이터를 항공수출로 분류)
  // 실제로는 COMPANY_CODE나 다른 필드로 분류해야 함
  return {
    '항공수출': {
      title: '항공수출 상위거래처',
      iconName: 'Plane',
      color: 'blue',
      data: top5Data
    },
    '항공수입': {
      title: '항공수입 상위거래처',
      iconName: 'Plane',
      color: 'purple',
      data: top5Data
    },
    '해상수출': {
      title: '해상수출 상위거래처',
      iconName: 'Ship',
      color: 'emerald',
      data: top5Data
    },
    '해상수입': {
      title: '해상수입 상위거래처',
      iconName: 'Ship',
      color: 'cyan',
      data: top5Data
    },
    '운송': {
      title: '운송 상위거래처',
      iconName: 'Truck',
      color: 'amber',
      data: top5Data
    },
    '철도': {
      title: '철도 상위거래처',
      iconName: 'Train',
      color: 'red',
      data: top5Data
    }
  };
};

export const useTopClientsStore = create<TopClientsStore>((set, get) => ({
  selectedTab: '항공수출',
  selectedClient: '',
  showCharts: true,
  isInitialLoad: true,
  animatingTab: null,
  backendData: null,
  loading: false,
  error: null,

  setSelectedTab: (tab: TransportType) => {
    set({ selectedTab: tab });
    // 탭 변경 시 해당 탭의 데이터 조회
    const { selectedYear, selectedMonth } = useGlobalStore.getState();
    const year = selectedYear || new Date().getFullYear();
    const month = selectedMonth || new Date().getMonth() + 1;
    const funcCode = getFuncCodeByTransportType(tab);
    
    // 비동기로 데이터 조회
    fetchTopClientsAPI(year, month, funcCode)
      .then(backendData => {
        const transformedData = transformBackendDataToFrontend(backendData, year, month);
        set({ backendData, transportData: transformedData });
      })
      .catch(error => {
        console.warn('탭 변경 시 데이터 조회 실패:', error);
      });
  },

  setSelectedClient: (client: string) => {
    set({ selectedClient: client });
  },

  setShowCharts: (show: boolean) => {
    set({ showCharts: show });
  },

  setIsInitialLoad: (load: boolean) => {
    set({ isInitialLoad: load });
  },

  setAnimatingTab: (tab: string | null) => {
    set({ animatingTab: tab });
  },

  fetchTopClientsData: async () => {
    set({ loading: true, error: null });
    try {
      const { selectedYear, selectedMonth } = useGlobalStore.getState();
      const year = selectedYear || new Date().getFullYear();
      const month = selectedMonth || new Date().getMonth() + 1; // 1-12

      const funcCode = getFuncCodeByTransportType(get().selectedTab);
      const backendData = await fetchTopClientsAPI(year, month, funcCode);
      const transformedData = transformBackendDataToFrontend(backendData, year, month);
      set({ backendData, transportData: transformedData });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      set({ loading: false });
    }
  },

  transportData: {
    '항공수출': {
      title: '항공수출 상위거래처',
      iconName: 'Plane',
      color: 'blue',
      data: []
    },
    '항공수입': {
      title: '항공수입 상위거래처',
      iconName: 'Plane',
      color: 'purple',
      data: []
    },
    '해상수출': {
      title: '해상수출 상위거래처',
      iconName: 'Ship',
      color: 'emerald',
      data: []
    },
    '해상수입': {
      title: '해상수입 상위거래처',
      iconName: 'Ship',
      color: 'cyan',
      data: []
    },
    '운송': {
      title: '운송 상위거래처',
      iconName: 'Truck',
      color: 'amber',
      data: []
    },
    '철도': {
      title: '철도 상위거래처',
      iconName: 'Train',
      color: 'red',
      data: []
    }
  }
}));
