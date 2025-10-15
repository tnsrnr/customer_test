import { create } from 'zustand';
import { 
  CompanyVisitAnalysisRaw, 
  ApiResponse, 
  TableRow, 
  FilterState, 
  AnalysisStats, 
  MonthlyStats 
} from './types';

interface CompanyVisitAnalysisStore {
  // 상태
  tableData: TableRow[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  stats: AnalysisStats;
  monthlyStats: MonthlyStats[];

  // 액션
  fetchAnalysisData: (year: number) => Promise<void>;
  transformApiDataToTableRows: (apiData: CompanyVisitAnalysisRaw[]) => TableRow[];
  calculateStats: (tableData: TableRow[]) => AnalysisStats;
  calculateMonthlyStats: (tableData: TableRow[]) => MonthlyStats[];
  setYear: (year: number) => void;
  setBusinessUnitFilter: (businessUnit: string) => void;
  setCategoryFilter: (category: string) => void;
  resetFilters: () => void;
}

export const useCompanyVisitAnalysisStore = create<CompanyVisitAnalysisStore>((set, get) => ({
  // 초기 상태
  tableData: [],
  loading: false,
  error: null,
  filters: {
    year: 2025,
    businessUnitFilter: [],
    teamFilter: [],
    salesPersonFilter: [],
    categoryFilter: [],
  },
  stats: {
    totalVisits: 0,
    totalQuotations: 0,
    totalContracts: 0,
    totalSalesPersons: 0,
    totalTeams: 0,
    totalBusinessUnits: 0,
  },
  monthlyStats: [],

  // API 호출
  fetchAnalysisData: async (year: number) => {
    set({ loading: true, error: null });

    try {
      const requestData = {
        MIS030306F1: {
          BASE_YEAR: year.toString(),
        },
        page: 1,
        start: 0,
        limit: 25,
        pageId: "MIS030306T"
      };


      const response = await fetch('/auth/api/proxy?path=/api/MIS030306SVC/getDivision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: ApiResponse = await response.json();

      if (apiData.MSG === "정상적으로 처리되었습니다." && apiData.MIS030306G1) {
        const transformedData = get().transformApiDataToTableRows(apiData.MIS030306G1);
        const stats = get().calculateStats(transformedData);
        const monthlyStats = get().calculateMonthlyStats(transformedData);
        
        
        set({ 
          tableData: transformedData,
          stats,
          monthlyStats,
          filters: { ...get().filters, year }
        });
      } else {
        console.warn('⚠️ API 응답이 예상과 다름:', apiData);
        set({ tableData: [] });
      }
    } catch (error) {
      console.error('❌ API 호출 오류:', error);
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류' });
    } finally {
      set({ loading: false });
    }
  },

  // 데이터 변환
  transformApiDataToTableRows: (apiData: CompanyVisitAnalysisRaw[]): TableRow[] => {

    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    const rows: TableRow[] = [];
    const businessUnitTotals = new Map<string, Map<string, number[]>>(); // 사업부별 합계

    // 원본 데이터를 행으로 변환
    apiData.forEach((item) => {
      const monthlyData = [
        item.AMT_01, item.AMT_02, item.AMT_03, item.AMT_04, item.AMT_05, item.AMT_06,
        item.AMT_07, item.AMT_08, item.AMT_09, item.AMT_10, item.AMT_11, item.AMT_12
      ];

      const row: TableRow = {
        businessUnit: item.PARENTS_DEPT_NAME,  // 상위 부서명 (사업부)
        team: item.DEPT_NAME,                  // 부서명 (팀)
        salesPerson: item.USER_NAME_LOC,       // 사용자명 (담당자)
        category: item.SALES_TYPE_NAME,        // 영업 타입명 (분류)
        monthlyData,
        total: item.AMT_SUM,                   // 합계
        isTotalRow: false,
        isBusinessUnitTotal: false,
      };

      rows.push(row);

      // 사업부별 합계 계산
      if (!businessUnitTotals.has(item.PARENTS_DEPT_NAME)) {
        businessUnitTotals.set(item.PARENTS_DEPT_NAME, new Map());
      }
      const businessUnitMap = businessUnitTotals.get(item.PARENTS_DEPT_NAME)!;
      
      if (!businessUnitMap.has(item.SALES_TYPE_NAME)) {
        businessUnitMap.set(item.SALES_TYPE_NAME, new Array(12).fill(0));
      }
      const categoryTotals = businessUnitMap.get(item.SALES_TYPE_NAME)!;
      
      monthlyData.forEach((value, index) => {
        categoryTotals[index] += value;
      });
    });


    return rows;
  },

  // 통계 계산
  calculateStats: (tableData: TableRow[]): AnalysisStats => {
    const stats: AnalysisStats = {
      totalVisits: 0,
      totalQuotations: 0,
      totalContracts: 0,
      totalSalesPersons: 0,
      totalTeams: 0,
      totalBusinessUnits: 0,
    };

    const uniqueSalesPersons = new Set<string>();
    const uniqueTeams = new Set<string>();
    const uniqueBusinessUnits = new Set<string>();

    tableData.forEach((row) => {
      if (!row.isTotalRow) {
        uniqueSalesPersons.add(row.salesPerson);
        uniqueTeams.add(`${row.businessUnit}_${row.team}`);
        uniqueBusinessUnits.add(row.businessUnit);

        switch (row.category) {
          case '방문이력':
            stats.totalVisits += row.total;
            break;
          case '견적':
            stats.totalQuotations += row.total;
            break;
          case '계약':
            stats.totalContracts += row.total;
            break;
        }
      }
    });

    stats.totalSalesPersons = uniqueSalesPersons.size;
    stats.totalTeams = uniqueTeams.size;
    stats.totalBusinessUnits = uniqueBusinessUnits.size;

    return stats;
  },

  // 월별 통계 계산
  calculateMonthlyStats: (tableData: TableRow[]): MonthlyStats[] => {
    const monthlyStats: MonthlyStats[] = [];
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', 
                       '7월', '8월', '9월', '10월', '11월', '12월'];

    for (let month = 0; month < 12; month++) {
      const monthStat: MonthlyStats = {
        month: monthNames[month],
        visits: 0,
        quotations: 0,
        contracts: 0,
        total: 0,
      };

      tableData.forEach((row) => {
        if (!row.isTotalRow) {
          const value = row.monthlyData[month];
          switch (row.category) {
            case '방문이력':
              monthStat.visits += value;
              break;
            case '견적':
              monthStat.quotations += value;
              break;
            case '계약':
              monthStat.contracts += value;
              break;
          }
          monthStat.total += value;
        }
      });

      monthlyStats.push(monthStat);
    }

    return monthlyStats;
  },

  // 필터 액션들
  setYear: (year: number) => set(state => ({
    filters: { ...state.filters, year }
  })),

  setBusinessUnitFilter: (businessUnit: string) => set(state => ({
    filters: { ...state.filters, businessUnitFilter: businessUnit ? [businessUnit] : [] }
  })),

  setCategoryFilter: (category: string) => set(state => ({
    filters: { ...state.filters, categoryFilter: category ? [category] : [] }
  })),

  resetFilters: () => set(state => ({
    filters: {
      year: state.filters.year,
      businessUnitFilter: [],
      teamFilter: [],
      salesPersonFilter: [],
      categoryFilter: [],
    }
  })),
}));