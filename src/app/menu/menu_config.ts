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
  Home
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
}

// 원래 메뉴 구조 (HTNS 로고 + 순서대로 메뉴들)
export const menuItems: MenuItem[] = [
  // HTNS 로고 (홈)
  { 
    name: '전체물동량현황', 
    path: '/menu/performance', 
    icon: Home,
    description: '전체 물동량 현황'
  },
  // 기존 메뉴들 순서대로
  { 
    name: '전사실적', 
    path: '/menu/company_performance', 
    icon: BarChart3,
    description: '전사 실적 현황'
  },
  { 
    name: '인원현황', 
    path: '/menu/personnel', 
    icon: Users,
    description: '인원 현황'
  },
  { 
    name: '본사실적', 
    path: '/menu/hq_performance', 
    icon: Building2,
    description: '본사 실적 현황'
  },
  { 
    name: '재무현황', 
    path: '/menu/finance', 
    icon: LineChart,
    description: '재무 현황'
  },
  { 
    name: '부문별실적', 
    path: '/menu/division', 
    icon: PieChart,
    description: '부문별 실적 현황'
  },
  { 
    name: '상위거래처', 
    path: '/menu/top_clients', 
    icon: TrendingUp,
    description: '상위 거래처 현황'
  },
  { 
    name: '항공실적', 
    path: '/menu/air', 
    icon: Plane,
    description: '항공 운송 실적'
  },
  { 
    name: '해상실적', 
    path: '/menu/sea', 
    icon: Ship,
    description: '해상 운송 실적'
  },
  { 
    name: '창고실적', 
    path: '/menu/warehouse', 
    icon: Warehouse,
    description: '창고 운영 실적'
  },
  { 
    name: '도급실적', 
    path: '/menu/outsourcing', 
    icon: HardHat,
    description: '도급 업무 실적'
  },
  { 
    name: '국내자회사', 
    path: '/menu/domestic_subsidiaries', 
    icon: Building,
    description: '국내 자회사 현황'
  },
  { 
    name: '해외자회사', 
    path: '/menu/overseas_subsidiaries', 
    icon: Globe,
    description: '해외 자회사 현황'
  },
  { 
    name: '국내', 
    path: '/menu/domestic',
    description: '국내 정보'
  },
  { 
    name: '사업부', 
    path: '/menu/test3',
    description: '사업부 정보'
  },
  { 
    name: '테4', 
    path: '/menu/test4',
    description: '테 4'
  },
  { 
    name: '테5', 
    path: '/menu/test5',
    description: '테 5'
  },
  { 
    name: '테6', 
    path: '/menu/test6',
    description: '테 6'
  }
];

// 유틸리티 함수들
export const getMenuByPath = (path: string): MenuItem | undefined => {
  return menuItems.find(item => item.path === path);
};

export const getAllMenuPaths = (): string[] => {
  return menuItems.map(item => item.path);
}; 