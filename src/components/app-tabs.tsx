"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  X, 
  ChevronDown, 
  Home,
  LayoutGrid,
  FileText,
  Database,
  Settings,
  File,
  Briefcase,
  LineChart,
  FileStack,
  Bell,
  MessageSquare,
  FormInput,
  SortAsc,
  FileSearch,
  Calendar,
  PieChart,
  Smartphone,
  BarChart3,
  Layers,
  Package,
  Compass,
  TestTube
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useTabsStore, Tab } from "@/lib/store/tabsStore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export interface AppTabsProps {
  className?: string
}

export function AppTabs({ className }: AppTabsProps) {
  const { 
    tabs, 
    activeTabId, 
    removeTab, 
    setActiveTab, 
    removeAllTabs, 
    reorderTabs,
    setTabCached,
    isTabCached
  } = useTabsStore();
  
  const router = useRouter();
  const pathname = usePathname();
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedTab, setDraggedTab] = React.useState<string | null>(null);
  const [dragOverTab, setDragOverTab] = React.useState<string | null>(null);
  const [isTabSwitching, setIsTabSwitching] = React.useState(false);

  // 탭 클릭 핸들러 - 상태 유지를 위한 최적화
  const handleTabClick = React.useCallback((tab: Tab) => {
    // 이미 활성화된 탭이면 클릭 무시
    if (tab.id === activeTabId) return;
    
    // 탭 전환 플래그 켜기
    setIsTabSwitching(true);
    
    // 활성 탭 변경
    setActiveTab(tab.id);
    
    // 탭 캐시 상태 확인 
    const isCached = isTabCached(tab.path);
    
    // 라우팅 - 이미 캐시된 탭도 라우팅 처리하지만 내부 상태는 보존됨
    router.push(tab.path);
    
    // 탭이 캐시되어 있지 않으면 캐시 상태 설정
    if (!isCached) {
      setTabCached(tab.path, true);
    }
  }, [activeTabId, setActiveTab, isTabCached, router, setTabCached]);

  // 탭 닫기 핸들러
  const handleTabClose = React.useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    
    // 탭 제거 (삭제는 tabsStore에서 캐시 함께 제거함)
    removeTab(tabId);
    
    // 모든 탭이 닫혔을 때 홈으로 이동
    if (tabs.length <= 1) {
      router.push('/');
    }
  }, [removeTab, tabs.length, router]);

  // 모든 탭 닫기 핸들러
  const handleCloseAllTabs = React.useCallback(() => {
    removeAllTabs();
    router.push('/');
  }, [removeAllTabs, router]);

  // 아이콘 이름으로 컴포넌트 렌더링하는 함수
  const renderIcon = React.useCallback((iconName?: string) => {
    if (!iconName) return <File className="h-4 w-4" />;
    
    switch (iconName) {
      case 'Home': return <Home className="h-4 w-4" />;
      case 'LayoutGrid': return <LayoutGrid className="h-4 w-4" />;
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'Database': return <Database className="h-4 w-4" />;
      case 'Settings': return <Settings className="h-4 w-4" />;
      case 'Briefcase': return <Briefcase className="h-4 w-4" />;
      case 'LineChart': return <LineChart className="h-4 w-4" />;
      case 'FileStack': return <FileStack className="h-4 w-4" />;
      case 'Bell': return <Bell className="h-4 w-4" />;
      case 'MessageSquare': return <MessageSquare className="h-4 w-4" />;
      case 'FormInput': return <FormInput className="h-4 w-4" />;
      case 'SortAsc': return <SortAsc className="h-4 w-4" />;
      case 'FileSearch': return <FileSearch className="h-4 w-4" />;
      case 'Calendar': return <Calendar className="h-4 w-4" />;
      case 'PieChart': return <PieChart className="h-4 w-4" />;
      case 'Smartphone': return <Smartphone className="h-4 w-4" />;
      case 'BarChart3': return <BarChart3 className="h-4 w-4" />;
      case 'Layers': return <Layers className="h-4 w-4" />;
      case 'Package': return <Package className="h-4 w-4" />;
      case 'Compass': return <Compass className="h-4 w-4" />;
      case 'TestTube': return <TestTube className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  }, []);

  // 현재 활성화된 탭으로 스크롤
  React.useEffect(() => {
    if (tabsRef.current && activeTabId) {
      const activeTab = tabsRef.current.querySelector(`[data-tab-id="${activeTabId}"]`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTabId]);

  // 현재 경로에 기반하여 활성 탭 자동 설정
  React.useEffect(() => {
    // 탭 전환 중이라면 이 효과 무시
    if (isTabSwitching) {
      setIsTabSwitching(false);
      return;
    }
    
    const matchingTab = tabs.find((tab) => tab.path === pathname);
    if (matchingTab && matchingTab.id !== activeTabId) {
      setActiveTab(matchingTab.id);
      
      // 탭 캐시 상태 설정
      if (!isTabCached(matchingTab.path)) {
        setTabCached(matchingTab.path, true);
      }
    }
  }, [pathname, tabs, activeTabId, setActiveTab, isTabSwitching, isTabCached, setTabCached]);

  // 드래그 앤 드롭 핸들러
  const handleDragStart = React.useCallback((e: React.DragEvent, tabId: string) => {
    setIsDragging(true);
    setDraggedTab(tabId);
    // 드래그 중인 탭의 이미지를 반투명하게 설정
    if (e.dataTransfer.setDragImage) {
      const dragElement = e.currentTarget.cloneNode(true) as HTMLElement;
      dragElement.style.opacity = '0.5';
      dragElement.style.position = 'absolute';
      dragElement.style.top = '-1000px';
      document.body.appendChild(dragElement);
      e.dataTransfer.setDragImage(dragElement, 0, 0);
      setTimeout(() => {
        document.body.removeChild(dragElement);
      }, 0);
    }
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    setDragOverTab(tabId);
  }, []);

  const handleDragEnter = React.useCallback((e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    setDragOverTab(tabId);
  }, []);

  const handleDragLeave = React.useCallback((tabId: string) => {
    if (dragOverTab === tabId) {
      setDragOverTab(null);
    }
  }, [dragOverTab]);

  const handleDrop = React.useCallback((e: React.DragEvent, tabId: string) => {
    e.preventDefault();
    if (draggedTab && draggedTab !== tabId) {
      reorderTabs(draggedTab, tabId);
    }
    setDragOverTab(null);
  }, [draggedTab, reorderTabs]);

  const handleDragEnd = React.useCallback(() => {
    setIsDragging(false);
    setDraggedTab(null);
    setDragOverTab(null);
  }, []);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative flex flex-col", className)}>
      {/* 윈도우 스타일 상단 바 */}
      <div className="flex items-center justify-between px-1 h-10 bg-card shadow-sm select-none">
        <ScrollArea className="w-full">
          <div 
            ref={tabsRef}
            className="flex h-10 items-center gap-1 px-1 py-1"
          >
            {tabs.map((tab) => (
              <div
                key={tab.instanceId || tab.id}
                data-tab-id={tab.id}
                onClick={() => handleTabClick(tab)}
                draggable
                onDragStart={(e) => handleDragStart(e, tab.id)}
                onDragOver={(e) => handleDragOver(e, tab.id)}
                onDragEnter={(e) => handleDragEnter(e, tab.id)}
                onDragLeave={() => handleDragLeave(tab.id)}
                onDrop={(e) => handleDrop(e, tab.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group relative flex h-8 min-w-[120px] max-w-[180px] items-center px-2 py-0 text-xs transition-all cursor-pointer rounded-md",
                  activeTabId === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:shadow-sm",
                  dragOverTab === tab.id && "border-l-2 border-primary/50",
                  isDragging && draggedTab === tab.id && "opacity-50"
                )}
              >
                <div className="flex items-center space-x-2 px-1.5 overflow-hidden w-full">
                  <div className={cn(
                    "shrink-0 w-4 h-4",
                    activeTabId === tab.id ? "text-primary" : "opacity-70"
                  )}>
                    {renderIcon(tab.iconName)}
                  </div>
                  <span className={cn(
                    "truncate flex-1",
                    activeTabId === tab.id && "font-medium"
                  )}>
                    {tab.title}
                  </span>
                </div>
                {activeTabId === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/40 rounded-full" />
                )}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
        <div className="flex items-center bg-muted/20 rounded-md mx-1 px-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseAllTabs}
                  className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>모든 탭 닫기</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
} 