// 인증 관련 타입 정의

export interface User {
  id: string;
  name: string;
  jsessionId?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  redirectUrl?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

export interface AuthError {
  success: false;
  message: string;
}

// Spring 서버 응답 타입
export interface SpringLoginData {
  _spring_security_remember_me: boolean;
  _csrf: string;
  USER_ID: string;
  PW: string;
}

// 프록시 요청 타입
export interface ProxyRequest {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

export interface ProxyResponse {
  success: boolean;
  message?: string;
  data?: any;
} 