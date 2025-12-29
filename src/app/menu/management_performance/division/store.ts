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
  
  const months: string[] = [];
  
  // 10월일 때는 작년 11월, 12월을 제외하고 10개월만 표시
  // 11월일 때는 작년 12월을 제외하고 11개월만 표시
  const isOctober = selectedMonth === 10;
  const isNovember = selectedMonth === 11;
  const startIndex = isOctober ? 9 : isNovember ? 10 : 11; // 10월이면 9, 11월이면 10, 그 외는 11부터 시작
  
  // 선택된 월부터 역순으로 생성
  for (let i = startIndex; i >= 0; i--) {
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
    const currentMonth = Number(revenueItem.COLUMN12 ?? 0);
    const previousMonth = Number(revenueItem.COLUMN11 ?? 0);
    
    // 매출 전월 比 계산
    const growth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;
    
    // 영업이익 (실제 데이터 사용 - COLUMN12 사용, 소수점 반올림)
    const profit = Number(profitItem?.COLUMN12 ?? 0);

    const result = {
      id: config.id,
      name: parentType, // PARENT_DIVISION_TYPE 사용
      revenue: currentMonth,
      growth,
      profit,
      color: config.color,
      borderColor: config.borderColor,
      textColor: config.textColor,
      icon: config.icon
    };
    
    return result;
  }).filter((card): card is NonNullable<typeof card> => Boolean(card));
  
  // 백엔드에 실제 데이터가 있는 부문만 반환
  
  return cards;
};

// 12개월 랜덤 매출 데이터 생성 함수
const generateRandomMonthlyData = (baseValue: number, variance: number = 0.3): number[] => {
  const data: number[] = [];
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
  const isOctober = selectedMonth === 10;
  const isNovember = selectedMonth === 11;
  const months = generateCurrentMonths(selectedYear, selectedMonth);
  
  // 10월일 때는 10개월 데이터만 생성, 11월일 때는 11개월 데이터만 생성
  const generateMonthlyData = (baseValue: number, variance: number) => {
    const data = generateRandomMonthlyData(baseValue, variance);
    if (isOctober) return data.slice(2); // 10월이면 처음 2개(작년 11월, 12월) 제외
    if (isNovember) return data.slice(1); // 11월이면 처음 1개(작년 12월) 제외
    return data;
  };
  
  return {
    months: months,
    divisions: [
      {
        name: '항공',
        color: 'blue',
        revenue: generateMonthlyData(615, 0.05),
        profit: generateMonthlyData(-3.3, 0.4)
      },
      {
        name: '해상',
        color: 'emerald',
        revenue: generateMonthlyData(203, 0.08),
        profit: generateMonthlyData(0.5, 0.3)
      },
      {
        name: '운송',
        color: 'purple',
        revenue: generateMonthlyData(156, 0.06),
        profit: generateMonthlyData(2.1, 0.2)
      },
      {
        name: '창고',
        color: 'orange',
        revenue: generateMonthlyData(89, 0.07),
        profit: generateMonthlyData(1.2, 0.3)
      },
      {
        name: '도급',
        color: 'pink',
        revenue: generateMonthlyData(67, 0.08),
        profit: generateMonthlyData(0.8, 0.4)
      },
      {
        name: '기타',
        color: 'cyan',
        revenue: generateMonthlyData(52, 0.09),
        profit: generateMonthlyData(0.3, 0.5)
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
  const isOctober = selectedMonth === 10;
  const isNovember = selectedMonth === 11;
  
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
    
    // 10월일 때는 COLUMN1, COLUMN2(작년 11월, 12월)를 제외하고 COLUMN3부터 시작
    // 11월일 때는 COLUMN1(작년 12월)을 제외하고 COLUMN2부터 시작
    const revenue = revenueItem 
      ? (isOctober
          ? [
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
            ]
          : isNovember
          ? [
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
            ]
          : [
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
            ])
      : Array(isOctober ? 10 : isNovember ? 11 : 12).fill(0);
    
    const profit = profitItem 
      ? (isOctober
          ? [
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
            ]
          : isNovember
          ? [
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
            ]
          : [
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
            ])
      : Array(isOctober ? 10 : isNovember ? 11 : 12).fill(0);
    
    return {
      name: parentType,
      color: color,
      revenue: revenue,
      profit: profit
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
    
    // ⭐ 10월 조건 체크 - 템프 데이터 사용
    if (currentMonth === 10) {
      console.log('🎯 10월 데이터: 템프 데이터를 사용합니다. (부문별 실적)');
      
      // 소수점 이하 1자리로 반올림하는 헬퍼 함수
      const roundTo1Decimal = (value: number): number => {
        return Math.round(value * 10) / 10;
      };
      
      // 제공된 데이터를 백엔드 구조에 맞게 변환 (억원 단위 그대로 저장)
      // 10월 조회 시: COLUMN1=11월(전년), COLUMN2=12월(전년), COLUMN3=1월, ..., COLUMN11=9월, COLUMN12=10월
      // 작년 11월, 12월은 원 단위를 억원 단위로 변환, 1~10월은 이미지 값 그대로 사용
      const tempBackendData: any[] = [
        // 매출 데이터
        {
          PARENT_DIVISION_TYPE: '항공',
          DIVISION_TYPE: '매출',
          COLUMN1: 71,   // 11월 (전년) - 원 -> 억원
          COLUMN2: 77,   // 12월 (전년) - 원 -> 억원
          COLUMN3: 64,   // 1월 (억원 단위 그대로)
          COLUMN4: 56,   // 2월
          COLUMN5: 68,   // 3월
          COLUMN6: 104,  // 4월
          COLUMN7: 75,   // 5월
          COLUMN8: 70,   // 6월
          COLUMN9: 83,   // 7월
          COLUMN10: 80,   // 8월
          COLUMN11: 87,   // 9월
          COLUMN12: 81,  // 10월
          COLUMN13: (71+77+64 + 56 + 68 + 104 + 75 + 70 + 83 + 80 + 87 + 81)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '항공',
          DIVISION_TYPE: '영업이익',
          COLUMN1: -1,   // 11월 (전년) - 원 -> 억원
          COLUMN2: -3,   // 12월 (전년) - 원 -> 억원
          COLUMN3: -1.9,   // 1월 (억원 단위 그대로)
          COLUMN4: -3.1,   // 2월
          COLUMN5: -2.1,   // 3월
          COLUMN6: -2.9,   // 4월
          COLUMN7: -2.6,   // 5월
          COLUMN8: -2.7,   // 6월
          COLUMN9: -1.9,    // 7월
          COLUMN10: -0.2,    // 8월
          COLUMN11: -1.7,    // 9월
          COLUMN12: -2.6,  // 10월
          COLUMN13: (-1 + -3 +-1.9 + -3.1 + -2.1 + -2.9 + -2.6 + -2.7 + -1.9 + -0.2 + -1.7 + -2.6)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '해상',
          DIVISION_TYPE: '매출',
          COLUMN1: 45,   // 11월 (전년)
          COLUMN2: 56,   // 12월 (전년)
          COLUMN3: 41,   // 1월 (억원 단위 그대로)
          COLUMN4: 40,   // 2월
          COLUMN5: 56,   // 3월
          COLUMN6: 33,   // 4월
          COLUMN7: 34,   // 5월
          COLUMN8: 34,   // 6월
          COLUMN9: 28,   // 7월
          COLUMN10: 28,   // 8월
          COLUMN11: 32,   // 9월
          COLUMN12: 23,  // 10월
          COLUMN13: (45 + 56 + 41 + 40 + 56 + 33 + 34 + 34 + 28 + 28 + 32 + 23)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '해상',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 11월 (전년)
          COLUMN2: -1,   // 12월 (전년)
          COLUMN3: 0.3,      // 1월 (억원 단위 그대로)
          COLUMN4: -0.7,    // 2월
          COLUMN5: 0.9,      // 3월
          COLUMN6: 0.2,      // 4월
          COLUMN7: -0.1,       // 5월
          COLUMN8: 1.1,     // 6월
          COLUMN9: 0.0,       // 7월
          COLUMN10: 0.0,       // 8월
          COLUMN11: -0.0,      // 9월
          COLUMN12: -0.1,    // 10월
          COLUMN13: (0 + -1 + 0.3 + -0.7 + 0.9 + 0.2 + -0.1 + 1.1 + 0.0 + 0.0 + -0.0 + -0.1)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '운송',
          DIVISION_TYPE: '매출',
          COLUMN1: 27,   // 11월 (전년)
          COLUMN2: 27,   // 12월 (전년)
          COLUMN3: 26,   // 1월 (억원 단위 그대로)
          COLUMN4: 27,   // 2월
          COLUMN5: 27,   // 3월
          COLUMN6: 28,   // 4월
          COLUMN7: 27,   // 5월
          COLUMN8: 26,   // 6월
          COLUMN9: 28,   // 7월
          COLUMN10: 28,   // 8월
          COLUMN11: 27,   // 9월
          COLUMN12: 23,  // 10월
          COLUMN13: (27 + 27 + 26 + 27 + 27 + 28 + 27 + 26 + 28 + 28 + 27 + 23)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '운송',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 11월 (전년)
          COLUMN2: 0,   // 12월 (전년)
          COLUMN3: 1.2,     // 1월 (억원 단위 그대로)
          COLUMN4: 0.5,     // 2월
          COLUMN5: 0.8,     // 3월
          COLUMN6: 0.7,     // 4월
          COLUMN7: 0.5,     // 5월
          COLUMN8: 0.6,     // 6월
          COLUMN9: 1.0,     // 7월
          COLUMN10: 0.6,     // 8월
          COLUMN11: 0.3,     // 9월
          COLUMN12: 0.5,    // 10월
          COLUMN13: (0 + 0 + 1.2 + 0.5 + 0.8 + 0.7 + 0.5 + 0.6 + 1.0 + 0.6 + 0.3 + 0.5)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '창고',
          DIVISION_TYPE: '매출',
          COLUMN1: 48,   // 11월 (전년)
          COLUMN2: 49,   // 12월 (전년)
          COLUMN3: 16,   // 1월 (억원 단위 그대로)
          COLUMN4: 16,   // 2월
          COLUMN5: 16,   // 3월
          COLUMN6: 16,   // 4월
          COLUMN7: 16,   // 5월
          COLUMN8: 17,   // 6월
          COLUMN9: 17,   // 7월
          COLUMN10: 17,   // 8월
          COLUMN11: 19,   // 9월
          COLUMN12: 18,  // 10월
          COLUMN13: (48 + 49 + 16 + 16 + 16 + 16 + 16 + 17 + 17 + 17 + 19 + 18)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '창고',
          DIVISION_TYPE: '영업이익',
          COLUMN1: -2,   // 11월 (전년)
          COLUMN2: -1,   // 12월 (전년)
          COLUMN3: -1.4,    // 1월 (억원 단위 그대로)
          COLUMN4: -1.6,   // 2월
          COLUMN5: -1.8,   // 3월
          COLUMN6: -2.8,   // 4월
          COLUMN7: -0.1,   // 5월
          COLUMN8: 0.4,   // 6월
          COLUMN9: -0.0,   // 7월
          COLUMN10: 0.2,   // 8월
          COLUMN11: 0.1,   // 9월
          COLUMN12: 0.5,  // 10월
          COLUMN13: (-2 + -1 + -1.4 + -1.6 + -1.8 + -2.8 + -0.1 + 0.4 + -0.0 + 0.2 + 0.1 + 0.5)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '도급',
          DIVISION_TYPE: '매출',
          COLUMN1: 19,   // 11월 (전년)
          COLUMN2: 19,   // 12월 (전년)
          COLUMN3: 18,   // 1월 (억원 단위 그대로)
          COLUMN4: 17,   // 2월
          COLUMN5: 19,   // 3월
          COLUMN6: 19,   // 4월
          COLUMN7: 20,   // 5월
          COLUMN8: 20,   // 6월
          COLUMN9: 22,   // 7월
          COLUMN10: 19,   // 8월
          COLUMN11: 18,   // 9월
          COLUMN12: 18,  // 10월
          COLUMN13: (19 + 19 + 18 + 17 + 19 + 19 + 20 + 20 + 22 + 19 + 18 + 18)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '도급',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 1,   // 11월 (전년)
          COLUMN2: 1,   // 12월 (전년)
          COLUMN3: 0.7,      // 1월 (억원 단위 그대로)
          COLUMN4: 0.6,     // 2월
          COLUMN5: 0.6,     // 3월
          COLUMN6: 0.7,     // 4월
          COLUMN7: 0.6,     // 5월
          COLUMN8: 0.8,     // 6월
          COLUMN9: 1.3,    // 7월
          COLUMN10: 0.9,     // 8월
          COLUMN11: 1.1,    // 9월
          COLUMN12: 0.6,    // 10월
          COLUMN13: (1 + 1 + 0.7 + 0.6 + 0.6 + 0.7 + 0.6 + 0.8 + 1.3 + 0.9 + 1.1 + 0.6)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '기타',
          DIVISION_TYPE: '매출',
          COLUMN1: 7,   // 11월 (전년)
          COLUMN2: 8,   // 12월 (전년)
          COLUMN3: 4,    // 1월 (억원 단위 그대로)
          COLUMN4: 6,    // 2월
          COLUMN5: 5,    // 3월
          COLUMN6: 7,   // 4월
          COLUMN7: 13,   // 5월
          COLUMN8: 6,   // 6월
          COLUMN9: 5,    // 7월
          COLUMN10: 6,   // 8월
          COLUMN11: 4,   // 9월
          COLUMN12: 4,   // 10월
          COLUMN13: (7 + 8 + 4 + 6 + 5 + 7 + 13 + 6 + 5 + 6 + 4 + 4)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '기타',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 4,   // 11월 (전년)
          COLUMN2: 4,   // 12월 (전년)
          COLUMN3: -4.3,      // 1월 (억원 단위 그대로)
          COLUMN4: -0.9,    // 2월
          COLUMN5: -0.7,    // 3월
          COLUMN6: -0.6,    // 4월
          COLUMN7: -0.5,    // 5월
          COLUMN8: -0.6,    // 6월
          COLUMN9: -1.2,    // 7월
          COLUMN10: -1.2,    // 8월
          COLUMN11: -1.5,    // 9월
          COLUMN12: -1.3,   // 10월
          COLUMN13: (4 + 4 + -4.3 + -0.9 + -0.7 + -0.6 + -0.5 + -0.6 + -1.2 + -1.2 + -1.5 + -1.3)  // 누계
        }
      ];
      
      const parsedData = parseDivisionData(tempBackendData, currentYear, currentMonth);
      set({ data: parsedData, loading: false });
      return; // API 호출 없이 리턴
    }
    
    // ⭐ 11월 조건 체크 - 템프 데이터 사용 (10월 데이터 참고)
    if (currentMonth === 11) {
      console.log('🎯 11월 데이터: 템프 데이터를 사용합니다. (부문별 실적)');
      
      // 소수점 이하 1자리로 반올림하는 헬퍼 함수
      const roundTo1Decimal = (value: number): number => {
        return Math.round(value * 10) / 10;
      };
      
      // 제공된 데이터를 백엔드 구조에 맞게 변환 (억원 단위 그대로 저장)
      // 11월 조회 시: COLUMN1=12월(전년), COLUMN2=1월, ..., COLUMN11=10월, COLUMN12=11월
      // 10월 데이터에서: COLUMN2(12월 전년) -> 11월의 COLUMN1, COLUMN3(1월) -> 11월의 COLUMN2, ..., COLUMN12(10월) -> 11월의 COLUMN11
      const tempBackendData: any[] = [
        // 매출 데이터
        {
          PARENT_DIVISION_TYPE: '항공',
          DIVISION_TYPE: '매출',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 64,   // 1월 - 10월의 COLUMN3
          COLUMN3: 56,   // 2월 - 10월의 COLUMN4
          COLUMN4: 68,   // 3월 - 10월의 COLUMN5
          COLUMN5: 104,  // 4월 - 10월의 COLUMN6
          COLUMN6: 75,   // 5월 - 10월의 COLUMN7
          COLUMN7: 70,   // 6월 - 10월의 COLUMN8
          COLUMN8: 83,   // 7월 - 10월의 COLUMN9
          COLUMN9: 80,   // 8월 - 10월의 COLUMN10
          COLUMN10: 87,   // 9월 - 10월의 COLUMN11
          COLUMN11: 81,  // 10월 - 10월의 COLUMN12
          COLUMN12: 86,  // 11월 - 새로운 값
          COLUMN13: (0 + 64 + 56 + 68 + 104 + 75 + 70 + 83 + 80 + 87 + 81 + 86)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '항공',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: -2,   // 1월 - 10월의 COLUMN3
          COLUMN3: -3,   // 2월 - 10월의 COLUMN4
          COLUMN4: -2,   // 3월 - 10월의 COLUMN5
          COLUMN5: -3,   // 4월 - 10월의 COLUMN6
          COLUMN6: -2,   // 5월 - 10월의 COLUMN7
          COLUMN7: -3,   // 6월 - 10월의 COLUMN8
          COLUMN8: -2,    // 7월 - 10월의 COLUMN9
          COLUMN9: 0,    // 8월 - 10월의 COLUMN10
          COLUMN10: -2,    // 9월 - 10월의 COLUMN11
          COLUMN11: -3,  // 10월 - 10월의 COLUMN12
          COLUMN12: -2,  // 11월 - 새로운 값
          COLUMN13: (0 + -2 + -3 + -2 + -3 + -2 + -3 + -2 + 0 + -2 + -3 + -2)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '해상',
          DIVISION_TYPE: '매출',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 41,   // 1월 - 10월의 COLUMN3
          COLUMN3: 40,   // 2월 - 10월의 COLUMN4
          COLUMN4: 56,   // 3월 - 10월의 COLUMN5
          COLUMN5: 33,   // 4월 - 10월의 COLUMN6
          COLUMN6: 34,   // 5월 - 10월의 COLUMN7
          COLUMN7: 34,   // 6월 - 10월의 COLUMN8
          COLUMN8: 28,   // 7월 - 10월의 COLUMN9
          COLUMN9: 29,   // 8월 - 10월의 COLUMN10
          COLUMN10: 32,   // 9월 - 10월의 COLUMN11
          COLUMN11: 24,  // 10월 - 10월의 COLUMN12
          COLUMN12: 25,  // 11월 - 새로운 값
          COLUMN13: (0 + 41 + 40 + 56 + 33 + 34 + 34 + 28 + 29 + 32 + 24 + 25)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '해상',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 0,      // 1월 - 10월의 COLUMN3
          COLUMN3: -1,    // 2월 - 10월의 COLUMN4
          COLUMN4: 1,      // 3월 - 10월의 COLUMN5
          COLUMN5: 0,      // 4월 - 10월의 COLUMN6
          COLUMN6: 0,       // 5월 - 10월의 COLUMN7
          COLUMN7: 1,     // 6월 - 10월의 COLUMN8
          COLUMN8: 0,       // 7월 - 10월의 COLUMN9
          COLUMN9: 0.0,       // 8월 - 10월의 COLUMN10
          COLUMN10: 0,      // 9월 - 10월의 COLUMN11
          COLUMN11: 0,    // 10월 - 10월의 COLUMN12
          COLUMN12: 0,    // 11월 - 새로운 값
          COLUMN13: (0 + 0 + -1 + 1 + 0 + 0 + 1 + 0 + 0 + 0 + 0 + 0)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '운송',
          DIVISION_TYPE: '매출',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 26,   // 1월 - 10월의 COLUMN3
          COLUMN3: 27,   // 2월 - 10월의 COLUMN4
          COLUMN4: 27,   // 3월 - 10월의 COLUMN5
          COLUMN5: 28,   // 4월 - 10월의 COLUMN6
          COLUMN6: 27,   // 5월 - 10월의 COLUMN7
          COLUMN7: 26,   // 6월 - 10월의 COLUMN8
          COLUMN8: 28,   // 7월 - 10월의 COLUMN9
          COLUMN9: 28,   // 8월 - 10월의 COLUMN10
          COLUMN10: 28,   // 9월 - 10월의 COLUMN11
          COLUMN11: 24,  // 10월 - 10월의 COLUMN12
          COLUMN12: 27,  // 11월 - 새로운 값
          COLUMN13: (0 + 26 + 27 + 27 + 28 + 27 + 26 + 28 + 28 + 28 + 24 + 27)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '운송',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 1,     // 1월 - 10월의 COLUMN3
          COLUMN3: 0,     // 2월 - 10월의 COLUMN4
          COLUMN4: 1,     // 3월 - 10월의 COLUMN5
          COLUMN5: 1,     // 4월 - 10월의 COLUMN6
          COLUMN6: 1,     // 5월 - 10월의 COLUMN7
          COLUMN7: 1,     // 6월 - 10월의 COLUMN8
          COLUMN8: 1,     // 7월 - 10월의 COLUMN9
          COLUMN9: 1,     // 8월 - 10월의 COLUMN10
          COLUMN10: 0,     // 9월 - 10월의 COLUMN11
          COLUMN11: 1,    // 10월 - 10월의 COLUMN12
          COLUMN12: 0,    // 11월 - 새로운 값
          COLUMN13: (0 + 1 + 0 + 1 + 1 + 1 + 1 + 1 + 0 + 1 + 0 + 0)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '창고',
          DIVISION_TYPE: '매출',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 16,   // 1월 - 10월의 COLUMN3
          COLUMN3: 16,   // 2월 - 10월의 COLUMN4
          COLUMN4: 16,   // 3월 - 10월의 COLUMN5
          COLUMN5: 16,   // 4월 - 10월의 COLUMN6
          COLUMN6: 16,   // 5월 - 10월의 COLUMN7
          COLUMN7: 17,   // 6월 - 10월의 COLUMN8
          COLUMN8: 17,   // 7월 - 10월의 COLUMN9
          COLUMN9: 17,   // 8월 - 10월의 COLUMN10
          COLUMN10: 19,   // 9월 - 10월의 COLUMN11
          COLUMN11: 18,  // 10월 - 10월의 COLUMN12
          COLUMN12: 18,  // 11월 - 새로운 값
          COLUMN13: (0 + 16 + 16 + 16 + 16 + 16 + 17 + 17 + 17 + 19 + 18 + 18)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '창고',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: -1,    // 1월 - 10월의 COLUMN3
          COLUMN3: -2,   // 2월 - 10월의 COLUMN4
          COLUMN4: -2,   // 3월 - 10월의 COLUMN5
          COLUMN5: -3,   // 4월 - 10월의 COLUMN6
          COLUMN6: 0,   // 5월 - 10월의 COLUMN7
          COLUMN7: 0,   // 6월 - 10월의 COLUMN8
          COLUMN8: 0,   // 7월 - 10월의 COLUMN9
          COLUMN9: 0,   // 8월 - 10월의 COLUMN10
          COLUMN10: 0,   // 9월 - 10월의 COLUMN11
          COLUMN11: 0,  // 10월 - 10월의 COLUMN12
          COLUMN12: 0,  // 11월 - 새로운 값
          COLUMN13: (0 + -1 + -2 + -2 + -3 + 0 + 0 + 0 + 0 + 0 + 0 + 0)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '도급',
          DIVISION_TYPE: '매출',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 18,   // 1월 - 10월의 COLUMN3
          COLUMN3: 17,   // 2월 - 10월의 COLUMN4
          COLUMN4: 19,   // 3월 - 10월의 COLUMN5
          COLUMN5: 19,   // 4월 - 10월의 COLUMN6
          COLUMN6: 20,   // 5월 - 10월의 COLUMN7
          COLUMN7: 20,   // 6월 - 10월의 COLUMN8
          COLUMN8: 22,   // 7월 - 10월의 COLUMN9
          COLUMN9: 19,   // 8월 - 10월의 COLUMN10
          COLUMN10: 18,   // 9월 - 10월의 COLUMN11
          COLUMN11: 18,  // 10월 - 10월의 COLUMN12
          COLUMN12: 18,  // 11월 - 새로운 값
          COLUMN13: (0 + 18 + 17 + 19 + 19 + 20 + 20 + 22 + 19 + 18 + 18 + 18)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '도급',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 1,      // 1월 - 10월의 COLUMN3
          COLUMN3: 1,     // 2월 - 10월의 COLUMN4
          COLUMN4: 1,     // 3월 - 10월의 COLUMN5
          COLUMN5: 1,     // 4월 - 10월의 COLUMN6
          COLUMN6: 1,     // 5월 - 10월의 COLUMN7
          COLUMN7: 1,     // 6월 - 10월의 COLUMN8
          COLUMN8: 1,    // 7월 - 10월의 COLUMN9
          COLUMN9: 1,     // 8월 - 10월의 COLUMN10
          COLUMN10: 1,    // 9월 - 10월의 COLUMN11
          COLUMN11: 1,    // 10월 - 10월의 COLUMN12
          COLUMN12: 1,    // 11월 - 새로운 값
          COLUMN13: (0 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '기타',
          DIVISION_TYPE: '매출',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: 4,    // 1월 - 10월의 COLUMN3
          COLUMN3: 6,    // 2월 - 10월의 COLUMN4
          COLUMN4: 5,    // 3월 - 10월의 COLUMN5
          COLUMN5: 7,   // 4월 - 10월의 COLUMN6
          COLUMN6: 13,   // 5월 - 10월의 COLUMN7
          COLUMN7: 6,   // 6월 - 10월의 COLUMN8
          COLUMN8: 5,    // 7월 - 10월의 COLUMN9
          COLUMN9: 6,   // 8월 - 10월의 COLUMN10
          COLUMN10: 4,   // 9월 - 10월의 COLUMN11
          COLUMN11: 4,   // 10월 - 10월의 COLUMN12
          COLUMN12: 8,   // 11월 - 새로운 값
          COLUMN13: (0 + 4 + 6 + 5 + 7 + 13 + 6 + 5 + 6 + 4 + 4 + 8)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '기타',
          DIVISION_TYPE: '영업이익',
          COLUMN1: 0,   // 12월 (전년) - 10월의 COLUMN2
          COLUMN2: -4,      // 1월 - 10월의 COLUMN3
          COLUMN3: -1,    // 2월 - 10월의 COLUMN4
          COLUMN4: -1,    // 3월 - 10월의 COLUMN5
          COLUMN5: -1,    // 4월 - 10월의 COLUMN6
          COLUMN6: 0,    // 5월 - 10월의 COLUMN7
          COLUMN7: -1,    // 6월 - 10월의 COLUMN8
          COLUMN8: -1,    // 7월 - 10월의 COLUMN9
          COLUMN9: -1,    // 8월 - 10월의 COLUMN10
          COLUMN10: -1,    // 9월 - 10월의 COLUMN11
          COLUMN11: -1,   // 10월 - 10월의 COLUMN12
          COLUMN12: -1,   // 11월 - 새로운 값
          COLUMN13: (0 + -4 + -1 + -1 + -1 + 0 + -1 + -1 + -1 + -1 + -1 + -1)  // 누계
        }
      ];
      
      const parsedData = parseDivisionData(tempBackendData, currentYear, currentMonth);
      set({ data: parsedData, loading: false });
      return; // API 호출 없이 리턴
    }
    
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