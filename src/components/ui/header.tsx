'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { useAuthStore } from '@/lib/store/authStore';
import { LogOut, Menu, Search, User } from 'lucide-react';
import { Input } from "./input";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 토글</span>
        </Button>
        
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            관리 시스템
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/admin"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/admin' || pathname.startsWith('/admin/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              관리자 관리
            </Link>
            <Link
              href="/com"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/com' || pathname.startsWith('/com/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              공통 관리
            </Link>
            <Link
              href="/hrs"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/hrs' || pathname.startsWith('/hrs/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              인사 관리
            </Link>
            <Link
              href="/gridtest"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/gridtest' || pathname.startsWith('/gridtest/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              그리드 테스트
            </Link>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative hidden md:flex mr-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색..."
              className="w-64 rounded-lg bg-background pl-8"
            />
          </div>
          
          {user && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}
          
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
} 