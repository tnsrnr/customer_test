"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  X, 
  Maximize2, 
  Square, 
  Minus, 
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
  const { tabs, activeTabId, removeTab, setActiveTab, removeAllTabs } = useTabsStore()
  const router = useRouter()
  const pathname = usePathname()
  const tabsRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [draggedTab, setDraggedTab] = React.useState<string | null>(null)
  const [dragOverTab, setDragOverTab] = React.useState<string | null>(null)

  // 탭 클릭 핸들러
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id)
    router.push(tab.path)
  }

  // 탭 닫기 핸들러
  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    removeTab(tabId)
  }

  // 모든 탭 닫기 핸들러
  const handleCloseAllTabs = () => {
    removeAllTabs()
    router.push('/')
  }

  // 아이콘 이름으로 컴포넌트 렌더링하는 함수
  const renderIcon = (iconName?: string) => {
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
  };

  // 현재 활성화된 탭으로 스크롤
  React.useEffect(() => {
    if (tabsRef.current && activeTabId) {
      const activeTab = tabsRef.current.querySelector(`[data-tab-id="${activeTabId}"]`)
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeTabId])

  // 현재 경로에 기반하여 활성 탭 자동 설정
  React.useEffect(() => {
    const matchingTab = tabs.find((tab) => tab.path === pathname)
    if (matchingTab && matchingTab.id !== activeTabId) {
      setActiveTab(matchingTab.id)
    }
  }, [pathname, tabs, activeTabId, setActiveTab])

  if (tabs.length === 0) {
    return null
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
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => handleTabClick(tab)}
                draggable
                onDragStart={(e) => {
                  setIsDragging(true)
                  setDraggedTab(tab.id)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOverTab(tab.id)
                }}
                onDragEnd={() => {
                  setIsDragging(false)
                  setDraggedTab(null)
                  setDragOverTab(null)
                }}
                className={cn(
                  "group relative flex h-8 min-w-[120px] max-w-[180px] items-center px-2 py-0 text-xs transition-all cursor-pointer rounded-md",
                  activeTabId === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:shadow-sm",
                  dragOverTab === tab.id && "border-l-2 border-primary/50"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full opacity-0 group-hover:opacity-80 transition-opacity hover:opacity-100 hover:bg-muted-foreground/20 focus:opacity-100"
                    onClick={(e) => handleTabClose(e, tab.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">닫기</span>
                  </Button>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCloseAllTabs}>
                모든 탭 닫기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/')}>
                홈으로 이동
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 