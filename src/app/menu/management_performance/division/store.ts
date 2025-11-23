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
    
    // ⭐ 10월 조건 체크 - 템프 데이터 사용
    if (currentMonth === 10) {
      console.log('🎯 10월 데이터: 템프 데이터를 사용합니다. (부문별 실적)');
      
      // 소수점 이하 2자리에서 반올림하여 소수점 이하 1자리로 변환하는 헬퍼 함수
      const roundTo1Decimal = (value: number): number => {
        return Math.round(value * 10) / 10;
      };
      
      // 제공된 데이터를 백엔드 구조에 맞게 변환 (억 단위로 변환 후 소수점 이하 1자리로 반올림)
      // 10월 조회 시: COLUMN1=11월(전년), COLUMN2=12월(전년), COLUMN3=1월, ..., COLUMN11=9월, COLUMN12=10월
      const tempBackendData: any[] = [
        // 매출 데이터
        {
          PARENT_DIVISION_TYPE: '항공',
          DIVISION_TYPE: '매출',
          COLUMN1: roundTo1Decimal(7080720762 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(7738149976 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(6405650775 / 100000000),   // 1월
          COLUMN4: roundTo1Decimal(5558123863 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(6795793582 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(10453766405 / 100000000),  // 4월
          COLUMN7: roundTo1Decimal(7481924260 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(7075842327 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(8431690256 / 100000000),   // 7월
          COLUMN10: roundTo1Decimal(8240481410 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(8827518027 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(8232629592 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((7080720762 + 7738149976 + 6405650775 + 5558123863 + 6795793582 + 10453766405 + 7481924260 + 7075842327 + 8431690256 + 8240481410 + 8827518027 + 8232629592) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '항공',
          DIVISION_TYPE: '영업이익',
          COLUMN1: roundTo1Decimal(-71724410 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(-272678904 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(-193249868 / 100000000),   // 1월
          COLUMN4: roundTo1Decimal(-307162183 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(-212086513 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(-277826988 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(-238764496 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(-215845327 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(-33261348 / 100000000),    // 7월
          COLUMN10: roundTo1Decimal(189139046 / 100000000),    // 8월
          COLUMN11: roundTo1Decimal(-65177584 / 100000000),    // 9월 (전월)
          COLUMN12: roundTo1Decimal(-153441426 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((-71724410 + -272678904 + -193249868 + -307162183 + -212086513 + -277826988 + -238764496 + -215845327 + -33261348 + 189139046 + -65177584 + -153441426) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '해상',
          DIVISION_TYPE: '매출',
          COLUMN1: roundTo1Decimal(4532228864 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(5578657004 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(4138480749 / 100000000),   // 1월
          COLUMN4: roundTo1Decimal(3958149638 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(5597611608 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(3337956008 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(3403994121 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(3424240926 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(2808882042 / 100000000),   // 7월
          COLUMN10: roundTo1Decimal(2845357806 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(3159246954 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(2279144027 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((4532228864 + 5578657004 + 4138480749 + 3958149638 + 5597611608 + 3337956008 + 3403994121 + 3424240926 + 2808882042 + 2845357806 + 3159246954 + 2279144027) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '해상',
          DIVISION_TYPE: '영업이익',
          COLUMN1: roundTo1Decimal(-41474949 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(-88200944 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(25051356 / 100000000),      // 1월
          COLUMN4: roundTo1Decimal(-110360761 / 100000000),    // 2월
          COLUMN5: roundTo1Decimal(73737949 / 100000000),      // 3월
          COLUMN6: roundTo1Decimal(19284746 / 100000000),      // 4월
          COLUMN7: roundTo1Decimal(6720828 / 100000000),       // 5월
          COLUMN8: roundTo1Decimal(155212928 / 100000000),     // 6월
          COLUMN9: roundTo1Decimal(3328297 / 100000000),       // 7월
          COLUMN10: roundTo1Decimal(2683006 / 100000000),       // 8월
          COLUMN11: roundTo1Decimal(-3414188 / 100000000),      // 9월 (전월)
          COLUMN12: roundTo1Decimal(-14133501 / 100000000),    // 10월 (현재월)
          COLUMN13: roundTo1Decimal((-41474949 + -88200944 + 25051356 + -110360761 + 73737949 + 19284746 + 6720828 + 155212928 + 3328297 + 2683006 + -3414188 + -14133501) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '운송',
          DIVISION_TYPE: '매출',
          COLUMN1: roundTo1Decimal(2717716178 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(2688705680 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(2627198608 / 100000000),   // 1월
          COLUMN4: roundTo1Decimal(2726255228 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(2693744356 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(2772637834 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(2719346184 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(2646147304 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(2820342645 / 100000000),   // 7월
          COLUMN10: roundTo1Decimal(2751375407 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(2745067485 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(2332396390 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((2717716178 + 2688705680 + 2627198608 + 2726255228 + 2693744356 + 2772637834 + 2719346184 + 2646147304 + 2820342645 + 2751375407 + 2745067485 + 2332396390) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '운송',
          DIVISION_TYPE: '영업이익',
          COLUMN1: roundTo1Decimal(35827726 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(36135510 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(120402096 / 100000000),     // 1월
          COLUMN4: roundTo1Decimal(45959476 / 100000000),     // 2월
          COLUMN5: roundTo1Decimal(84848653 / 100000000),     // 3월
          COLUMN6: roundTo1Decimal(74424648 / 100000000),     // 4월
          COLUMN7: roundTo1Decimal(48965385 / 100000000),     // 5월
          COLUMN8: roundTo1Decimal(56548149 / 100000000),     // 6월
          COLUMN9: roundTo1Decimal(96693121 / 100000000),     // 7월
          COLUMN10: roundTo1Decimal(57953254 / 100000000),     // 8월
          COLUMN11: roundTo1Decimal(32189970 / 100000000),     // 9월 (전월)
          COLUMN12: roundTo1Decimal(58891253 / 100000000),    // 10월 (현재월)
          COLUMN13: roundTo1Decimal((35827726 + 36135510 + 120402096 + 45959476 + 84848653 + 74424648 + 48965385 + 56548149 + 96693121 + 57953254 + 32189970 + 58891253) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '창고',
          DIVISION_TYPE: '매출',
          COLUMN1: roundTo1Decimal(4759313105 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(4922233046 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(1996662245 / 100000000),   // 1월
          COLUMN4: roundTo1Decimal(1914489988 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(1988150476 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(1571588383 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(1628848805 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(1716837858 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(1741112086 / 100000000),   // 7월
          COLUMN10: roundTo1Decimal(1700900985 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(1853582809 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(1766009461 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((4759313105 + 4922233046 + 1996662245 + 1914489988 + 1988150476 + 1571588383 + 1628848805 + 1716837858 + 1741112086 + 1700900985 + 1853582809 + 1766009461) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '창고',
          DIVISION_TYPE: '영업이익',
          COLUMN1: roundTo1Decimal(-225033071 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(-113382873 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(-312830033 / 100000000),    // 1월
          COLUMN4: roundTo1Decimal(-341370901 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(-353321741 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(-448834312 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(-186123283 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(-132056165 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(-175057896 / 100000000),   // 7월
          COLUMN10: roundTo1Decimal(-156246345 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(-160254438 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(-124368594 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((-225033071 + -113382873 + -312830033 + -341370901 + -353321741 + -448834312 + -186123283 + -132056165 + -175057896 + -156246345 + -160254438 + -124368594) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '도급',
          DIVISION_TYPE: '매출',
          COLUMN1: roundTo1Decimal(1918653188 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(1874889631 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(1768401002 / 100000000),   // 1월
          COLUMN4: roundTo1Decimal(1701715781 / 100000000),   // 2월
          COLUMN5: roundTo1Decimal(1901236975 / 100000000),   // 3월
          COLUMN6: roundTo1Decimal(1913673842 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(2012944497 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(2027517589 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(2217113780 / 100000000),   // 7월
          COLUMN10: roundTo1Decimal(1873014828 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(1800888802 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(1763009997 / 100000000),  // 10월 (현재월)
          COLUMN13: roundTo1Decimal((1918653188 + 1874889631 + 1768401002 + 1701715781 + 1901236975 + 1913673842 + 2012944497 + 2027517589 + 2217113780 + 1873014828 + 1800888802 + 1763009997) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '도급',
          DIVISION_TYPE: '영업이익',
          COLUMN1: roundTo1Decimal(84023259 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(73171721 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(65003551 / 100000000),      // 1월
          COLUMN4: roundTo1Decimal(56942561 / 100000000),     // 2월
          COLUMN5: roundTo1Decimal(62648299 / 100000000),     // 3월
          COLUMN6: roundTo1Decimal(72510033 / 100000000),     // 4월
          COLUMN7: roundTo1Decimal(58080483 / 100000000),     // 5월
          COLUMN8: roundTo1Decimal(79010673 / 100000000),     // 6월
          COLUMN9: roundTo1Decimal(125444589 / 100000000),    // 7월
          COLUMN10: roundTo1Decimal(85781416 / 100000000),     // 8월
          COLUMN11: roundTo1Decimal(105119004 / 100000000),    // 9월 (전월)
          COLUMN12: roundTo1Decimal(64191425 / 100000000),    // 10월 (현재월)
          COLUMN13: roundTo1Decimal((84023259 + 73171721 + 65003551 + 56942561 + 62648299 + 72510033 + 58080483 + 79010673 + 125444589 + 85781416 + 105119004 + 64191425) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '기타',
          DIVISION_TYPE: '매출',
          COLUMN1: roundTo1Decimal(716836848 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(767820299 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(734721898 / 100000000),    // 1월
          COLUMN4: roundTo1Decimal(900635792 / 100000000),    // 2월
          COLUMN5: roundTo1Decimal(778015122 / 100000000),    // 3월
          COLUMN6: roundTo1Decimal(1112544535 / 100000000),   // 4월
          COLUMN7: roundTo1Decimal(1719585726 / 100000000),   // 5월
          COLUMN8: roundTo1Decimal(1019605543 / 100000000),   // 6월
          COLUMN9: roundTo1Decimal(891367400 / 100000000),    // 7월
          COLUMN10: roundTo1Decimal(1434526920 / 100000000),   // 8월
          COLUMN11: roundTo1Decimal(1289253021 / 100000000),   // 9월 (전월)
          COLUMN12: roundTo1Decimal(842338899 / 100000000),   // 10월 (현재월)
          COLUMN13: roundTo1Decimal((716836848 + 767820299 + 734721898 + 900635792 + 778015122 + 1112544535 + 1719585726 + 1019605543 + 891367400 + 1434526920 + 1289253021 + 842338899) / 100000000)  // 누계
        },
        {
          PARENT_DIVISION_TYPE: '기타',
          DIVISION_TYPE: '영업이익',
          COLUMN1: roundTo1Decimal(385020320 / 100000000),   // 11월 (전년)
          COLUMN2: roundTo1Decimal(395836419 / 100000000),   // 12월 (전년)
          COLUMN3: roundTo1Decimal(374286108 / 100000000),      // 1월
          COLUMN4: roundTo1Decimal(353903327 / 100000000),    // 2월
          COLUMN5: roundTo1Decimal(348375816 / 100000000),    // 3월
          COLUMN6: roundTo1Decimal(356704938 / 100000000),    // 4월
          COLUMN7: roundTo1Decimal(352814009 / 100000000),    // 5월
          COLUMN8: roundTo1Decimal(336761948 / 100000000),    // 6월
          COLUMN9: roundTo1Decimal(285679505 / 100000000),    // 7월
          COLUMN10: roundTo1Decimal(695498946 / 100000000),    // 8월
          COLUMN11: roundTo1Decimal(752104260 / 100000000),    // 9월 (전월)
          COLUMN12: roundTo1Decimal(283421203 / 100000000),   // 10월 (현재월)
          COLUMN13: roundTo1Decimal((385020320 + 395836419 + 374286108 + 353903327 + 348375816 + 356704938 + 352814009 + 336761948 + 285679505 + 695498946 + 752104260 + 283421203) / 100000000)  // 누계
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