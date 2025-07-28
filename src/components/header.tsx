'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from '@/app/menu/menu-config';
import { cn } from "@/utils";
import { RefreshCw } from 'lucide-react';
import { useGlobalStore } from '@/store/global';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isRefreshing, triggerGlobalRefresh } = useGlobalStore();

  // 로그인 페이지에서는 헤더를 숨김
  if (pathname === '/auth') {
    return null;
  }

  const handleLogout = () => {
    // localStorage에서 세션 정보 제거
    localStorage.removeItem('htns-session');
    // 로그인 페이지로 리다이렉트
    router.push('/auth');
  };

  const handleGlobalRefresh = () => {
    triggerGlobalRefresh();
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-6">
          {/* HTNS 로고 */}
          <Link href="/menu/performance">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/htns-logo.png" 
                alt="HTNS Logo" 
                width={120} 
                height={40} 
                className="object-contain"
              />
            </div>
          </Link>
          
          {/* 메뉴 네비게이션 */}
          <nav className="flex space-x-0 overflow-x-auto pb-2">
            {menuItems.slice(1).map((menu) => ( // 첫 번째(홈) 제외하고 표시
              <Link
                key={menu.name}
                href={menu.path}
                className={cn(
                  "flex items-center space-x-1 px-2 py-2 rounded-md transition-all duration-200 ease-in-out whitespace-nowrap text-sm font-medium",
                  pathname === menu.path
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-blue-200"
                )}
              >
                {menu.icon && <menu.icon className="w-4 h-4" />}
                <span>{menu.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* 우측 버튼들 */}
        <div className="flex items-center space-x-3">
          {/* 전역 조회 버튼 */}
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="현재 페이지 데이터 새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">조회</span>
          </button>
          
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 hover:underline px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
} 