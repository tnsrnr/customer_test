'use client';

import { create } from 'zustand';
import { User, LoginCredentials, AuthState } from '@/lib/types/auth';
import { authService } from '@/lib/api/services/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: { id: '1', email: 'admin@example.com', name: '관리자' },
  token: 'dummy-token',
  isAuthenticated: true,

  login: async (email: string, password: string) => {
    // 임시로 항상 로그인 성공
    set({
      isAuthenticated: true,
      user: { id: '1', email, name: '관리자' }
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null
    });
  },

  checkAuth: async () => {
    // 임시로 항상 인증된 상태로 설정
    set({ 
      user: { id: '1', email: 'admin@example.com', name: '관리자' }, 
      token: 'dummy-token', 
      isAuthenticated: true 
    });
  }
})); 