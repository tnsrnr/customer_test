import { create } from 'zustand';
import { FinanceData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

const finance_overview_kpi = async (year: number, month: number): Promise<FinanceData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/finance_overview_kpi`, {
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

    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const kpiData = responseData.MIS030231[0];
      
      return {
        totalAssets: kpiData.TOTALASSETS || 0,
        totalLiabilities: kpiData.TOTALLIABILITIES || 0,
        totalEquity: kpiData.TOTALEQUITY || 0,
        debtWeight: kpiData.DEBTWEIGHT || 0,
        totalAssetsChange: kpiData.TOTALASSETSCHANGE || 0,
        totalLiabilitiesChange: kpiData.TOTALLIABILITIESCHANGE || 0,
        totalEquityChange: kpiData.TOTALEQUITYCHANGE || 0,
        debtWeightChange: kpiData.DEBTWEIGHTCHANGE || 0
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    throw error;
  }
};

const finance_overview_charts = async (year: number, month: number): Promise<FinanceData['chartData']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/finance_overview_charts`, {
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
    
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const chartData = responseData.MIS030231[0];
      
      const capitalStructure = {
        labels: chartData.CAPITALSTRUCTURE_LABELS || [`${year-1}`, `${year}`],
        capital: chartData.CAPITALSTRUCTURE_CAPITAL || [chartData.PREVTOTALEQUITY || 0, chartData.TOTALEQUITY || 0],
        debt: chartData.CAPITALSTRUCTURE_DEBT || [chartData.PREVTOTALLIABILITIES || 0, chartData.TOTALLIABILITIES || 0],
        assets: chartData.CAPITALSTRUCTURE_ASSETS || [chartData.PREVTOTALASSETS || 0, chartData.TOTALASSETS || 0]
      };
      
      const loanStructure = {
        labels: chartData.LOANSTRUCTURE_LABELS || [`${year-1}`, `${year}`],
        shortTermLoan: chartData.LOANSTRUCTURE_SHORTTERMLOAN || [chartData.PREVTOTALSHORTLOAN || 0, chartData.TOTALSHORTLOAN || 0],
        longTermLoan: chartData.LOANSTRUCTURE_LONGTERMLOAN || [chartData.PREVTOTALLONGLOAN || 0, chartData.TOTALLONGLOAN || 0],
        totalLoan: chartData.LOANSTRUCTURE_TOTALLOAN || [
          (chartData.PREVTOTALSHORTLOAN || 0) + (chartData.PREVTOTALLONGLOAN || 0),
          (chartData.TOTALSHORTLOAN || 0) + (chartData.TOTALLONGLOAN || 0)
        ]
      };
      
      return { capitalStructure, loanStructure };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    throw error;
  }
};

const finance_overview_trends = async (year: number, month: number): Promise<FinanceData['trendData']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/finance_overview_trends`, {
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
    
    if (responseData.MIS030231 && responseData.MIS030231.length > 0) {
      const trendData = responseData.MIS030231[0];
      
      // 백엔드에서 배열로 받는 경우
      if (Array.isArray(trendData.TOTALLOAN) && trendData.TOTALLOAN.length > 0) {
        return {
          labels: trendData.LABELS || [],
          totalLoan: trendData.TOTALLOAN || [],
          debtRatio: trendData.DEBTRATIO || []
        };
      }
      
      // 백엔드에서 개별 필드로 받는 경우 (TOTALLOAN_0, TOTALLOAN_1, ...)
      // 0부터 9까지: year-9부터 year까지 (예: 2025년이면 2016~2025)
      const totalLoanArray: number[] = [];
      const debtRatioArray: number[] = [];
      const labelsArray: string[] = [];
      
      for (let i = 0; i <= 9; i++) {
        labelsArray.push((year - 9 + i).toString());
        totalLoanArray.push(trendData[`TOTALLOAN_${i}`] || 0);
        debtRatioArray.push(trendData[`DEBTRATIO_${i}`] || 0);
      }
      
      return {
        labels: labelsArray,
        totalLoan: totalLoanArray,
        debtRatio: debtRatioArray
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    throw error;
  }
};

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

interface FinanceStore {
  data: FinanceData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: FinanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useFinanceStore = create<FinanceStore>((set, get) => {
  return {
    data: null,
    loading: false,
    error: null,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    fetchAllData: async () => {
      const { selectedYear, selectedMonth } = useGlobalStore.getState();
      const currentYear = selectedYear || new Date().getFullYear();
      const currentMonth = selectedMonth || new Date().getMonth() + 1;
      
      set({ currentYear, currentMonth, loading: true, error: null });
      
      try {
        const [kpiMetrics, chartData, trendData] = await Promise.all([
          finance_overview_kpi(currentYear, currentMonth),
          finance_overview_charts(currentYear, currentMonth),
          finance_overview_trends(currentYear, currentMonth)
        ]);

        const combinedData: FinanceData = {
          kpiMetrics,
          chartData,
          trendData
        };

        set({ data: combinedData, loading: false });
      } catch (error) {
        set({ loading: false, error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' });
      }
    },

    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCurrentDate: (year, month) => set({ currentYear: year, currentMonth: month }),
    reset: () => set({ data: null, loading: false, error: null })
  };
});
