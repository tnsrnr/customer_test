// 사업부실적 데이터 타입 정의
export interface BusinessDivisionData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    division1: number;              // 사업부 1
    division2: number;              // 사업부 2
    division3: number;              // 사업부 3
    total: number;                  // 총계
    division1Change: number;         // 사업부 1 변화
    division2Change: number;         // 사업부 2 변화
    division3Change: number;         // 사업부 3 변화
    totalChange: number;            // 총계 변화
  };
  // 2번째 API: 중간 그리드 테이블 데이터
  gridData: {
    divisions: Array<{
      team_name: string;             // 팀명
      account_name: string;          // 계정명 (Revenue, Cost, 직접경비, Profit, 간접경비, 영업이익, 방문횟수)
      year2025: number;              // 2025년 값
      year2024: number;              // 2024년 값
      yoyAmount: number;             // 전년비 금액
      yoyPercent: number;            // 전년비%
      groupCategory: string;          // 구분 컬럼에 표시할 그룹 (빈 값)
    }>;
  };
}

