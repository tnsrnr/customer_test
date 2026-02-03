// 권역별 실적 데이터 타입 정의
export interface RegionalPerformanceData {
  // 상단 KPI 지표 데이터 (API: regional_performance_hd) — 8개 컬럼
  kpiMetrics: {
    ACTUAL_SALES: number;              // 현재 누적 매출액
    ACTUAL_SALES_CHANGE: number;      // 전년대비 매출 누적 증가액
    ACTUAL_OP_PROFIT: number;         // 실제 영업이익
    ACTUAL_OP_PROFIT_CHANGE: number;  // 전년대비 영업이익 누적 증가액
    ACTUAL_OP_MARGIN: number;         // 현재 영업이익률
    ACTUAL_OP_MARGIN_CHANGE: number;  // 전년대비 누적 영업이익률 증가액
    SALES_ACHIEVEMENT: number;        // 현재 매출 증감률
    SALES_ACHIEVEMENT_CHANGE: number; // 전년대비 누적 매출 증감률 증가액
  };
  // 권역별 상세 데이터 (API: regional_performance_card)
  regions: Array<{
    name: string;                    // 권역명 (GROUP_CODE 매핑)
    icon: string;
    variant: 'china' | 'asia' | 'europe' | 'usa';
    monthlyData: {
      sales: number;                 // ACTUAL_SALES 매출액
      profit: number;                // ACTUAL_OP_PROFIT 영업이익
    };
    achievement: {
      sales: number;                 // SALES_ACHIEVEMENT_RATE 매출 달성률
      profit: number;                // SALES_OP_ACHIEVEMENT_RATE 영업이익 달성률
    };
    totalData: {
      sales: number;                 // YTD_ACTUAL_SALES 누적 매출액
      profit: number;                 // YTD_ACTUAL_OP_PROFIT 누적 영업이익
    };
  }>;
}

// regional_performance_card API 응답 행 타입
export interface RegionalPerformanceCardRow {
  GROUP_CODE: string;                // 권역 코드
  ACTUAL_SALES: number;              // 매출액
  ACTUAL_OP_PROFIT: number;         // 영업이익
  YTD_ACTUAL_SALES: number;          // 누적 매출액
  YTD_ACTUAL_OP_PROFIT: number;     // 누적 영업이익
  SALES_ACHIEVEMENT_RATE: number;    // 매출 달성률
  SALES_OP_ACHIEVEMENT_RATE: number; // 영업이익 달성률
}

