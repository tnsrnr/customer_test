'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  Home,
  Settings,
  User,
  Users,
  LayoutGrid,
  Table2,
  Bell,
  MessageSquare,
  FileStack,
  LineChart,
  FormInput,
  TestTube,
  ChevronDown,
  ChevronRight
} from "lucide-react";

// 메뉴 항목의 타입 정의
interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  submenu?: MenuItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [selectedMenu, setSelectedMenu] = useState<string>("");

  const menuItems: MenuItem[] = [
    {
      title: "홈",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    },
    {
      title: "관리자 관리",
      href: "/admin",
      icon: <User className="w-4 h-4" />,
    },
    {
      title: "공통 관리",
      href: "/com",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      title: "인사 관리",
      href: "/hrs",
      icon: <Briefcase className="w-4 h-4" />,
      submenu: [
        {
          title: "직원 관리",
          href: "/hrs/employees",
          icon: <Users className="w-4 h-4" />,
        },
        {
          title: "부서 관리",
          href: "/hrs/departments",
          icon: <Building2 className="w-4 h-4" />,
        },
        {
          title: "출결 관리",
          href: "/hrs/attendance",
          icon: <Clock className="w-4 h-4" />,
          submenu: [
            {
              title: "출퇴근 기록",
              href: "/hrs/attendance/records",
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              title: "지각/조퇴/결근 처리",
              href: "/hrs/attendance/issues",
              icon: <Clock className="w-4 h-4" />,
            },
          ],
        },
        {
          title: "급여 관리",
          href: "/hrs/payroll",
          icon: <CreditCard className="w-4 h-4" />,
        },
      ],
    },
    {
      title: "그리드 테스트",
      href: "/gridtest",
      icon: <LayoutGrid className="w-4 h-4" />,
      submenu: [
        { 
          title: "AG Grid", 
          href: "/gridtest/aggrid", 
          icon: <LayoutGrid className="w-4 h-4" />,
          submenu: [
            { title: "AG Grid 샘플 1", href: "/gridtest/aggrid/sample1", icon: <LayoutGrid className="w-4 h-4" /> },
            { title: "AG Grid 샘플 2", href: "/gridtest/aggrid/sample2", icon: <LayoutGrid className="w-4 h-4" /> },
            { title: "AG Grid 샘플 3", href: "/gridtest/aggrid/sample3", icon: <LayoutGrid className="w-4 h-4" /> }
          ]
        },
        { 
          title: "Handsontable", 
          href: "/gridtest/handsontable", 
          icon: <Table2 className="w-4 h-4" />,
          submenu: [
            { title: "Handsontable 샘플1", href: "/gridtest/handsontable/sample1", icon: <Table2 className="w-4 h-4" /> },
            { title: "Handsontable 샘플2", href: "/gridtest/handsontable/sample2", icon: <Table2 className="w-4 h-4" /> },
            { title: "Handsontable 샘플3", href: "/gridtest/handsontable/sample3", icon: <Table2 className="w-4 h-4" /> },
            { title: "Handsontable 샘플4", href: "/gridtest/handsontable/sample4", icon: <Table2 className="w-4 h-4" /> },
            { title: "Handsontable 샘플5", href: "/gridtest/handsontable/sample5", icon: <Table2 className="w-4 h-4" /> }
          ]
        },
        { 
          title: "Tabulator", 
          href: "/gridtest/tabulator", 
          icon: <Table2 className="w-4 h-4" />,
          submenu: [
            { title: "Tabulator 샘플", href: "/gridtest/tabulator/sample", icon: <Table2 className="w-4 h-4" /> }
          ]
        }
      ],
    },
    {
      title: "기타 테스트",
      href: "/other_test",
      icon: <TestTube className="w-4 h-4" />,
      submenu: [
        {
          title: "토스트 메시지",
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
        }
      ],
    },
  ];

  // 현재 경로와 메뉴 아이템 경로가 일치하는지 확인하는 함수
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    // 선택된 메뉴와 현재 메뉴가 일치하는 경우도 활성화된 것으로 처리
    return pathname.startsWith(href) || href === selectedMenu;
  };

  // 링크 클래스 생성 함수
  const linkClass = (href: string) => {
    return cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
      isActive(href)
        ? "bg-primary text-primary-foreground"
        : "hover:bg-muted"
    );
  };

  // 메뉴 토글 및 선택 함수
  const toggleMenu = (href: string, hasSubmenu: boolean, event: React.MouseEvent) => {
    // 클릭된 메뉴를 선택된 메뉴로 설정
    setSelectedMenu(href);
    
    if (hasSubmenu) {
      event.preventDefault();
      setOpenMenus(prev => ({
        ...prev,
        [href]: !prev[href]
      }));
    }
  };

  // 서브메뉴가 있는 아이템 렌더링 함수
  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.href);
    const isOpen = openMenus[item.href] || (active && openMenus[item.href] !== false);
    const hasSubmenu = !!item.submenu?.length;

    const commonClasses = cn(
      "sidebar-menu-item flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
      active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
    );

    return (
      <div key={item.href} className="space-y-1">
        {hasSubmenu ? (
          // 서브메뉴가 있는 경우 div로 렌더링 (링크 없음)
          <div 
            className={cn(commonClasses, "cursor-pointer")}
            onClick={(e) => toggleMenu(item.href, hasSubmenu, e)}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.title}</span>
            </div>
            <div className="flex items-center">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </div>
        ) : (
          // 서브메뉴가 없는 경우 Link로 렌더링
          <Link
            href={item.href}
            className={commonClasses}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.title}</span>
            </div>
          </Link>
        )}
        {item.submenu && isOpen && (
          <div className="ml-4 border-l pl-2 pt-1">
            {item.submenu.map((subItem) => renderMenuItem(subItem))}
          </div>
        )}
      </div>
    );
  };

  // 컴포넌트 마운트 시 현재 경로에 해당하는 메뉴를 열기
  useEffect(() => {
    // 현재 경로에 맞는 메뉴들 자동으로 열기
    const newOpenMenus: Record<string, boolean> = {};
    let isPathInMenu = false;
    
    // 메인 메뉴 체크
    menuItems.forEach(item => {
      if (pathname.startsWith(item.href) && item.href !== "/") {
        newOpenMenus[item.href] = true;
        isPathInMenu = true;
      }
      
      // 서브메뉴 확인
      item.submenu?.forEach(subItem => {
        if (pathname.startsWith(subItem.href)) {
          newOpenMenus[item.href] = true; // 상위 메뉴 열기
          isPathInMenu = true;
          
          // 3단계 서브메뉴 확인
          subItem.submenu?.forEach(subSubItem => {
            if (pathname.startsWith(subSubItem.href)) {
              newOpenMenus[subItem.href] = true; // 2단계 메뉴도 열기
            }
          });
        }
      });
    });
    
    // 초기 선택 메뉴 설정: 경로와 일치하는 가장 깊은 메뉴 찾기
    if (isPathInMenu) {
      setSelectedMenu(""); // 경로 기반으로 하이라이트를 표시할 것이므로 선택 메뉴 초기화
    }
    
    setOpenMenus(newOpenMenus);
  }, [pathname, menuItems]);

  return (
    <div className="hidden border-r bg-card md:block md:w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="border-b p-4">
          <h1 className="text-xl font-bold">관리 시스템</h1>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <div>
              <div className="text-sm font-medium">관리자</div>
              <div className="text-xs text-muted-foreground">admin@admin.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 