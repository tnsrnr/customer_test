'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from './menu_config';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect, useRef } from 'react';

function cn(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}

import { RefreshCw, ChevronLeft, ChevronRight, Calendar, Settings, X, Check, LogOut, Edit3, Layers, ChevronDown } from 'lucide-react';
import { useGlobalStore } from '@/global/store/slices/global';
import { clearSession } from '@/app/auth/session';

// 드래그 가능한 메뉴 아이템 컴포넌트
function SortableMenuItem({ menu, pathname, isEditMode }: { 
  menu: any; 
  pathname: string; 
  isEditMode: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.path });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex flex-row items-center gap-x-2 px-2 py-2 rounded-lg transition-all duration-200 font-medium text-base backdrop-blur-sm cursor-move",
        pathname === menu.path
          ? "bg-white/20 text-white shadow-lg border border-white/20"
          : "bg-white/10 text-blue-100 hover:bg-white/20 hover:text-white hover:shadow-md border border-transparent hover:border-white/20",
        isEditMode && "ring-2 ring-blue-400 ring-opacity-50"
      )}
    >
      {isEditMode && (
        <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
      )}
      {menu.icon && <menu.icon className="w-5 h-5" />}
      <span className="whitespace-nowrap">{menu.name}</span>
    </div>
  );
}

// 설정 드롭다운 메뉴 컴포넌트
function SettingsDropdown({ 
  isOpen, 
  onToggle, 
  onClose, 
  isMenuEditMode, 
  toggleMenuEditMode, 
  resetMenuOrder, 
  currentPage, 
  setCurrentPage,
  canToggle, 
  handleLogout 
}: {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMenuEditMode: boolean;
  toggleMenuEditMode: () => void;
  resetMenuOrder: () => void;
  currentPage: 'page1' | 'page2' | 'page3';
  setCurrentPage: (page: 'page1' | 'page2' | 'page3') => void;
  canToggle: boolean;
  handleLogout: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 text-base text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/20"
        title="설정"
      >
        <Settings className="w-5 h-5" />
        <span className="hidden sm:inline">설정</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-600/50 shadow-2xl z-50">
          <div className="p-2 space-y-1">
            {/* 메뉴 편집 섹션 */}
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                메뉴 관리
              </h3>
              <div className="space-y-1">
                <button
                  onClick={toggleMenuEditMode}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    isMenuEditMode
                      ? "bg-blue-600/20 text-blue-200"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  )}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isMenuEditMode ? "편집 완료" : "메뉴 순서 편집"}</span>
                </button>
                
                {isMenuEditMode && (
                  <button
                    onClick={resetMenuOrder}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>메뉴 순서 초기화</span>
                  </button>
                )}
              </div>
            </div>

            {/* 페이지 전환 섹션 */}
            {canToggle && (
              <div className="px-3 py-2 border-t border-slate-600/30">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  페이지 전환
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setCurrentPage('page1');
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                      currentPage === 'page1'
                        ? "bg-blue-600/20 text-blue-200"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    )}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Page 1 - 경영실적</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('page2');
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                      currentPage === 'page2'
                        ? "bg-blue-600/20 text-blue-200"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    )}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Page 2 - 실적관리</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('page3');
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                      currentPage === 'page3'
                        ? "bg-blue-600/20 text-blue-200"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    )}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Page 3 - 영업실적분석</span>
                  </button>
                </div>
              </div>
            )}

            {/* 로그아웃 섹션 */}
            <div className="px-3 py-2 border-t border-slate-600/30">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                계정
              </h3>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    isRefreshing, 
    triggerGlobalRefresh, 
    selectedYear, 
    selectedMonth, 
    setSelectedYear, 
    setSelectedMonth,
    menuOrder,
    isMenuEditMode,
    setMenuOrder,
    toggleMenuEditMode,
    resetMenuOrder,
    getOrderedMenus,
    currentPage,
    setCurrentPage
  } = useGlobalStore();
  const [isClient, setIsClient] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const page1MenuCount = 6; // PAGE1: 전사실적, 인원현황, 본사실적, 재무현황, 부문별실적, 상위거래처 (6개)
  const page2MenuCount = 12; // PAGE2: 전체물동량현황 + 기타 실적관리 메뉴들
  const primaryGradient = 'from-blue-900 to-slate-900';

  // 클라이언트 사이드 렌더링 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 현재 경로에 따라 페이지 자동 설정
  useEffect(() => {
    if (!pathname) return;
    
    // 원본 menuItems 배열에서 현재 경로가 어느 페이지에 속하는지 확인
    const currentMenuItem = menuItems.find(item => item.path === pathname);
    if (!currentMenuItem) {
      console.log('❌ 메뉴를 찾을 수 없음:', pathname);
      return;
    }
    
    const currentIndex = menuItems.findIndex(item => item.path === pathname);
    if (currentIndex === -1) {
      console.log('❌ 메뉴 인덱스를 찾을 수 없음:', pathname);
      return;
    }
    
    console.log('🔍 현재 경로:', pathname);
    console.log('🔍 메뉴명:', currentMenuItem.name);
    console.log('🔍 인덱스:', currentIndex);
    console.log('🔍 전체 메뉴 개수:', menuItems.length);
    
    // 페이지 분할 로직에 따라 현재 페이지 결정 (원본 menuItems 기준)
    if (currentIndex >= 1 && currentIndex <= 6) {
      // PAGE1: 경영실적 메뉴들 (인덱스 1-6: 전사실적, 인원현황, 본사실적, 재무현황, 부문별실적, 상위거래처)
      console.log('📄 Page 1으로 설정 (인덱스 1-6)');
      setCurrentPage('page1');
    } else if (currentIndex >= 7 && currentIndex <= 17) {
      // PAGE2: 실적관리 메뉴들 (인덱스 7-17: 항공실적, 해상실적, 창고실적, 도급실적, 국내자회사, 해외자회사, 국내, 사업부, 테4, 테5, 테6)
      console.log('📄 Page 2로 설정 (인덱스 7-17)');
      setCurrentPage('page2');
    } else if (currentIndex >= 18) {
      // PAGE3: 영업실적분석 (인덱스 18-19: 영업실적분석, 영업실적분석 2)
      console.log('📄 Page 3으로 설정 (인덱스 18+)');
      setCurrentPage('page3');
    } else {
      console.log('❌ 예상치 못한 인덱스:', currentIndex);
    }
  }, [pathname, setCurrentPage]);

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 로그인 페이지에서는 헤더를 숨김
  if (pathname === '/auth') {
    return null;
  }

  const handleLogout = () => {
    // localStorage에서 세션 정보 제거
    clearSession();
    // 로그인 페이지로 리다이렉트
    router.push('/auth');
  };

  const handleGlobalRefresh = () => {
    const currentPage = pathname || '';
    console.log('🔍 조회 버튼 클릭 - 현재 페이지:', currentPage);
    
    // 현재 페이지에 따라 다른 조회 로직 실행
    if (currentPage.includes('/menu/company-performance')) {
      console.log('📊 company-performance 페이지 조회 실행');
      // company-performance 페이지의 경우 kpiMetrics API 호출
      triggerGlobalRefresh();
    } else if (currentPage.includes('/menu/personnel')) {
      console.log('👥 personnel 페이지 조회 실행');
      triggerGlobalRefresh();
    } else if (currentPage.includes('/menu/hq-performance')) {
      console.log('🏢 hq-performance 페이지 조회 실행');
      triggerGlobalRefresh();
    } else if (currentPage.includes('/menu/finance')) {
      console.log('💰 finance 페이지 조회 실행');
      triggerGlobalRefresh();
    } else if (currentPage.includes('/menu/division')) {
      console.log('📈 division 페이지 조회 실행');
      triggerGlobalRefresh();
    } else {
      console.log('🔄 일반 페이지 조회 실행');
      triggerGlobalRefresh();
    }
  };



  // 정렬된 메뉴 가져오기
  const orderedMenus = getOrderedMenus();
  
  let visibleMenus: any[] = [];
  if (currentPage === 'page1') {
    // PAGE1: 경영실적 메뉴들 (2-7번째: 전사실적, 인원현황, 본사실적, 재무현황, 부문별실적, 상위거래처)
    visibleMenus = orderedMenus.slice(1, page1MenuCount + 1);
  } else if (currentPage === 'page2') {
    // PAGE2: 실적관리 메뉴들 (8-18번째: 항공실적, 해상실적, 창고실적, 도급실적, 국내자회사, 해외자회사, 국내, 사업부, 테4, 테5, 테6)
    visibleMenus = orderedMenus.slice(1).slice(page1MenuCount, page1MenuCount + 11);
  } else {
    // PAGE3: 영업실적분석 (마지막 2개: 영업실적분석, 영업실적분석 2)
    visibleMenus = orderedMenus.slice(1).slice(page1MenuCount + 11, page2MenuCount + page1MenuCount + 2);
  }

  const canToggle = orderedMenus.slice(1).length > page1MenuCount;

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = menuOrder.indexOf(active.id as string);
      const newIndex = menuOrder.indexOf(over?.id as string);
      
      const newOrder = arrayMove(menuOrder, oldIndex, newIndex);
      setMenuOrder(newOrder);
    }
  };

  // 년도 옵션 (현재 년도 기준 ±2년)
  const yearOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  
  // 월 옵션
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // 서버 사이드 렌더링 시 기본 메뉴 순서 사용
  const serverSideMenus = currentPage === 'page1' 
    ? menuItems.slice(1, page1MenuCount + 1)
    : currentPage === 'page2'
    ? menuItems.slice(1).slice(page1MenuCount, page1MenuCount + 11)
    : menuItems.slice(1).slice(-2);

  return (
    <header className={cn("bg-gradient-to-br backdrop-blur-md shadow-xl border-none z-50 relative", primaryGradient)}>
      <div className="flex justify-between items-center px-3 py-3">
        <div className="flex items-center space-x-4">
          {/* HTNS 로고 */}
          <Link href="/menu/performance_management/performance">
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
            {isClient ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleMenus.map(menu => menu.path)}
                  strategy={verticalListSortingStrategy}
                >
                  <nav className="flex space-x-2">
                    {visibleMenus.map((menu) => (
                      isMenuEditMode ? (
                        <SortableMenuItem
                          key={menu.path}
                          menu={menu}
                          pathname={pathname}
                          isEditMode={isMenuEditMode}
                        />
                      ) : (
                        <Link
                          key={menu.path}
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
                      )
                    ))}
                  </nav>
                </SortableContext>
              </DndContext>
            ) : (
              <nav className="flex space-x-2">
                {serverSideMenus.map((menu) => (
                  <Link
                    key={menu.path}
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
            )}
          </div>
        </div>
        {/* 우측 버튼들 */}
        <div className="flex items-center space-x-3">
          {/* 년도/월 선택기 */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
            {isClient ? (
              <Calendar className="w-4 h-4 text-blue-100" />
            ) : (
              <span className="w-4 h-4 bg-blue-100 rounded"></span>
            )}
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
            {isClient ? (
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            ) : (
              <span className="w-5 h-5 bg-blue-100 rounded"></span>
            )}
            <span className="hidden sm:inline">조회</span>
          </button>
          
          {/* 설정 드롭다운 */}
          {isClient && (
            <SettingsDropdown
              isOpen={isSettingsOpen}
              onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
              onClose={() => setIsSettingsOpen(false)}
              isMenuEditMode={isMenuEditMode}
              toggleMenuEditMode={toggleMenuEditMode}
              resetMenuOrder={resetMenuOrder}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              canToggle={canToggle}
              handleLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
} 