export type TransportType = '항공수출' | '항공수입' | '해상수출' | '해상수입' | '운송' | '철도';

export interface CountUpAnimationProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isAnimating?: boolean;
}

export interface MonthlyData {
  sales: number[];
  profit: number[];
  salesManager: string[];
}

export interface ClientData {
  name: string;
  sales: number;
  profit: number;
  progressCount: number;
  salesManager: string;
  trend: string;
  mainItems: string;
  comparison: {
    prevMonth: {
      sales: number;
      profit: number;
      progressCount: number;
      salesManager: string;
    };
    prevYear: {
      sales: number;
      profit: number;
      progressCount: number;
      salesManager: string;
    };
  };
  monthlyData: MonthlyData;
}

export interface TransportData {
  title: string;
  iconName: string;
  color: string;
  data: ClientData[];
}

// 백단 API 데이터 구조
export interface BackendClientData {
  COMPANY_CODE: string;
  CUSTOMER_NAME: string;
  SALES_NAME_MASTER: string;
  B_REV_MONTH9: number;
  B_REV_MONTH10: number;
  B_REV_MONTH11: number;
  B_REV_MONTH12: number;
  B_PRF_MONTH9: number;
  B_PRF_MONTH10: number;
  B_PRF_MONTH11: number;
  B_PRF_MONTH12: number;
  B_CNT_MONTH9: number;
  B_CNT_MONTH10: number;
  B_CNT_MONTH11: number;
  B_CNT_MONTH12: number;
  REV_MONTH1: number;
  REV_MONTH2: number;
  REV_MONTH3: number;
  REV_MONTH4: number;
  REV_MONTH5: number;
  REV_MONTH6: number;
  REV_MONTH7: number;
  REV_MONTH8: number;
  REV_MONTH9: number;
  REV_MONTH10: number;
  REV_MONTH11: number;
  REV_MONTH12: number;
  PRF_MONTH1: number;
  PRF_MONTH2: number;
  PRF_MONTH3: number;
  PRF_MONTH4: number;
  PRF_MONTH5: number;
  PRF_MONTH6: number;
  PRF_MONTH7: number;
  PRF_MONTH8: number;
  PRF_MONTH9: number;
  PRF_MONTH10: number;
  PRF_MONTH11: number;
  PRF_MONTH12: number;
  CNT_MONTH1: number;
  CNT_MONTH2: number;
  CNT_MONTH3: number;
  CNT_MONTH4: number;
  CNT_MONTH5: number;
  CNT_MONTH6: number;
  CNT_MONTH7: number;
  CNT_MONTH8: number;
  CNT_MONTH9: number;
  CNT_MONTH10: number;
  CNT_MONTH11: number;
  CNT_MONTH12: number;
}
