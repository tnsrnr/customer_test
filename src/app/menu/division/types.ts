// 부문별 실적 데이터 타입 정의
export interface DivisionData {
  // 부문별 카드 데이터
  divisionCards: Array<{
    id: string;
    name: string;
    revenue: number;
    growth: number;
    profit: number;
    color: string;
    borderColor: string;
    textColor: string;
    icon: any;
  }>;
  
  // 부문별 상세 테이블 데이터
  divisionTable: {
    months: string[];  // ['1월', '2월', '3월', '4월', '5월', '누계']
    divisions: Array<{
      name: string;
      color: string;
      revenue: number[];  // 월별 매출
      profit: number[];   // 월별 영업이익
    }>;
  };
}

// 부문별 컬럼 정의
export interface DivisionColumn {
  key: string;
  label: string;
  colSpan?: number;
  color?: string;
}

// 부문별 헤더 정의
export interface DivisionHeader {
  key: string;
  label: string;
  colSpan: number;
  color?: string;
}

// 부문별 테이블 컬럼 설정
export const DIVISION_COLUMNS: DivisionColumn[] = [
  { key: 'month', label: '월별', colSpan: 1 },
  { key: 'air_revenue', label: '매출', colSpan: 1, color: 'blue' },
  { key: 'air_profit', label: '영업이익', colSpan: 1, color: 'blue' },
  { key: 'sea_revenue', label: '매출', colSpan: 1, color: 'emerald' },
  { key: 'sea_profit', label: '영업이익', colSpan: 1, color: 'emerald' },
  { key: 'transport_revenue', label: '매출', colSpan: 1, color: 'purple' },
  { key: 'transport_profit', label: '영업이익', colSpan: 1, color: 'purple' },
  { key: 'warehouse_revenue', label: '매출', colSpan: 1, color: 'orange' },
  { key: 'warehouse_profit', label: '영업이익', colSpan: 1, color: 'orange' },
  { key: 'construction_revenue', label: '매출', colSpan: 1, color: 'pink' },
  { key: 'construction_profit', label: '영업이익', colSpan: 1, color: 'pink' },
  { key: 'other_revenue', label: '매출', colSpan: 1, color: 'cyan' },
  { key: 'other_profit', label: '영업이익', colSpan: 1, color: 'cyan' }
];

// 부문별 테이블 헤더 설정
export const DIVISION_HEADERS = {
  topRow: [
    { key: 'month', label: '구분', colSpan: 1 },
    { key: 'air', label: '항공', colSpan: 2, color: 'blue' },
    { key: 'sea', label: '해상', colSpan: 2, color: 'emerald' },
    { key: 'transport', label: '운송', colSpan: 2, color: 'purple' },
    { key: 'warehouse', label: '창고', colSpan: 2, color: 'orange' },
    { key: 'construction', label: '도급', colSpan: 2, color: 'pink' },
    { key: 'other', label: '기타', colSpan: 2, color: 'cyan' }
  ],
  bottomRow: [
    { key: 'month', label: '월별', colSpan: 1 },
    { key: 'air_revenue', label: '매출', colSpan: 1, color: 'blue' },
    { key: 'air_profit', label: '영업이익', colSpan: 1, color: 'blue' },
    { key: 'sea_revenue', label: '매출', colSpan: 1, color: 'emerald' },
    { key: 'sea_profit', label: '영업이익', colSpan: 1, color: 'emerald' },
    { key: 'transport_revenue', label: '매출', colSpan: 1, color: 'purple' },
    { key: 'transport_profit', label: '영업이익', colSpan: 1, color: 'purple' },
    { key: 'warehouse_revenue', label: '매출', colSpan: 1, color: 'orange' },
    { key: 'warehouse_profit', label: '영업이익', colSpan: 1, color: 'orange' },
    { key: 'construction_revenue', label: '매출', colSpan: 1, color: 'pink' },
    { key: 'construction_profit', label: '영업이익', colSpan: 1, color: 'pink' },
    { key: 'other_revenue', label: '매출', colSpan: 1, color: 'cyan' },
    { key: 'other_profit', label: '영업이익', colSpan: 1, color: 'cyan' }
  ]
};
