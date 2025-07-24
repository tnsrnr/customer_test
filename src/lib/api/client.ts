import axios from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

// API 클라이언트 인스턴스 생성
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Spring 서버 프록시 클라이언트 (auth 디렉토리로 이동)
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

// 로그인 API 호출 함수 (auth 디렉토리로 이동)
export const loginAPI = async (username: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '로그인에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('로그인 API 호출 오류:', error);
    throw error;
  }
};

// 로그아웃 API 호출 함수 (auth 디렉토리로 이동)
export const logoutAPI = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '로그아웃에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error('로그아웃 API 호출 오류:', error);
    throw error;
  }
};

// 인터셉터 설정
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
setupRequestInterceptor(springProxyClient);
setupResponseInterceptor(springProxyClient); 