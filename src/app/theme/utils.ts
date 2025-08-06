import { useThemeStore } from '@/app/theme';
import { cn } from '@/utils';

/**
 * 테마 클래스를 적용하는 함수
 */
export function useThemeClasses() {
  const { getCurrentThemeConfig } = useThemeStore();
  const theme = getCurrentThemeConfig();

  return {
    // 헤더 관련
    header: cn("bg-gradient-to-br backdrop-blur-md shadow-xl border-none", theme.colors.primary),
    
    // 카드 관련
    card: cn("rounded-xl shadow-lg overflow-hidden", theme.colors.surface),
    cardHeader: cn("bg-gradient-to-r p-4", theme.colors.primary),
    cardBody: cn("p-4", theme.colors.surface),
    
    // 버튼 관련
    primaryButton: cn("bg-gradient-to-r px-4 py-2 rounded-lg text-white font-medium transition-all", theme.colors.primary),
    secondaryButton: cn("bg-gradient-to-r px-4 py-2 rounded-lg text-white font-medium transition-all", theme.colors.secondary),
    accentButton: cn("bg-gradient-to-r px-4 py-2 rounded-lg text-white font-medium transition-all", theme.colors.accent),
    
    // 텍스트 관련
    text: theme.colors.text,
    textSecondary: theme.colors.textSecondary,
    
    // 배경 관련
    background: cn("min-h-screen bg-gradient-to-b", theme.colors.background),
    
    // 메트릭 카드
    metricCard: (variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' = 'primary') => {
      const variants = {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error
      };
      return cn("rounded-lg p-4 text-white shadow-lg", `bg-gradient-to-br ${variants[variant]}`);
    },
    
    // 차트 컨테이너
    chartContainer: cn("bg-white rounded-lg p-4 shadow-md", theme.colors.border),
    
    // 테이블 관련
    table: cn("bg-white rounded-lg shadow-md", theme.colors.border),
    tableHeader: cn("bg-gradient-to-r px-4 py-3 text-white font-medium", theme.colors.primary),
    tableRow: cn("border-b", theme.colors.border),
    tableCell: cn("px-4 py-3", theme.colors.text),
    
    // 네비게이션
    navItem: cn("px-3 py-2 rounded-lg transition-all", theme.colors.text),
    navItemActive: cn("bg-gradient-to-r text-white shadow-lg", theme.colors.primary),
    
    // 상태 표시
    success: cn("bg-gradient-to-r text-white px-2 py-1 rounded", theme.colors.success),
    warning: cn("bg-gradient-to-r text-white px-2 py-1 rounded", theme.colors.warning),
    error: cn("bg-gradient-to-r text-white px-2 py-1 rounded", theme.colors.error)
  };
}

/**
 * 테마 색상을 직접 가져오는 함수
 */
export function useThemeColors() {
  const { getCurrentThemeConfig } = useThemeStore();
  return getCurrentThemeConfig().colors;
}

/**
 * 현재 테마 정보를 가져오는 함수
 */
export function useCurrentTheme() {
  const { currentTheme, getCurrentThemeConfig } = useThemeStore();
  return {
    mode: currentTheme,
    config: getCurrentThemeConfig()
  };
} 