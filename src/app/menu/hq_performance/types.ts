// HQ Performance 데이터 타입 정의
export interface HQPerformanceData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    revenue: number;              // 매출
    costOfSales: number;         // 매출원가
    grossProfit: number;         // 매출총이익
    operatingExpense: number;    // 관리비
    operatingIncome: number;     // 영업이익
    operatingMargin: number;     // 영업이익율
    revenueChange: number;       // 매출 변화
    costOfSalesChange: number;   // 매출원가 변화
    grossProfitChange: number;   // 매출총이익 변화
    operatingExpenseChange: number; // 관리비 변화
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
