import axios from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';

// 일반 API 클라이언트 인스턴스 생성
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 인터셉터 설정
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient); 