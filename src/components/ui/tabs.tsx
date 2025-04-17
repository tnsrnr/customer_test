"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"
import { X, Home } from "lucide-react"
import { ScrollArea, ScrollBar } from "./scroll-area"
import { Badge } from "./badge"
import { Button } from "./button"
import { useRouter, usePathname } from "next/navigation"
import { useTabsStore, Tab } from "@/lib/store/tabsStore"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export interface TabsProps {
  className?: string
}

export function ErpTabs({ className }: TabsProps) {
  const { tabs, activeTabId, removeTab, setActiveTab, removeAllTabs } = useTabsStore()
  const router = useRouter()
  const pathname = usePathname()
  const tabsRef = React.useRef<HTMLDivElement>(null)

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

  // 현재 활성화된 탭으로 스크롤
  React.useEffect(() => {
    if (tabsRef.current && activeTabId) {
      const activeTab = tabsRef.current.querySelector(`[data-tab-id="${activeTabId}"]`)
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [activeTabId])

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div className="flex items-center justify-between px-1 h-9 border-b bg-muted/20">
        <ScrollArea className="w-full">
          <div 
            ref={tabsRef}
            className="flex h-9 items-center"
          >
            {tabs.map((tab) => (
              <div
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "group relative flex h-8 min-w-[120px] max-w-[200px] items-center justify-between rounded-t-md border-b-2 px-4 py-1 text-sm transition-all cursor-pointer",
                  activeTabId === tab.id
                    ? "border-primary bg-background text-foreground shadow-sm"
                    : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {tab.icon || <Home className="h-4 w-4 shrink-0" />}
                  <span className="truncate">{tab.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full opacity-80 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted-foreground/20"
                  onClick={(e) => handleTabClose(e, tab.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">닫기</span>
                </Button>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseAllTabs}
            className="h-7 rounded-sm px-2 text-xs"
          >
            모두 닫기
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
