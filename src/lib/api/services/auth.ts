'use client';

import { apiClient } from '../client';
import { User, LoginCredentials } from '@/lib/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    // TODO: 실제 API 연동
    return { id: '1', email: 'admin@example.com', name: '관리자' };
  },

  refreshToken: async () => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    return response.data;
  }
}; 