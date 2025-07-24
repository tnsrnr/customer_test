// API 엔드포인트 상수 (실제 사용되는 것만 정의)
export const API_ENDPOINTS = {
  // 재무 관련 (실제 사용 중)
  FINANCE: {
    STATUS: '/api/PORM060101SVC/getFinanceStatus',
    SUMMARY: '/api/PORM060101SVC/getFinanceSummary',
  },
} as const;

// 엔드포인트 유틸리티 함수
export const getFinanceEndpoint = (type: 'status' | 'summary') => {
  return API_ENDPOINTS.FINANCE[type.toUpperCase() as keyof typeof API_ENDPOINTS.FINANCE];
}; 