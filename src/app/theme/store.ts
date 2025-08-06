import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark-blue' | 'light-blue' | 'dark-gray' | 'light-gray';

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

export const themes: Record<ThemeMode, ThemeConfig> = {
  'dark-blue': {
    name: '다크 블루',
    description: '기존 다크 블루 그라데이션 스타일',
    colors: {
      primary: 'from-blue-900 via-slate-900 to-slate-800',
      secondary: 'from-blue-800 to-blue-700',
      accent: 'from-cyan-700 to-cyan-600',
      background: 'from-slate-50 to-slate-100',
      surface: 'bg-white',
      text: 'text-slate-800',
      textSecondary: 'text-slate-600',
      border: 'border-slate-200',
      success: 'from-emerald-600 to-emerald-500',
      warning: 'from-amber-600 to-amber-500',
      error: 'from-red-600 to-red-500'
    }
  },
  'light-blue': {
    name: '라이트 블루',
    description: '밝은 블루 그라데이션 스타일',
    colors: {
      primary: 'from-blue-600 via-blue-500 to-blue-400',
      secondary: 'from-blue-500 to-blue-400',
      accent: 'from-cyan-500 to-cyan-400',
      background: 'from-blue-50 to-blue-100',
      surface: 'bg-white',
      text: 'text-slate-800',
      textSecondary: 'text-slate-600',
      border: 'border-blue-200',
      success: 'from-emerald-500 to-emerald-400',
      warning: 'from-amber-500 to-amber-400',
      error: 'from-red-500 to-red-400'
    }
  },
  'dark-gray': {
    name: '다크 그레이',
    description: '모던 다크 그레이 스타일',
    colors: {
      primary: 'from-gray-900 via-slate-800 to-gray-700',
      secondary: 'from-gray-800 to-gray-700',
      accent: 'from-indigo-600 to-indigo-500',
      background: 'from-gray-50 to-gray-100',
      surface: 'bg-white',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      success: 'from-green-600 to-green-500',
      warning: 'from-yellow-600 to-yellow-500',
      error: 'from-red-600 to-red-500'
    }
  },
  'light-gray': {
    name: '라이트 그레이',
    description: '미니멀 라이트 그레이 스타일',
    colors: {
      primary: 'from-gray-600 via-gray-500 to-gray-400',
      secondary: 'from-gray-500 to-gray-400',
      accent: 'from-indigo-500 to-indigo-400',
      background: 'from-gray-50 to-gray-100',
      surface: 'bg-white',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      success: 'from-green-500 to-green-400',
      warning: 'from-yellow-500 to-yellow-400',
      error: 'from-red-500 to-red-400'
    }
  }
};

interface ThemeStore {
  currentTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  getCurrentThemeConfig: () => ThemeConfig;
  cycleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'dark-blue',
      setTheme: (theme: ThemeMode) => set({ currentTheme: theme }),
      getCurrentThemeConfig: () => themes[get().currentTheme],
      cycleTheme: () => {
        const themes = ['dark-blue', 'light-blue', 'dark-gray', 'light-gray'] as ThemeMode[];
        const currentIndex = themes.indexOf(get().currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        set({ currentTheme: themes[nextIndex] });
      }
    }),
    {
      name: 'theme-storage',
    }
  )
); 