'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Users,
  ArrowUp,
  ChevronRight,
  Activity,
  BarChart3,
  Zap,
  ArrowRight,
  PackageOpen,
  Package,
  Truck,
  ClipboardList,
  MessageCircle,
  AlertCircle,
  MoreHorizontal,
  TrendingUp,
  ShoppingBag,
  RotateCcw,
  PackageCheck,
  AlertTriangle,
  ArrowDown,
  PieChart,
  UserPlus,
  Briefcase,
  MapPin,
  Heart,
  Target,
  GraduationCap,
  ClipboardCheck,
  FileCheck,
  Calendar,
  UserCheck,
  CalendarCheck,
  BadgeCheck,
  BarChart2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { GenderPieChart } from "@/components/charts/GenderPieChart";
import { DepartmentChart } from "@/components/charts/DepartmentChart";
import { SalesTrendChart } from "@/components/charts/SalesTrendChart";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// 원형 프로그레스 컴포넌트
function CircularProgress({ value, total, title, color = "blue" }: { value: number, total: number, title: string, color?: string }) {
  const percentage = (value / total) * 100;
  const strokeWidth = 10;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">{value}개</span>
          <span className="text-xs text-gray-500">{title}</span>
        </div>
      </div>
    </div>
  );
}

// 향상된 프로그레스 바 컴포넌트
function EnhancedProgress({ 
  value, 
  max = 100, 
  className, 
  colorScheme = "blue",
  showAnimation = true,
  size = "md",
  showLabel = false
}: { 
  value: number, 
  max?: number, 
  className?: string,
  colorScheme?: "blue" | "green" | "amber" | "red" | "purple" | "indigo",
  showAnimation?: boolean,
  size?: "sm" | "md" | "lg",
  showLabel?: boolean
}) {
  // 색상 스키마에 따른 그라데이션 클래스 결정
  const gradientClass = {
    blue: "bg-gradient-to-r from-blue-400 to-blue-600",
    green: "bg-gradient-to-r from-green-400 to-green-600",
    amber: "bg-gradient-to-r from-amber-400 to-amber-600",
    red: "bg-gradient-to-r from-red-400 to-red-600",
    purple: "bg-gradient-to-r from-purple-400 to-purple-600",
    indigo: "bg-gradient-to-r from-indigo-400 to-indigo-600"
  }[colorScheme];
  
  // 사이즈에 따른 높이 클래스 결정
  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  }[size];
  
  // 애니메이션 클래스
  const animationClass = showAnimation ? "transition-all duration-500 ease-out" : "";
  
  return (
    <div className="w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`${heightClass} ${gradientClass} rounded-full shadow-inner ${animationClass} ${className}`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      >
        {showLabel && size === "lg" && (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] font-semibold text-white px-1">{value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// 통계 아이템 컴포넌트
function StatItem({ 
  title, 
  value, 
  trend = 0, 
  desc = "", 
  trendColor = "text-green-500" 
}: { 
  title: string, 
  value: string, 
  trend?: number, 
  desc?: string,
  trendColor?: string 
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{value}</span>
        {trend !== 0 && (
          <Badge className={`${trendColor} px-1.5 py-0.5 text-xs`}>
            {trend > 0 ? '+' : ''}{trend}%
          </Badge>
        )}
      </div>
      {desc && <p className="text-xs text-gray-500">{desc}</p>}
    </div>
  );
}

// 카드 컴포넌트
function KpiCard({ 
  title, 
  value, 
  icon, 
  trend = 0, 
  progressValue = 0,
  trendText = "",
  iconColor = "text-blue-500",
  valueSuffix = "" 
}: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode, 
  trend?: number, 
  progressValue?: number,
  trendText?: string,
  iconColor?: string,
  valueSuffix?: string
}) {
  const trendColor = trend >= 0 ? "text-green-500" : "text-red-500";
  const trendBgColor = trend >= 0 ? "bg-green-50" : "bg-red-50";
  const trendIcon = trend >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />;

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <div className={`mr-2 ${iconColor}`}>{icon}</div>
          {title}
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-500">
          상세보기
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{value}{valueSuffix}</span>
            {trend !== 0 && (
              <div className="flex items-center mt-1">
                <Badge className={`${trendBgColor} ${trendColor} px-1.5 text-xs`}>
                  {trendIcon}
                  {Math.abs(trend)}%
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">{trendText || "전월 대비"}</span>
              </div>
            )}
          </div>
          {progressValue > 0 && (
            <Badge className="px-2 py-1 text-xs bg-blue-50 text-blue-700">
              목표 대비 {progressValue}%
            </Badge>
          )}
        </div>
        {progressValue > 0 && (
          <Progress value={progressValue} className="h-1.5 mt-3" />
        )}
      </CardContent>
    </Card>
  );
}

// 차트 데이터 컴포넌트
function TopItems({ 
  title, 
  items 
}: { 
  title: string, 
  items: {name: string, value: string | number, percent: number}[] 
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">{item.value}</span>
                  <span className="text-xs text-muted-foreground">{item.percent}%</span>
                </div>
              </div>
              <Progress value={item.percent} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 면적 차트(트리맵) 컴포넌트
function AreaChart({ 
  title, 
  items,
  colorScale = "blue",
}: { 
  title: string, 
  items: {name: string, value: string | number, percent: number, color?: string}[],
  colorScale?: "blue" | "green" | "amber" | "red" | "purple",
}) {
  // 색상 팔레트 정의
  const getColorClass = (percent: number, scale: string) => {
    if (scale === "blue") {
      if (percent > 70) return "bg-blue-500";
      if (percent > 40) return "bg-blue-400";
      if (percent > 20) return "bg-blue-300";
      return "bg-blue-200";
    } else if (scale === "green") {
      if (percent > 70) return "bg-green-500";
      if (percent > 40) return "bg-green-400";
      if (percent > 20) return "bg-green-300";
      return "bg-green-200";
    } else if (scale === "amber") {
      if (percent > 70) return "bg-amber-500";
      if (percent > 40) return "bg-amber-400";
      if (percent > 20) return "bg-amber-300";
      return "bg-amber-200";
    } else if (scale === "red") {
      if (percent > 70) return "bg-red-500";
      if (percent > 40) return "bg-red-400";
      if (percent > 20) return "bg-red-300";
      return "bg-red-200";
    } else {
      if (percent > 70) return "bg-purple-500";
      if (percent > 40) return "bg-purple-400";
      if (percent > 20) return "bg-purple-300";
      return "bg-purple-200";
    }
  };

  // 항목 전체 합계 계산
  const totalPercent = items.reduce((sum, item) => sum + item.percent, 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="flex flex-wrap">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`${item.color || getColorClass(item.percent, colorScale)} relative rounded transition-all overflow-hidden m-0.5`}
              style={{ 
                width: `calc(${Math.max(item.percent / totalPercent * 100, 5)}% - 4px)`,
                height: '80px',
                minWidth: '80px',
              }}
            >
              <div className="absolute inset-0 p-2 flex flex-col justify-between">
                <div className="text-xs font-medium text-white">{item.name}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{item.value}</span>
                  <span className="text-xs text-white/80">{item.percent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 상태 트리맵 컴포넌트
function StatusAreaChart({
  title,
  statusItems,
  colorClasses = [],
  badgeClass = "bg-blue-100 text-blue-700",
  badgeText = "현재"
}: {
  title: string,
  statusItems: {label: string, value: string | number, percent: number}[],
  colorClasses?: string[],
  badgeClass?: string,
  badgeText?: string
}) {
  // 기본 색상 클래스
  const defaultColors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-red-500", "bg-purple-500"];
  
  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{title}</h3>
        <Badge className={`${badgeClass} px-1.5`}>{badgeText}</Badge>
      </div>
      <div className="mt-3">
        <div className="flex flex-wrap">
          {statusItems.map((item, index) => (
            <div 
              key={index} 
              className={`${colorClasses[index] || defaultColors[index % defaultColors.length]} relative rounded transition-all overflow-hidden m-0.5`}
              style={{ 
                width: `calc(${item.percent}% - 4px)`,
                height: '60px',
                minWidth: '70px',
              }}
            >
              <div className="absolute inset-0 p-2 flex flex-col justify-between">
                <div className="text-xs font-medium text-white">{item.label}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{item.value}</span>
                  <span className="text-xs text-white/80">{item.percent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 mt-3">
          {statusItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${colorClasses[index] || defaultColors[index % defaultColors.length]} mr-1`}></div>
              <span className="text-xs truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 인원현황과 근태현황 시각화를 위한 컴팩트한 인포 블록 컴포넌트
function CompactInfoBlock({ 
  label, 
  value, 
  percent, 
  color 
}: { 
  label: string, 
  value: string, 
  percent: number, 
  color: string 
}) {
  return (
    <div className="flex items-center justify-between border-b pb-2 mb-2 last:mb-0 last:border-0">
      <div className="flex items-center">
        <div className={`w-2.5 h-2.5 rounded-full ${color} mr-2`} />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium">{value}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${color.replace('bg-', 'bg-opacity-20 text-')}`}>
          {percent}%
        </span>
      </div>
    </div>
  );
}

// 미니 도넛 차트 컴포넌트
function MiniDonutChart({ 
  value, 
  color = "text-blue-500",
  size = "md",
  thickness = "thin"
}: { 
  value: number, 
  color?: string,
  size?: "sm" | "md" | "lg",
  thickness?: "thin" | "normal" | "thick"
}) {
  // 원형 진행 정도 계산
  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  // 사이즈 계산
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  }[size];
  
  // 두께 계산
  const strokeWidth = {
    thin: 2,
    normal: 3,
    thick: 4
  }[thickness];
  
  return (
    <div className={`relative ${sizeClass} flex items-center justify-center`}>
      <svg className="w-full h-full" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
          transform="rotate(-90 12 12)"
        />
      </svg>
      <span className="absolute text-[9px] font-medium">
        {value}%
      </span>
    </div>
  );
}

// 컬러 블록 컴포넌트
function ColorBlocks({
  values,
  colorScheme = "blue"
}: {
  values: {label: string, value: string | number, percent: number}[],
  colorScheme?: "blue" | "green" | "purple" | "amber" | "indigo"
}) {
  // 색상 스키마
  const baseColors = {
    blue: ["bg-blue-500", "bg-blue-400", "bg-blue-300", "bg-blue-200", "bg-blue-100"],
    green: ["bg-green-500", "bg-green-400", "bg-green-300", "bg-green-200", "bg-green-100"],
    purple: ["bg-purple-500", "bg-purple-400", "bg-purple-300", "bg-purple-200", "bg-purple-100"],
    amber: ["bg-amber-500", "bg-amber-400", "bg-amber-300", "bg-amber-200", "bg-amber-100"],
    indigo: ["bg-indigo-500", "bg-indigo-400", "bg-indigo-300", "bg-indigo-200", "bg-indigo-100"]
  };
  
  const colors = baseColors[colorScheme];
  
  return (
    <div className="space-y-1">
      <div className="flex">
        {values.map((item, index) => (
          <div 
            key={index} 
            className={`h-1.5 ${colors[index % colors.length]}`} 
            style={{ width: `${item.percent}%` }} 
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs pt-1">
        {values.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${colors[index % colors.length]} mr-1`} />
            <span className="truncate">{item.label}</span>
            <span className="font-medium ml-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 도넛 차트 컴포넌트
function LargeDonutChart({ 
  data, 
  title,
  centerLabel,
  tabItems = [],
  activeTab = "해외",
  onTabChange = (tab: string) => {}
}: { 
  data: {value: number, label: string, color: string}[],
  title: string,
  centerLabel?: string,
  tabItems?: {label: string, value: string, color?: string}[],
  activeTab?: string,
  onTabChange?: (tab: string) => void
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // 원형 차트 계산
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  let startAngle = 0;
  
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* 상단 탭 버튼 */}
      <div className="flex border-b">
        <button 
          className={`flex-1 py-2 text-center font-medium text-sm ${activeTab === "전체" ? 'bg-blue-700 text-white' : 'hover:bg-gray-50'}`}
          onClick={() => onTabChange("전체")}
        >
          전체
        </button>
        <button 
          className={`flex-1 py-2 text-center font-medium text-sm ${activeTab === "국내" ? 'bg-blue-700 text-white' : 'hover:bg-gray-50'}`}
          onClick={() => onTabChange("국내")}
        >
          국내
        </button>
        <button 
          className={`flex-1 py-2 text-center font-medium text-sm ${activeTab === "해외" ? 'bg-blue-700 text-white' : 'hover:bg-gray-50'}`}
          onClick={() => onTabChange("해외")}
        >
          해외
        </button>
      </div>
      
      {/* 차트 영역 */}
      <div className="p-5">
        {/* 상단 요약 정보 */}
        <div className="flex gap-4 mb-4 items-center">
          <div className="bg-gray-100 rounded-full px-3 py-1 text-sm">
            공실면적: 23,306.0평
          </div>
          <div className="bg-blue-100 rounded-full px-3 py-1 text-sm">
            가동률: 85.1%
          </div>
          <div className="bg-gray-100 rounded-full px-3 py-1 text-sm">
            센터개수: 37개
          </div>
        </div>
        
        {/* 차트 제목 */}
        <div className="bg-blue-500 text-white text-center py-2 rounded-md mb-5">
          {title}
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-64 h-64">
            <svg width="100%" height="100%" viewBox="0 0 220 220">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const angle = (percentage / 100) * 360;
                const dashArray = (percentage / 100) * circumference;
                const dashOffset = circumference - dashArray;
                const rotate = startAngle;
                startAngle += angle;
                
                return (
                  <circle 
                    key={index}
                    cx="110"
                    cy="110"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="40"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    transform={`rotate(${rotate} 110 110)`}
                    className="transition-all duration-1000 ease-in-out"
                  />
                );
              })}
            </svg>
            
            {/* 데이터 레이블 */}
            {data.map((item, index) => {
              // 값이 작으면 차트 외부에 레이블 표시
              const isSmallSlice = (item.value / total) < 0.2;
              const angle = (index === 0) ? 45 : 200;
              const labelDistance = isSmallSlice ? 135 : 70;
              const x = 110 + labelDistance * Math.cos(angle * Math.PI / 180);
              const y = 110 + labelDistance * Math.sin(angle * Math.PI / 180);
              
              return (
                <div 
                  key={index}
                  className="absolute text-sm font-medium"
                  style={{ 
                    left: `${x}px`, 
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {item.label}명
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* 하단 통계 요약 */}
      {tabItems.length > 0 && (
        <div className="flex items-center justify-between border-t">
          {tabItems.map((item, index) => (
            <div key={index} className="flex-1 text-center py-3 px-2 border-r last:border-r-0">
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="text-sm font-bold mt-1">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  // 샘플 데이터: 실제로는 API나 다른 데이터 소스에서 가져올 것입니다
  // 주요 거래처 TOP 5 - 매출 기여도
  const topClients = [
    { name: "(주)삼성전자", value: "3.8억", percent: 85 },
    { name: "LG전자", value: "2.5억", percent: 65 },
    { name: "현대자동차", value: "1.7억", percent: 45 },
    { name: "SK하이닉스", value: "1.2억", percent: 32 },
    { name: "포스코", value: "0.8억", percent: 22 }
  ];

  // 미수금 TOP 5 거래처
  const topUnpaidClients = [
    { name: "대우건설", value: "1.8억", percent: 78 },
    { name: "롯데백화점", value: "1.2억", percent: 65 },
    { name: "신세계백화점", value: "0.9억", percent: 48 },
    { name: "이마트", value: "0.7억", percent: 38 },
    { name: "NC백화점", value: "0.5억", percent: 25 }
  ];
  
  // 매입 TOP 5 거래처 추가
  const topPurchaseClients = [
    { name: "(주)서울부품", value: "2.2억", percent: 72 },
    { name: "부산소재(주)", value: "1.8억", percent: 60 },
    { name: "광주전자", value: "1.5억", percent: 50 },
    { name: "대구금속", value: "1.1억", percent: 35 },
    { name: "천안소재", value: "0.9억", percent: 28 }
  ];
  
  // 신규 추가 거래처
  const newClients = [
    { name: "인천산업(주)", date: "2023-10-15", type: "매출처", value: "1.5억" },
    { name: "경기전자부품", date: "2023-10-02", type: "매입처", value: "0.9억" },
    { name: "성남디스플레이", date: "2023-09-28", type: "매출처", value: "0.8억" },
    { name: "화성반도체", date: "2023-09-15", type: "매입처", value: "0.7억" },
    { name: "평택산업", date: "2023-09-07", type: "매출처", value: "0.6억" }
  ];
  
  // 부서별 인원 데이터
  const departmentStaff = [
    { label: "영업부", value: "42명", percent: 35 },
    { label: "기술부", value: "23명", percent: 19 },
    { label: "연구개발", value: "18명", percent: 15 },
    { label: "경영지원", value: "15명", percent: 13 },
    { label: "인사부", value: "10명", percent: 8 },
    { label: "기타", value: "12명", percent: 10 }
  ];
  
  // 근태 상태 데이터
  const attendanceStatus = [
    { label: "정상근무", value: "112명", percent: 93.3 },
    { label: "휴가중", value: "5명", percent: 4.2 },
    { label: "결근", value: "2명", percent: 1.7 },
    { label: "지각", value: "1명", percent: 0.8 }
  ];
  
  // 활성 탭 상태 관리
  const [activeTab, setActiveTab] = useState<'hr' | 'finance' | 'client'>('hr');

  return (
    <div className="space-y-3.5 p-1">
      {/* 대시보드 요약 카드들 - 상단 카드를 탭 선택용 버튼으로 변경 */}
      <div className="grid grid-cols-3 gap-3">
        <Card 
          className={`border shadow-sm transition-all cursor-pointer
                     ${activeTab === 'hr' 
                       ? 'border-blue-500 ring-2 ring-blue-200 shadow-md' 
                       : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
          onClick={() => setActiveTab('hr')}
        >
          <CardContent className="p-3.5 flex items-center">
            <div className={`mr-3.5 h-10 w-10 rounded-full flex items-center justify-center
                           ${activeTab === 'hr' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 인원</p>
              <h4 className="text-xl font-bold">120명</h4>
            </div>
          </CardContent>
          {activeTab === 'hr' && <div className="h-1 bg-blue-500"></div>}
        </Card>
        
        <Card 
          className={`border shadow-sm transition-all cursor-pointer
                     ${activeTab === 'finance' 
                       ? 'border-green-500 ring-2 ring-green-200 shadow-md' 
                       : 'border-gray-200 hover:border-green-300 hover:shadow-md'}`}
          onClick={() => setActiveTab('finance')}
        >
          <CardContent className="p-3.5 flex items-center">
            <div className={`mr-3.5 h-10 w-10 rounded-full flex items-center justify-center
                           ${activeTab === 'finance' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}>
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">월 매출</p>
              <h4 className="text-xl font-bold">12.5억원</h4>
            </div>
          </CardContent>
          {activeTab === 'finance' && <div className="h-1 bg-green-500"></div>}
        </Card>
        
        <Card 
          className={`border shadow-sm transition-all cursor-pointer
                     ${activeTab === 'client' 
                       ? 'border-amber-500 ring-2 ring-amber-200 shadow-md' 
                       : 'border-gray-200 hover:border-amber-300 hover:shadow-md'}`}
          onClick={() => setActiveTab('client')}
        >
          <CardContent className="p-3.5 flex items-center">
            <div className={`mr-3.5 h-10 w-10 rounded-full flex items-center justify-center
                           ${activeTab === 'client' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 거래처</p>
              <h4 className="text-xl font-bold">215개</h4>
            </div>
          </CardContent>
          {activeTab === 'client' && <div className="h-1 bg-amber-500"></div>}
        </Card>
      </div>
      
      {/* 탭 컨텐츠 */}
      <div className="mt-3.5">
        {/* 인사관리 탭 */}
        {activeTab === 'hr' && (
          <div className="space-y-3">
            {/* 주요 인원 및 근태 현황 요약 - 상단에 배치 */}
            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">총 인원</p>
                  <h4 className="text-lg font-bold">120명</h4>
                </div>
              </div>
              
              <div className="flex items-center p-2.5 bg-green-50 rounded-lg border border-green-100">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">정상근무</p>
                  <h4 className="text-lg font-bold">112명</h4>
                </div>
              </div>
              
              <div className="flex items-center p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">휴가중</p>
                  <h4 className="text-lg font-bold">5명</h4>
                </div>
              </div>
              
              <div className="flex items-center p-2.5 bg-red-50 rounded-lg border border-red-100">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">지각/결근</p>
                  <h4 className="text-lg font-bold">3명</h4>
                </div>
              </div>
            </div>
            
            {/* 인원 현황과 근태 현황을 가로로 배치 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 인원 현황 카드 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    부서별 인원 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2.5 px-3.5 pb-2.5">
                  <div className="h-[200px]">
                    <Doughnut 
                      data={{
                        labels: departmentStaff.map(item => item.label),
                        datasets: [
                          {
                            data: departmentStaff.map(item => Number(item.value.replace('명', ''))),
                            backgroundColor: [
                              '#3b82f6', // 파란색
                              '#10b981', // 초록색
                              '#f59e0b', // 주황색
                              '#8b5cf6', // 보라색
                              '#ec4899', // 분홍색
                              '#6b7280', // 회색
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right' as const,
                            labels: {
                              usePointStyle: true,
                              padding: 10,
                              font: {
                                size: 10,
                              },
                            },
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context: any) {
                                const label = context.label || '';
                                const value = Number(context.raw) || 0;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value}명 (${percentage}%)`;
                              }
                            }
                          }
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* 근태 현황 카드 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    오늘 근태 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2.5 px-3.5 pb-2.5">
                  <div className="space-y-2.5">
                    {/* 근태 상태 분포 */}
                    <div className="space-y-1.5">
                      <CompactInfoBlock 
                        label="정상근무" 
                        value="112명" 
                        percent={93.3} 
                        color="bg-green-500" 
                      />
                      <CompactInfoBlock 
                        label="휴가중" 
                        value="5명" 
                        percent={4.2} 
                        color="bg-amber-500" 
                      />
                      <CompactInfoBlock 
                        label="결근" 
                        value="2명" 
                        percent={1.7} 
                        color="bg-red-500" 
                      />
                      <CompactInfoBlock 
                        label="지각" 
                        value="1명" 
                        percent={0.8} 
                        color="bg-blue-500" 
                      />
                    </div>
                    
                    {/* 이번달 근태 요약 */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-2">
                      <div className="text-xs text-center font-medium mb-1">이번달 근태 현황 요약</div>
                      <div className="grid grid-cols-3 gap-1">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">평균 출근</div>
                          <div className="text-sm font-bold">08:52</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">평균 퇴근</div>
                          <div className="text-sm font-bold">18:35</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">평균 근무</div>
                          <div className="text-sm font-bold">8.7시간</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 인구통계 정보 - 직급별/연령대별/성별 분포를 한 행에 배치 */}
            <div className="grid grid-cols-3 gap-3">
              {/* 직급별 분포 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-2 px-3 border-b bg-gray-50">
                  <CardTitle className="text-xs font-medium flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                    직급별 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 px-3 pb-2">
                  <div className="h-[180px]">
                    <Pie 
                      data={{
                        labels: ["사원", "대리", "과장", "차장", "부장", "임원"],
                        datasets: [
                          {
                            data: [52, 28, 18, 12, 8, 2],
                            backgroundColor: [
                              "#818cf8", // 인디고
                              "#a5b4fc",
                              "#c7d2fe",
                              "#ddd6fe",
                              "#e0e7ff",
                              "#eef2ff"
                            ],
                            borderWidth: 1
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                            labels: {
                              usePointStyle: true,
                              boxWidth: 6,
                              padding: 6,
                              font: {
                                size: 9
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="text-xs text-center mt-1">
                    <span className="text-gray-500">평균 근속:</span> <span className="font-medium">4.8년</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* 연령대별 분포 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-2 px-3 border-b bg-gray-50">
                  <CardTitle className="text-xs font-medium flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                    연령대별 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 px-3 pb-2">
                  <div className="h-[180px]">
                    <Pie 
                      data={{
                        labels: ["20대", "30대", "40대", "50대"],
                        datasets: [
                          {
                            data: [40, 45, 22, 13],
                            backgroundColor: [
                              "#c084fc", // 보라색
                              "#d8b4fe",
                              "#e9d5ff",
                              "#f3e8ff"
                            ],
                            borderWidth: 1
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                            labels: {
                              usePointStyle: true,
                              boxWidth: 6,
                              padding: 6,
                              font: {
                                size: 9
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="text-xs text-center mt-1">
                    <span className="text-gray-500">평균 연령:</span> <span className="font-medium">34.7세</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* 성별 분포 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-2 px-3 border-b bg-gray-50">
                  <CardTitle className="text-xs font-medium flex items-center">
                    <UserPlus className="h-3.5 w-3.5 mr-1.5 text-pink-500" />
                    성별 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 px-3 pb-2">
                  <div className="flex flex-col space-y-2">
                    {/* 성별 파이 차트 */}
                    <div className="h-[180px]">
                      <Pie 
                        data={{
                          labels: ['남성', '여성'],
                          datasets: [
                            {
                              data: [72, 48],
                              backgroundColor: ['#3b82f6', '#ec4899'],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom' as const,
                              labels: {
                                usePointStyle: true,
                                boxWidth: 6,
                                padding: 6,
                                font: {
                                  size: 9,
                                },
                              },
                            }
                          }
                        }}
                      />
                    </div>
                    
                    {/* 성별 기본 정보 */}
                    <div className="grid grid-cols-2 gap-1 text-center">
                      <div>
                        <span className="text-[10px] text-blue-700">남성</span>
                        <div className="font-medium text-xs">72명 (60%)</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-pink-700">여성</span>
                        <div className="font-medium text-xs">48명 (40%)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* 정산관리 탭 */}
        {activeTab === 'finance' && (
          <div className="space-y-3">
            {/* 상단 요약 지표 - 카드 대신 컴팩트한 디자인으로 변경 */}
            <div className="grid grid-cols-3 gap-3">
              {/* 이번달 매출 */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200 shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-xs font-medium flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                    이번달 매출
                  </h3>
                  <Badge className="bg-green-100 text-green-700 px-1.5 text-[10px] py-0">10월</Badge>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">12.5억원</span>
                  <Badge className="ml-2 bg-green-100 text-green-700 px-1 py-0 text-[10px]">
                    <ArrowUp className="h-2.5 w-2.5 mr-0.5 inline" />
                    8.5%
                  </Badge>
                </div>
                
                <div className="mt-1.5 flex items-center text-[10px] text-gray-500 gap-2">
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 text-green-500 mr-0.5" />
                    <span>8.5% 전월</span>
                  </span>
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 text-blue-500 mr-0.5" />
                    <span>12.3% 전년</span>
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span>목표 달성률</span>
                    <span>92%</span>
                  </div>
                  <EnhancedProgress value={92} colorScheme="green" size="sm" />
                </div>
              </div>
              
              {/* 이번달 매입 */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-xs font-medium flex items-center">
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                    이번달 매입
                  </h3>
                  <Badge className="bg-blue-100 text-blue-700 px-1.5 text-[10px] py-0">10월</Badge>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">8.2억원</span>
                  <Badge className="ml-2 bg-blue-100 text-blue-700 px-1 py-0 text-[10px]">
                    <ArrowUp className="h-2.5 w-2.5 mr-0.5 inline" />
                    3.2%
                  </Badge>
                </div>
                
                <div className="mt-1.5 flex items-center text-[10px] text-gray-500 gap-2">
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 text-green-500 mr-0.5" />
                    <span>3.2% 전월</span>
                  </span>
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 text-blue-500 mr-0.5" />
                    <span>5.7% 전년</span>
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span>예산 사용률</span>
                    <span>78%</span>
                  </div>
                  <EnhancedProgress value={78} colorScheme="blue" size="sm" />
                </div>
              </div>
              
              {/* 이번달 이익률 */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className="text-xs font-medium flex items-center">
                    <PieChart className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
                    이번달 이익률
                  </h3>
                  <Badge className="bg-purple-100 text-purple-700 px-1.5 text-[10px] py-0">10월</Badge>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">34.2%</span>
                  <Badge className="ml-2 bg-green-100 text-green-700 px-1 py-0 text-[10px]">
                    <ArrowUp className="h-2.5 w-2.5 mr-0.5 inline" />
                    2.4%
                  </Badge>
                </div>
                
                <div className="mt-1.5 flex items-center text-[10px] text-gray-500 gap-2">
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 text-green-500 mr-0.5" />
                    <span>2.4% 전월</span>
                  </span>
                  <span className="inline-flex items-center">
                    <ArrowUp className="h-2.5 w-2.5 text-green-500 mr-0.5" />
                    <span>4.1% 전년</span>
                  </span>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span>목표 달성률</span>
                    <span>89%</span>
                  </div>
                  <EnhancedProgress value={89} colorScheme="purple" size="sm" />
                </div>
              </div>
            </div>
                
            {/* 매출/매입/이익 추이 차트 */}
            <Card className="border shadow-sm">
              <CardHeader className="py-2 px-3 border-b bg-gray-50 flex items-center justify-between">
                <CardTitle className="text-xs font-medium flex items-center">
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                  월별 매출/매입/이익 추이
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="h-[250px]">
                  <Line 
                    data={{
                      labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
                      datasets: [
                        {
                          label: '매출',
                          data: [18, 15, 20, 22, 19, 21, 25, 27, 24, 28],
                          borderColor: '#3b82f6',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderWidth: 2,
                          tension: 0.3,
                          pointRadius: 2,
                          pointBackgroundColor: '#3b82f6',
                          fill: false,
                          yAxisID: 'y',
                        },
                        {
                          label: '매입',
                          data: [14, 12, 15, 18, 14, 16, 19, 22, 18, 21],
                          borderColor: '#10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderWidth: 2,
                          tension: 0.3,
                          pointRadius: 2,
                          pointBackgroundColor: '#10b981',
                          fill: false,
                          yAxisID: 'y',
                        },
                        {
                          label: '이익률',
                          data: [22, 20, 25, 18, 26, 24, 24, 19, 25, 25],
                          borderColor: '#8b5cf6',
                          borderWidth: 2,
                          borderDash: [5, 5],
                          tension: 0.3,
                          pointRadius: 2,
                          pointBackgroundColor: '#8b5cf6',
                          fill: false,
                          yAxisID: 'y1',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index' as const,
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'top' as const,
                          labels: {
                            usePointStyle: true,
                            padding: 10,
                            boxWidth: 8,
                            font: {
                              size: 10,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              let label = context.dataset.label || '';
                              let value = context.raw || 0;
                              
                              if (label === '매출' || label === '매입') {
                                return `${label}: ${value}억원`;
                              } else if (label === '이익률') {
                                return `${label}: ${value}%`;
                              }
                              return label;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          type: 'linear' as const,
                          display: true,
                          position: 'left' as const,
                          title: {
                            display: true,
                            text: '금액 (억원)',
                            font: {
                              size: 10,
                            },
                          },
                          ticks: {
                            font: {
                              size: 9
                            }
                          },
                          grid: {
                            display: true,
                          },
                        },
                        y1: {
                          type: 'linear' as const,
                          display: true,
                          position: 'right' as const,
                          title: {
                            display: true,
                            text: '이익률 (%)',
                            font: {
                              size: 10,
                            },
                          },
                          ticks: {
                            font: {
                              size: 9
                            }
                          },
                          grid: {
                            display: false,
                          },
                        },
                        x: {
                          ticks: {
                            font: {
                              size: 9
                            }
                          }
                        }
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* 매출 분석 및 비교 대시보드 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 매출 구성 분석 */}
              <Card className="border shadow-sm">
                <CardHeader className="py-2 px-3 border-b bg-gray-50 flex items-center justify-between">
                  <CardTitle className="text-xs font-medium flex items-center">
                    <PieChart className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                    매출 구성 분석 <span className="ml-1.5 text-[10px] text-gray-500">(10월 기준)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-3">
                    {/* 좌측: 파이 차트 */}
                    <div className="h-[180px]">
                      <Pie 
                        data={{
                          labels: ['제품A', '제품B', '제품C', '제품D', '기타'],
                          datasets: [
                            {
                              data: [38, 27, 18, 12, 5],
                              backgroundColor: [
                                '#3b82f6', // 파란색
                                '#60a5fa', // 파란색2
                                '#93c5fd', // 파란색3
                                '#bfdbfe', // 파란색4
                                '#dbeafe', // 파란색5
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right' as const,
                              labels: {
                                usePointStyle: true,
                                boxWidth: 6,
                                padding: 8,
                                font: {
                                  size: 9,
                                },
                              },
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value}% (${(value/100 * 12.5).toFixed(1)}억원)`;
                                }
                              }
                            }
                          },
                        }}
                      />
                    </div>
                    
                    {/* 우측: 전년 대비 증감율 */}
                    <div className="space-y-2">
                      <div className="text-xs text-center font-medium mb-1">전년 대비 증감율</div>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs">제품A</span>
                            <div className="text-xs text-green-600">+15.2%</div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '15.2%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs">제품B</span>
                            <div className="text-xs text-green-600">+8.7%</div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '8.7%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs">제품C</span>
                            <div className="text-xs text-red-600">-2.3%</div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '2.3%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs">제품D</span>
                            <div className="text-xs text-green-600">+22.5%</div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '22.5%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs">기타</span>
                            <div className="text-xs text-red-600">-5.8%</div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '5.8%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 매출 지역별 분석 */}
              <Card className="border shadow-sm">
                <CardHeader className="py-2 px-3 border-b bg-gray-50 flex items-center justify-between">
                  <CardTitle className="text-xs font-medium flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                    매출 지역별 분석 <span className="ml-1.5 text-[10px] text-gray-500">(10월 기준)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-[180px]">
                    <Bar
                      data={{
                        labels: ['서울', '경기', '인천', '부산', '대구', '광주', '기타'],
                        datasets: [
                          {
                            label: '매출액 (억원)',
                            data: [4.8, 2.6, 1.2, 1.5, 0.8, 0.7, 0.9],
                            backgroundColor: [
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(59, 130, 246, 0.7)',
                              'rgba(59, 130, 246, 0.6)',
                              'rgba(59, 130, 246, 0.5)',
                              'rgba(59, 130, 246, 0.4)',
                              'rgba(59, 130, 246, 0.3)',
                              'rgba(59, 130, 246, 0.2)',
                            ],
                            borderWidth: 1,
                            borderRadius: 3,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y' as const,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context: any) {
                                return `매출액: ${context.raw}억원`;
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            ticks: {
                              font: {
                                size: 9
                              }
                            },
                            grid: {
                              display: true,
                            }
                          },
                          y: {
                            ticks: {
                              font: {
                                size: 9
                              }
                            },
                            grid: {
                              display: false,
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* 거래처관리 탭 */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            {/* 상단 요약 통계 - 더 현대적인 디자인으로 변경 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center mr-4">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">총 거래처</p>
                    <div className="flex items-baseline">
                      <h4 className="text-xl font-bold">215</h4>
                      <span className="text-xs ml-1 text-muted-foreground">개사</span>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-blue-500"></div>
              </Card>
              
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-md bg-green-50 flex items-center justify-center mr-4">
                    <ArrowUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">매출처</p>
                    <div className="flex items-baseline">
                      <h4 className="text-xl font-bold">145</h4>
                      <span className="text-xs ml-1 text-muted-foreground">개사</span>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-green-500"></div>
              </Card>
              
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-md bg-amber-50 flex items-center justify-center mr-4">
                    <ArrowDown className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">매입처</p>
                    <div className="flex items-baseline">
                      <h4 className="text-xl font-bold">98</h4>
                      <span className="text-xs ml-1 text-muted-foreground">개사</span>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-amber-500"></div>
              </Card>
              
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-4 flex items-center">
                  <div className="h-10 w-10 rounded-md bg-purple-50 flex items-center justify-center mr-4">
                    <UserPlus className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">이번달 신규</p>
                    <div className="flex items-baseline">
                      <h4 className="text-xl font-bold">12</h4>
                      <span className="text-xs ml-1 text-muted-foreground">개사</span>
                    </div>
                  </div>
                </div>
                <div className="h-1 w-full bg-purple-500"></div>
              </Card>
            </div>
            
            {/* 거래처 상세 정보 그리드 - 개선된 디자인 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 매출 주요 거래처 */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="py-3 px-4 border-b flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    매출 주요 거래처 TOP 5
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] py-0 px-2">매출액 기준</Badge>
                </CardHeader>
                <CardContent className="px-4 py-3">
                  <div className="space-y-3">
                    {topClients.map((item, index) => (
                      <div 
                        key={index} 
                        className={`bg-gradient-to-r from-green-50 to-green-${Math.min(200 + (item.percent*2), 500)} 
                                   p-3 rounded-lg border border-green-100 flex items-center justify-between
                                   hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs text-green-700 mr-3 font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-green-800">{item.value}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white shadow-sm border border-green-100">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 매입 주요 거래처 */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="py-3 px-4 border-b flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-amber-500" />
                    매입 주요 거래처 TOP 5
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] py-0 px-2">매입액 기준</Badge>
                </CardHeader>
                <CardContent className="px-4 py-3">
                  <div className="space-y-3">
                    {topPurchaseClients.map((item, index) => (
                      <div 
                        key={index} 
                        className={`bg-gradient-to-r from-amber-50 to-amber-${Math.min(200 + (item.percent*2), 500)} 
                                   p-3 rounded-lg border border-amber-100 flex items-center justify-between
                                   hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs text-amber-700 mr-3 font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-amber-800">{item.value}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white shadow-sm border border-amber-100">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 미수금 주요 거래처 */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="py-3 px-4 border-b flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    미수금 주요 거래처 TOP 5
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] py-0 px-2">미수액 기준</Badge>
                </CardHeader>
                <CardContent className="px-4 py-3">
                  <div className="space-y-3">
                    {topUnpaidClients.map((item, index) => (
                      <div 
                        key={index} 
                        className={`bg-gradient-to-r from-red-50 to-red-${Math.min(200 + (item.percent*2), 500)} 
                                   p-3 rounded-lg border border-red-100 flex items-center justify-between
                                   hover:shadow-md transition-all duration-200`}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs text-red-700 mr-3 font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-red-800">{item.value}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white shadow-sm border border-red-100">
                            {item.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 신규 추가 거래처 - 원형 아바타와 강조 디자인 */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="py-3 px-4 border-b flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <UserPlus className="h-4 w-4 mr-2 text-purple-500" />
                    신규 추가 거래처
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] py-0 px-2">최근 30일</Badge>
                </CardHeader>
                <CardContent className="px-4 py-3">
                  <div className="space-y-3">
                    {newClients.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3 border-2 border-purple-100">
                            <AvatarFallback className={`${item.type === "매출처" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                              {item.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-sm">{item.name}</span>
                              <Badge className={`ml-2 px-1.5 py-0 text-[10px] ${item.type === "매출처" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"} border`}>
                                {item.type}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1 text-gray-500 text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {item.date}
                              <span className="mx-1.5">•</span>
                              <span className="font-medium">{item.value}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex justify-center mt-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="h-8 px-4 text-xs">
                        전체보기
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 거래처 분석 차트 */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="py-3 px-4 border-b flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center">
                  <PieChart className="h-4 w-4 mr-2 text-blue-500" />
                  거래처 분포 현황
                </CardTitle>
                <Badge variant="outline" className="text-[10px] py-0 px-2">전체 거래처 기준</Badge>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 지역별 분포 파이 차트 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-medium flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                        지역별 분포
                      </h3>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 border px-1.5 py-0 text-[10px]">
                        {215}개
                      </Badge>
                    </div>
                    <div className="h-[170px]">
                      <Pie 
                        data={{
                          labels: ["서울", "경기", "부산", "대구", "기타"],
                          datasets: [
                            {
                              data: [85, 45, 30, 24, 31],
                              backgroundColor: [
                                "#3b82f6", // 파란색
                                "#60a5fa", // 밝은 파란색
                                "#93c5fd", // 더 밝은 파란색
                                "#bfdbfe", // 매우 밝은 파란색
                                "#dbeafe", // 가장 밝은 파란색
                              ],
                              borderWidth: 1
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom' as const,
                              labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                padding: 10,
                                font: {
                                  size: 10
                                }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  const label = context.label || '';
                                  const value = Number(context.raw) || 0;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value}개 (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 업종별 분포 파이 차트 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-medium flex items-center">
                        <Briefcase className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                        업종별 분포
                      </h3>
                      <Badge className="bg-purple-50 text-purple-700 border-purple-200 border px-1.5 py-0 text-[10px]">
                        {215}개
                      </Badge>
                    </div>
                    <div className="h-[170px]">
                      <Doughnut 
                        data={{
                          labels: ["제조업", "유통업", "서비스", "건설업", "기타"],
                          datasets: [
                            {
                              data: [92, 56, 35, 25, 7],
                              backgroundColor: [
                                "#8b5cf6", // 보라색
                                "#a78bfa", // 밝은 보라색
                                "#c4b5fd", // 더 밝은 보라색
                                "#ddd6fe", // 매우 밝은 보라색
                                "#ede9fe", // 가장 밝은 보라색
                              ],
                              borderWidth: 1
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '65%',
                          plugins: {
                            legend: {
                              position: 'bottom' as const,
                              labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                padding: 10,
                                font: {
                                  size: 10
                                }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  const label = context.label || '';
                                  const value = Number(context.raw) || 0;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value}개 (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 거래규모별 분포 차트 */}
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-medium flex items-center">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        거래규모별 분포
                      </h3>
                      <Badge className="bg-green-50 text-green-700 border-green-200 border px-1.5 py-0 text-[10px]">
                        {215}개
                      </Badge>
                    </div>
                    <div className="h-[170px]">
                      <Doughnut
                        data={{
                          labels: ["10억 이상", "5~10억", "1~5억", "5천~1억", "5천만 미만"],
                          datasets: [
                            {
                              data: [15, 34, 78, 53, 35],
                              backgroundColor: [
                                "#10b981", // 초록색
                                "#34d399", // 밝은 초록색
                                "#6ee7b7", // 더 밝은 초록색
                                "#a7f3d0", // 매우 밝은 초록색
                                "#d1fae5", // 가장 밝은 초록색
                              ],
                              borderWidth: 1
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '65%',
                          plugins: {
                            legend: {
                              position: 'bottom' as const,
                              labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                padding: 10,
                                font: {
                                  size: 10
                                }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  const label = context.label || '';
                                  const value = Number(context.raw) || 0;
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value}개 (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 거래처 매출/매입 추이 스택 바 차트 (월별) */}
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="py-3 px-4 border-b flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                  거래처 동향
                </CardTitle>
                <Badge variant="outline" className="text-[10px] py-0 px-2">최근 6개월</Badge>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <div className="h-[300px]">
                  <Bar
                    data={{
                      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
                      datasets: [
                        {
                          label: '신규 거래처',
                          data: [8, 11, 7, 14, 9, 12],
                          backgroundColor: '#8b5cf6',
                          borderRadius: 4
                        },
                        {
                          label: '활성 거래처',
                          data: [120, 124, 128, 136, 142, 145],
                          backgroundColor: '#3b82f6',
                          borderRadius: 4
                        },
                        {
                          label: '휴면 거래처',
                          data: [67, 64, 62, 58, 60, 58],
                          backgroundColor: '#d1d5db',
                          borderRadius: 4
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                          labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: any) {
                              const label = context.dataset.label || '';
                              const value = context.raw || 0;
                              return `${label}: ${value}개`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          stacked: true,
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          stacked: true,
                          grid: {
                            display: true
                          },
                          title: {
                            display: true,
                            text: '거래처 수',
                            font: {
                              size: 12
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}