// 재무 데이터 타입 정의
export interface FinanceData {
  // 상단 차트 데이터
  topChart: {
    labels: string[];
    capital: number[];
    debt: number[];
    assets: number[];
  };
  
  // 우측 상단 차트 데이터
  rightTopChart: {
    labels: string[];
    shortTermLoan: number[];
    longTermLoan: number[];
  };
  
  // 하단 차트 데이터
  bottomChart: {
    labels: string[];
    totalLoan: number[];
    debtRatio: number[];
  };
} 