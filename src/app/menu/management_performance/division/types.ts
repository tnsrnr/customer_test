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
  
  // 부문별 상세 테이블 데이터 (백엔드: PARENT_DIVISION_TYPE, DIVISION_TYPE, MONTH1~MONTH13 → 내부 COLUMN1~COLUMN13)
  divisionTable: {
    monthlyDetails: DivisionMonthlyDetailData[];  // 백엔드 컬럼명 기반 데이터
    monthLabels: string[];      // 월 라벨 배열 (예: ['1월', '2월', '3월', '4월', '5월'])
    // 차트용 기존 데이터 구조도 함께 제공
    months: string[];  // 현재월 기준 12개월
    divisions: Array<{
      name: string;
      color: string;
      revenue: number[];  // 월별 매출 (12개월)
      profit: number[];   // 월별 영업이익 (12개월)
    }>;
  };
}

// 월별 상세 데이터 (백엔드 컬럼: PARENT_DIVISION_TYPE, DIVISION_TYPE, MONTH1~MONTH13 → 매핑 후 COLUMN1~COLUMN13)
export interface DivisionMonthlyDetailData {
  DIVISION_TYPE: string;         // 부문 타입 (매출/영업이익)
  COLUMN1: number;               // MONTH1 매핑
  COLUMN2: number;               // MONTH2 매핑
  COLUMN3: number;               // MONTH3 매핑
  COLUMN4: number;               // MONTH4 매핑
  COLUMN5: number;               // MONTH5 매핑
  COLUMN6: number;               // MONTH6 매핑
  COLUMN7: number;               // MONTH7 매핑
  COLUMN8: number;               // MONTH8 매핑
  COLUMN9: number;               // MONTH9 매핑
  COLUMN10: number;              // MONTH10 매핑
  COLUMN11: number;              // MONTH11 매핑
  COLUMN12: number;              // MONTH12 매핑
  COLUMN13?: number;             // 누계 (선택 연도 1~M 합계, 백엔드 MONTH13 사용 안 함)
}

// 그리드 테이블 컬럼 정의
export interface GridColumn {
  key: string;
  label: string;
  colSpan?: number;
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

// 백엔드 컬럼명 기반 그리드 컬럼 생성 함수
export const generateGridColumns = (): GridColumn[] => {
  const columns: GridColumn[] = [];
  
  // 백엔드 순서: PARENT_DIVISION_TYPE, DIVISION_TYPE, MONTH1~MONTH13 → 표시는 COLUMN1~COLUMN13
  columns.push({ key: 'DIVISION_TYPE', label: '구분' });
  const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  monthLabels.forEach((label, index) => {
    columns.push({ key: `COLUMN${index + 1}`, label });
  });
  columns.push({ key: 'COLUMN13', label: '누계' });
  
  return columns;
};

// 동적 그리드 헤더 생성 함수
export const generateGridHeaders = (monthLabels: string[]): { topRow: GridColumn[] } => {
  return {
    topRow: [
      { key: 'parent_division', label: '상위부문', colSpan: 1 },
      { key: 'division', label: '부문', colSpan: 1 },
      { key: 'monthly', label: '월별', colSpan: monthLabels.length },
      { key: 'total', label: '누계', colSpan: 1 }
    ]
  };
};

// 12개월 헤더 생성 함수 (1~12월 고정)
export const generateMonthHeaders = () => {
  const headers = [
    { key: 'division', label: '부문', colSpan: 1 },
    { key: 'type', label: '구분', colSpan: 1 }
  ];
  
  // 1~12월 고정 헤더 추가
  const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  monthLabels.forEach((label, index) => {
    headers.push({
      key: `COLUMN${index + 1}`,
      label: label,
      colSpan: 1
    });
  });
  
  // 누계 추가
  headers.push({ key: 'total', label: '누계', colSpan: 1 });
  
  return headers;
};

// 부문별 테이블 컬럼 설정 (12개월 동적 생성)
export const DIVISION_COLUMNS: DivisionColumn[] = [
  { key: 'division', label: '부문', colSpan: 1 },
  { key: 'type', label: '구분', colSpan: 1 },
  ...generateMonthHeaders().slice(2) // division, type 제외하고 월별 헤더만
];

// 부문별 테이블 헤더 설정 (12개월 동적 생성)
export const DIVISION_HEADERS = {
  topRow: generateMonthHeaders(),
  bottomRow: generateMonthHeaders()
};
