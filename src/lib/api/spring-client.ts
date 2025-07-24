import axios from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

// Spring 서버 프록시 클라이언트
export const springProxyClient = axios.create({
  baseURL: '/api/auth/proxy',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// Spring 서버 API 호출 헬퍼 함수
export const callSpringAPI = async (path: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) => {
  try {
    const config: any = {
      method,
      url: `?path=${encodeURIComponent(path)}`,
    };

    if (data && method !== 'GET') {
      config.data = data;
    }

    const response = await springProxyClient(config);
    return response.data;
  } catch (error) {
    console.error(`Spring API 호출 오류 (${path}):`, error);
    throw error;
  }
};

// 인터셉터 설정
setupRequestInterceptor(springProxyClient);
setupResponseInterceptor(springProxyClient); 