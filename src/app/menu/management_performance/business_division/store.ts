import { create } from 'zustand';
import { BusinessDivisionData } from './types';
import { useGlobalStore } from '@/global/store/slices/global';

// API 호출과 데이터 처리를 하나로 합친 함수들
const business_division_header = async (year: number, month: number): Promise<BusinessDivisionData['kpiMetrics']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/business_division_header`, {
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
      const kpiData = responseData.MIS030231[0];
      
      return {
        division1: kpiData.DIVISION1 || 0,
        division2: kpiData.DIVISION2 || 0,
        division3: kpiData.DIVISION3 || 0,
        total: kpiData.TOTAL || 0,
        division1Change: kpiData.DIVISION1CHANGE || 0,
        division2Change: kpiData.DIVISION2CHANGE || 0,
        division3Change: kpiData.DIVISION3CHANGE || 0,
        totalChange: kpiData.TOTALCHANGE || 0
      };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('KPI 데이터 조회 실패:', error);
    throw error;
  }
};

const business_division_grid = async (year: number, month: number): Promise<BusinessDivisionData['gridData']> => {
  try {
    const params = createParams(year, month);
    const response = await fetch(`/auth/api/proxy?path=/api/MIS030231SVC/business_division_grid`, {
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
      const divisions = responseData.MIS030231.map((item: any) => ({
        division_name: item.DIVISION_NAME || '',
        q1: item.Q1 || 0,
        q2: item.Q2 || 0,
        q3: item.Q3 || 0,
        q4: item.Q4 || 0,
        currentSales: item.CURRENT_SALES || 0,
        currentProfit: item.CURRENT_PROFIT || 0,
        previousMonth: item.PREVIOUS_MONTH || 0,
        currentMonth: item.CURRENT_MONTH || 0,
        change: item.CHANGE || 0,
        groupCategory: item.GROUP_CATEGORY || ''
      }));
      
      return { divisions };
    }
    
    throw new Error('데이터 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('그리드 데이터 조회 실패:', error);
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

interface BusinessDivisionStore {
  data: BusinessDivisionData | null;
  loading: boolean;
  error: string | null;
  currentYear: number;
  currentMonth: number;
  
  fetchAllData: () => Promise<void>;
  setData: (data: BusinessDivisionData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDate: (year: number, month: number) => void;
  reset: () => void;
}

export const useBusinessDivisionStore = create<BusinessDivisionStore>((set, get) => {
  return {
    data: null,
    loading: false,
    error: null,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,

    fetchAllData: async () => {
      // global store에서 현재 선택된 날짜 가져오기
      const { selectedYear, selectedMonth } = useGlobalStore.getState();
      const currentYear = selectedYear || new Date().getFullYear();
      const currentMonth = selectedMonth || new Date().getMonth() + 1;
      
      // store의 현재 날짜도 업데이트
      set({ currentYear, currentMonth });
      
      // 하드코딩 데이터 사용
      console.log('🎯 사업부실적 데이터: 하드코딩 데이터를 사용합니다.');
      
      const hardcodedData: BusinessDivisionData = {
        kpiMetrics: {
          division1: Math.round(50350508568 / 100000000),  // 글로벌영업1팀 Revenue (억원)
          division2: Math.round(26194356073 / 100000000),  // 글로벌영업2팀 Revenue (억원)
          division3: Math.round(20990054144 / 100000000),  // 글로벌영업3팀 Revenue (억원)
          total: Math.round(112569749022 / 100000000),     // 총합계 Revenue (억원)
          division1Change: Math.round(-10400047551 / 100000000),  // 글로벌영업1팀 변화 (억원)
          division2Change: Math.round(632363601 / 100000000),      // 글로벌영업2팀 변화 (억원)
          division3Change: Math.round(-7719539659 / 100000000),   // 글로벌영업3팀 변화 (억원)
          totalChange: Math.round(-17312151587 / 100000000)       // 총합계 변화 (억원)
        },
        gridData: {
          divisions: [
            // 글로벌영업1팀
            { team_name: '글로벌영업1팀', account_name: 'Revenue', year2025: 50350508568, year2024: 60750556119, yoyAmount: -10400047551, yoyPercent: -17.12, groupCategory: '' },
            { team_name: '글로벌영업1팀', account_name: 'Cost', year2025: 45841444448, year2024: 53398539984, yoyAmount: -7557095536, yoyPercent: -14.15, groupCategory: '' },
            { team_name: '글로벌영업1팀', account_name: '직접경비', year2025: 3006076423, year2024: 2889531754, yoyAmount: 116544669, yoyPercent: 4.03, groupCategory: '' },
            { team_name: '글로벌영업1팀', account_name: 'Profit', year2025: 1502987697, year2024: 4462484381, yoyAmount: -2959496684, yoyPercent: -66.32, groupCategory: '' },
            { team_name: '글로벌영업1팀', account_name: '간접경비', year2025: 2685174470, year2024: 2688921281, yoyAmount: -3746811, yoyPercent: -0.14, groupCategory: '' },
            { team_name: '글로벌영업1팀', account_name: '영업이익', year2025: -1182186773, year2024: 1773563100, yoyAmount: -2955749873, yoyPercent: -166.66, groupCategory: '' },
            { team_name: '글로벌영업1팀', account_name: '방문횟수', year2025: 103, year2024: 66, yoyAmount: 37, yoyPercent: 56.06, groupCategory: '' },
            
            // 글로벌영업2팀
            { team_name: '글로벌영업2팀', account_name: 'Revenue', year2025: 26194356073, year2024: 25561992472, yoyAmount: 632363601, yoyPercent: 2.47, groupCategory: '' },
            { team_name: '글로벌영업2팀', account_name: 'Cost', year2025: 24078793810, year2024: 23535348607, yoyAmount: 543445203, yoyPercent: 2.31, groupCategory: '' },
            { team_name: '글로벌영업2팀', account_name: '직접경비', year2025: 1518520744, year2024: 1147778949, yoyAmount: 370741795, yoyPercent: 32.3, groupCategory: '' },
            { team_name: '글로벌영업2팀', account_name: 'Profit', year2025: 597041519, year2024: 878864916, yoyAmount: -281823397, yoyPercent: -32.07, groupCategory: '' },
            { team_name: '글로벌영업2팀', account_name: '간접경비', year2025: 1391432838, year2024: 1148861209, yoyAmount: 242571629, yoyPercent: 21.11, groupCategory: '' },
            { team_name: '글로벌영업2팀', account_name: '영업이익', year2025: -794391319, year2024: -269996293, yoyAmount: -524395026, yoyPercent: -194.22, groupCategory: '' },
            { team_name: '글로벌영업2팀', account_name: '방문횟수', year2025: 37, year2024: 62, yoyAmount: -25, yoyPercent: -40.32, groupCategory: '' },
            
            // 글로벌영업3팀
            { team_name: '글로벌영업3팀', account_name: 'Revenue', year2025: 20990054144, year2024: 28709593803, yoyAmount: -7719539659, yoyPercent: -26.89, groupCategory: '' },
            { team_name: '글로벌영업3팀', account_name: 'Cost', year2025: 18218242179, year2024: 26186653312, yoyAmount: -7968411133, yoyPercent: -30.43, groupCategory: '' },
            { team_name: '글로벌영업3팀', account_name: '직접경비', year2025: 1250543954, year2024: 1362315486, yoyAmount: -111771532, yoyPercent: -8.2, groupCategory: '' },
            { team_name: '글로벌영업3팀', account_name: 'Profit', year2025: 1521268011, year2024: 1160625005, yoyAmount: 360643006, yoyPercent: 31.07, groupCategory: '' },
            { team_name: '글로벌영업3팀', account_name: '간접경비', year2025: 1112972804, year2024: 1298112943, yoyAmount: -185140139, yoyPercent: -14.26, groupCategory: '' },
            { team_name: '글로벌영업3팀', account_name: '영업이익', year2025: 408295207, year2024: -137487938, yoyAmount: 545783145, yoyPercent: 396.97, groupCategory: '' },
            { team_name: '글로벌영업3팀', account_name: '방문횟수', year2025: 125, year2024: 72, yoyAmount: 53, yoyPercent: 73.61, groupCategory: '' },
            
            // 해상영업그룹
            { team_name: '해상영업그룹', account_name: 'Revenue', year2025: 2725749656, year2024: 2832720855, yoyAmount: -106971199, yoyPercent: -3.78, groupCategory: '' },
            { team_name: '해상영업그룹', account_name: 'Cost', year2025: 2399192600, year2024: 2524973483, yoyAmount: -125780883, yoyPercent: -4.98, groupCategory: '' },
            { team_name: '해상영업그룹', account_name: '직접경비', year2025: 160773563, year2024: 132675521, yoyAmount: 28098042, yoyPercent: 21.18, groupCategory: '' },
            { team_name: '해상영업그룹', account_name: 'Profit', year2025: 165783493, year2024: 175071851, yoyAmount: -9288358, yoyPercent: -5.31, groupCategory: '' },
            { team_name: '해상영업그룹', account_name: '간접경비', year2025: 145230777, year2024: 126705252, yoyAmount: 18525525, yoyPercent: 14.62, groupCategory: '' },
            { team_name: '해상영업그룹', account_name: '영업이익', year2025: 20552716, year2024: 48366599, yoyAmount: -27813883, yoyPercent: -57.51, groupCategory: '' },
            { team_name: '해상영업그룹', account_name: '방문횟수', year2025: 54, year2024: 23, yoyAmount: 31, yoyPercent: 134.78, groupCategory: '' },
            
            // 기타
            { team_name: '기타', account_name: 'Revenue', year2025: 12309080581, year2024: 12027037360, yoyAmount: 282043221, yoyPercent: 2.35, groupCategory: '' },
            { team_name: '기타', account_name: 'Cost', year2025: 10630907236, year2024: 11517479022, yoyAmount: -886571786, yoyPercent: -7.70, groupCategory: '' },
            { team_name: '기타', account_name: '직접경비', year2025: 733769618, year2024: 553861290, yoyAmount: 179908328, yoyPercent: 32.48, groupCategory: '' },
            { team_name: '기타', account_name: 'Profit', year2025: 944403727, year2024: -44302952, yoyAmount: 988706679, yoyPercent: 2231.69, groupCategory: '' },
            { team_name: '기타', account_name: '간접경비', year2025: 660678013, year2024: 537712993, yoyAmount: 122965020, yoyPercent: 22.87, groupCategory: '' },
            { team_name: '기타', account_name: '영업이익', year2025: 283725714, year2024: -582015945, yoyAmount: 865741659, yoyPercent: 148.75, groupCategory: '' },
            { team_name: '기타', account_name: '방문횟수', year2025: 0, year2024: 0, yoyAmount: 0, yoyPercent: 0, groupCategory: '' },
            
            // 총합계
            { team_name: '총합계', account_name: 'Revenue', year2025: 112569749022, year2024: 129881900609, yoyAmount: -17312151587, yoyPercent: -13.33, groupCategory: '' },
            { team_name: '총합계', account_name: 'Cost', year2025: 101168580273, year2024: 117162994408, yoyAmount: -15994414135, yoyPercent: -13.65, groupCategory: '' },
            { team_name: '총합계', account_name: '직접경비', year2025: 6669684302, year2024: 6086163000, yoyAmount: 583521302, yoyPercent: 9.59, groupCategory: '' },
            { team_name: '총합계', account_name: 'Profit', year2025: 4731484447, year2024: 6632743201, yoyAmount: -1901258754, yoyPercent: -28.66, groupCategory: '' },
            { team_name: '총합계', account_name: '간접경비', year2025: 5995488902, year2024: 5800313678, yoyAmount: 195175224, yoyPercent: 3.36, groupCategory: '' },
            { team_name: '총합계', account_name: '영업이익', year2025: -1264004455, year2024: 832429523, yoyAmount: -2096433978, yoyPercent: -251.85, groupCategory: '' },
            { team_name: '총합계', account_name: '방문횟수', year2025: 319, year2024: 223, yoyAmount: 96, yoyPercent: 43.05, groupCategory: '' }
          ]
        }
      };
      
      set({ data: hardcodedData, loading: false, error: null });
    },

    setData: (data) => set({ data }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setCurrentDate: (year, month) => set({ currentYear: year, currentMonth: month }),
    reset: () => set({ data: null, loading: false, error: null })
  };
});

