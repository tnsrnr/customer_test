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
const fetchTopClientsAPI = async (year: number, month: number) => {
  try {
    const params = createParams(year, month);
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
    set({ selectedTab: tab, selectedClient: '' });
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

      const backendData = await fetchTopClientsAPI(year, month);
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
      data: [
        { 
          name: "삼성전자", 
          sales: 850, 
          profit: 120, 
          progressCount: 2500, 
          salesManager: "김영업", 
          trend: "증가", 
          mainItems: "반도체",
          comparison: {
            prevMonth: {
              sales: 820,
              profit: 115,
              progressCount: 2400,
              salesManager: "김영업"
            },
            prevYear: {
              sales: 780,
              profit: 108,
              progressCount: 2300,
              salesManager: "김영업"
            }
          },
          monthlyData: {
            sales: [794, 1241, 74, 56, 65],
            profit: [120, 180, 11, 8, 10],
            salesManager: ["김영업", "김영업", "김영업", "김영업", "김영업"]
          }
        },
        { name: "LG전자", sales: 680, profit: 95, progressCount: 2100, salesManager: "이영업", trend: "유지", mainItems: "전자부품", comparison: { prevMonth: { sales: 670, profit: 92, progressCount: 2050, salesManager: "이영업" }, prevYear: { sales: 650, profit: 88, progressCount: 2000, salesManager: "이영업" } }, monthlyData: { sales: [670, 92, 2050, 13.8], profit: [92, 13.8], salesManager: ["이영업", "이영업", "이영업", "이영업", "이영업"] } },
        { name: "SK하이닉스", sales: 520, profit: 75, progressCount: 1800, salesManager: "박영업", trend: "증가", mainItems: "반도체", comparison: { prevMonth: { sales: 510, profit: 72, progressCount: 1780, salesManager: "박영업" }, prevYear: { sales: 500, profit: 70, progressCount: 1750, salesManager: "박영업" } }, monthlyData: { sales: [510, 72, 1780, 14.3], profit: [72, 14.3], salesManager: ["박영업", "박영업", "박영업", "박영업", "박영업"] } },
        { name: "현대모비스", sales: 420, profit: 58, progressCount: 1500, salesManager: "최영업", trend: "감소", mainItems: "자동차부품", comparison: { prevMonth: { sales: 430, profit: 60, progressCount: 1520, salesManager: "최영업" }, prevYear: { sales: 410, profit: 57, progressCount: 1480, salesManager: "최영업" } }, monthlyData: { sales: [430, 60, 1520, 13.9], profit: [60, 13.9], salesManager: ["최영업", "최영업", "최영업", "최영업", "최영업"] } },
        { name: "LG디스플레이", sales: 380, profit: 52, progressCount: 1300, salesManager: "정영업", trend: "유지", mainItems: "디스플레이", comparison: { prevMonth: { sales: 375, profit: 51, progressCount: 1290, salesManager: "정영업" }, prevYear: { sales: 370, profit: 50, progressCount: 1280, salesManager: "정영업" } }, monthlyData: { sales: [375, 51, 1290, 13.6], profit: [51, 13.6], salesManager: ["정영업", "정영업", "정영업", "정영업", "정영업"] } }
      ]
    },
    '항공수입': {
      title: '항공수입 상위거래처',
      iconName: 'Plane',
      color: 'purple',
      data: [
        { name: "애플", sales: 920, profit: 135, progressCount: 2800, salesManager: "김영업", trend: "증가", mainItems: "전자제품", comparison: { prevMonth: { sales: 900, profit: 132, progressCount: 2780, salesManager: "김영업" }, prevYear: { sales: 880, profit: 128, progressCount: 2750, salesManager: "김영업" } }, monthlyData: { sales: [900, 132, 2780, 14.6], profit: [132, 14.6], salesManager: ["김영업", "김영업", "김영업", "김영업", "김영업"] } },
        { name: "퀄컴", sales: 750, profit: 108, progressCount: 2300, salesManager: "이영업", trend: "유지", mainItems: "반도체", comparison: { prevMonth: { sales: 740, profit: 106, progressCount: 2280, salesManager: "이영업" }, prevYear: { sales: 730, profit: 104, progressCount: 2250, salesManager: "이영업" } }, monthlyData: { sales: [740, 106, 2280, 14.3], profit: [106, 14.3], salesManager: ["이영업", "이영업", "이영업", "이영업", "이영업"] } },
        { name: "인텔", sales: 580, profit: 82, progressCount: 1900, salesManager: "박영업", trend: "감소", mainItems: "반도체", comparison: { prevMonth: { sales: 590, profit: 84, progressCount: 1920, salesManager: "박영업" }, prevYear: { sales: 570, profit: 80, progressCount: 1880, salesManager: "박영업" } }, monthlyData: { sales: [590, 84, 1920, 14.2], profit: [84, 14.2], salesManager: ["박영업", "박영업", "박영업", "박영업", "박영업"] } },
        { name: "테슬라", sales: 450, profit: 63, progressCount: 1600, salesManager: "최영업", trend: "증가", mainItems: "자동차부품", comparison: { prevMonth: { sales: 440, profit: 61, progressCount: 1580, salesManager: "최영업" }, prevYear: { sales: 430, profit: 59, progressCount: 1560, salesManager: "최영업" } }, monthlyData: { sales: [440, 61, 1580, 13.9], profit: [61, 13.9], salesManager: ["최영업", "최영업", "최영업", "최영업", "최영업"] } },
        { name: "AMD", sales: 400, profit: 56, progressCount: 1400, salesManager: "정영업", trend: "유지", mainItems: "반도체", comparison: { prevMonth: { sales: 395, profit: 55, progressCount: 1390, salesManager: "정영업" }, prevYear: { sales: 390, profit: 54, progressCount: 1380, salesManager: "정영업" } }, monthlyData: { sales: [395, 55, 1390, 13.9], profit: [55, 13.9], salesManager: ["정영업", "정영업", "정영업", "정영업", "정영업"] } }
      ]
    },
    '해상수출': {
      title: '해상수출 상위거래처',
      iconName: 'Ship',
      color: 'emerald',
      data: [
        { name: "현대자동차", sales: 1100, profit: 165, progressCount: 3500, salesManager: "김영업", trend: "증가", mainItems: "완성차", comparison: { prevMonth: { sales: 1080, profit: 162, progressCount: 3480, salesManager: "김영업" }, prevYear: { sales: 1050, profit: 158, progressCount: 3450, salesManager: "김영업" } }, monthlyData: { sales: [1080, 162, 3480, 14.9], profit: [162, 14.9], salesManager: ["김영업", "김영업", "김영업", "김영업", "김영업"] } },
        { name: "포스코", sales: 950, profit: 142, progressCount: 3200, salesManager: "이영업", trend: "유지", mainItems: "철강", comparison: { prevMonth: { sales: 940, profit: 140, progressCount: 3180, salesManager: "이영업" }, prevYear: { sales: 930, profit: 138, progressCount: 3160, salesManager: "이영업" } }, monthlyData: { sales: [940, 140, 3180, 14.8], profit: [140, 14.8], salesManager: ["이영업", "이영업", "이영업", "이영업", "이영업"] } },
        { name: "기아자동차", sales: 820, profit: 123, progressCount: 2900, salesManager: "박영업", trend: "증가", mainItems: "완성차", comparison: { prevMonth: { sales: 810, profit: 121, progressCount: 2880, salesManager: "박영업" }, prevYear: { sales: 800, profit: 120, progressCount: 2860, salesManager: "박영업" } }, monthlyData: { sales: [810, 121, 2880, 14.9], profit: [121, 14.9], salesManager: ["박영업", "박영업", "박영업", "박영업", "박영업"] } },
        { name: "삼성전자", sales: 750, profit: 112, progressCount: 2700, salesManager: "최영업", trend: "유지", mainItems: "가전제품", comparison: { prevMonth: { sales: 745, profit: 111, progressCount: 2690, salesManager: "최영업" }, prevYear: { sales: 740, profit: 110, progressCount: 2680, salesManager: "최영업" } }, monthlyData: { sales: [745, 111, 2690, 14.8], profit: [111, 14.8], salesManager: ["최영업", "최영업", "최영업", "최영업", "최영업"] } },
        { name: "LG전자", sales: 680, profit: 102, progressCount: 2500, salesManager: "정영업", trend: "증가", mainItems: "가전제품", comparison: { prevMonth: { sales: 675, profit: 101, progressCount: 2490, salesManager: "정영업" }, prevYear: { sales: 670, profit: 100, progressCount: 2480, salesManager: "정영업" } }, monthlyData: { sales: [675, 101, 2490, 14.9], profit: [101, 14.9], salesManager: ["정영업", "정영업", "정영업", "정영업", "정영업"] } }
      ]
    },
    '해상수입': {
      title: '해상수입 상위거래처',
      iconName: 'Ship',
      color: 'cyan',
      data: [
        { name: "쉘", sales: 980, profit: 147, progressCount: 3300, salesManager: "김영업", trend: "증가", mainItems: "원유", comparison: { prevMonth: { sales: 970, profit: 145, progressCount: 3280, salesManager: "김영업" }, prevYear: { sales: 960, profit: 143, progressCount: 3260, salesManager: "김영업" } }, monthlyData: { sales: [970, 145, 3280, 14.9], profit: [145, 14.9], salesManager: ["김영업", "김영업", "김영업", "김영업", "김영업"] } },
        { name: "엑손모빌", sales: 850, profit: 127, progressCount: 3000, salesManager: "이영업", trend: "유지", mainItems: "석유제품", comparison: { prevMonth: { sales: 840, profit: 125, progressCount: 2980, salesManager: "이영업" }, prevYear: { sales: 830, profit: 123, progressCount: 2960, salesManager: "이영업" } }, monthlyData: { sales: [840, 125, 2980, 14.8], profit: [125, 14.8], salesManager: ["이영업", "이영업", "이영업", "이영업", "이영업"] } },
        { name: "BP", sales: 720, profit: 108, progressCount: 2700, salesManager: "박영업", trend: "증가", mainItems: "원유", comparison: { prevMonth: { sales: 710, profit: 106, progressCount: 2680, salesManager: "박영업" }, prevYear: { sales: 700, profit: 104, progressCount: 2660, salesManager: "박영업" } }, monthlyData: { sales: [710, 106, 2680, 14.9], profit: [106, 14.9], salesManager: ["박영업", "박영업", "박영업", "박영업", "박영업"] } },
        { name: "토탈", sales: 650, profit: 97, progressCount: 2500, salesManager: "최영업", trend: "유지", mainItems: "석유제품", comparison: { prevMonth: { sales: 645, profit: 96, progressCount: 2490, salesManager: "최영업" }, prevYear: { sales: 640, profit: 95, progressCount: 2480, salesManager: "최영업" } }, monthlyData: { sales: [645, 96, 2490, 14.8], profit: [96, 14.8], salesManager: ["최영업", "최영업", "최영업", "최영업", "최영업"] } },
        { name: "발레", sales: 580, profit: 87, progressCount: 2300, salesManager: "정영업", trend: "감소", mainItems: "철광석", comparison: { prevMonth: { sales: 575, profit: 86, progressCount: 2290, salesManager: "정영업" }, prevYear: { sales: 570, profit: 85, progressCount: 2280, salesManager: "정영업" } }, monthlyData: { sales: [575, 86, 2290, 14.9], profit: [86, 14.9], salesManager: ["정영업", "정영업", "정영업", "정영업", "정영업"] } }
      ]
    },
    '운송': {
      title: '운송 상위거래처',
      iconName: 'Truck',
      color: 'amber',
      data: [
        { name: "이마트", sales: 580, profit: 87, progressCount: 2200, salesManager: "김영업", trend: "증가", mainItems: "유통", comparison: { prevMonth: { sales: 575, profit: 86, progressCount: 2190, salesManager: "김영업" }, prevYear: { sales: 570, profit: 85, progressCount: 2180, salesManager: "김영업" } }, monthlyData: { sales: [575, 86, 2190, 14.9], profit: [86, 14.9], salesManager: ["김영업", "김영업", "김영업", "김영업", "김영업"] } },
        { name: "홈플러스", sales: 520, profit: 78, progressCount: 2000, salesManager: "이영업", trend: "유지", mainItems: "유통", comparison: { prevMonth: { sales: 515, profit: 77, progressCount: 1990, salesManager: "이영업" }, prevYear: { sales: 510, profit: 76, progressCount: 1980, salesManager: "이영업" } }, monthlyData: { sales: [515, 77, 1990, 14.9], profit: [77, 14.9], salesManager: ["이영업", "이영업", "이영업", "이영업", "이영업"] } },
        { name: "롯데마트", sales: 480, profit: 72, progressCount: 1900, salesManager: "박영업", trend: "증가", mainItems: "유통", comparison: { prevMonth: { sales: 475, profit: 71, progressCount: 1890, salesManager: "박영업" }, prevYear: { sales: 470, profit: 70, progressCount: 1880, salesManager: "박영업" } }, monthlyData: { sales: [475, 71, 1890, 14.9], profit: [71, 14.9], salesManager: ["박영업", "박영업", "박영업", "박영업", "박영업"] } },
        { name: "쿠팡", sales: 450, profit: 67, progressCount: 1800, salesManager: "최영업", trend: "증가", mainItems: "이커머스", comparison: { prevMonth: { sales: 445, profit: 66, progressCount: 1790, salesManager: "최영업" }, prevYear: { sales: 440, profit: 65, progressCount: 1780, salesManager: "최영업" } }, monthlyData: { sales: [445, 66, 1790, 14.8], profit: [66, 14.8], salesManager: ["최영업", "최영업", "최영업", "최영업", "최영업"] } },
        { name: "농협", sales: 420, profit: 63, progressCount: 1700, salesManager: "정영업", trend: "유지", mainItems: "유통", comparison: { prevMonth: { sales: 415, profit: 62, progressCount: 1690, salesManager: "정영업" }, prevYear: { sales: 410, profit: 61, progressCount: 1680, salesManager: "정영업" } }, monthlyData: { sales: [415, 62, 1690, 14.9], profit: [62, 14.9], salesManager: ["정영업", "정영업", "정영업", "정영업", "정영업"] } }
      ]
    },
    '철도': {
      title: '철도 상위거래처',
      iconName: 'Train',
      color: 'red',
      data: [
        { name: "한국철도공사", sales: 320, profit: 48, progressCount: 1200, salesManager: "김영업", trend: "증가", mainItems: "철도운송", comparison: { prevMonth: { sales: 315, profit: 47, progressCount: 1190, salesManager: "김영업" }, prevYear: { sales: 310, profit: 46, progressCount: 1180, salesManager: "김영업" } }, monthlyData: { sales: [315, 47, 1190, 14.9], profit: [47, 14.9], salesManager: ["김영업", "김영업", "김영업", "김영업", "김영업"] } },
        { name: "포스코", sales: 280, profit: 42, progressCount: 1000, salesManager: "이영업", trend: "유지", mainItems: "철강운송", comparison: { prevMonth: { sales: 275, profit: 41, progressCount: 990, salesManager: "이영업" }, prevYear: { sales: 270, profit: 40, progressCount: 980, salesManager: "이영업" } }, monthlyData: { sales: [275, 41, 990, 14.9], profit: [41, 14.9], salesManager: ["이영업", "이영업", "이영업", "이영업", "이영업"] } },
        { name: "현대제철", sales: 250, profit: 37, progressCount: 900, salesManager: "박영업", trend: "증가", mainItems: "철강운송", comparison: { prevMonth: { sales: 245, profit: 36, progressCount: 890, salesManager: "박영업" }, prevYear: { sales: 240, profit: 35, progressCount: 880, salesManager: "박영업" } }, monthlyData: { sales: [245, 36, 890, 14.7], profit: [36, 14.7], salesManager: ["박영업", "박영업", "박영업", "박영업", "박영업"] } },
        { name: "동부제철", sales: 220, profit: 33, progressCount: 800, salesManager: "최영업", trend: "유지", mainItems: "철강운송", comparison: { prevMonth: { sales: 215, profit: 32, progressCount: 790, salesManager: "최영업" }, prevYear: { sales: 210, profit: 31, progressCount: 780, salesManager: "최영업" } }, monthlyData: { sales: [215, 32, 790, 14.9], profit: [32, 14.9], salesManager: ["최영업", "최영업", "최영업", "최영업", "최영업"] } },
        { name: "세아제철", sales: 200, profit: 30, progressCount: 750, salesManager: "정영업", trend: "감소", mainItems: "철강운송", comparison: { prevMonth: { sales: 195, profit: 29, progressCount: 740, salesManager: "정영업" }, prevYear: { sales: 190, profit: 28, progressCount: 730, salesManager: "정영업" } }, monthlyData: { sales: [195, 29, 740, 14.9], profit: [29, 14.9], salesManager: ["정영업", "정영업", "정영업", "정영업", "정영업"] } }
      ]
    }
  }
}));
