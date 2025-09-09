// 업체방문분석 테이블용 타입 정의

// 백엔드 API 응답 타입
export interface ApiResponse {
  MSG: string;
  MIS030306G1: CompanyVisitAnalysisRaw[];
  TYPE: number;
}

// 백엔드에서 받는 원본 데이터 (실제 API 응답 구조)
export interface CompanyVisitAnalysisRaw {
  AMT_01: number;               // 1월
  AMT_02: number;               // 2월
  AMT_03: number;               // 3월
  AMT_04: number;               // 4월
  AMT_05: number;               // 5월
  AMT_06: number;               // 6월
  AMT_07: number;               // 7월
  AMT_08: number;               // 8월
  AMT_09: number;               // 9월
  AMT_10: number;               // 10월
  AMT_11: number;               // 11월
  AMT_12: number;               // 12월
  AMT_SUM: number;              // 합계
  DEPT_CODE: string;            // 부서 코드
  DEPT_NAME: string;            // 부서명 (팀)
  GID: number;                  // 그룹 ID
  PARENTS_DEPT_CODE: string;    // 상위 부서 코드
  PARENTS_DEPT_NAME: string;    // 상위 부서명 (사업부)
  SALES_TYPE: string;           // 영업 타입 코드
  SALES_TYPE_NAME: string;      // 영업 타입명 (분류: 방문이력, 견적, 계약)
  USER_ID: string;              // 사용자 ID
  USER_NAME_LOC: string;        // 사용자명 (담당자)
}

// 테이블 행 데이터 타입
export interface TableRow {
  businessUnit: string;         // 사업부
  team: string;                 // 팀
  salesPerson: string;          // 담당자
  category: string;             // 분류
  monthlyData: number[];        // 월별 데이터 (1월~12월)
  total: number;                // 합계
  isTotalRow?: boolean;         // 합계 행 여부
  isBusinessUnitTotal?: boolean; // 사업부 합계 행 여부
}

// 필터 상태
export interface FilterState {
  year: number;                 // 기준년도
  businessUnitFilter: string[]; // 선택된 사업부들
  teamFilter: string[];         // 선택된 팀들
  salesPersonFilter: string[];  // 선택된 담당자들
  categoryFilter: string[];     // 선택된 분류들
}

// 통계 데이터 타입
export interface AnalysisStats {
  totalVisits: number;          // 총 방문이력
  totalQuotations: number;      // 총 견적
  totalContracts: number;       // 총 계약
  totalSalesPersons: number;    // 총 담당자 수
  totalTeams: number;           // 총 팀 수
  totalBusinessUnits: number;   // 총 사업부 수
}

// 월별 통계 타입
export interface MonthlyStats {
  month: string;                // 월
  visits: number;               // 방문이력
  quotations: number;           // 견적
  contracts: number;            // 계약
  total: number;                // 합계
}