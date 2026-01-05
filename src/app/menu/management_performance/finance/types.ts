export interface FinanceData {
  kpiMetrics: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    debtWeight: number;
    totalAssetsChange: number;
    totalLiabilitiesChange: number;
    totalEquityChange: number;
    debtWeightChange: number;
  };
  
  chartData: {
    capitalStructure: {
      labels: string[];
      capital: number[];
      debt: number[];
      assets: number[];
    };
    loanStructure: {
      labels: string[];
      shortTermLoan: number[];
      longTermLoan: number[];
      totalLoan: number[];
    };
  };
  
  trendData: {
    labels: string[];
    totalLoan: number[];
    debtRatio: number[];
  };
}

