import { create } from 'zustand';
import { DivisionData, DivisionMonthlyDetailData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

interface DivisionState {
  data: DivisionData | null;
  loading: boolean;
  error: string | null;
  selectedDivision: string | null;
  currentYear: number;
  currentMonth: number;
  displayYear: number;  // 화면에 표시할 년도
  displayMonth: number; // 화면에 표시할 월
  fetchDivisionData: () => Promise<void>;
  setSelectedDivision: (divisionId: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  updateDisplayDate: (year: number, month: number) => void;
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
  
  const months = [];
  
  // 선택된 월부터 12개월 전까지 역순으로 생성
  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const month = targetDate.getMonth();
    months.push(monthNames[month]);
  }
  
  return months;
};

// API 호출 함수
const fetchDivisionAPI = async (year: number, month: number) => {
  try {
    const params = createParams(year, month);
    const response = await fetch('/auth/api/proxy?path=/api/MIS030231SVC/division', {
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
    console.warn('부문별 데이터 조회 실패:', error);
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

// 백엔드 데이터로부터 부문별 실적 카드 생성 함수
const generateDivisionCardsFromBackend = (backendData: any[]) => {
  const divisionConfig = {
    '항공': {
      id: 'air',
      color: 'bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-200',
      icon: 'Plane',
      profitRate: -0.022 // -2.2%
    },
    '해상': {
      id: 'sea',
      color: 'bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10',
      borderColor: 'border-emerald-400/30',
      textColor: 'text-emerald-200',
      icon: 'Ship',
      profitRate: 0.002 // 0.2%
    },
    '운송': {
      id: 'transport',
      color: 'bg-gradient-to-br from-yellow-500/20 via-yellow-600/15 to-yellow-700/10',
      borderColor: 'border-yellow-400/30',
      textColor: 'text-yellow-200',
      icon: 'Truck',
      profitRate: 0.013 // 1.3%
    },
    '창고': {
      id: 'warehouse',
      color: 'bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10',
      borderColor: 'border-orange-400/30',
      textColor: 'text-orange-200',
      icon: 'Warehouse',
      profitRate: 0.013 // 1.3%
    },
    '도급': {
      id: 'construction',
      color: 'bg-gradient-to-br from-pink-500/20 via-pink-600/15 to-pink-700/10',
      borderColor: 'border-pink-400/30',
      textColor: 'text-pink-200',
      icon: 'Building',
      profitRate: 0.012 // 1.2%
    },
    '기타': {
      id: 'other',
      color: 'bg-gradient-to-br from-cyan-500/20 via-cyan-600/15 to-cyan-700/10',
      borderColor: 'border-cyan-400/30',
      textColor: 'text-cyan-200',
      icon: 'Package',
      profitRate: 0.006 // 0.6%
    }
  };

  // PARENT_DIVISION_TYPE별로 데이터 그룹화
  const divisionGroups = backendData.reduce((acc: any, item: any) => {
    const parentType = item.PARENT_DIVISION_TYPE;
    if (!acc[parentType]) {
      acc[parentType] = [];
    }
    acc[parentType].push(item);
    return acc;
  }, {});

  // 각 부문별로 카드 데이터 생성
  const cards = Object.keys(divisionGroups).map((parentType, index) => {
    const items = divisionGroups[parentType];
    
    
    // 매출 데이터 찾기
    const revenueItem = items.find((item: any) => item.DIVISION_TYPE === '매출');
    // 영업이익 데이터 찾기
    const profitItem = items.find((item: any) => item.DIVISION_TYPE === '영업이익');
    
    if (!revenueItem) {
      return null;
    }
    
    // 부문별 설정 (PARENT_DIVISION_TYPE 기준)
    const config = divisionConfig[parentType] || Object.values(divisionConfig)[index % Object.keys(divisionConfig).length];
    
    // 현재월과 전월 데이터 추출 (COLUMN12가 현재월, COLUMN11이 전월)
    const currentMonth = revenueItem.COLUMN12 || 0;
    const previousMonth = revenueItem.COLUMN11 || 0;
    
    // 매출 전월 比 계산
    const growth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;
    
    // 영업이익 (실제 데이터 사용 - COLUMN12 사용, 소수점 반올림)
    const profit = profitItem ? Math.round(profitItem.COLUMN12 || 0) : 0;

    const result = {
      id: config.id,
      name: parentType, // PARENT_DIVISION_TYPE 사용
      revenue: Math.round(currentMonth),
      growth: Math.round(growth),
      profit: Math.round(profit * 10) / 10, // 소수점 1자리
      color: config.color,
      borderColor: config.borderColor,
      textColor: config.textColor,
      icon: config.icon
    };
    
    return result;
  }).filter(Boolean);
  
  // 백엔드에 실제 데이터가 있는 부문만 반환
  
  return cards;
};

// 12개월 랜덤 매출 데이터 생성 함수
const generateRandomMonthlyData = (baseValue: number, variance: number = 0.3) => {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const randomFactor = 1 + (Math.random() - 0.5) * variance * 2;
    data.push(Math.round(baseValue * randomFactor));
  }
  return data;
};

// 백엔드 데이터 구조에 맞는 월별 상세 데이터 생성 함수
const generateMockDivisionMonthlyDetails = (selectedYear?: number, selectedMonth?: number): DivisionMonthlyDetailData[] => {
  const monthLabels = generateCurrentMonths(selectedYear, selectedMonth);
  
  // 부문별 기본 데이터 (백엔드 구조에 맞게)
  const divisions = [
    { parentType: '운송', divisionType: '항공', baseRevenue: 615 },
    { parentType: '운송', divisionType: '해상', baseRevenue: 203 },
    { parentType: '운송', divisionType: '운송', baseRevenue: 156 },
    { parentType: '물류', divisionType: '창고', baseRevenue: 89 },
    { parentType: '건설', divisionType: '도급', baseRevenue: 67 },
    { parentType: '기타', divisionType: '기타', baseRevenue: 52 }
  ];
  
  return divisions.map(division => {
    const revenueData = generateRandomMonthlyData(division.baseRevenue, 0.05);
    
    // 누계 계산
    const total = revenueData.reduce((sum, val) => sum + val, 0);
    
    return {
      PARENT_DIVISION_TYPE: division.parentType,
      DIVISION_TYPE: division.divisionType,
      COLUMN1: revenueData[0] || 0,
      COLUMN2: revenueData[1] || 0,
      COLUMN3: revenueData[2] || 0,
      COLUMN4: revenueData[3] || 0,
      COLUMN5: revenueData[4] || 0,
      COLUMN6: revenueData[5] || 0,
      COLUMN7: revenueData[6] || 0,
      COLUMN8: revenueData[7] || 0,
      COLUMN9: revenueData[8] || 0,
      COLUMN10: revenueData[9] || 0,
      COLUMN11: revenueData[10] || 0,
      COLUMN12: revenueData[11] || 0,
      COLUMN13: total
    };
  });
};

// 차트용 기존 데이터 구조 생성 함수
const generateMockDivisionTable = (selectedYear?: number, selectedMonth?: number) => {
  return {
    months: generateCurrentMonths(selectedYear, selectedMonth),
    divisions: [
      {
        name: '항공',
        color: 'blue',
        revenue: generateRandomMonthlyData(615, 0.05),
        profit: generateRandomMonthlyData(-3.3, 0.4)
      },
      {
        name: '해상',
        color: 'emerald',
        revenue: generateRandomMonthlyData(203, 0.08),
        profit: generateRandomMonthlyData(0.5, 0.3)
      },
      {
        name: '운송',
        color: 'purple',
        revenue: generateRandomMonthlyData(156, 0.06),
        profit: generateRandomMonthlyData(2.1, 0.2)
      },
      {
        name: '창고',
        color: 'orange',
        revenue: generateRandomMonthlyData(89, 0.07),
        profit: generateRandomMonthlyData(1.2, 0.3)
      },
      {
        name: '도급',
        color: 'pink',
        revenue: generateRandomMonthlyData(67, 0.08),
        profit: generateRandomMonthlyData(0.8, 0.4)
      },
      {
        name: '기타',
        color: 'cyan',
        revenue: generateRandomMonthlyData(52, 0.09),
        profit: generateRandomMonthlyData(0.3, 0.5)
      }
    ]
  };
};

// 데이터 파싱 함수
const parseDivisionData = (backendData: any, selectedYear?: number, selectedMonth?: number): DivisionData => {
  console.log('🔍 parseDivisionData 호출:', { 
    hasData: !!backendData, 
    isArray: Array.isArray(backendData), 
    dataLength: backendData?.length 
  });
  
  // 백엔드 데이터가 없으면 목 데이터 생성
  if (!backendData || !Array.isArray(backendData)) {
    console.log('⚠️ 백엔드 데이터 없음, 목 데이터 생성');
    const mockTableData = generateMockDivisionTable(selectedYear, selectedMonth);
    return {
      divisionCards: generateDivisionCardsFromBackend(generateMockDivisionMonthlyDetails(selectedYear, selectedMonth)),
      divisionTable: {
        monthlyDetails: generateMockDivisionMonthlyDetails(selectedYear, selectedMonth),
        monthLabels: generateCurrentMonths(selectedYear, selectedMonth),
        // 차트용 기존 데이터 구조도 함께 제공
        months: mockTableData.months,
        divisions: mockTableData.divisions
      }
    };
  }

  console.log('✅ 백엔드 데이터 처리 시작:', backendData.length, '개 항목');
  
  // 백엔드 데이터로부터 차트용 데이터 생성
  const chartData = generateChartDataFromBackend(backendData, selectedYear, selectedMonth);
  
  const result = {
    divisionCards: generateDivisionCardsFromBackend(backendData),
    divisionTable: {
      monthlyDetails: backendData,
      monthLabels: generateCurrentMonths(selectedYear, selectedMonth),
      // 차트용 기존 데이터 구조도 함께 제공
      months: chartData.months,
      divisions: chartData.divisions
    }
  };
  
  console.log('✅ 파싱 완료:', {
    cardsCount: result.divisionCards.length,
    tableDetailsCount: result.divisionTable.monthlyDetails.length,
    chartDivisionsCount: result.divisionTable.divisions.length
  });
  
  return result;
};

// 백엔드 데이터로부터 차트용 데이터 생성 함수
const generateChartDataFromBackend = (backendData: any[], selectedYear?: number, selectedMonth?: number) => {
  const months = generateCurrentMonths(selectedYear, selectedMonth);
  
  // PARENT_DIVISION_TYPE별로 데이터 그룹화
  const divisionGroups = backendData.reduce((acc: any, item: any) => {
    const parentType = item.PARENT_DIVISION_TYPE;
    if (!acc[parentType]) {
      acc[parentType] = [];
    }
    acc[parentType].push(item);
    return acc;
  }, {});
  
  // 각 부문별로 차트 데이터 생성 (실제 데이터가 있는 부문만)
  const divisions = Object.keys(divisionGroups).map((parentType, index) => {
    const items = divisionGroups[parentType];
    
    // 매출 데이터 찾기
    const revenueItem = items.find((item: any) => item.DIVISION_TYPE === '매출');
    // 영업이익 데이터 찾기
    const profitItem = items.find((item: any) => item.DIVISION_TYPE === '영업이익');
    
    // 색상 매핑 - 부문별 실적 카드와 동일하게
    const divisionConfig = {
      '항공': 'blue',
      '해상': 'emerald', 
      '운송': 'yellow',
      '창고': 'orange',
      '도급': 'pink',
      '기타': 'cyan'
    };
    const color = divisionConfig[parentType] || 'blue';
    
    return {
      name: parentType,
      color: color,
      revenue: revenueItem ? [
        revenueItem.COLUMN1 || 0,
        revenueItem.COLUMN2 || 0,
        revenueItem.COLUMN3 || 0,
        revenueItem.COLUMN4 || 0,
        revenueItem.COLUMN5 || 0,
        revenueItem.COLUMN6 || 0,
        revenueItem.COLUMN7 || 0,
        revenueItem.COLUMN8 || 0,
        revenueItem.COLUMN9 || 0,
        revenueItem.COLUMN10 || 0,
        revenueItem.COLUMN11 || 0,
        revenueItem.COLUMN12 || 0
      ] : Array(12).fill(0),
      profit: profitItem ? [
        profitItem.COLUMN1 || 0,
        profitItem.COLUMN2 || 0,
        profitItem.COLUMN3 || 0,
        profitItem.COLUMN4 || 0,
        profitItem.COLUMN5 || 0,
        profitItem.COLUMN6 || 0,
        profitItem.COLUMN7 || 0,
        profitItem.COLUMN8 || 0,
        profitItem.COLUMN9 || 0,
        profitItem.COLUMN10 || 0,
        profitItem.COLUMN11 || 0,
        profitItem.COLUMN12 || 0
      ] : Array(12).fill(0)
    };
  });
  
  return { months, divisions };
};

// Zustand store
export const useDivisionStore = create<DivisionState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  selectedDivision: null,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  displayYear: new Date().getFullYear(),
  displayMonth: new Date().getMonth() + 1,
  
  fetchDivisionData: async () => {
    console.log('🔍 division fetchDivisionData 호출됨');
    
    // global store에서 현재 선택된 날짜 가져오기
    const { selectedYear, selectedMonth } = useGlobalStore.getState();
    const currentYear = selectedYear || new Date().getFullYear();
    const currentMonth = selectedMonth || new Date().getMonth() + 1;
    
    console.log('📅 division 조회 날짜:', { currentYear, currentMonth });
    
    // store의 현재 날짜도 업데이트
    set({ currentYear, currentMonth, displayYear: currentYear, displayMonth: currentMonth });
    
    set({ loading: true, error: null });
    
    try {
      const backendData = await fetchDivisionAPI(currentYear, currentMonth);
      
      const parsedData = parseDivisionData(backendData, currentYear, currentMonth);
      set({ data: parsedData, loading: false });
    } catch (error) {
      console.error('부문별 데이터 로딩 오류:', error);
      set({
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        loading: false
      });
    }
  },
  
  setSelectedDivision: (divisionId: string | null) => {
    set({ selectedDivision: divisionId });
  },
  
  setCurrentDate: (year: number, month: number) => {
    console.log('📅 setCurrentDate 호출:', { year, month });
    set({ currentYear: year, currentMonth: month, displayYear: year, displayMonth: month });
    // 날짜가 변경되어도 바로 조회하지 않음 (조회 버튼 클릭 시에만 조회)
  },
  
  updateDisplayDate: (year: number, month: number) => {
    console.log('📅 updateDisplayDate 호출:', { year, month });
    set({ displayYear: year, displayMonth: month });
  }
}));