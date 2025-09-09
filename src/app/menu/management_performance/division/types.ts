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
  
  // 부문별 상세 테이블 데이터 (백엔드 구조: PARENT_DIVISION_TYPE, DIVISION_TYPE, COLUMN1~13)
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

// 백엔드 데이터 구조에 맞는 월별 상세 데이터 인터페이스
export interface DivisionMonthlyDetailData {
  PARENT_DIVISION_TYPE: string;  // 상위 부문 타입
  DIVISION_TYPE: string;         // 부문 타입
  COLUMN1: number;               // 첫 번째 월 데이터
  COLUMN2: number;               // 두 번째 월 데이터
  COLUMN3: number;               // 세 번째 월 데이터
  COLUMN4: number;               // 네 번째 월 데이터
  COLUMN5: number;               // 다섯 번째 월 데이터
  COLUMN6: number;               // 여섯 번째 월 데이터
  COLUMN7: number;               // 일곱 번째 월 데이터
  COLUMN8: number;               // 여덟 번째 월 데이터
  COLUMN9: number;               // 아홉 번째 월 데이터
  COLUMN10: number;              // 열 번째 월 데이터
  COLUMN11: number;              // 열한 번째 월 데이터
  COLUMN12: number;              // 열두 번째 월 데이터
  COLUMN13: number;              // 누계
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
export const generateGridColumns = (monthLabels: string[]): GridColumn[] => {
  const columns: GridColumn[] = [];
  
  // 백엔드 컬럼명 순서: PARENT_DIVISION_TYPE, DIVISION_TYPE, COLUMN1~13
  const backendColumns = [
    'PARENT_DIVISION_TYPE', 'DIVISION_TYPE', 
    'COLUMN1', 'COLUMN2', 'COLUMN3', 'COLUMN4', 'COLUMN5', 'COLUMN6', 
    'COLUMN7', 'COLUMN8', 'COLUMN9', 'COLUMN10', 'COLUMN11', 'COLUMN12', 'COLUMN13'
  ];
  
  backendColumns.forEach((columnKey, index) => {
    if (index === 0) {
      columns.push({ key: columnKey, label: '상위부문' });
    } else if (index === 1) {
      columns.push({ key: columnKey, label: '부문' });
    } else if (index <= 13) {
      columns.push({ 
        key: columnKey, 
        label: monthLabels[index - 2] || `${index - 1}월` 
      });
    } else {
      columns.push({ key: columnKey, label: '누계' });
    }
  });
  
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

// 현재월 기준 12개월 헤더 생성 함수 (탑네비게이션 월에 따라 동적 생성)
export const generateMonthHeaders = (selectedYear?: number, selectedMonth?: number) => {
  const currentDate = new Date();
  const currentMonth = selectedMonth ? selectedMonth - 1 : currentDate.getMonth(); // 0-11
  const currentYear = selectedYear || currentDate.getFullYear();
  
  const headers = [
    { key: 'division', label: '부문', colSpan: 1 },
    { key: 'type', label: '구분', colSpan: 1 }
  ];
  
  // 선택된 월부터 12개월 전까지 역순으로 생성
  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - i, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    
    // 월 이름 (한국어)
    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    
    const monthLabel = monthNames[month];
    const key = `month_${i}`;
    
    headers.push({
      key,
      label: monthLabel,
      colSpan: 1
    });
  }
  
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
