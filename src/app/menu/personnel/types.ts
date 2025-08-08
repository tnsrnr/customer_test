// 인사 데이터 타입 정의
export interface PersonnelData {
  // 1번째 API: 상위 4개 KPI 컴포넌트 데이터
  kpiMetrics: {
    headquarters: number;              // 본사 인원
    domesticSubsidiaries: number;     // 국내 계열사 인원
    overseasSubsidiaries: number;     // 해외 계열사 인원
    total: number;                    // 총 인원
    headquartersChange: number;       // 본사 인원 변화
    domesticSubsidiariesChange: number; // 국내 계열사 인원 변화
    overseasSubsidiariesChange: number; // 해외 계열사 인원 변화
    totalChange: number;              // 총 인원 변화
  };
  // 2번째 API: 중간 그리드 테이블 데이터
  gridData: {
    divisions: Array<{
      name: string;                    // 회사명/지역명
      q1: number;                     // 1분기
      q2: number;                     // 2분기
      q3: number;                     // 3분기
      q4: number;                     // 4분기
      currentLocal: number;            // 현재월 현지인
      currentKorean: number;           // 현재월 한국인
      previousMonth: number;           // 소계 전월
      currentMonth: number;            // 소계 현재월
      change: number;                  // 전월대비 변화
      groupCategory: string;           // 구분 컬럼에 표시할 그룹 (국내/해외)
    }>;
  };
} 