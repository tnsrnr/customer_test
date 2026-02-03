import { create } from 'zustand';
import { RegionalPerformanceData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

const num = (v: unknown): number => (v != null && v !== '' ? Number(v) : 0);

// 1번 API: 헤더 4개 카드 데이터 (regional_performance_hd)
const regional_performance_hd = async (year: number, month: number): Promise<RegionalPerformanceData['kpiMetrics']> => {
  const params = createParams(year, month);
  const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/regional_performance_hd`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const responseData = await response.json();
  if (responseData.data && typeof responseData.data === 'string' && responseData.data.includes('<!DOCTYPE html>')) {
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  }
  if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
  const list = responseData.MIS030231 ?? responseData.data ?? responseData.list ?? [];
  const row = Array.isArray(list) && list.length > 0 ? list[0] : responseData;
  return {
    ACTUAL_SALES: Math.round(num(row?.ACTUAL_SALES ?? 0)),
    ACTUAL_SALES_CHANGE: Math.round(num(row?.ACTUAL_SALES_CHANGE ?? 0)),
    ACTUAL_OP_PROFIT: Math.round(num(row?.ACTUAL_OP_PROFIT ?? 0)),
    ACTUAL_OP_PROFIT_CHANGE: Math.round(num(row?.ACTUAL_OP_PROFIT_CHANGE ?? 0)),
    ACTUAL_OP_MARGIN: num(row?.ACTUAL_OP_MARGIN ?? 0),
    ACTUAL_OP_MARGIN_CHANGE: num(row?.ACTUAL_OP_MARGIN_CHANGE ?? 0),
    SALES_ACHIEVEMENT: num(row?.SALES_ACHIEVEMENT ?? 0),
    SALES_ACHIEVEMENT_CHANGE: num(row?.SALES_ACHIEVEMENT_CHANGE ?? 0)
  };
};

// GROUP_CODE → 권역명, 아이콘, variant (코드 접두어 제거 — 백엔드에서 이미 CN/EU/US 등이 붙어 올 수 있음)
const GROUP_CODE_MAP: Record<string, { name: string; icon: string; variant: 'china' | 'asia' | 'europe' | 'usa' }> = {
  china: { name: '중국권역', icon: '🏮', variant: 'china' },
  cn: { name: '중국권역', icon: '🏮', variant: 'china' },
  중국: { name: '중국권역', icon: '🏮', variant: 'china' },
  중국권역: { name: '중국권역', icon: '🏮', variant: 'china' },
  asia: { name: '아시아권역', icon: '🌏', variant: 'asia' },
  아시아: { name: '아시아권역', icon: '🌏', variant: 'asia' },
  아시아권역: { name: '아시아권역', icon: '🌏', variant: 'asia' },
  europe: { name: '유럽권역', icon: '🏛️', variant: 'europe' },
  eu: { name: '유럽권역', icon: '🏛️', variant: 'europe' },
  유럽: { name: '유럽권역', icon: '🏛️', variant: 'europe' },
  유럽권역: { name: '유럽권역', icon: '🏛️', variant: 'europe' },
  usa: { name: '미국권역', icon: '🗽', variant: 'usa' },
  us: { name: '미국권역', icon: '🗽', variant: 'usa' },
  미주: { name: '미국권역', icon: '🗽', variant: 'usa' },
  미국: { name: '미국권역', icon: '🗽', variant: 'usa' },
  미국권역: { name: '미국권역', icon: '🗽', variant: 'usa' }
};

// 표시명에서 CN, EU, US 접두어 제거
function stripCodePrefix(label: string): string {
  return (label || '').replace(/^(CN|EU|US)\s*/i, '').trim() || '기타';
}

function getRegionMeta(groupCode: string) {
  const key = (groupCode || '').trim().toLowerCase().replace(/\s/g, '');
  const mapped = GROUP_CODE_MAP[key];
  if (mapped) return mapped;
  return { name: stripCodePrefix(groupCode), icon: '🌍', variant: 'asia' as const };
}

// 원래 디자인 순서: 중국 → 아시아 → 유럽 → 미국
const REGION_DISPLAY_ORDER: Array<'china' | 'asia' | 'europe' | 'usa'> = ['china', 'asia', 'europe', 'usa'];

// 2번 API: 권역별 카드 데이터 (regional_performance_card) — GROUP_CODE, ACTUAL_SALES, ACTUAL_OP_PROFIT, YTD_ACTUAL_SALES, YTD_ACTUAL_OP_PROFIT, SALES_ACHIEVEMENT_RATE, SALES_OP_ACHIEVEMENT_RATE
const regional_performance_card = async (year: number, month: number): Promise<RegionalPerformanceData['regions']> => {
  const params = createParams(year, month);
  const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/regional_performance_card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const responseData = await response.json();
  if (responseData.data && typeof responseData.data === 'string' && responseData.data.includes('<!DOCTYPE html>')) {
    throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
  }
  if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
  const list = responseData.MIS030231 ?? responseData.data ?? responseData.list ?? [];
  const items = Array.isArray(list) ? list : [];
  const mapped = items.map((item: any) => {
    const meta = getRegionMeta(item.GROUP_CODE ?? item.group_code ?? '');
    return {
      name: meta.name,
      icon: meta.icon,
      variant: meta.variant,
      monthlyData: {
        sales: Math.round(num(item.ACTUAL_SALES ?? item.actual_sales ?? 0)),
        profit: Math.round(num(item.ACTUAL_OP_PROFIT ?? item.actual_op_profit ?? 0) * 100) / 100
      },
      achievement: {
        sales: num(item.SALES_ACHIEVEMENT_RATE ?? item.sales_achievement_rate ?? 0),
        profit: num(item.SALES_OP_ACHIEVEMENT_RATE ?? item.sales_op_achievement_rate ?? 0)
      },
      totalData: {
        sales: Math.round(num(item.YTD_ACTUAL_SALES ?? item.ytd_actual_sales ?? 0)),
        profit: Math.round(num(item.YTD_ACTUAL_OP_PROFIT ?? item.ytd_actual_op_profit ?? 0) * 100) / 100
      }
    };
  });
  // 원래 디자인 순서: 중국 → 아시아 → 유럽 → 미국
  return [...mapped].sort((a, b) => REGION_DISPLAY_ORDER.indexOf(a.variant) - REGION_DISPLAY_ORDER.indexOf(b.variant));
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

// Zustand 스토어 정의
interface RegionalPerformanceStore {
  data: RegionalPerformanceData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: RegionalPerformanceData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useRegionalPerformanceStore = create<RegionalPerformanceStore>((set, get) => {
  // 전역 스토어에서 현재 날짜 가져오기
  const getCurrentDate = () => {
    const globalStore = useGlobalStore.getState();
    return {
      year: globalStore.selectedYear,
      month: globalStore.selectedMonth
    };
  };

  return {
    // 초기 상태
    data: null,
    loading: false,
    error: null,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    // 모든 데이터 조회: 1) regional_performance_hd(헤더 4카드), 2) regional_performance_card(권역 카드)
    fetchAllData: async () => {
      const { year, month } = getCurrentDate();
      set({ currentYear: year, currentMonth: month, loading: true, error: null });
      try {
        const [kpiMetrics, regions] = await Promise.all([
          regional_performance_hd(year, month),
          regional_performance_card(year, month)
        ]);
        set({
          data: { kpiMetrics, regions },
          loading: false
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.';
        set({ error: errorMessage, loading: false });
      }
    },

    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCurrentDate: (year, month) => set({ currentYear: year, currentMonth: month }),
    reset: () => set({ 
      data: null, 
      loading: false, 
      error: null,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    })
  };
});

