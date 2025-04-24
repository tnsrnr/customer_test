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
  FileCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

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
      {/* 대시보드 요약 카드들 - 항상 표시되는 요약 정보 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3.5 flex items-center">
            <div className="mr-3.5 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 인원</p>
              <h4 className="text-xl font-bold">120명</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3.5 flex items-center">
            <div className="mr-3.5 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">월 매출</p>
              <h4 className="text-xl font-bold">12.5억원</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3.5 flex items-center">
            <div className="mr-3.5 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 거래처</p>
              <h4 className="text-xl font-bold">215개</h4>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 탭 네비게이션 */}
      <div className="border-b bg-white rounded-t-md shadow-sm">
        <div className="flex">
          <button
            onClick={() => setActiveTab('hr')}
            className={`px-3.5 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'hr'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              인사관리
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3.5 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'finance'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              정산관리
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('client')}
            className={`px-3.5 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'client'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              거래처관리
            </div>
          </button>
        </div>
      </div>
      
      {/* 탭 컨텐츠 */}
      <div className="mt-3.5">
        {/* 인사관리 탭 */}
        {activeTab === 'hr' && (
          <div className="space-y-3.5">
            {/* 주요 인원 및 근태 현황 요약 - 상단에 배치 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              {/* 상단 요약 지표 */}
              <div className="md:col-span-12">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3.5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                      <div className="flex items-center p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">총 인원</p>
                          <h4 className="text-xl font-bold">120명</h4>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2.5 bg-green-50 rounded-lg border border-green-100">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">정상근무</p>
                          <h4 className="text-xl font-bold">112명</h4>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">휴가중</p>
                          <h4 className="text-xl font-bold">5명</h4>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2.5 bg-red-50 rounded-lg border border-red-100">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">지각/결근</p>
                          <h4 className="text-xl font-bold">3명</h4>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 인원 현황 카드 */}
              <div className="md:col-span-6">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      인원 현황
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2.5 px-3.5 pb-3.5">
                    <div className="space-y-3.5">
                      {/* 부서별 인원 분포 - 컬러 블록으로 변경 */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <h3 className="text-sm font-medium">부서별 인원 분포</h3>
                          <Badge className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs">총 120명</Badge>
                        </div>
                        
                        <ColorBlocks 
                          values={departmentStaff.slice(0, 6)} 
                          colorScheme="blue"
                        />
                      </div>
                      
                      {/* 요약 통계 */}
                      <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <div className="text-xs text-gray-500">신규입사</div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">8명</div>
                            <Badge className="bg-green-50 text-green-600 px-1.5 text-xs">이번달</Badge>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <div className="text-xs text-gray-500">퇴사</div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">2명</div>
                            <Badge className="bg-red-50 text-red-600 px-1.5 text-xs">이번달</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* 근태 현황 카드 */}
              <div className="md:col-span-6">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      근태 현황
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2.5 px-3.5 pb-3.5">
                    <div className="space-y-3.5">
                      {/* 근태 상태 - 컴팩트 인포블록으로 변경 */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <h3 className="text-sm font-medium">오늘 근태 상태</h3>
                          <Badge className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs">실시간</Badge>
                        </div>
                        
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
                      </div>
                      
                      {/* 이번달 근태 요약 */}
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium">이번달 근태 현황</span>
                          <Badge className="bg-blue-100 text-blue-700 px-1.5 text-xs">월간</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">평균 출근</div>
                            <div className="text-base font-bold">08:52</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">평균 퇴근</div>
                            <div className="text-base font-bold">18:35</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">평균 근무</div>
                            <div className="text-base font-bold">8.7시간</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* 직급/연령/성별 분포 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* 직급별 분포 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                    직급별 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2.5 px-3.5 pb-3.5">
                  <ColorBlocks 
                    values={[
                      { label: "사원", value: "52명", percent: 43 },
                      { label: "대리", value: "28명", percent: 23 },
                      { label: "과장", value: "18명", percent: 15 },
                      { label: "차장", value: "12명", percent: 10 },
                      { label: "부장", value: "8명", percent: 7 },
                      { label: "임원", value: "2명", percent: 2 }
                    ]} 
                    colorScheme="indigo"
                  />
                  
                  <div className="mt-2.5 pt-1.5 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">평균 근속 연수</span>
                      <span className="text-sm font-medium">4.8년</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 연령대별 분포 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    연령대별 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2.5 px-3.5 pb-3.5">
                  <ColorBlocks 
                    values={[
                      { label: "20대", value: "40명", percent: 33 },
                      { label: "30대", value: "45명", percent: 38 },
                      { label: "40대", value: "22명", percent: 18 },
                      { label: "50대", value: "13명", percent: 11 }
                    ]} 
                    colorScheme="purple"
                  />
                  
                  <div className="mt-2.5 pt-1.5 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">평균 연령</span>
                      <span className="text-sm font-medium">34.7세</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* 성별 분포 */}
              <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <UserPlus className="h-4 w-4 mr-2 text-green-500" />
                    성별 분포
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2.5 px-3.5 pb-3.5">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-blue-50 rounded-lg p-3.5 text-center border border-blue-100">
                      <div className="text-xs text-gray-500 mb-1">남성</div>
                      <div className="text-xl font-bold">72명</div>
                      <div className="text-xs text-blue-600 mt-0.5">60%</div>
                    </div>
                    <div className="bg-pink-50 rounded-lg p-3.5 text-center border border-pink-100">
                      <div className="text-xs text-gray-500 mb-1">여성</div>
                      <div className="text-xl font-bold">48명</div>
                      <div className="text-xs text-pink-600 mt-0.5">40%</div>
                    </div>
                  </div>
                  
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-3.5 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>남성 비율: 60%</span>
                    <span>여성 비율: 40%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* 정산관리 탭 */}
        {activeTab === 'finance' && (
          <div className="space-y-3.5">
            {/* 1. 회사의 매출/매입/이익 현황 */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                  월별 매출/매입/이익 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3.5 pt-2.5 pb-3.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-medium">이번달 매출</h3>
                      <Badge className="bg-green-100 text-green-700 px-1.5 text-[10px] py-0">10월</Badge>
                    </div>
                    <div className="mt-1.5">
                      <div className="text-xl font-bold">12.5억원</div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <div className="flex items-center">
                          <Badge className="bg-green-100 text-green-700 px-1 text-[10px] py-0">
                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                            8.5%
                          </Badge>
                          <span className="text-[10px] text-gray-500 ml-0.5">전월</span>
                        </div>
                        <div className="flex items-center">
                          <Badge className="bg-blue-100 text-blue-700 px-1 text-[10px] py-0">
                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                            12.3%
                          </Badge>
                          <span className="text-[10px] text-gray-500 ml-0.5">전년</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span>목표 달성률</span>
                          <span>92%</span>
                        </div>
                        <EnhancedProgress value={92} colorScheme="green" size="sm" />
                      </div>
                    </div>
                  </div>
              
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-medium">이번달 매입</h3>
                      <Badge className="bg-blue-100 text-blue-700 px-1.5 text-[10px] py-0">10월</Badge>
                    </div>
                    <div className="mt-1.5">
                      <div className="text-xl font-bold">8.2억원</div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <div className="flex items-center">
                          <Badge className="bg-green-100 text-green-700 px-1 text-[10px] py-0">
                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                            3.2%
                          </Badge>
                          <span className="text-[10px] text-gray-500 ml-0.5">전월</span>
                        </div>
                        <div className="flex items-center">
                          <Badge className="bg-blue-100 text-blue-700 px-1 text-[10px] py-0">
                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                            5.7%
                          </Badge>
                          <span className="text-[10px] text-gray-500 ml-0.5">전년</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span>예산 사용률</span>
                          <span>78%</span>
                        </div>
                        <EnhancedProgress value={78} colorScheme="blue" size="sm" />
                      </div>
                    </div>
                  </div>
              
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-medium">이번달 이익률</h3>
                      <Badge className="bg-purple-100 text-purple-700 px-1.5 text-[10px] py-0">10월</Badge>
                    </div>
                    <div className="mt-1.5">
                      <div className="text-xl font-bold">34.2%</div>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <div className="flex items-center">
                          <Badge className="bg-green-100 text-green-700 px-1 text-[10px] py-0">
                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                            2.4%
                          </Badge>
                          <span className="text-[10px] text-gray-500 ml-0.5">전월</span>
                        </div>
                        <div className="flex items-center">
                          <Badge className="bg-green-100 text-green-700 px-1 text-[10px] py-0">
                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                            4.1%
                          </Badge>
                          <span className="text-[10px] text-gray-500 ml-0.5">전년</span>
                        </div>
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
                </div>
                
                {/* 매출 차트 */}
                <div className="mt-3.5 p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">월별 매출/이익 추이</h3>
                    <Badge className="bg-gray-100 text-gray-700 px-1.5 text-xs">최근 6개월</Badge>
                  </div>
                  <div className="h-32 w-full bg-gray-50 rounded-md border border-dashed p-3">
                    <div className="flex h-full">
                      {/* 월별 데이터 막대 그래프 (가상) */}
                      {[65, 72, 68, 80, 85, 92].map((value, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end items-center mx-1">
                          <div className="w-full bg-green-500 rounded-t-sm opacity-80" style={{ height: `${value * 0.8}%` }}></div>
                          <div className="w-full bg-blue-500 rounded-t-sm mt-1" style={{ height: `${value * 0.35}%` }}></div>
                          <span className="text-[9px] mt-1 text-gray-500">{5-i}월</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs mt-1.5">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 mr-1 rounded-sm"></div>
                        <span>매출</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 mr-1 rounded-sm"></div>
                        <span>이익</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. 부서별 판관비 내역 */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                <CardTitle className="text-sm font-medium flex items-center">
                  <FileCheck className="h-4 w-4 mr-2 text-amber-500" />
                  부서별 판관비 내역
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3.5 pt-2.5 pb-3.5">
                <div className="space-y-3.5">
                  {/* 전체 판관비 요약 */}
                  <div className="flex items-center p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="mr-3 h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                      <FileText className="h-4.5 w-4.5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">이번달 총 판관비</p>
                        <Badge className="bg-amber-100 text-amber-700 px-1.5 py-0.5 text-xs">10월</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">3.85억원</h4>
                        <Badge className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs">
                          전월 대비 -2.3%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 부서별 판관비 내역 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* 인사/총무 부서 */}
                    <div className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                          인사/총무
                        </h3>
                        <span className="text-sm font-bold">1.25억원</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">인건비</span>
                            <span>9,600만원</span>
                          </div>
                          <EnhancedProgress value={76.8} max={100} colorScheme="indigo" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">건물세/임대료</span>
                            <span>1,800만원</span>
                          </div>
                          <EnhancedProgress value={14.4} max={100} colorScheme="indigo" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">기타 비용</span>
                            <span>1,100만원</span>
                          </div>
                          <EnhancedProgress value={8.8} max={100} colorScheme="indigo" size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* 영업/마케팅 부서 */}
                    <div className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                          영업/마케팅
                        </h3>
                        <span className="text-sm font-bold">1.45억원</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">인건비</span>
                            <span>8,200만원</span>
                          </div>
                          <EnhancedProgress value={56.6} max={100} colorScheme="blue" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">광고/판촉비</span>
                            <span>4,500만원</span>
                          </div>
                          <EnhancedProgress value={31} max={100} colorScheme="blue" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">교통/접대비</span>
                            <span>1,800만원</span>
                          </div>
                          <EnhancedProgress value={12.4} max={100} colorScheme="blue" size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* 생산/물류 부서 */}
                    <div className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center">
                          <Truck className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                          생산/물류
                        </h3>
                        <span className="text-sm font-bold">1.15억원</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">인건비</span>
                            <span>6,500만원</span>
                          </div>
                          <EnhancedProgress value={56.5} max={100} colorScheme="green" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">물류/운송비</span>
                            <span>3,200만원</span>
                          </div>
                          <EnhancedProgress value={27.8} max={100} colorScheme="green" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">설비/유지비</span>
                            <span>1,800만원</span>
                          </div>
                          <EnhancedProgress value={15.7} max={100} colorScheme="green" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 비용 항목별 분포 */}
                  <div className="border rounded-lg p-3">
                    <h3 className="text-sm font-medium mb-2">비용 항목별 분포</h3>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-indigo-500" style={{ width: '62%' }}></div>
                      <div className="h-full bg-blue-500" style={{ width: '20%' }}></div>
                      <div className="h-full bg-green-500" style={{ width: '10%' }}></div>
                      <div className="h-full bg-amber-500" style={{ width: '8%' }}></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-indigo-500 mr-1.5 rounded-full"></div>
                        <span className="text-gray-500">인건비 (62%)</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-blue-500 mr-1.5 rounded-full"></div>
                        <span className="text-gray-500">시설/임대료 (20%)</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-green-500 mr-1.5 rounded-full"></div>
                        <span className="text-gray-500">물류/운송 (10%)</span>
                      </div>
                      <div className="flex items-center text-xs">
                        <div className="w-2 h-2 bg-amber-500 mr-1.5 rounded-full"></div>
                        <span className="text-gray-500">기타 비용 (8%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. 통장 자금 흐름 */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="py-2.5 px-3.5 border-b bg-gray-50">
                <CardTitle className="text-sm font-medium flex items-center">
                  <RotateCcw className="h-4 w-4 mr-2 text-blue-500" />
                  통장 자금 흐름
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3.5 pt-2.5 pb-3.5">
                <div className="space-y-3.5">
                  {/* 통장 잔액 현황 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div className="border rounded-lg p-3 bg-blue-50 border-blue-100">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-medium">통장 총 잔액</h3>
                        <Badge className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs">현재</Badge>
                      </div>
                      <div className="text-xl font-bold">8.25억원</div>
                      <div className="flex items-center mt-1">
                        <Badge className="bg-green-100 text-green-700 px-1.5 py-0 text-[10px]">
                          <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                          1.25억
                        </Badge>
                        <span className="text-[10px] text-gray-500 ml-1.5">전월 대비</span>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 bg-green-50 border-green-100">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-medium">이번달 입금</h3>
                        <Badge className="bg-green-100 text-green-700 px-1.5 py-0.5 text-xs">10월</Badge>
                      </div>
                      <div className="text-xl font-bold">5.85억원</div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        매출 입금 5.1억원 + 기타 수입 0.75억원
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 bg-red-50 border-red-100">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xs font-medium">이번달 출금</h3>
                        <Badge className="bg-red-100 text-red-700 px-1.5 py-0.5 text-xs">10월</Badge>
                      </div>
                      <div className="text-xl font-bold">4.6억원</div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        매입 3.2억원 + 판관비 1.4억원
                      </div>
                    </div>
                  </div>

                  {/* 주요 거래내역 */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">주요 거래내역</h3>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-500">
                        전체보기
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center">
                          <div className="rounded-full bg-green-100 p-1.5 mr-2">
                            <ArrowDown className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">삼성전자(주) 입금</div>
                            <div className="text-xs text-gray-500">2023-10-23 14:32:15</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-600">+ 1.25억원</div>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center">
                          <div className="rounded-full bg-green-100 p-1.5 mr-2">
                            <ArrowDown className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">현대자동차(주) 입금</div>
                            <div className="text-xs text-gray-500">2023-10-15 09:45:23</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-green-600">+ 0.95억원</div>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center">
                          <div className="rounded-full bg-red-100 p-1.5 mr-2">
                            <ArrowUp className="h-3.5 w-3.5 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">10월 직원 급여 지급</div>
                            <div className="text-xs text-gray-500">2023-10-10 10:00:00</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-red-600">- 1.85억원</div>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center">
                          <div className="rounded-full bg-red-100 p-1.5 mr-2">
                            <ArrowUp className="h-3.5 w-3.5 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">(주)서울부품 외상매입</div>
                            <div className="text-xs text-gray-500">2023-10-05 15:21:42</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-red-600">- 0.72억원</div>
                      </div>
                    </div>
                  </div>

                  {/* 자금흐름 예측 */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">11월 자금흐름 예측</h3>
                      <Badge className="bg-purple-100 text-purple-700 px-1.5 py-0.5 text-xs">예측</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">예상 입금</span>
                            <span className="font-medium text-green-600">+ 6.2억원</span>
                          </div>
                          <EnhancedProgress value={62} max={100} colorScheme="green" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">예상 출금</span>
                            <span className="font-medium text-red-600">- 4.8억원</span>
                          </div>
                          <EnhancedProgress value={48} max={100} colorScheme="red" size="sm" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">예상 순증가</span>
                            <span className="font-medium text-blue-600">+ 1.4억원</span>
                          </div>
                          <EnhancedProgress value={14} max={100} colorScheme="blue" size="sm" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-sm font-medium mb-1">11월말 예상 잔액</div>
                        <div className="text-xl font-bold text-blue-600">9.65억원</div>
                        <Badge className="bg-green-100 text-green-700 w-fit mt-1 px-1.5 py-0 text-[10px]">
                          <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                          16.9%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 거래처관리 탭 */}
        {activeTab === 'client' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 매출 주요 거래처 */}
              <Card>
                <CardHeader className="py-3 px-4 border-b">
                  <CardTitle className="text-sm font-medium">매출 주요 거래처 TOP 5</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-3 pb-4">
                  <div className="space-y-3">
                    {topClients.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{item.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-2">{item.value}</span>
                            <span className="text-[10px] text-muted-foreground">{item.percent}%</span>
                          </div>
                        </div>
                        <EnhancedProgress 
                          value={item.percent} 
                          colorScheme={
                            index === 0 ? "green" : 
                            index === 1 ? "blue" : 
                            index === 2 ? "indigo" : 
                            index === 3 ? "purple" : "amber"
                          } 
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* 미수금 주요 거래처 */}
              <Card>
                <CardHeader className="py-3 px-4 border-b">
                  <CardTitle className="text-sm font-medium">미수금 주요 거래처 TOP 5</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pt-3 pb-4">
                  <div className="space-y-3">
                    {topUnpaidClients.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{item.name}</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-2">{item.value}</span>
                            <span className="text-[10px] text-muted-foreground">{item.percent}%</span>
                          </div>
                        </div>
                        <EnhancedProgress 
                          value={item.percent} 
                          colorScheme={
                            index === 0 ? "red" : 
                            index === 1 ? "amber" : 
                            index === 2 ? "purple" : 
                            index === 3 ? "indigo" : "blue"
                          } 
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* 거래처 지역분포 */}
            <Card>
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium">거래처 분포 현황</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pt-3 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">지역별 분포</span>
                      </div>
                      <div className="h-28 w-full flex items-center justify-center border border-dashed rounded-md">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <PieChart className="h-4 w-4 mr-1.5" />
                          지역별 분포 차트
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">업종별 분포</span>
                      </div>
                      <div className="h-28 w-full flex items-center justify-center border border-dashed rounded-md">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <PieChart className="h-4 w-4 mr-1.5" />
                          업종별 분포 차트
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">거래규모별 분포</span>
                      </div>
                      <div className="h-28 w-full flex items-center justify-center border border-dashed rounded-md">
                        <div className="text-xs text-muted-foreground flex items-center">
                          <PieChart className="h-4 w-4 mr-1.5" />
                          거래규모별 분포 차트
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 