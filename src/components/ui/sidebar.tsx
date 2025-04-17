'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import {
  Home,
  Settings,
  LayoutGrid,
  Bell,
  MessageSquare,
  FileStack,
  LineChart,
  FormInput,
  TestTube,
  ChevronDown,
  SortAsc,
  FileSearch,
  Calendar,
  PieChart,
  Smartphone,
  BarChart3,
  Layers,
  Package,
  Briefcase,
  Compass,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { ScrollArea } from "./scroll-area";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { motion, AnimatePresence } from "framer-motion";
import { useTabsStore } from "@/lib/store/tabsStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

// 메뉴 항목의 타입 정의
interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
  badge?: string;
}

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
}

export function Sidebar({ isCollapsed = false, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { addTab } = useTabsStore();

  const menuItems: MenuItem[] = [
    {
      title: "Tabulator 그리드",
      href: "/tabulatorGrid",
      icon: <LayoutGrid className="w-4 h-4" />,
      submenu: [
        { title: "기본 테이블", href: "/tabulatorGrid/sample1", icon: <SortAsc className="w-4 h-4" /> },
        { title: "데이터 필터링", href: "/tabulatorGrid/sample2", icon: <FileSearch className="w-4 h-4" /> },
        { title: "고급 기능", href: "/tabulatorGrid/sample3", icon: <Calendar className="w-4 h-4" /> }
      ]
    },
    {
      title: "기타 테스트",
      href: "/other_test",
      icon: <TestTube className="w-4 h-4" />,
      submenu: [
        {
          title: "알림 시스템",
          href: "/other_test/toast-demo",
          icon: <Bell className="w-4 h-4" />,
        },
        {
          title: "다이얼로그/모달",
          href: "/other_test/dialog-demo",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          title: "폼 밸리데이션",
          href: "/other_test/form-validation",
          icon: <FormInput className="w-4 h-4" />,
        },
        {
          title: "데이터 필터링",
          href: "/other_test/data-filter",
          icon: <FileStack className="w-4 h-4" />,
        },
        {
          title: "스켈레톤 UI",
          href: "/other_test/skeleton-demo",
          icon: <LineChart className="w-4 h-4" />,
        },
        {
          title: "테마 전환",
          href: "/other_test/theme-toggle",
          icon: <Settings className="w-4 h-4" />,
        },
        {
          title: "멀티스텝 폼",
          href: "/other_test/multi-step-form",
          icon: <FormInput className="w-4 h-4" />,
        },
        {
          title: "드래그 앤 드롭 업로드",
          href: "/other_test/drag-drop-upload",
          icon: <FileStack className="w-4 h-4" />,
        },
        {
          title: "무한 스크롤",
          href: "/other_test/infinite-scroll",
          icon: <Smartphone className="w-4 h-4" />,
        }
      ],
    }
  ];

  // 현재 경로가 메뉴 항목의 경로와 일치하는지 확인
  const isActive = useCallback((href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }, [pathname]);

  // 메뉴 토글 함수
  const toggleMenu = useCallback((href: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  }, []);

  // 모바일 사이드바 토글
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(prev => !prev);
  }, []);

  // 사이드바 접기/펼치기 토글
  const toggleCollapse = useCallback(() => {
    if (setIsCollapsed) {
      setIsCollapsed(!isCollapsed);
    }
  }, [isCollapsed, setIsCollapsed]);

  // 아이콘 렌더링 함수 추가
  const renderMenuIcon = useCallback((iconName: string, small = false) => {
    const iconClass = small ? "w-3.5 h-3.5" : "w-4 h-4";
    
    switch (iconName) {
      case 'Home': return <Home className={iconClass} />;
      case 'LayoutGrid': return <LayoutGrid className={iconClass} />;
      case 'TestTube': return <TestTube className={iconClass} />;
      case 'Bell': return <Bell className={iconClass} />;
      case 'MessageSquare': return <MessageSquare className={iconClass} />;
      case 'FormInput': return <FormInput className={iconClass} />;
      case 'FileStack': return <FileStack className={iconClass} />;
      case 'LineChart': return <LineChart className={iconClass} />;
      case 'Settings': return <Settings className={iconClass} />;
      case 'SortAsc': return <SortAsc className={iconClass} />;
      case 'FileSearch': return <FileSearch className={iconClass} />;
      case 'Calendar': return <Calendar className={iconClass} />;
      case 'PieChart': return <PieChart className={iconClass} />;
      case 'Smartphone': return <Smartphone className={iconClass} />;
      case 'BarChart3': return <BarChart3 className={iconClass} />;
      case 'Layers': return <Layers className={iconClass} />;
      case 'Package': return <Package className={iconClass} />;
      case 'Briefcase': return <Briefcase className={iconClass} />;
      case 'Compass': return <Compass className={iconClass} />;
      default: return <FileStack className={iconClass} />;
    }
  }, []);

  // 메뉴 클릭 핸들러 수정
  const handleMenuClick = useCallback((item: MenuItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    
    if (hasSubmenu) {
      toggleMenu(item.href);
    } else {
      // 아이콘 이름 결정
      let iconName = getIconNameFromMenuItem(item);
      
      // 새 탭 추가
      addTab({
        id: item.href,
        title: item.title,
        path: item.href,
        iconName: iconName
      });
      
      // 페이지 이동
      router.push(item.href);
    }
  }, [addTab, router, toggleMenu]);
  
  // 메뉴 아이템에서 아이콘 이름 추출
  const getIconNameFromMenuItem = (item: MenuItem): string => {
    // 아이콘 타입에 따라 이름 반환
    if (item.title.includes('대시보드')) return 'Home';
    if (item.title.includes('테이블') || item.href.includes('tabulatorGrid')) return 'LayoutGrid';
    if (item.title.includes('보고서') || item.href.includes('analytics')) return 'LineChart';
    if (item.title.includes('프로젝트')) return 'Briefcase';
    if (item.title.includes('설정')) return 'Settings';
    if (item.title.includes('알림')) return 'Bell';
    if (item.title.includes('다이얼로그') || item.title.includes('모달')) return 'MessageSquare';
    if (item.title.includes('폼')) return 'FormInput';
    if (item.title.includes('데이터')) return 'FileSearch';
    if (item.title.includes('테마')) return 'Settings';
    if (item.title.includes('업로드')) return 'FileStack';
    if (item.title.includes('스크롤')) return 'Smartphone';
    
    // 경로에 따라 이름 반환
    if (item.href === '/') return 'Home';
    if (item.href.includes('settings')) return 'Settings';
    if (item.href.includes('analytics')) return 'BarChart3';
    if (item.href.includes('projects')) return 'Briefcase';
    
    // 기본값
    return 'FileStack';
  };

  // 메뉴 항목 렌더링 함수 수정
  const renderMenuItem = useCallback((item: MenuItem, level = 0) => {
    const pathname = usePathname();
    const active = isActive(item.href);
    const hasSubmenu = !!item.submenu?.length;
    const isOpen = openMenus[item.href] || (active && openMenus[item.href] !== false);
    const isDashboard = item.href === "/";
    
    // 각 메뉴 레벨에 맞는 패딩 설정
    const paddingLeft = level * 12 + 'px';

    // 접힌 상태일 때의 메뉴 아이템 (아이콘만 표시)
    if (isCollapsed && level === 0) {
      return (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "mb-0.5 flex items-center justify-center p-1 rounded-lg mx-auto my-0.5 cursor-default transition-colors duration-200",
                  isDashboard 
                    ? "bg-primary/20 text-primary shadow-sm" 
                    : active 
                      ? "bg-gradient-to-br from-primary/15 to-transparent text-primary"
                      : "hover:bg-secondary/30 text-muted-foreground hover:text-primary",
                  !isDashboard && "cursor-pointer"
                )}
                onClick={(e) => !isDashboard && handleMenuClick(item, e)}
              >
                <div>
                  {isDashboard 
                    ? <Home className="w-5 h-5" />
                    : renderMenuIcon(getIconNameFromMenuItem(item), true)}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              {item.title}
              {isDashboard && <span className="text-[10px] text-muted-foreground">(대시보드)</span>}
              {item.badge && (
                <Badge variant={active ? "outline" : "secondary"} className="px-1 py-0 h-4 text-[10px] font-medium">
                  {item.badge}
                </Badge>
              )}
              {hasSubmenu && (
                <ChevronRight className="h-3 w-3 ml-1 opacity-70" />
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <div key={item.href} className={cn(
        "mb-0.5 transition-transform duration-200", 
        active && level === 0 ? "scale-[1.02]" : "",
        isDashboard ? "mb-3 mt-1" : "")}>
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ease-in-out",
            isDashboard
              ? "bg-primary/10 text-primary font-medium border-l-4 border-primary py-2"
              : active 
                ? "bg-gradient-to-r from-primary/10 to-transparent text-primary font-medium"
                : "hover:bg-secondary/30 hover:text-primary",
            isDashboard ? "cursor-default" : "cursor-pointer",
            level === 0 ? "my-0.5" : "my-0.5",
          )}
          onClick={(e) => !isDashboard && (hasSubmenu ? toggleMenu(item.href) : handleMenuClick(item, e))}
          style={{ paddingLeft: level > 0 ? `calc(${paddingLeft} + 0.5rem)` : undefined }}
        >
          <div className="flex items-center gap-2 w-full">
            {hasSubmenu && !isDashboard ? (
              <div className={cn("flex-shrink-0 w-4 h-4 transition-transform", 
                  isOpen ? "rotate-0" : "transform")}>
                {isOpen ? (
                  <ChevronDown className={cn("h-3.5 w-3.5", active ? "text-primary opacity-100" : "opacity-80")} />
                ) : (
                  <ChevronRight className={cn("h-3.5 w-3.5", active ? "text-primary opacity-100" : "opacity-80")} />
                )}
              </div>
            ) : (
              <div className="w-4 h-4"></div>
            )}
            
            <div className={cn(
              "rounded-md transition-colors flex items-center",
              isDashboard ? "text-primary" : active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {isDashboard 
                ? <Home className="w-5 h-5" />
                : renderMenuIcon(getIconNameFromMenuItem(item))}
            </div>
            
            <div className="flex-1 flex flex-col">
              <span className={cn(
                "truncate", 
                isDashboard ? "text-sm font-semibold" : "text-xs"
              )}>
                {item.title}
              </span>
              {isDashboard && (
                <span className="text-[10px] text-muted-foreground">대시보드</span>
              )}
            </div>
            
            {item.badge && (
              <Badge variant={active ? "default" : "outline"} className="ml-auto px-1 py-0 h-3.5 text-[9px] font-medium">
                {item.badge}
              </Badge>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {hasSubmenu && isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-0 ml-3 pl-2 py-0.5">
                {item.submenu?.map(subItem => renderMenuItem(subItem, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, [isActive, openMenus, toggleMenu, isCollapsed, handleMenuClick, renderMenuIcon, getIconNameFromMenuItem]);

  // 초기 메뉴 상태 설정 (페이지 로드 시)
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    
    // 현재 경로에 맞는 메뉴들을 모두 열기
    const findAndOpenMenus = (items: MenuItem[], parentPaths: string[] = []) => {
      for (const item of items) {
        if (pathname.startsWith(item.href) && item.href !== "/") {
          // 현재 메뉴 열기
          newOpenMenus[item.href] = true;
          
          // 부모 메뉴들도 모두 열기
          parentPaths.forEach(path => {
            newOpenMenus[path] = true;
          });
          
          // 서브메뉴 확인
          if (item.submenu) {
            findAndOpenMenus(item.submenu, [...parentPaths, item.href]);
          }
        } else if (item.submenu) {
          // 현재 경로와 일치하지 않더라도 서브메뉴 확인
          findAndOpenMenus(item.submenu, [...parentPaths, item.href]);
        }
      }
    };
    
    findAndOpenMenus(menuItems);
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  // 모바일 사이드바 외부 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isMobileSidebarOpen) {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setIsMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileSidebarOpen]);

  // 데스크톱 사이드바
  const DesktopSidebar = (
    <div 
      className={cn(
        "hidden border-r bg-card shadow-sm md:flex md:flex-col h-screen pt-0 transition-all duration-300",
        isCollapsed ? "md:w-12" : "md:w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 px-3 pt-1 pb-2">
            <nav className={cn(
              "flex flex-col gap-0",
              isCollapsed ? "items-center" : ""
            )}>
              {menuItems.map(item => renderMenuItem(item))}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </div>
  );

  // 모바일 사이드바
  const MobileSidebar = (
    <div className="md:hidden">
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 shadow-md rounded-full bg-background"
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black"
            />
            
            <motion.div
              id="mobile-sidebar"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 z-40 h-screen w-64 bg-card shadow-lg pt-0"
            >
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 px-3 pt-1 pb-2">
                    <nav className="flex flex-col gap-0">
                      {menuItems.map(item => renderMenuItem(item))}
                    </nav>
                  </ScrollArea>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );
} 