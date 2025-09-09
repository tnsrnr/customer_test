import { create } from 'zustand';
import { CalendarEvent, CalendarEventRaw, ApiResponse, VisitDetailRaw, VisitDetailApiResponse } from './types';

interface SalesAnalysis2Store {
  // 기존 상태들
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  selectedDate: Date;
  selectedEvent: CalendarEvent | null;
  showEventModal: boolean;
  
  // 방문 상세 데이터 관련 상태 추가
  visitDetail: VisitDetailRaw | null;
  visitDetailLoading: boolean;
  visitDetailError: string | null;
  
  // 기존 액션들
  setSelectedDate: (date: Date) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setShowEventModal: (show: boolean) => void;
  fetchCalendarData: (date: Date) => Promise<void>;
  transformApiDataToEvents: (apiData: CalendarEventRaw[]) => CalendarEvent[];
  getFilteredEvents: () => CalendarEvent[];
  
  // 방문 상세 데이터 관련 액션 추가
  fetchVisitDetail: (visitSeqNo: string, additionalParams?: {
    customerCode?: string;
    companyCode?: string;  // SEARCH_COMPANY_CODE로 매핑
    deptName?: string;
    deptCode?: string;
    salesName?: string;
    salesId?: string;
    customerName?: string;
    hashtag?: string;
    startDate?: string;    // VISIT_DATE_FROM으로 매핑
    endDate?: string;      // VISIT_DATE_TO로 매핑
  }) => Promise<void>;
  clearVisitDetail: () => void;
  
  // 필터 관련
  filters: {
    displayMode: 'customer' | 'sales' | 'both';
  };
  setDisplayMode: (mode: 'customer' | 'sales' | 'both') => void;
}

export const useSalesAnalysis2Store = create<SalesAnalysis2Store>((set, get) => ({
  // 초기 상태
  events: [],
  loading: false,
  error: null,
  selectedDate: new Date(),
  selectedEvent: null,
  showEventModal: false,
  
  // 방문 상세 데이터 관련 상태 추가
  visitDetail: null,
  visitDetailLoading: false,
  visitDetailError: null,
  
  filters: {
    displayMode: 'both' as const,
  },

  // 액션들
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedEvent: (selectedEvent) => set({ selectedEvent }),
  setShowEventModal: (showEventModal) => set({ showEventModal }),
  setDisplayMode: (displayMode) => set((state) => ({
    filters: { ...state.filters, displayMode }
  })),

  // 필터링된 이벤트 계산
  getFilteredEvents: () => {
    const state = get();
    const { events, filters } = state;
    
    // TITLE_TYPE에 따라 필터링
    return events.filter(event => {
      const titleType = event.extendedProps.titleType;
      
      if (filters.displayMode === 'customer') {
        return titleType === 'CU'; // 화주만
      } else if (filters.displayMode === 'sales') {
        return titleType === 'SA'; // 영업사원만
      } else if (filters.displayMode === 'both') {
        return titleType === 'CUSA'; // 전체 (CUSA 타입만)
      }
      
      return true; // 기본값
    });
  },

  // API 호출
  fetchCalendarData: async (date: Date) => {
    set({ loading: true, error: null });
    
    try {
      // API 요청 파라미터 구성
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const requestBody = {
        MIS030306F1: {
          START_DATE: startDate.toISOString().slice(0, 10).replace(/-/g, ''),
          END_DATE: endDate.toISOString().slice(0, 10).replace(/-/g, '')
        },
        page: 1,
        start: 0,
        limit: "100",
        pageId: "MIS030306T"
      };

      const response = await fetch('/auth/api/proxy?path=/api/MIS030306SVC/getCalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: ApiResponse = await response.json();
      
      if (apiData.MSG === "정상적으로 처리되었습니다." && apiData.MIS030306G1) {
        console.log('API 응답 데이터:', apiData.MIS030306G1);
        console.log('첫 번째 아이템:', apiData.MIS030306G1[0]);
        const transformedEvents = get().transformApiDataToEvents(apiData.MIS030306G1);
        console.log('변환된 이벤트들:', transformedEvents);
        set({ events: transformedEvents });
      } else {
        console.log('API 응답 오류 또는 데이터 없음:', apiData);
        set({ events: [] });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '알 수 없는 오류' });
    } finally {
      set({ loading: false });
    }
  },

  // 데이터 변환
  transformApiDataToEvents: (apiData: CalendarEventRaw[]): CalendarEvent[] => {
    return apiData.map((item, index) => {
      try {
        console.log(`이벤트 ${index} 변환 중:`, item);
        console.log(`SEQ_NO 값:`, item.SEQ_NO, typeof item.SEQ_NO);
        console.log(`CUSTOMER_CODE 값:`, item.CUSTOMER_CODE);
        console.log(`COMPANY_CODE 값:`, item.COMPANY_CODE);
        
        // SEQ_NO 유효성 검사
        if (item.SEQ_NO === undefined || item.SEQ_NO === null || item.SEQ_NO === '') {
          console.warn(`이벤트 ${index}에 SEQ_NO가 없습니다:`, item);
          return null;
        }
        
        // 날짜 파싱 (YYYYMMDD 형식)
        const dateStr = item.start.substring(0, 8);
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1; // 월은 0부터 시작
        const day = parseInt(dateStr.substring(6, 8));
        
        const startDate = new Date(year, month, day);
        
        // 삼성 여부에 따른 색상 결정
        const colors = getSamsungColor(item.SAMSUNG_YN);
        
        // SEQ_NO를 안전하게 변환 (문자열이면 숫자로, 숫자면 그대로)
        const safeSeqNo = typeof item.SEQ_NO === 'string' ? parseInt(item.SEQ_NO) : item.SEQ_NO;
        
        const event: CalendarEvent = {
          id: `${safeSeqNo}_${item.title}_${item.start}`,
          title: item.title,
          start: startDate,
          end: startDate,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          textColor: colors.text,
          allDay: true,
          extendedProps: {
            samsungYn: item.SAMSUNG_YN,
            titleType: item.TITLE_TYPE,
            seqNo: safeSeqNo,
            deptName: formatDeptName(item.DEPT_NAME, item.COMPANY_CODE), // 백엔드에서 받은 부서명 사용
            // 추가 파라미터들 (실제 백엔드 응답 기준)
            customerCode: item.CUSTOMER_CODE,
            companyCode: item.COMPANY_CODE,  // SEARCH_COMPANY_CODE로 매핑
            deptName: item.DEPT_NAME,
            deptCode: item.DEPT_CODE,
            salesName: item.SALES_NAME,
            salesId: item.SALES_ID,
            customerName: item.CUSTOMER_NAME,
            hashtag: item.HASHTAG,
            startDate: item.start,  // VISIT_DATE_FROM으로 매핑
            endDate: item.end,      // VISIT_DATE_TO로 매핑
          }
        };
        
        console.log(`변환된 이벤트 ${index}:`, event);
        return event;
      } catch (error) {
        console.error('이벤트 변환 오류:', error, item);
        return null;
      }
    }).filter(Boolean) as CalendarEvent[];
  },

  // 방문 상세 데이터 관련 액션 추가
  fetchVisitDetail: async (visitSeqNo: string, additionalParams?: {
    customerCode?: string;
    companyCode?: string;  // SEARCH_COMPANY_CODE로 매핑
    deptName?: string;
    deptCode?: string;
    salesName?: string;
    salesId?: string;
    customerName?: string;
    hashtag?: string;
    startDate?: string;    // VISIT_DATE_FROM으로 매핑
    endDate?: string;      // VISIT_DATE_TO로 매핑
  }) => {
    console.log('방문 상세 정보 요청:', visitSeqNo);
    console.log('추가 파라미터:', additionalParams);
    set({ visitDetailLoading: true, visitDetailError: null });
    try {
      const requestBody = {
        SLS050102F1: {
          VISIT_SEQ_NO: visitSeqNo,
          HISTORY_YN: "N",  // 디폴트로 N 설정
          SALES_MASTER_FLAG: "N",  // 디폴트로 N 설정
          SALES_SUB_FLAG: "N",     // 디폴트로 N 설정
          SALES_FLAG: "N",         // 디폴트로 N 설정
          // 추가 파라미터들 포함 (올바른 매핑 적용)
          ...(additionalParams?.customerCode && { CUSTOMER_CODE: additionalParams.customerCode }),
          ...(additionalParams?.companyCode && { SEARCH_COMPANY_CODE: additionalParams.companyCode }),  // COMPANY_CODE → SEARCH_COMPANY_CODE
          ...(additionalParams?.deptName && { DEPT_NAME: additionalParams.deptName }),
          ...(additionalParams?.deptCode && { DEPT_CODE: additionalParams.deptCode }),
          ...(additionalParams?.salesName && { SALES_NAME: additionalParams.salesName }),
          ...(additionalParams?.salesId && { SALES_ID: additionalParams.salesId }),
          ...(additionalParams?.customerName && { CUSTOMER_NAME: additionalParams.customerName }),
          ...(additionalParams?.hashtag && { HASHTAG: additionalParams.hashtag }),
          ...(additionalParams?.startDate && { VISIT_DATE_FROM: additionalParams.startDate.substring(0, 8) }),  // start → VISIT_DATE_FROM (앞 8자리만)
          ...(additionalParams?.endDate && { VISIT_DATE_TO: additionalParams.endDate.substring(0, 8) }),        // end → VISIT_DATE_TO (앞 8자리만)
        },
        page: 1,
        start: 0,
        limit: "100",
        pageId: "SLS050102T"
      };
      console.log('요청 데이터:', requestBody);
      
      const response = await fetch(`/auth/api/proxy?path=/api/SLS050102SVC/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: VisitDetailApiResponse = await response.json();
      console.log('방문 상세 API 응답:', apiData);
      
      if (apiData.MSG === "정상적으로 처리되었습니다." && apiData.SLS050102G1 && apiData.SLS050102G1.length > 0) {
        console.log('방문 상세 데이터 설정:', apiData.SLS050102G1[0]);
        set({ visitDetail: apiData.SLS050102G1[0] });
      } else {
        console.log('방문 상세 데이터 없음 또는 오류:', apiData);
        set({ visitDetail: null });
      }
    } catch (error) {
      console.error('방문 상세 데이터 조회 오류:', error);
      set({ visitDetailError: error instanceof Error ? error.message : '알 수 없는 오류' });
    } finally {
      set({ visitDetailLoading: false });
    }
  },

  clearVisitDetail: () => set({ visitDetail: null }),
}));

// 부서명을 사용자 친화적으로 변환하는 함수
const formatDeptName = (deptName: string, companyCode: string): string => {
  // COMPANY_CODE가 HTNS가 아닌 경우, 해당 코드를 부서명으로 사용
  if (companyCode && companyCode !== 'HTNS') {
    return companyCode;
  }
  
  // HTNS인 경우 기존 부서명 변환 로직 사용
  if (deptName === '해상영업그룹') {
    return '해상그룹';
  }
  
  // 글로벌영업X팀 → 영업X팀
  if (deptName.startsWith('글로벌영업') && deptName.endsWith('팀')) {
    return deptName.replace('글로벌', '');
  }
  
  return deptName; // 기타 부서명은 그대로 유지
};

// 삼성 이벤트 색상 함수
const getSamsungColor = (samsungYn: string): { bg: string; border: string; text: string } => {
  if (samsungYn === 'Y') {
    return {
      bg: '#3b82f6',      // 파란색 (삼성)
      border: '#3b82f6',
      text: '#ffffff'      // 흰색 텍스트
    };
  } else {
    return {
      bg: '#f3f4f6',      // 연한 회색 (일반)
      border: '#d1d5db',
      text: '#374151'      // 진한 회색 텍스트
    };
  }
};
