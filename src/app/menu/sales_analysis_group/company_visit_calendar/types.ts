// API 응답 타입
export interface ApiResponse {
  MSG: string;
  MIS030306G1: CalendarEventRaw[];
  TYPE: number;
}

// 방문 상세 데이터 API 응답 타입
export interface VisitDetailApiResponse {
  MSG: string;
  SLS050102G1: VisitDetailRaw[];
  TYPE: number;
}

// 방문 상세 데이터 원본 타입
export interface VisitDetailRaw {
  APPROVAL_DATE: string;
  SALES_STAFF: string;
  SALES_NAME: string;
  ADD_USER_ID: string;
  ADD_USER_NAME: string;
  VISIT_SEQ_NO: string;
  VISIT_DATE: string;
  CUSTOMER_STAFF: string;
  VISIT_PLACE: string;
  VISIT_CONTENTS: string;
  VISIT_TITLE: string;
  COMPANY_NAME: string;
  CUSTOMER_NAME: string;
  SALES_ID: string;
  CONTRACT_DATE: string;
  CUSTOMER_SEQ_NO: string;
  EMAIL_SEND_DATE: string;
  REGULAR_FLAG: string;
  COMPANY_CODE: string;
  ORIGIN_VISIT_SEQ_NO: string;
  CUSTOMER_CODE: string;
  REGULAR_FLAG_NAME: string;
  COPY_YN: string;
}

// 백엔드에서 받는 원본 데이터 타입
export interface CalendarEventRaw {
  title: string;           // 실제로 달력에 표시되는 텍스트
  SAMSUNG_YN: string;      // Y일 경우 텍스트 색상 변경
  TITLE_TYPE: string;      // CU: 화주, SA: 영업사원, CUSA: 화주+영업사원
  SEQ_NO: number | string; // 중복방지위한 키 (백엔드에서 SEQ_NO로 전송)
  start: string;           // 20250831 형식의 날짜 (앞 8자리만 사용)
  DEPT_NAME: string;       // 부서명 (영업1팀, 영업2팀, 영업3팀 등)
  COMPANY_CODE: string;    // 회사 코드 (HTNS, ABC, XYZ 등)
  // 추가 파라미터들 (실제 백엔드 응답 기준)
  CUSTOMER_CODE?: string;        // 고객 코드
  COMPANY_CODE?: string;         // 회사 코드 (SEARCH_COMPANY_CODE로 매핑)
  DEPT_NAME?: string;            // 부서명
  DEPT_CODE?: string;            // 부서 코드
  SALES_NAME?: string;           // 영업사원명
  SALES_ID?: string;             // 영업사원 ID
  CUSTOMER_NAME?: string;        // 고객명
  HASHTAG?: string;              // 해시태그
  start?: string;                // 시작 날짜 (VISIT_DATE_FROM으로 매핑)
  end?: string;                  // 종료 날짜 (VISIT_DATE_TO로 매핑)
}

// 달력에 표시할 이벤트 타입
export interface CalendarEvent {
  
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    samsungYn: string;
    titleType: string;
    seqNo: number;
    deptName: string;     // 부서명 추가
    // 추가 파라미터들 (실제 백엔드 응답 기준)
    customerCode?: string;       // 고객 코드
    companyCode?: string;        // 회사 코드 (SEARCH_COMPANY_CODE로 매핑)
    deptName?: string;           // 부서명
    deptCode?: string;           // 부서 코드
    salesName?: string;          // 영업사원명
    salesId?: string;            // 영업사원 ID
    customerName?: string;       // 고객명
    hashtag?: string;            // 해시태그
    startDate?: string;          // 시작 날짜 (VISIT_DATE_FROM으로 매핑)
    endDate?: string;            // 종료 날짜 (VISIT_DATE_TO로 매핑)
  };
}

// 필터 상태 타입
export interface FilterState {
  searchTerm: string;
  displayMode: 'customer' | 'sales' | 'both';
}

// 스토어 타입 정의
export interface SalesAnalysis2Store {
  // 상태
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  showEventModal: boolean;
  filters: FilterState;
  
  // 액션
  setEvents: (events: CalendarEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setShowEventModal: (show: boolean) => void;
  setDisplayMode: (mode: 'customer' | 'sales' | 'both') => void;
  setSearchTerm: (term: string) => void;
  
  // API 호출
  fetchCalendarData: (date: Date) => Promise<void>;
  
  // 데이터 변환
  transformApiDataToEvents: (apiData: CalendarEventRaw[]) => CalendarEvent[];
  
  // 필터링된 이벤트 계산
  getFilteredEvents: () => CalendarEvent[];
}
