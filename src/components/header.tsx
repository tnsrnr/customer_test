'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from '@/app/menu/menu-config';
import { cn } from "@/utils";
import { RefreshCw, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useGlobalStore } from '@/store/global';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isRefreshing, triggerGlobalRefresh } = useGlobalStore();
  const [showAllMenus, setShowAllMenus] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const initialMenuCount = 6; // 전사실적, 인원현황, 본사실적, 재무현황, 부문별실적, 상위거래처 (6개 표시)

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

  const toggleMenus = () => {
    setShowAllMenus(!showAllMenus);
  };

  const visibleMenus = showAllMenus 
    ? menuItems.slice(1).slice(initialMenuCount) // 처음 6개 제외하고 나머지만
    : menuItems.slice(1, initialMenuCount + 1); // 처음 6개만

  const canToggle = menuItems.slice(1).length > initialMenuCount;

  // 년도 옵션 (현재 년도 기준 ±2년)
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  
  // 월 옵션
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <header className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800/95 backdrop-blur-md shadow-xl border-none">
      <div className="flex justify-between items-center px-3 py-3">
        <div className="flex items-center space-x-4">
          {/* HTNS 로고 */}
          <Link href="/menu/performance">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/htns-logo.png" 
                alt="HTNS Logo" 
                width={110} 
                height={38} 
                className="object-contain"
              />
            </div>
          </Link>
          {/* 메뉴 네비게이션 */}
          <div className="flex items-center space-x-2">
            {/* 메뉴 목록 */}
            <nav className="flex space-x-2">
              {visibleMenus.map((menu) => (
                <Link
                  key={menu.name}
                  href={menu.path}
                  className={cn(
                    "flex flex-row items-center gap-x-2 px-2 py-2 rounded-lg transition-all duration-200 font-medium text-base backdrop-blur-sm",
                    pathname === menu.path
                      ? "bg-white/20 text-white shadow-lg border border-white/20"
                      : "bg-white/10 text-blue-100 hover:bg-white/20 hover:text-white hover:shadow-md border border-transparent hover:border-white/20"
                  )}
                >
                  {menu.icon && <menu.icon className="w-5 h-5" />}
                  <span className="whitespace-nowrap">{menu.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        {/* 우측 버튼들 */}
        <div className="flex items-center space-x-3">
          {/* 전환 버튼 */}
          {canToggle && (
            <button
              onClick={toggleMenus}
              className="flex items-center gap-1 px-3 py-2 text-base text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20"
              title={showAllMenus ? "page1로" : "page2로"}
            >
              {showAllMenus ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              <span className="hidden sm:inline">{showAllMenus ? "page1" : "page2"}</span>
            </button>
          )}
          
          {/* 년도/월 선택기 */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
            <Calendar className="w-4 h-4 text-blue-100" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-blue-100 text-sm border-none outline-none cursor-pointer"
            >
              {yearOptions.map(year => (
                <option key={year} value={year} className="bg-slate-800 text-white">
                  {year}년
                </option>
              ))}
            </select>
            <span className="text-blue-100 text-sm">/</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-blue-100 text-sm border-none outline-none cursor-pointer"
            >
              {monthOptions.map(month => (
                <option key={month} value={month} className="bg-slate-800 text-white">
                  {month}월
                </option>
              ))}
            </select>
          </div>
          
          {/* 전역 조회 버튼 */}
          <button
            onClick={handleGlobalRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 px-3 py-2 text-base text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-white/20"
            title="현재 페이지 데이터 새로고침"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">조회</span>
          </button>
          
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className="text-base text-red-300 hover:text-red-200 hover:underline px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors border border-red-300/30 hover:border-red-200"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
} 