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

// 1~12월 고정 생성 함수
const generateCurrentMonths = (): string[] => {
  return ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
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
const generateDivisionCardsFromBackend = (backendData: any[], selectedMonth?: number) => {
  // 조회한 월 정보 (selectedMonth가 없으면 현재 월 사용)
  const queryMonth = selectedMonth || new Date().getMonth() + 1;
  
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
  const divisionGroups: { [key: string]: { revenue?: any; profit?: any } } = {};
  
  backendData.forEach((item: any) => {
    const parentDivision = item.PARENT_DIVISION_TYPE || '기타';
    if (!divisionGroups[parentDivision]) {
      divisionGroups[parentDivision] = {};
    }
    
    if (item.DIVISION_TYPE === '매출') {
      divisionGroups[parentDivision].revenue = item;
    } else if (item.DIVISION_TYPE === '영업이익') {
      divisionGroups[parentDivision].profit = item;
    }
  });

  // 부문 순서: 백엔드 응답에서 처음 등장한 PARENT_DIVISION_TYPE 순서
  const divisionOrder = backendData.reduce((acc: string[], item: any) => {
    const p = item.PARENT_DIVISION_TYPE || '기타';
    if (!acc.includes(p)) acc.push(p);
    return acc;
  }, []);

  // 부문별 카드 생성
  const cards: any[] = [];
  
  // 전체 합계 계산용
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalPreviousRevenue = 0;
  
  divisionOrder.forEach((divisionName) => {
    const group = divisionGroups[divisionName];
    if (!group || !group.revenue) return;
    
    const config = divisionConfig[divisionName as keyof typeof divisionConfig];
    if (!config) return;
    
    const revenueItem = group.revenue;
    const profitItem = group.profit;
    
    // 조회한 월의 데이터 추출 (COLUMN{queryMonth}가 현재월, COLUMN{queryMonth-1}이 전월)
    const currentMonthCol = `COLUMN${queryMonth}` as keyof typeof revenueItem;
    const previousMonthCol = queryMonth > 1 ? `COLUMN${queryMonth - 1}` as keyof typeof revenueItem : null;
    
    const currentMonth = Number(revenueItem[currentMonthCol] ?? 0);
    const previousMonth = previousMonthCol ? Number(revenueItem[previousMonthCol] ?? 0) : 0;
    
    // 매출 전월 比 계산
    const growth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;
    
    // 영업이익 (조회한 월의 데이터 사용)
    const profitCol = `COLUMN${queryMonth}` as keyof typeof profitItem;
    const profit = Number(profitItem?.[profitCol] ?? 0);
    
    // 전체 합계에 추가
    totalRevenue += currentMonth;
    totalProfit += profit;
    totalPreviousRevenue += previousMonth;
    
    cards.push({
      id: config.id,
      name: divisionName,
      revenue: currentMonth,
      growth,
      profit,
      color: config.color,
      borderColor: config.borderColor,
      textColor: config.textColor,
      icon: config.icon
    });
  });
  
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
const generateMockDivisionMonthlyDetails = (): DivisionMonthlyDetailData[] => {
  
  // 기본 데이터 (매출, 영업이익, 영업이익률)
  const baseRevenue = 1000;
  const baseProfit = 100;
  
  const revenueData = generateRandomMonthlyData(baseRevenue, 0.05);
  const profitData = generateRandomMonthlyData(baseProfit, 0.1);
  
  // 누계 계산
  const revenueTotal = revenueData.reduce((sum, val) => sum + val, 0);
  const profitTotal = profitData.reduce((sum, val) => sum + val, 0);
  
  return [
    {
      DIVISION_TYPE: '매출',
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
      COLUMN13: revenueTotal
    },
    {
      DIVISION_TYPE: '영업이익',
      COLUMN1: profitData[0] || 0,
      COLUMN2: profitData[1] || 0,
      COLUMN3: profitData[2] || 0,
      COLUMN4: profitData[3] || 0,
      COLUMN5: profitData[4] || 0,
      COLUMN6: profitData[5] || 0,
      COLUMN7: profitData[6] || 0,
      COLUMN8: profitData[7] || 0,
      COLUMN9: profitData[8] || 0,
      COLUMN10: profitData[9] || 0,
      COLUMN11: profitData[10] || 0,
      COLUMN12: profitData[11] || 0,
      COLUMN13: profitTotal
    },
    {
      DIVISION_TYPE: '영업이익률',
      COLUMN1: revenueData[0] !== 0 ? (profitData[0] / revenueData[0]) * 100 : 0,
      COLUMN2: revenueData[1] !== 0 ? (profitData[1] / revenueData[1]) * 100 : 0,
      COLUMN3: revenueData[2] !== 0 ? (profitData[2] / revenueData[2]) * 100 : 0,
      COLUMN4: revenueData[3] !== 0 ? (profitData[3] / revenueData[3]) * 100 : 0,
      COLUMN5: revenueData[4] !== 0 ? (profitData[4] / revenueData[4]) * 100 : 0,
      COLUMN6: revenueData[5] !== 0 ? (profitData[5] / revenueData[5]) * 100 : 0,
      COLUMN7: revenueData[6] !== 0 ? (profitData[6] / revenueData[6]) * 100 : 0,
      COLUMN8: revenueData[7] !== 0 ? (profitData[7] / revenueData[7]) * 100 : 0,
      COLUMN9: revenueData[8] !== 0 ? (profitData[8] / revenueData[8]) * 100 : 0,
      COLUMN10: revenueData[9] !== 0 ? (profitData[9] / revenueData[9]) * 100 : 0,
      COLUMN11: revenueData[10] !== 0 ? (profitData[10] / revenueData[10]) * 100 : 0,
      COLUMN12: revenueData[11] !== 0 ? (profitData[11] / revenueData[11]) * 100 : 0,
      COLUMN13: revenueTotal !== 0 ? (profitTotal / revenueTotal) * 100 : 0
    }
  ];
};

// 차트용 기존 데이터 구조 생성 함수
const generateMockDivisionTable = () => {
  const months = generateCurrentMonths();
  
  // 1~12월 고정 데이터 생성
  const generateMonthlyData = (baseValue: number, variance: number) => {
    return generateRandomMonthlyData(baseValue, variance);
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
    const mockTableData = generateMockDivisionTable();
    return {
      divisionCards: generateDivisionCardsFromBackend(generateMockDivisionMonthlyDetails()),
      divisionTable: {
        monthlyDetails: generateMockDivisionMonthlyDetails(),
        monthLabels: generateCurrentMonths(),
        // 차트용 기존 데이터 구조도 함께 제공
        months: mockTableData.months,
        divisions: mockTableData.divisions
      }
    };
  }

  console.log('✅ 백엔드 데이터 처리 시작:', backendData.length, '개 항목');
  
  // 조회한 월 정보 (selectedMonth가 없으면 현재 월 사용)
  const queryMonth = selectedMonth || new Date().getMonth() + 1;
  
  // 백엔드 컬럼 매핑: PARENT_DIVISION_TYPE, DIVISION_TYPE, MONTH1~MONTH13 → 내부 COLUMN1~COLUMN13
  // 조회한 월 이후의 데이터는 0으로 처리
  const processedData = backendData.map((item: any) => {
    const monthValues = [
      Number(item.MONTH1 ?? 0),
      Number(item.MONTH2 ?? 0),
      Number(item.MONTH3 ?? 0),
      Number(item.MONTH4 ?? 0),
      Number(item.MONTH5 ?? 0),
      Number(item.MONTH6 ?? 0),
      Number(item.MONTH7 ?? 0),
      Number(item.MONTH8 ?? 0),
      Number(item.MONTH9 ?? 0),
      Number(item.MONTH10 ?? 0),
      Number(item.MONTH11 ?? 0),
      Number(item.MONTH12 ?? 0)
    ];
    
    // 조회한 월 이후의 데이터는 0으로 처리
    for (let i = queryMonth; i < 12; i++) {
      monthValues[i] = 0;
    }
    
    // COLUMN13(누계): 선택 연도 1~조회월 합계만 사용 (백엔드 MONTH13 사용 안 함)
    const column13 = monthValues.slice(0, queryMonth).reduce((sum, val) => sum + val, 0);

    return {
      PARENT_DIVISION_TYPE: item.PARENT_DIVISION_TYPE ?? '기타',
      DIVISION_TYPE: item.DIVISION_TYPE ?? '',
      COLUMN1: monthValues[0],
      COLUMN2: monthValues[1],
      COLUMN3: monthValues[2],
      COLUMN4: monthValues[3],
      COLUMN5: monthValues[4],
      COLUMN6: monthValues[5],
      COLUMN7: monthValues[6],
      COLUMN8: monthValues[7],
      COLUMN9: monthValues[8],
      COLUMN10: monthValues[9],
      COLUMN11: monthValues[10],
      COLUMN12: monthValues[11],
      COLUMN13: column13
    };
  });
  
  // PARENT_DIVISION_TYPE별로 데이터 그룹화하여 monthlyDetails 생성
  const divisionGroups: { [key: string]: { revenue?: any; profit?: any } } = {};
  
  processedData.forEach((item: any) => {
    const parentDivision = item.PARENT_DIVISION_TYPE || '기타';
    if (!divisionGroups[parentDivision]) {
      divisionGroups[parentDivision] = {};
    }
    
    if (item.DIVISION_TYPE === '매출') {
      divisionGroups[parentDivision].revenue = item;
    } else if (item.DIVISION_TYPE === '영업이익') {
      divisionGroups[parentDivision].profit = item;
    }
  });
  
  // 부문 순서: 백엔드 응답에서 처음 등장한 PARENT_DIVISION_TYPE 순서
  const divisionOrder = processedData.reduce((acc: string[], item: any) => {
    const p = item.PARENT_DIVISION_TYPE || '기타';
    if (!acc.includes(p)) acc.push(p);
    return acc;
  }, []);

  // 부문별 monthlyDetails 생성
  const monthlyDetails: any[] = [];
  
  // 전체 합계 계산용
  const overallRevenue = Array(12).fill(0);
  const overallProfit = Array(12).fill(0);
  
  // "전체" 데이터 생성 (모든 부문의 합계)
  divisionOrder.forEach((divisionName) => {
    const group = divisionGroups[divisionName];
    if (!group || !group.revenue) return;
    
    const revenueItem = group.revenue;
    const profitItem = group.profit;
    
    // 전체 합계에 추가 (조회한 월까지만)
    for (let i = 1; i <= queryMonth; i++) {
      const colKey = `COLUMN${i}` as keyof typeof revenueItem;
      overallRevenue[i - 1] += Number(revenueItem[colKey] || 0);
      if (profitItem) {
        overallProfit[i - 1] += Number(profitItem[colKey] || 0);
      }
    }
  });
  
  // 조회한 월 이후의 합계 데이터는 0으로 처리
  for (let i = queryMonth; i < 12; i++) {
    overallRevenue[i] = 0;
    overallProfit[i] = 0;
  }
  
  // 각 부문별 데이터 추가
  divisionOrder.forEach((divisionName) => {
    const group = divisionGroups[divisionName];
    if (!group || !group.revenue) return;
    
    const revenueItem = group.revenue;
    const profitItem = group.profit;
    
    monthlyDetails.push({
      PARENT_DIVISION_TYPE: divisionName,
      DIVISION_TYPE: '매출',
      COLUMN1: revenueItem.COLUMN1,
      COLUMN2: revenueItem.COLUMN2,
      COLUMN3: revenueItem.COLUMN3,
      COLUMN4: revenueItem.COLUMN4,
      COLUMN5: revenueItem.COLUMN5,
      COLUMN6: revenueItem.COLUMN6,
      COLUMN7: revenueItem.COLUMN7,
      COLUMN8: revenueItem.COLUMN8,
      COLUMN9: revenueItem.COLUMN9,
      COLUMN10: revenueItem.COLUMN10,
      COLUMN11: revenueItem.COLUMN11,
      COLUMN12: revenueItem.COLUMN12,
      COLUMN13: revenueItem.COLUMN13
    });
    
    if (profitItem) {
      monthlyDetails.push({
        PARENT_DIVISION_TYPE: divisionName,
        DIVISION_TYPE: '영업이익',
        COLUMN1: profitItem.COLUMN1,
        COLUMN2: profitItem.COLUMN2,
        COLUMN3: profitItem.COLUMN3,
        COLUMN4: profitItem.COLUMN4,
        COLUMN5: profitItem.COLUMN5,
        COLUMN6: profitItem.COLUMN6,
        COLUMN7: profitItem.COLUMN7,
        COLUMN8: profitItem.COLUMN8,
        COLUMN9: profitItem.COLUMN9,
        COLUMN10: profitItem.COLUMN10,
        COLUMN11: profitItem.COLUMN11,
        COLUMN12: profitItem.COLUMN12,
        COLUMN13: profitItem.COLUMN13
      });
    }
  });
  
  // "합계" 행 추가를 위한 총계 계산 (조회한 월까지만 합산)
  const overallRevenueTotal = overallRevenue.slice(0, queryMonth).reduce((sum, val) => sum + val, 0);
  const overallProfitTotal = overallProfit.slice(0, queryMonth).reduce((sum, val) => sum + val, 0);
  
  // "합계" 행 추가
  monthlyDetails.push({
    PARENT_DIVISION_TYPE: '합계',
    DIVISION_TYPE: '매출',
    COLUMN1: overallRevenue[0],
    COLUMN2: overallRevenue[1],
    COLUMN3: overallRevenue[2],
    COLUMN4: overallRevenue[3],
    COLUMN5: overallRevenue[4],
    COLUMN6: overallRevenue[5],
    COLUMN7: overallRevenue[6],
    COLUMN8: overallRevenue[7],
    COLUMN9: overallRevenue[8],
    COLUMN10: overallRevenue[9],
    COLUMN11: overallRevenue[10],
    COLUMN12: overallRevenue[11],
    COLUMN13: overallRevenueTotal
  });
  
  monthlyDetails.push({
    PARENT_DIVISION_TYPE: '합계',
    DIVISION_TYPE: '영업이익',
    COLUMN1: overallProfit[0],
    COLUMN2: overallProfit[1],
    COLUMN3: overallProfit[2],
    COLUMN4: overallProfit[3],
    COLUMN5: overallProfit[4],
    COLUMN6: overallProfit[5],
    COLUMN7: overallProfit[6],
    COLUMN8: overallProfit[7],
    COLUMN9: overallProfit[8],
    COLUMN10: overallProfit[9],
    COLUMN11: overallProfit[10],
    COLUMN12: overallProfit[11],
    COLUMN13: overallProfitTotal
  });
  
  // 백엔드 데이터로부터 차트용 데이터 생성
  const chartData = generateChartDataFromBackend(processedData, selectedYear, selectedMonth);
  
  const result = {
    divisionCards: generateDivisionCardsFromBackend(processedData, selectedMonth),
    divisionTable: {
      monthlyDetails: monthlyDetails,
      monthLabels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], // 1~12월 고정
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
  // 1~12월 고정
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  
  // 조회한 월 정보 (selectedMonth가 없으면 현재 월 사용)
  const queryMonth = selectedMonth || new Date().getMonth() + 1;
  
  // PARENT_DIVISION_TYPE별로 데이터 그룹화
  const divisionGroups: { [key: string]: { revenue?: any; profit?: any } } = {};
  
  backendData.forEach((item: any) => {
    const parentDivision = item.PARENT_DIVISION_TYPE || '기타';
    if (!divisionGroups[parentDivision]) {
      divisionGroups[parentDivision] = {};
    }
    
    if (item.DIVISION_TYPE === '매출') {
      divisionGroups[parentDivision].revenue = item;
    } else if (item.DIVISION_TYPE === '영업이익') {
      divisionGroups[parentDivision].profit = item;
    }
  });
  
  // 부문 순서: 백엔드 응답에서 처음 등장한 PARENT_DIVISION_TYPE 순서
  const divisionOrder = backendData.reduce((acc: string[], item: any) => {
    const p = item.PARENT_DIVISION_TYPE || '기타';
    if (!acc.includes(p)) acc.push(p);
    return acc;
  }, []);

  // 부문별 차트 데이터 생성
  const divisions: any[] = [];
  
  const divisionColors: { [key: string]: string } = {
    '기타': 'cyan',
    '도급': 'pink',
    '운송': 'yellow',
    '창고': 'orange',
    '항공': 'blue',
    '해상': 'emerald'
  };
  
  // 전체 합계 계산용
  const overallRevenue = Array(12).fill(0);
  const overallProfit = Array(12).fill(0);
  
  divisionOrder.forEach((divisionName) => {
    const group = divisionGroups[divisionName];
    if (!group || !group.revenue) return;
    
    const revenueItem = group.revenue;
    const profitItem = group.profit;
    
    const revenue = [
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
    ];
    
    const profit = profitItem 
      ? [
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
        ]
      : Array(12).fill(0);
    
    // 조회한 월 이후의 데이터는 0으로 처리
    for (let i = queryMonth; i < 12; i++) {
      revenue[i] = 0;
      profit[i] = 0;
    }
    
    // 전체 합계에 추가 (조회한 월까지만)
    for (let i = 0; i < queryMonth; i++) {
      overallRevenue[i] += revenue[i];
      overallProfit[i] += profit[i];
    }
    
    divisions.push({
      name: divisionName,
      color: divisionColors[divisionName] || 'blue',
      revenue,
      profit
    });
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