export interface MonthlyData {
  매출액: number;
  영업이익: number;
}

export interface YearlyData {
  매출액: number;
  영업이익: number;
}

export interface Department {
  name: string;
  monthlyData: MonthlyData;
  yearlyData: YearlyData;
  달성률: {
    매출액: number;
    영업이익: number;
  };
} 