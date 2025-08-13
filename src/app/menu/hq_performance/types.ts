// 그리드 테이블 컬럼 정의
export interface GridColumn {
  key: string;
  label: string;
  colSpan?: number;
}

// HQ Performance 데이터 타입 정의
export interface HQPerformanceData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    revenue: number;              // 매출
    grossProfit: number;         // 매출총이익
    operatingIncome: number;     // 영업이익
    operatingMargin: number;     // 영업이익율
    revenueChange: number;       // 매출 변화
    grossProfitChange: number;   // 매출총이익 변화
    operatingIncomeChange: number;  // 영업이익 변화
    operatingMarginChange: number;  // 영업이익율 변화
  };
  // 2번째 API: 중간 그리드 테이블 데이터
  gridData: {
    monthlyDetails: Array<{
      category: string;          // 항목명
      jan: number;              // 1월
      feb: number;              // 2월
      mar: number;              // 3월
      apr: number;              // 4월
      may: number;              // 5월
      total: number;            // 합계
      growth: string;           // 성장률
    }>;
  };
  // 3번째 API: 차트 데이터
  chartData: {
    revenueChart: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        borderWidth?: number;
        borderDash?: number[];
      }>;
    };
    profitChart: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        borderWidth?: number;
        borderDash?: number[];
      }>;
    };
  };
}

// 그리드 테이블 컬럼 설정
export const GRID_COLUMNS: GridColumn[] = [
  { key: 'category', label: '구분' },
  { key: 'jan', label: '1월' },
  { key: 'feb', label: '2월' },
  { key: 'mar', label: '3월' },
  { key: 'apr', label: '4월' },
  { key: 'may', label: '5월' },
  { key: 'total', label: '합계' },
  { key: 'growth', label: '성장률' }
];

// 그리드 테이블 헤더 설정
export const GRID_HEADERS = {
  topRow: [
    { key: 'category', label: '항목', colSpan: 1 },
    { key: 'monthly', label: '월별', colSpan: 5 },
    { key: 'total', label: '합계', colSpan: 1 },
    { key: 'growth', label: '성장률', colSpan: 1 }
  ]
};
