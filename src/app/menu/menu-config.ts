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
  HardHat 
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
  category?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

// 개별 메뉴 아이템 정의
export const menuItems: MenuItem[] = [
  // 실적 관련
  { 
    name: '전사실적', 
    path: '/menu/company-performance', 
    icon: BarChart3,
    description: '전사 실적 현황',
    category: 'performance'
  },
  { 
    name: '본사실적', 
    path: '/menu/hq-performance', 
    icon: Building2,
    description: '본사 실적 현황',
    category: 'performance'
  },
  { 
    name: '부문별실적', 
    path: '/menu/division', 
    icon: PieChart,
    description: '부문별 실적 현황',
    category: 'performance'
  },
  { 
    name: '인원현황', 
    path: '/menu/personnel', 
    icon: Users,
    description: '인원 현황',
    category: 'management'
  },
  { 
    name: '재무현황', 
    path: '/menu/finance', 
    icon: LineChart,
    description: '재무 현황',
    category: 'management'
  },
  { 
    name: '상위거래처', 
    path: '/menu/top-clients', 
    icon: TrendingUp,
    description: '상위 거래처 현황',
    category: 'business'
  },
  // 운송 관련
  { 
    name: '항공실적', 
    path: '/menu/air', 
    icon: Plane,
    description: '항공 운송 실적',
    category: 'transport'
  },
  { 
    name: '해상실적', 
    path: '/menu/sea', 
    icon: Ship,
    description: '해상 운송 실적',
    category: 'transport'
  },
  { 
    name: '창고실적', 
    path: '/menu/warehouse', 
    icon: Warehouse,
    description: '창고 운영 실적',
    category: 'transport'
  },
  { 
    name: '도급실적', 
    path: '/menu/outsourcing', 
    icon: HardHat,
    description: '도급 업무 실적',
    category: 'business'
  },
  // 자회사 관련
  { 
    name: '국내자회사', 
    path: '/menu/domestic-subsidiaries', 
    icon: Building,
    description: '국내 자회사 현황',
    category: 'subsidiaries'
  },
  { 
    name: '해외자회사', 
    path: '/menu/overseas-subsidiaries', 
    icon: Globe,
    description: '해외 자회사 현황',
    category: 'subsidiaries'
  },
  // 기타
  { 
    name: '회사', 
    path: '/menu/domestic',
    description: '국내 회사 정보',
    category: 'company'
  },
  { 
    name: '사업부', 
    path: '/menu/test3',
    description: '사업부 정보',
    category: 'company'
  },
  { 
    name: '해외권역1', 
    path: '/menu/test5',
    description: '해외 권역 1',
    category: 'overseas'
  },
  { 
    name: '해외권역2', 
    path: '/menu/test6',
    description: '해외 권역 2',
    category: 'overseas'
  }
];

// 카테고리별로 그룹화된 메뉴
export const menuCategories: MenuCategory[] = [
  {
    name: '실적 관리',
    items: menuItems.filter(item => item.category === 'performance')
  },
  {
    name: '경영 관리',
    items: menuItems.filter(item => item.category === 'management')
  },
  {
    name: '운송 실적',
    items: menuItems.filter(item => item.category === 'transport')
  },
  {
    name: '사업 관리',
    items: menuItems.filter(item => item.category === 'business')
  },
  {
    name: '자회사 관리',
    items: menuItems.filter(item => item.category === 'subsidiaries')
  },
  {
    name: '회사 정보',
    items: menuItems.filter(item => item.category === 'company')
  },
  {
    name: '해외 권역',
    items: menuItems.filter(item => item.category === 'overseas')
  }
];

// 메뉴 경로 매핑 (기존 경로에서 새 경로로 리다이렉트용)
export const menuPathMapping: Record<string, string> = {
  '/a01-company-performance': '/menu/company-performance',
  '/a02-personnel': '/menu/personnel',
  '/a03-hq-performance': '/menu/hq-performance',
  '/a04-finance': '/menu/finance',
  '/a05-division': '/menu/division',
  '/a06-top-clients': '/menu/top-clients',
  '/a07-air': '/menu/air',
  '/a08-sea': '/menu/sea',
  '/a09-warehouse': '/menu/warehouse',
  '/a10-outsourcing': '/menu/outsourcing',
  '/a11-domestic-subsidiaries': '/menu/domestic-subsidiaries',
  '/a12-overseas-subsidiaries': '/menu/overseas-subsidiaries',
  '/a13-performance': '/menu/performance',
  '/a15-domestic': '/menu/domestic',
  '/a18-test3': '/menu/test3',
  '/a19-test4': '/menu/test4',
  '/a20-test5': '/menu/test5',
  '/a21-test6': '/menu/test6'
};

// 유틸리티 함수들
export const getMenuByPath = (path: string): MenuItem | undefined => {
  return menuItems.find(item => item.path === path);
};

export const getMenuByCategory = (category: string): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};

export const getAllMenuPaths = (): string[] => {
  return menuItems.map(item => item.path);
}; 