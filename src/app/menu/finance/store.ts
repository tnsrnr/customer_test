import { create } from 'zustand';
import { FinanceData } from './types';

interface FinanceState {
  data: FinanceData | null;
  loading: boolean;
  error: string | null;
  fetchFinanceData: () => Promise<void>;
}

// API 호출 함수들
const fetchTopLeftChartAPI = async (): Promise<any> => {
  try {
    const response = await fetch('/auth/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: '/api/finance/top-left-chart',
        method: 'GET',
      }),
    });

    if (!response.ok) {
      throw new Error('API 호출 실패');
    }

    const result = await response.json();
    return result.data || generateMockTopLeftData();
  } catch (error) {
    console.warn('Top Left Chart API 호출 실패, 목 데이터 사용:', error);
    return generateMockTopLeftData();
  }
};

const fetchTopRightChartAPI = async (): Promise<any> => {
  try {
    const response = await fetch('/auth/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: '/api/finance/top-right-chart',
        method: 'GET',
      }),
    });

    if (!response.ok) {
      throw new Error('API 호출 실패');
    }

    const result = await response.json();
    return result.data || generateMockTopRightData();
  } catch (error) {
    console.warn('Top Right Chart API 호출 실패, 목 데이터 사용:', error);
    return generateMockTopRightData();
  }
};

const fetchBottomChartAPI = async (): Promise<any> => {
  try {
    const response = await fetch('/auth/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: '/api/finance/bottom-chart',
        method: 'GET',
      }),
    });

    if (!response.ok) {
      throw new Error('API 호출 실패');
    }

    const result = await response.json();
    return result.data || generateMockBottomData();
  } catch (error) {
    console.warn('Bottom Chart API 호출 실패, 목 데이터 사용:', error);
    return generateMockBottomData();
  }
};

// 목 데이터 생성 함수들
const generateMockTopLeftData = () => ({
  labels: ['2023', '2024'],
  capital: [8500, 9200],
  debt: [3200, 3500],
  assets: [15000, 16500]
});

const generateMockTopRightData = () => ({
  labels: ['2024', '2025'],
  shortTermLoan: [1800, 2100],
  longTermLoan: [1400, 1600]
});

const generateMockBottomData = () => ({
  labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
  totalLoan: [2800, 3100, 2900, 3200, 3500, 3800, 3600, 3900, 3200, 3700],
  debtRatio: [18.7, 20.0, 19.3, 20.0, 23.3, 25.3, 24.0, 26.0, 21.3, 22.4]
});

// 데이터 파싱 함수
const parseFinanceData = (topLeftData: any, topRightData: any, bottomData: any): FinanceData => {
  try {
    return {
      topLeftChart: {
        labels: topLeftData.labels || ['2023', '2024'],
        capital: topLeftData.capital || [8500, 9200],
        debt: topLeftData.debt || [3200, 3500],
        assets: topLeftData.assets || [15000, 16500]
      },
      topRightChart: {
        labels: topRightData.labels || ['2024', '2025'],
        shortTermLoan: topRightData.shortTermLoan || [1800, 2100],
        longTermLoan: topRightData.longTermLoan || [1400, 1600]
      },
      bottomChart: {
        labels: bottomData.labels || ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        totalLoan: bottomData.totalLoan || [2800, 3100, 2900, 3200, 3500, 3800, 3600, 3900, 3200, 3700],
        debtRatio: bottomData.debtRatio || [18.7, 20.0, 19.3, 20.0, 23.3, 25.3, 24.0, 26.0, 21.3, 22.4]
      }
    };
  } catch (error) {
    console.error('데이터 파싱 오류:', error);
    return {
      topLeftChart: generateMockTopLeftData(),
      topRightChart: generateMockTopRightData(),
      bottomChart: generateMockBottomData()
    };
  }
};

export const useFinanceStore = create<FinanceState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchFinanceData: async () => {
    set({ loading: true, error: null });
    
    try {
      // 3개의 API를 병렬로 호출
      const [topLeftData, topRightData, bottomData] = await Promise.all([
        fetchTopLeftChartAPI(),
        fetchTopRightChartAPI(),
        fetchBottomChartAPI()
      ]);

      const parsedData = parseFinanceData(topLeftData, topRightData, bottomData);
      set({ data: parsedData, loading: false });
    } catch (error) {
      console.error('재무 데이터 로딩 오류:', error);
      set({ 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.', 
        loading: false 
      });
    }
  },
}));
