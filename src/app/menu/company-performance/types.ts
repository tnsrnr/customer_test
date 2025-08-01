// 회사 성과 데이터 타입 정의
export interface CompanyPerformanceData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    ACTUAL_SALES: number;        // 총 매출액
    ACTUAL_OP_PROFIT: number;    // 영업이익
    ACTUAL_OP_MARGIN: number;    // 영업이익률
    SALES_ACHIEVEMENT: number;   // 매출 달성률
  };
  
  // 2번째 API: 중간 그리드 테이블 데이터
  gridData: {
    divisions: Array<{
      name: string;
      revenue: number;
      profit: number;
      margin: number;
      growth: number;
      change: number;
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