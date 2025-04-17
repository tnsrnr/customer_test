'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Menu, Search } from 'lucide-react';
import { Input } from "./input";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();

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
              href="/tabulatorGrid"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/tabulatorGrid' || pathname.startsWith('/tabulatorGrid/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              Tabulator 그리드
            </Link>
            <Link
              href="/other_test"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === '/other_test' || pathname.startsWith('/other_test/')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              테스트 기능
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
        </div>
      </div>
    </header>
  );
} 