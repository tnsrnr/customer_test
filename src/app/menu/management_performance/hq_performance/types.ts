// 그리드 테이블 컬럼 정의
export interface GridColumn {
  key: string;
  label: string;
  colSpan?: number;
}

// 고정 월별 데이터 인터페이스 (컬럼명은 고정, 라벨만 동적) - 9개월 확장, 성장률 제거
export interface MonthlyDetailData {
  column1: string;           // 고정 컬럼명 (COLUMN1) - 구분
  column2: number;           // 고정 컬럼명 (COLUMN2) - 1월 데이터
  column3: number;           // 고정 컬럼명 (COLUMN3) - 2월 데이터
  column4: number;           // 고정 컬럼명 (COLUMN4) - 3월 데이터
  column5: number;           // 고정 컬럼명 (COLUMN5) - 4월 데이터
  column6: number;           // 고정 컬럼명 (COLUMN6) - 5월 데이터
  column7: number;           // 고정 컬럼명 (COLUMN7) - 6월 데이터
  column8: number;           // 고정 컬럼명 (COLUMN8) - 7월 데이터
  column9: number;           // 고정 컬럼명 (COLUMN9) - 8월 데이터
  column10: number;          // 고정 컬럼명 (COLUMN10) - 9월 데이터
  column11: number;          // 고정 컬럼명 (COLUMN11) - 합계 (9월 조회 시) 또는 10월 데이터 (10월 조회 시)
  column12?: number;         // 고정 컬럼명 (COLUMN12) - 합계 (10월 조회 시) 또는 11월 데이터 (11월 조회 시)
  column13?: number;         // 고정 컬럼명 (COLUMN13) - 합계 (11월 조회 시에만 사용)
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

// 고정 컬럼명 기반 그리드 컬럼 생성 함수 (9개월 확장, 성장률 제거)
export const generateGridColumns = (monthLabels: string[]): GridColumn[] => {
  const columns: GridColumn[] = [];
  
  // 11월 조회 시 column13까지 사용, 10월 조회 시 column12까지 사용, 9월 조회 시 column11까지 사용
  const monthCount = monthLabels.length;
  let fixedColumns: string[];
  if (monthCount === 11) {
    fixedColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12', 'column13'];
  } else if (monthCount === 10) {
    fixedColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12'];
  } else {
    fixedColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11'];
  }
  
  fixedColumns.forEach((columnKey, index) => {
    if (index === 0) {
      columns.push({ key: columnKey, label: '구분' });
    } else if (index <= monthLabels.length) {
      columns.push({ 
        key: columnKey, 
        label: monthLabels[index - 1] || `${index}월` 
      });
    } else {
      columns.push({ key: columnKey, label: '합계' });
    }
  });
  
  return columns;
};

// 동적 그리드 헤더 생성 함수 (성장률 제거)
export const generateGridHeaders = (monthLabels: string[]): { topRow: GridColumn[] } => {
  return {
    topRow: [
      { key: 'category', label: '구분', colSpan: 1 },
      { key: 'monthly', label: '월별', colSpan: monthLabels.length },
      { key: 'total', label: '합계', colSpan: 1 }
    ]
  };
};
