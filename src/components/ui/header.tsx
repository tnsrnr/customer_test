'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Moon, 
  Sun, 
  Settings,
  LogOut,
  HelpCircle,
  MessageSquare,
  Database,
  Menu,
} from 'lucide-react';
import { Input } from "./input";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { Badge } from "./badge";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { useTabsStore } from "@/lib/store/tabsStore";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const { addTab } = useTabsStore();

  return (
    <header className="sticky top-0 z-40 border-b bg-card shadow-sm">
      <div className="flex h-12 items-center px-3">
        <div className="flex items-center mr-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 토글</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex h-14 items-center border-b px-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary rounded-md p-1">
                    <Database className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h2 className="text-lg font-semibold">ERP<span className="text-primary">System</span></h2>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (toggleSidebar) toggleSidebar();
            }} 
            className="font-bold text-xl tracking-tight hidden md:flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-primary rounded-md p-1">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            ERP<span className="text-primary">System</span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center space-x-1">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색..."
              className="w-56 h-7 rounded-md bg-muted/50 pl-7 text-xs focus-visible:ring-primary/20"
            />
          </div>
          
          {/* 다크모드 토글 */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)}
            className="h-7 w-7 rounded-md"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          {/* 알림 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-7 w-7 rounded-md">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center text-[9px]">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-center">알림</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* 알림 항목들 */}
              <div className="max-h-[300px] overflow-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer p-3">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>SY</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">새로운 알림 {i}</p>
                        <p className="text-xs text-muted-foreground">10분 전</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center font-medium text-primary">
                모든 알림 보기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* 메시지 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-7 w-7 rounded-md">
                <MessageSquare className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center text-[9px]">
                  2
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-center">메시지</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-auto">
                {[1, 2].map((i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer p-3">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>RP</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">새 메시지 {i}</p>
                        <p className="text-xs text-muted-foreground">방금 전</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center font-medium text-primary">
                모든 메시지 보기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* 사용자 프로필 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-1 pr-2 h-7 gap-1 rounded-md">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>관리</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium hidden md:inline-block">관리자</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>프로필</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>도움말</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 