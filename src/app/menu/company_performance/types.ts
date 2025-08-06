// 회사 성과 데이터 타입 정의
export interface CompanyPerformanceData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    ACTUAL_SALES: number;        // 총 매출액
    ACTUAL_OP_PROFIT: number;    // 영업이익
    ACTUAL_OP_MARGIN: number;    // 영업이익률
    SALES_ACHIEVEMENT: number;   // 매출 달성률
    // 실시간 전월대비 증가액 데이터
    ACTUAL_SALES_CHANGE: number;         // 전월대비 매출 증가액
    ACTUAL_OP_PROFIT_CHANGE: number;     // 전월대비 영업이익 증가액
    ACTUAL_OP_MARGIN_CHANGE: number;     // 전월대비 영업이익률 증가액
    SALES_ACHIEVEMENT_CHANGE: number;    // 전월대비 매출 달성률 증가액
  };
  // 2번째 API: 중간 그리드 테이블 데이터
  gridData: {
    divisions: Array<{
      name: string;                    // DIVISION
      plannedSales: number;            // PLANNED_SALES (억원)
      plannedOpProfit: number;         // PLANNED_OP_PROFIT (억원)
      plannedOpMargin: number;         // PLANNED_OP_MARGIN (%)
      actualSales: number;             // ACTUAL_SALES (억원)
      actualOpProfit: number;          // ACTUAL_OP_PROFIT (억원)
      actualOpMargin: number;          // ACTUAL_OP_MARGIN (%)
      salesAchievement: number;        // SALES_ACHIEVEMENT (%)
      opProfitAchievement: number;     // OP_PROFIT_ACHIEVEMENT (%)
    }>;
  };
  // 3번째 API: 하단 첫 번째 카드 데이터
  chartData1: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }>;
    // kpiMetrics와 동일한 구조로 명시적 필드명 제공
    PLANNED_SALES: number;
    ACTUAL_SALES: number;
    PLANNED_OP_PROFIT: number;
    ACTUAL_OP_PROFIT: number;
  };
  // 4번째 API: 하단 두 번째 카드 데이터
  chartData2: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }>;
  };
  // 5번째 API: 하단 세 번째 카드 데이터
  chartData3: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }>;
  };
} 