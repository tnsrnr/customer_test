import axios from 'axios';
import { ApiResponse } from '@/types/common';
import { FinanceData } from './types';
import { callSpringAPI } from '@/lib/api/spring-client';

// 재무 현황 데이터 조회 (Spring 서버 프록시 사용)
export const getFinanceStatus = async (): Promise<FinanceData> => {
  try {
    // Spring 서버 프록시를 통한 안정적인 API 호출
    const response = await callSpringAPI('/api/PORM060101SVC/getFinanceStatus', 'POST', {});
    
    if (response.STATUS === 200) {
      return response.data || getMockFinanceData();
    } else {
      throw new Error(response.MSG || '재무 데이터 조회에 실패했습니다.');
    }
  } catch (error) {
    console.error('재무 데이터 조회 오류:', error);
    
    // Spring 서버에 해당 API가 없는 경우를 대비한 임시 데이터
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 500)) {
      console.log('Spring 서버에 finance API가 없습니다. 임시 데이터를 사용합니다.');
      return getMockFinanceData();
    }
    
    throw error;
  }
};

// 재무 요약 데이터 조회 (향후 확장용)
export const getFinanceSummary = async () => {
  try {
    const response = await callSpringAPI('/api/PORM060101SVC/getFinanceSummary', 'POST', {});
    return response;
  } catch (error) {
    console.error('재무 요약 데이터 조회 오류:', error);
    throw error;
  }
};

// 임시 목 데이터 (Spring 서버에 API가 없는 경우)
const getMockFinanceData = (): FinanceData => {
  return {
    topChart: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      capital: [1200, 1250, 1300, 1280, 1350],
      debt: [800, 850, 900, 880, 920],
      assets: [2000, 2100, 2200, 2160, 2270]
    },
    rightTopChart: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      shortTermLoan: [300, 320, 350, 340, 360],
      longTermLoan: [500, 530, 550, 540, 560]
    },
    bottomChart: {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      totalLoan: [800, 850, 900, 880, 920],
      debtRatio: [40, 40.5, 40.9, 40.7, 40.5]
    }
  };
}; 