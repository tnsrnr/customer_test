'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Building2, LineChart, BarChart3, PieChart, TrendingUp, Plane, Ship, Warehouse, Building, Globe, HardHat } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { logoutAPI } from '@/lib/api/client';

// Temporary cn function implementation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface MenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

export function Header() {
  const pathname = usePathname();

  // 로그인 페이지에서는 헤더를 숨김
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      const result = await logoutAPI();
      if (result.success) {
        // localStorage에서 사용자 정보 제거
        localStorage.removeItem('user');
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬에서 로그아웃 처리
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const menuItems: MenuItem[] = [
    { name: '전사실적', path: '/a01-company-performance', icon: BarChart3 },
    { name: '인원현황', path: '/a02-personnel', icon: Users },
    { name: '본사실적', path: '/a03-hq-performance', icon: Building2 },
    { name: '재무현황', path: '/a04-finance', icon: LineChart },
    { name: '부문별실적', path: '/a05-division', icon: PieChart },
    { name: '상위거래처', path: '/a06-top-clients', icon: TrendingUp },
    { name: '항공실적', path: '/a07-air', icon: Plane },
    { name: '해상실적', path: '/a08-sea', icon: Ship },
    { name: '창고실적', path: '/a09-warehouse', icon: Warehouse },
    { name: '도급실적', path: '/a10-outsourcing', icon: HardHat },
    { name: '국내자회사', path: '/a11-domestic-subsidiaries', icon: Building },
    { name: '해외자회사', path: '/a12-overseas-subsidiaries', icon: Globe },
    { name: '회사', path: '/a15-domestic' },
    { name: '사업부', path: '/a18-test3' },
    { name: '해외권역1', path: '/a20-test5' },
    { name: '해외권역2', path: '/a21-test6' }
  ];

  return (
    <header className="bg-white border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-8">
          <Link href="/a13-performance">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/htns-logo.png" 
                alt="HTNS Logo" 
                width={100} 
                height={30} 
                className="object-contain"
              />
            </div>
          </Link>
          <nav className="flex space-x-2 overflow-x-auto pb-2">
            {menuItems.map((menu) => (
              <Link
                key={menu.name}
                href={menu.path}
                className={cn(
                  "flex items-center space-x-1 px-3 py-2 rounded-md transition-colors whitespace-nowrap text-sm",
                  pathname === menu.path
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {menu.icon && <menu.icon className="w-4 h-4" />}
                <span>{menu.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 hover:underline"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
} 