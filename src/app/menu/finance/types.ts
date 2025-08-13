export interface TopLeftChartData {
  labels: string[];
  capital: number[];
  debt: number[];
  assets: number[];
}

export interface TopRightChartData {
  labels: string[];
  shortTermLoan: number[];
  longTermLoan: number[];
}

export interface BottomChartData {
  labels: string[];
  totalLoan: number[];
  debtRatio: number[];
}

export interface FinanceData {
  topLeftChart: TopLeftChartData;
  topRightChart: TopRightChartData;
  bottomChart: BottomChartData;
}
