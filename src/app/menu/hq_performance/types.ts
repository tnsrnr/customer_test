// 그리드 테이블 컬럼 정의
export interface GridColumn {
  key: string;
  label: string;
  colSpan?: number;
}

// 고정 월별 데이터 인터페이스 (컬럼명은 고정, 라벨만 동적)
export interface MonthlyDetailData {
  category: string;          // 항목명
  month1: number;           // 고정 컬럼명 (1번째 월)
  month2: number;           // 고정 컬럼명 (2번째 월)
  month3: number;           // 고정 컬럼명 (3번째 월)
  month4: number;           // 고정 컬럼명 (4번째 월)
  month5: number;           // 고정 컬럼명 (5번째 월)
  total: number;            // 합계
  growth: string;           // 성장률
}

// HQ Performance 데이터 타입 정의
export interface HQPerformanceData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    actualSales: number;              // ACTUAL_SALES - 현재 매출액
    actualSalesChange: number;        // ACTUAL_SALES_CHANGE - 전월대비 매출 증가액
    actualPurchases: number;          // ACTUAL_PURCHASES - 현재 매입액
    actualPurchasesChange: number;    // ACTUAL_PURCHASES_CHANGE - 전월대비 매입 증가액
    actualOpProfit: number;           // ACTUAL_OP_PROFIT - 실제 영업이익
    actualOpProfitChange: number;     // ACTUAL_OP_PROFIT_CHANGE - 전월대비 영업이익 증가액
    actualOpMargin: number;           // ACTUAL_OP_MARGIN - 현재 영업이익률
    actualOpMarginChange: number;     // ACTUAL_OP_MARGIN_CHANGE - 전월대비 영업이익률 증가액
  };
  // 2번째 API: 중간 그리드 테이블 데이터 (고정 컬럼명)
  gridData: {
    monthlyDetails: MonthlyDetailData[];
    monthLabels: string[];      // 월 라벨 배열 (예: ['1월', '2월', '3월', '4월', '5월'])
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

// 고정 컬럼명 기반 그리드 컬럼 생성 함수
export const generateGridColumns = (monthLabels: string[]): GridColumn[] => {
  const columns: GridColumn[] = [
    { key: 'category', label: '구분' }
  ];
  
  // 고정 컬럼명에 동적 라벨 매핑
  const fixedColumns = ['month1', 'month2', 'month3', 'month4', 'month5'];
  fixedColumns.forEach((columnKey, index) => {
    columns.push({ 
      key: columnKey, 
      label: monthLabels[index] || `${index + 1}월` 
    });
  });
  
  // 합계와 성장률 컬럼 추가
  columns.push({ key: 'total', label: '합계' });
  columns.push({ key: 'growth', label: '성장률' });
  
  return columns;
};

// 동적 그리드 헤더 생성 함수
export const generateGridHeaders = (monthLabels: string[]): { topRow: GridColumn[] } => {
  return {
    topRow: [
      { key: 'category', label: '항목', colSpan: 1 },
      { key: 'monthly', label: '월별', colSpan: 5 },
      { key: 'total', label: '합계', colSpan: 1 },
      { key: 'growth', label: '성장률', colSpan: 1 }
    ]
  };
};

// 기존 고정 컬럼 (하위 호환성을 위해 유지)
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
