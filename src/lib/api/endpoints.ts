// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 재무 관련
  FINANCE: {
    STATUS: '/finance/status',
    SUMMARY: '/finance/summary',
  },
  // 향후 확장을 위한 다른 도메인들
  WAREHOUSE: {
    STATUS: '/warehouse/status',
  },
  PERFORMANCE: {
    OVERVIEW: '/performance/overview',
  },
} as const; 