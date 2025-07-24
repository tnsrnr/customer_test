import { AxiosInstance } from 'axios';

// 요청 인터셉터
export const setupRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      // 토큰이 있다면 헤더에 추가
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// 응답 인터셉터
export const setupResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 에러 처리
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );
}; 