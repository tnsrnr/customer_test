import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/common';

// 회사 성과 데이터 조회 (예시)
export const getCompanyPerformance = async () => {
  try {
    const response = await apiClient.get<ApiResponse>('/company/performance');
    return response.data;
  } catch (error) {
    console.error('회사 성과 데이터 조회 오류:', error);
    throw error;
  }
}; 