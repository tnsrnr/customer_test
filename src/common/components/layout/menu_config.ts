import { 
  Users, 
  Building2, 
  LineChart, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Plane, 
  Ship, 
  Warehouse, 
  Building, 
  Globe, 
  HardHat,
  Home,
  Target
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
  isUnderDevelopment?: boolean; // 개발 중인 메뉴 표시
}

// 메뉴 구조 (HTNS 로고 + 순서대로 메뉴들)
export const menuItems: MenuItem[] = [
  // ===== 경영실적 관리 카테고리 =====
  { 
    name: '전사실적', 
    path: '/menu/management_performance/company_performance', 
    icon: BarChart3,
    description: '전사 실적 현황'
  },
  { 
    name: '인원현황', 
    path: '/menu/management_performance/personnel', 
    icon: Users,
    description: '인원 현황'
  },
  { 
    name: '본사실적', 
    path: '/menu/management_performance/hq_performance', 
    icon: Building2,
    description: '본사 실적 현황'
  },
  { 
    name: '재무현황', 
    path: '/menu/management_performance/finance', 
    icon: PieChart,
    description: '재무 현황 - 탭 기반 대시보드'
  },
  { 
    name: '상위거래처', 
    path: '/menu/management_performance/top_clients', 
    icon: TrendingUp,
    description: '상위 거래처 현황'
  },
  { 
    name: '부문별실적', 
    path: '/menu/management_performance/division', 
    icon: PieChart,
    description: '부문별 실적 현황',
    isUnderDevelopment: true
  },
  { 
    name: '국내자회사', 
    path: '/menu/management_performance/domestic_subsidiaries', 
    icon: Building,
    description: '국내 자회사 현황',
    isUnderDevelopment: true
  },
  { 
    name: '해외자회사', 
    path: '/menu/management_performance/overseas_subsidiaries', 
    icon: Globe,
    description: '해외 자회사 현황',
    isUnderDevelopment: true
  },
  // ===== 물동량 실적 관리 카테고리 =====
  { 
    name: '항공실적', 
    path: '/menu/performance_management/air', 
    icon: Plane,
    description: '항공 운송 실적'
  },
  { 
    name: '해상실적', 
    path: '/menu/performance_management/sea', 
    icon: Ship,
    description: '해상 운송 실적'
  },
  { 
    name: '창고실적', 
    path: '/menu/performance_management/warehouse', 
    icon: Warehouse,
    description: '창고 운영 실적'
  },
  { 
    name: '도급실적', 
    path: '/menu/performance_management/outsourcing', 
    icon: HardHat,
    description: '도급 업무 실적'
  },
  { 
    name: '국내', 
    path: '/menu/performance_management/domestic',
    description: '국내 정보'
  },
  { 
    name: '사업부', 
    path: '/menu/performance_management/test3',
    description: '사업부 정보'
  },
  { 
    name: '테4', 
    path: '/menu/performance_management/test4',
    description: '테 4'
  },
  { 
    name: '테5', 
    path: '/menu/performance_management/test5',
    description: '테 5'
  },
  { 
    name: '테6', 
    path: '/menu/performance_management/test6',
    description: '테 6'
  },
  { 
    name: '테7', 
    path: '/menu/performance_management/performance',
    icon: Home,
    description: '전체 물동량 현황'
  },
  { 
    name: '테8', 
    path: '/menu/performance_management/performance2',
    icon: Home,
    description: '전체 물동량 현황2'
  },
  // ===== 영업실적 분석 카테고리 =====
  { 
    name: '업체방문분석', 
    path: '/menu/sales_analysis_group/company_visit_analysis',
    icon: Target,
    description: '업체 방문 분석'
  },
  { 
    name: '업체방문캘린더', 
    path: '/menu/sales_analysis_group/company_visit_calendar',
    icon: Target,
    description: '업체 방문 캘린더'
  }
];

// 유틸리티 함수들
export const getMenuByPath = (path: string): MenuItem | undefined => {
  return menuItems.find(item => item.path === path);
};

export const getAllMenuPaths = (): string[] => {
  return menuItems.map(item => item.path);
}; 