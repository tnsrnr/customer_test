import { create } from 'zustand';
import { HQPerformanceData } from './types';

interface HQPerformanceStore {
  data: HQPerformanceData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  fetchAllData: () => Promise<void>;
  setCurrentYear: (year: number) => void;
  setCurrentMonth: (month: number) => void;
}

// Mock 데이터 생성 함수
const generateMockData = (): HQPerformanceData => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  // 12개월 라벨 생성 (현재월 기준으로 12개월 전부터)
  const generateMonthLabels = (): string[] => {
    const labels: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      labels.push(`${month}월`);
    }
    return labels;
  };
  
  // 12개월 매출 데이터 생성 (올해)
  const generateRevenueData = (): number[] => {
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      // 150~220 범위의 랜덤한 매출 데이터
      const revenue = Math.floor(Math.random() * 71) + 150;
      data.push(revenue);
    }
    return data;
  };
  
  // 1년 전 매출 데이터 생성
  const generateLastYearRevenueData = (): number[] => {
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      // 1년 전 데이터는 더 낮은 수준으로 생성 (120~180 범위)
      const revenue = Math.floor(Math.random() * 61) + 120;
      data.push(revenue);
    }
    return data;
  };
  
  // 12개월 영업이익 데이터 생성 (올해)
  const generateProfitData = (revenueData: number[]) => {
    return revenueData.map((revenue) => {
      // 매출의 85~90%를 매출원가로 가정
      const costRatio = 0.85 + Math.random() * 0.05;
      const cost = Math.floor(revenue * costRatio);
      const grossProfit = revenue - cost;
      const operatingExpense = Math.floor(Math.random() * 15) + 5; // 5~20
      return parseFloat((grossProfit - operatingExpense).toFixed(1));
    });
  };
  
  // 1년 전 영업이익 데이터 생성
  const generateLastYearProfitData = () => {
    const data: number[] = [];
    for (let i = 0; i < 12; i++) {
      // 1년 전 데이터는 더 낮은 수준으로 생성 (-5~15 범위)
      const profit = (Math.random() * 20) - 5;
      data.push(parseFloat(profit.toFixed(1)));
    }
    return data;
  };
  
  const monthLabels = generateMonthLabels();
  const revenueData = generateRevenueData();
  const lastYearRevenueData = generateLastYearRevenueData();
  const profitData = generateProfitData(revenueData);
  const lastYearProfitData = generateLastYearProfitData();
  
  return {
    kpiMetrics: {
      revenue: 934,
      costOfSales: 900,
      grossProfit: 34,
      operatingExpense: 43,
      operatingIncome: -8.6,
      operatingMargin: -0.92,
      revenueChange: -11,
      costOfSalesChange: -13,
      grossProfitChange: 50,
      operatingExpenseChange: 3,
      operatingIncomeChange: 0,
      operatingMarginChange: 0
    },
    gridData: {
      monthlyDetails: [
        {
          category: '매출',
          jan: 175,
          feb: 165,
          mar: 195,
          apr: 211,
          may: 188,
          total: 934,
          growth: '▼11%'
        },
        {
          category: '매출원가',
          jan: 169,
          feb: 160,
          mar: 187,
          apr: 205,
          may: 179,
          total: 900,
          growth: '▼13%'
        },
        {
          category: '매출총이익',
          jan: 5.6,
          feb: 5.9,
          mar: 8.1,
          apr: 5.7,
          may: 8.6,
          total: 34,
          growth: '▲50%'
        },
        {
          category: '관리비',
          jan: 8.6,
          feb: 9.1,
          mar: 8.1,
          apr: 8.3,
          may: 8.5,
          total: 43,
          growth: '▲3%'
        },
        {
          category: '영업이익',
          jan: -3.0,
          feb: -3.2,
          mar: 0.1,
          apr: -2.6,
          may: 0.0,
          total: -8.6,
          growth: '손익분기점'
        },
        {
          category: '영업이익율',
          jan: -1.73,
          feb: -1.91,
          mar: 0.03,
          apr: -1.22,
          may: 0.03,
          total: -0.92,
          growth: '개선'
        }
      ]
    },
    chartData: {
      revenueChart: {
        labels: monthLabels.slice(0, 6),
        datasets: [
          {
            label: '매출 (올해)',
            data: revenueData.slice(0, 6),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2
          },
          {
            label: '매출 (1년 전)',
            data: lastYearRevenueData.slice(0, 6),
            borderColor: 'rgb(156, 163, 175)',
            backgroundColor: 'rgba(156, 163, 175, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      profitChart: {
        labels: monthLabels.slice(6, 12),
        datasets: [
          {
            label: '영업이익 (올해)',
            data: profitData.slice(6, 12),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2
          },
          {
            label: '영업이익 (1년 전)',
            data: lastYearProfitData.slice(6, 12),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      }
    }
  };
};

export const useHQPerformanceStore = create<HQPerformanceStore>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,

  fetchAllData: async () => {
    set({ loading: true, error: null });
    
    try {
      // 실제 API 호출 대신 Mock 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 지연
      
      const mockData = generateMockData();
      set({ 
        data: mockData, 
        loading: false,
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '데이터 로드 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
  },

  setCurrentYear: (year: number) => {
    set({ currentYear: year });
  },

  setCurrentMonth: (month: number) => {
    set({ currentMonth: month });
  }
}));
