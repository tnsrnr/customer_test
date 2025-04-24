'use client';

import React, { useState, useEffect } from 'react';
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
  Megaphone,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Input } from "./input";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { Badge } from "./badge";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { useTabsStore } from "@/lib/store/tabsStore";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const { addTab } = useTabsStore();
  const [date, setDate] = useState<Date>(new Date());
  
  // 공지사항 데이터
  const announcements = [
    "시스템 점검 안내: 오늘 오후 6시부터 8시까지 점검 예정입니다.",
    "신규 기능 업데이트: 부지재 관리 기능이 추가되었습니다.",
    "보안 업데이트: 사용자 비밀번호를 변경해주세요."
  ];
  
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  
  // 공지사항 자동 변경 효과
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAnnouncementIndex(prev => (prev + 1) % announcements.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [announcements.length]);
  
  // 다음 공지사항으로 이동
  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex(prev => (prev + 1) % announcements.length);
  };
  
  // 이전 공지사항으로 이동
  const prevAnnouncement = () => {
    setCurrentAnnouncementIndex(prev => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="px-4 pt-3 pb-3 flex items-center">
        <div className="rounded-xl border bg-card shadow-md w-full">
          <div className="flex h-12 items-center px-4">
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
            
            {/* 공지사항 영역 */}
            <div className="hidden md:flex items-center flex-1 max-w-xl">
              <div className="flex items-center bg-slate-50 rounded-md border px-3 py-1 w-full">
                <Megaphone className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <div className="relative overflow-hidden flex-1">
                  <div className="animate-marquee whitespace-nowrap overflow-hidden text-ellipsis text-sm">
                    {announcements[currentAnnouncementIndex]}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={prevAnnouncement}
                    className="h-5 w-5 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Badge variant="outline" className="px-1.5 py-0 h-5 text-[10px]">
                    {currentAnnouncementIndex + 1}/{announcements.length}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={nextAnnouncement}
                    className="h-5 w-5 rounded-full text-slate-400 hover:text-primary hover:bg-slate-100"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="ml-auto flex items-center space-x-1">
              <div className="relative hidden md:flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="py-1 px-3 h-auto flex items-center gap-1 hover:bg-secondary">
                      <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                      <span className="text-xs font-medium">
                        {format(date, "yyyy년 MM월 dd일 (EEEE)", { locale: ko })}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => newDate && setDate(newDate)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium hidden md:inline-block">내정보</span>
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
        </div>
      </div>
    </header>
  );
} 