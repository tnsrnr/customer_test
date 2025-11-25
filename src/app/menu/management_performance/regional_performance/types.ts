// 권역별 실적 데이터 타입 정의
export interface RegionalPerformanceData {
  // 상단 KPI 지표 데이터
  kpiMetrics: {
    totalSales: number;              // 총 매출액
    totalProfit: number;             // 총 매출이익
    totalOpProfit: number;           // 총 영업이익
    totalOpMargin: number;           // 총 영업이익률
  };
  // 권역별 상세 데이터
  regions: Array<{
    name: string;                    // 권역명 (중국권역, 아시아권역, 유럽권역, 미국권역)
    icon: string;                    // 이모지 아이콘
    variant: 'china' | 'asia' | 'europe' | 'usa';
    monthlyData: {
      sales: number;                 // 당월 매출액 (억원)
      profit: number;                // 당월 영업이익 (억원)
    };
    achievement: {
      sales: number;                 // 매출 달성율 (%)
      profit: number;                 // 영업이익 달성율 (%)
    };
    totalData: {
      sales: number;                  // 누계 매출액 (억원)
      profit: number;                 // 누계 영업이익 (억원)
    };
  }>;
}

