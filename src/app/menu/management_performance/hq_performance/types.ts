// 그리드 테이블 컬럼 정의
export interface GridColumn {
  key: string;
  label: string;
  colSpan?: number;
}

// 고정 월별 데이터 인터페이스 (컬럼명은 고정, 라벨만 동적)
export interface MonthlyDetailData {
  column1: string;           // 고정 컬럼명 (COLUMN1) - 구분
  column2: number;           // 고정 컬럼명 (COLUMN2) - 첫 번째 월 데이터
  column3: number;           // 고정 컬럼명 (COLUMN3) - 두 번째 월 데이터
  column4: number;           // 고정 컬럼명 (COLUMN4) - 세 번째 월 데이터
  column5: number;           // 고정 컬럼명 (COLUMN5) - 네 번째 월 데이터
  column6: number;           // 고정 컬럼명 (COLUMN6) - 다섯 번째 월 데이터 (선택한 월)
  column7: number;           // 고정 컬럼명 (COLUMN7) - 합계
  column8: string;           // 고정 컬럼명 (COLUMN8) - 성장률
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
  // 2번째 API: 매출 차트 데이터 & 3번째 API: 영업이익 차트 데이터 (통합됨)
  chartData: {
    revenueChart: ChartData;
    profitChart: ChartData;
  };
  // 4번째 API: 그리드 테이블 데이터 (고정 컬럼명)
  gridData: {
    monthlyDetails: MonthlyDetailData[];
    monthLabels: string[];      // 월 라벨 배열 (예: ['1월', '2월', '3월', '4월', '5월'])
  };
}

// 차트 데이터 인터페이스
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null | undefined)[];
    borderColor: string;
    backgroundColor: string;
    borderWidth?: number;
    borderDash?: number[];
    spanGaps?: boolean;
  }[];
}

// 고정 컬럼명 기반 그리드 컬럼 생성 함수
export const generateGridColumns = (monthLabels: string[]): GridColumn[] => {
  const columns: GridColumn[] = [];
  
  // 고정 컬럼명에 동적 라벨 매핑 (COLUMN1~COLUMN8)
  const fixedColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8'];
  fixedColumns.forEach((columnKey, index) => {
    if (index === 0) {
      columns.push({ key: columnKey, label: '구분' });
    } else if (index <= 5) {
      columns.push({ 
        key: columnKey, 
        label: monthLabels[index - 1] || `${index}월` 
      });
    } else if (index === 6) {
      columns.push({ key: columnKey, label: '합계' });
    } else {
      columns.push({ key: columnKey, label: '성장률' });
    }
  });
  
  return columns;
};

// 동적 그리드 헤더 생성 함수
export const generateGridHeaders = (monthLabels: string[]): { topRow: GridColumn[] } => {
  return {
    topRow: [
      { key: 'category', label: '구분', colSpan: 1 },
      { key: 'monthly', label: '월별', colSpan: monthLabels.length },
      { key: 'total', label: '합계', colSpan: 1 },
      { key: 'growth', label: '성장률', colSpan: 1 }
    ]
  };
};
