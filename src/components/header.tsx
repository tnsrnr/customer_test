'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAPI } from '@/app/auth/auth-client';
import { menuItems } from '@/app/menu/menu-config';

// Temporary cn function implementation
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
  const pathname = usePathname();

  // 로그인 페이지에서는 헤더를 숨김
  if (pathname === '/auth') {
    return null;
  }

  const handleLogout = async () => {
    try {
      const result = await logoutAPI();
      if (result.success) {
        // localStorage에서 사용자 정보 제거
        localStorage.removeItem('user');
        // 로그인 페이지로 리다이렉트
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬에서 로그아웃 처리
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
  };

  // menuItems는 이미 import된 menu-config에서 가져옴

  return (
    <header className="bg-white border-b">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-8">
          <Link href="/menu/performance">
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
          <nav className="flex space-x-1 overflow-x-auto pb-2">
            {menuItems.map((menu) => (
              <Link
                key={menu.name}
                href={menu.path}
                className={cn(
                  "flex items-center space-x-1 px-2 py-2 rounded-md transition-all duration-200 ease-in-out whitespace-nowrap text-sm",
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