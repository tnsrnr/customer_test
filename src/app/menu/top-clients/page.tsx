'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Building2, TrendingUp, Package, DollarSign, BarChart2, ArrowUpRight, Plane, Ship, Truck, Train, ArrowDownRight, Minus, Trophy, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthGuard } from "@/components/auth-guard";
import { Chart } from 'react-chartjs-2';

// 전역 Chart.js 설정 사용
import '@/lib/chart-config';

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

type TransportType = '항공수출' | '항공수입' | '해상수출' | '해상수입' | '운송' | '철도';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isAnimating?: boolean;
}

function TabButton({ active, onClick, icon, label, isAnimating = false }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium relative ${
        active 
          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20' 
          : 'text-blue-200 hover:bg-white/10 hover:text-white hover:shadow-md backdrop-blur-sm'
      }`}
    >
      {/* 아이콘 애니메이션 컨테이너 */}
      <div className="relative">
        {icon}
      </div>
      <span>{label}</span>
    </button>
  );
}

function CountUpAnimation({ end, duration = 2000, delay = 0, suffix = "", prefix = "", className = "" }: CountUpAnimationProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = end / (duration / 16);
      const animate = () => {
        start += step;
        if (start < end) {
          setCount(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <span className={className}>{prefix}{formatNumber(count)}{suffix}</span>;
}

// 월별 데이터 타입 정의 추가
interface MonthlyData {
  sales: number[];
  profit: number[];
  profitRatio: number[];
}

interface ClientData {
  name: string;
  sales: number;
  profit: number;
  volume: number;
  profitRatio: number;
  trend: string;
  mainItems: string;
  comparison: {
    prevMonth: {
      sales: number;
      profit: number;
      volume: number;
      profitRatio: number;
    };
    prevYear: {
      sales: number;
      profit: number;
      volume: number;
      profitRatio: number;
    };
  };
  monthlyData: MonthlyData;
}

export default function TopClientsPage() {
  const [showCharts, setShowCharts] = useState(true);
  const [selectedTab, setSelectedTab] = useState<TransportType>('항공수출');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [animatingTab, setAnimatingTab] = useState<string | null>(null);
  const [pendingTabChange, setPendingTabChange] = useState<TransportType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 운송 수단별 데이터
  const transportData = {
    '항공수출': {
      title: '항공수출 상위거래처',
      icon: <Plane className="w-12 h-12 text-blue-600" />,
      color: 'blue',
      data: [
        { 
          name: "삼성전자", 
          sales: 850, 
          profit: 120, 
          volume: 2500, 
          profitRatio: 14.1, 
          trend: "증가", 
          mainItems: "반도체",
          comparison: {
            prevMonth: {
              sales: 820,
              profit: 115,
              volume: 2400,
              profitRatio: 14.0
            },
            prevYear: {
              sales: 780,
              profit: 108,
              volume: 2300,
              profitRatio: 13.8
            }
          },
          monthlyData: {
            sales: [794, 1241, 74, 56, 65],
            profit: [120, 180, 11, 8, 10],
            profitRatio: [15.1, 14.5, 14.8, 14.2, 15.3]
          }
        },
        { name: "LG전자", sales: 680, profit: 95, volume: 2100, profitRatio: 14.0, trend: "유지", mainItems: "전자부품", comparison: { prevMonth: { sales: 670, profit: 92, volume: 2050, profitRatio: 13.8 }, prevYear: { sales: 650, profit: 88, volume: 2000, profitRatio: 13.5 } }, monthlyData: { sales: [670, 92, 2050, 13.8], profit: [92, 13.8], profitRatio: [13.8] } },
        { name: "SK하이닉스", sales: 520, profit: 75, volume: 1800, profitRatio: 14.4, trend: "증가", mainItems: "반도체", comparison: { prevMonth: { sales: 510, profit: 72, volume: 1780, profitRatio: 14.3 }, prevYear: { sales: 500, profit: 70, volume: 1750, profitRatio: 14.2 } }, monthlyData: { sales: [510, 72, 1780, 14.3], profit: [72, 14.3], profitRatio: [14.3] } },
        { name: "현대모비스", sales: 420, profit: 58, volume: 1500, profitRatio: 13.8, trend: "감소", mainItems: "자동차부품", comparison: { prevMonth: { sales: 430, profit: 60, volume: 1520, profitRatio: 13.9 }, prevYear: { sales: 410, profit: 57, volume: 1480, profitRatio: 13.7 } }, monthlyData: { sales: [430, 60, 1520, 13.9], profit: [60, 13.9], profitRatio: [13.9] } },
        { name: "LG디스플레이", sales: 380, profit: 52, volume: 1300, profitRatio: 13.7, trend: "유지", mainItems: "디스플레이", comparison: { prevMonth: { sales: 375, profit: 51, volume: 1290, profitRatio: 13.6 }, prevYear: { sales: 370, profit: 50, volume: 1280, profitRatio: 13.5 } }, monthlyData: { sales: [375, 51, 1290, 13.6], profit: [51, 13.6], profitRatio: [13.6] } }
      ]
    },
    '항공수입': {
      title: '항공수입 상위거래처',
      icon: <Plane className="w-12 h-12 text-purple-600" />,
      color: 'purple',
      data: [
        { name: "애플", sales: 920, profit: 135, volume: 2800, profitRatio: 14.7, trend: "증가", mainItems: "전자제품", comparison: { prevMonth: { sales: 900, profit: 132, volume: 2780, profitRatio: 14.6 }, prevYear: { sales: 880, profit: 128, volume: 2750, profitRatio: 14.4 } }, monthlyData: { sales: [900, 132, 2780, 14.6], profit: [132, 14.6], profitRatio: [14.6] } },
        { name: "퀄컴", sales: 750, profit: 108, volume: 2300, profitRatio: 14.4, trend: "유지", mainItems: "반도체", comparison: { prevMonth: { sales: 740, profit: 106, volume: 2280, profitRatio: 14.3 }, prevYear: { sales: 730, profit: 104, volume: 2250, profitRatio: 14.2 } }, monthlyData: { sales: [740, 106, 2280, 14.3], profit: [106, 14.3], profitRatio: [14.3] } },
        { name: "인텔", sales: 580, profit: 82, volume: 1900, profitRatio: 14.1, trend: "감소", mainItems: "반도체", comparison: { prevMonth: { sales: 590, profit: 84, volume: 1920, profitRatio: 14.2 }, prevYear: { sales: 570, profit: 80, volume: 1880, profitRatio: 13.9 } }, monthlyData: { sales: [590, 84, 1920, 14.2], profit: [84, 14.2], profitRatio: [14.2] } },
        { name: "테슬라", sales: 450, profit: 63, volume: 1600, profitRatio: 14.0, trend: "증가", mainItems: "자동차부품", comparison: { prevMonth: { sales: 440, profit: 61, volume: 1580, profitRatio: 13.9 }, prevYear: { sales: 430, profit: 59, volume: 1560, profitRatio: 13.8 } }, monthlyData: { sales: [440, 61, 1580, 13.9], profit: [61, 13.9], profitRatio: [13.9] } },
        { name: "AMD", sales: 400, profit: 56, volume: 1400, profitRatio: 14.0, trend: "유지", mainItems: "반도체", comparison: { prevMonth: { sales: 395, profit: 55, volume: 1390, profitRatio: 13.9 }, prevYear: { sales: 390, profit: 54, volume: 1380, profitRatio: 13.8 } }, monthlyData: { sales: [395, 55, 1390, 13.9], profit: [55, 13.9], profitRatio: [13.9] } }
      ]
    },
    '해상수출': {
      title: '해상수출 상위거래처',
      icon: <Ship className="w-12 h-12 text-emerald-600" />,
      color: 'emerald',
      data: [
        { name: "현대자동차", sales: 1100, profit: 165, volume: 3500, profitRatio: 15.0, trend: "증가", mainItems: "완성차", comparison: { prevMonth: { sales: 1080, profit: 162, volume: 3480, profitRatio: 14.9 }, prevYear: { sales: 1050, profit: 158, volume: 3450, profitRatio: 14.8 } }, monthlyData: { sales: [1080, 162, 3480, 14.9], profit: [162, 14.9], profitRatio: [14.9] } },
        { name: "포스코", sales: 950, profit: 142, volume: 3200, profitRatio: 14.9, trend: "유지", mainItems: "철강", comparison: { prevMonth: { sales: 940, profit: 140, volume: 3180, profitRatio: 14.8 }, prevYear: { sales: 930, profit: 138, volume: 3160, profitRatio: 14.7 } }, monthlyData: { sales: [940, 140, 3180, 14.8], profit: [140, 14.8], profitRatio: [14.8] } },
        { name: "기아자동차", sales: 820, profit: 123, volume: 2900, profitRatio: 15.0, trend: "증가", mainItems: "완성차", comparison: { prevMonth: { sales: 810, profit: 121, volume: 2880, profitRatio: 14.9 }, prevYear: { sales: 800, profit: 120, volume: 2860, profitRatio: 14.8 } }, monthlyData: { sales: [810, 121, 2880, 14.9], profit: [121, 14.9], profitRatio: [14.9] } },
        { name: "삼성전자", sales: 750, profit: 112, volume: 2700, profitRatio: 14.9, trend: "유지", mainItems: "가전제품", comparison: { prevMonth: { sales: 745, profit: 111, volume: 2690, profitRatio: 14.8 }, prevYear: { sales: 740, profit: 110, volume: 2680, profitRatio: 14.8 } }, monthlyData: { sales: [745, 111, 2690, 14.8], profit: [111, 14.8], profitRatio: [14.8] } },
        { name: "LG전자", sales: 680, profit: 102, volume: 2500, profitRatio: 15.0, trend: "증가", mainItems: "가전제품", comparison: { prevMonth: { sales: 675, profit: 101, volume: 2490, profitRatio: 14.9 }, prevYear: { sales: 670, profit: 100, volume: 2480, profitRatio: 14.9 } }, monthlyData: { sales: [675, 101, 2490, 14.9], profit: [101, 14.9], profitRatio: [14.9] } }
      ]
    },
    '해상수입': {
      title: '해상수입 상위거래처',
      icon: <Ship className="w-12 h-12 text-cyan-600" />,
      color: 'cyan',
      data: [
        { name: "쉘", sales: 980, profit: 147, volume: 3300, profitRatio: 15.0, trend: "증가", mainItems: "원유", comparison: { prevMonth: { sales: 970, profit: 145, volume: 3280, profitRatio: 14.9 }, prevYear: { sales: 960, profit: 143, volume: 3260, profitRatio: 14.8 } }, monthlyData: { sales: [970, 145, 3280, 14.9], profit: [145, 14.9], profitRatio: [14.9] } },
        { name: "엑손모빌", sales: 850, profit: 127, volume: 3000, profitRatio: 14.9, trend: "유지", mainItems: "석유제품", comparison: { prevMonth: { sales: 840, profit: 125, volume: 2980, profitRatio: 14.8 }, prevYear: { sales: 830, profit: 123, volume: 2960, profitRatio: 14.7 } }, monthlyData: { sales: [840, 125, 2980, 14.8], profit: [125, 14.8], profitRatio: [14.8] } },
        { name: "BP", sales: 720, profit: 108, volume: 2700, profitRatio: 15.0, trend: "증가", mainItems: "원유", comparison: { prevMonth: { sales: 710, profit: 106, volume: 2680, profitRatio: 14.9 }, prevYear: { sales: 700, profit: 104, volume: 2660, profitRatio: 14.8 } }, monthlyData: { sales: [710, 106, 2680, 14.9], profit: [106, 14.9], profitRatio: [14.9] } },
        { name: "토탈", sales: 650, profit: 97, volume: 2500, profitRatio: 14.9, trend: "유지", mainItems: "석유제품", comparison: { prevMonth: { sales: 645, profit: 96, volume: 2490, profitRatio: 14.8 }, prevYear: { sales: 640, profit: 95, volume: 2480, profitRatio: 14.8 } }, monthlyData: { sales: [645, 96, 2490, 14.8], profit: [96, 14.8], profitRatio: [14.8] } },
        { name: "발레", sales: 580, profit: 87, volume: 2300, profitRatio: 15.0, trend: "감소", mainItems: "철광석", comparison: { prevMonth: { sales: 575, profit: 86, volume: 2290, profitRatio: 14.9 }, prevYear: { sales: 570, profit: 85, volume: 2280, profitRatio: 14.9 } }, monthlyData: { sales: [575, 86, 2290, 14.9], profit: [86, 14.9], profitRatio: [14.9] } }
      ]
    },
    '운송': {
      title: '운송 상위거래처',
      icon: <Truck className="w-12 h-12 text-amber-600" />,
      color: 'amber',
      data: [
        { name: "이마트", sales: 580, profit: 87, volume: 2200, profitRatio: 15.0, trend: "증가", mainItems: "유통", comparison: { prevMonth: { sales: 575, profit: 86, volume: 2190, profitRatio: 14.9 }, prevYear: { sales: 570, profit: 85, volume: 2180, profitRatio: 14.8 } }, monthlyData: { sales: [575, 86, 2190, 14.9], profit: [86, 14.9], profitRatio: [14.9] } },
        { name: "홈플러스", sales: 520, profit: 78, volume: 2000, profitRatio: 15.0, trend: "유지", mainItems: "유통", comparison: { prevMonth: { sales: 515, profit: 77, volume: 1990, profitRatio: 14.9 }, prevYear: { sales: 510, profit: 76, volume: 1980, profitRatio: 14.8 } }, monthlyData: { sales: [515, 77, 1990, 14.9], profit: [77, 14.9], profitRatio: [14.9] } },
        { name: "롯데마트", sales: 480, profit: 72, volume: 1900, profitRatio: 15.0, trend: "증가", mainItems: "유통", comparison: { prevMonth: { sales: 475, profit: 71, volume: 1890, profitRatio: 14.9 }, prevYear: { sales: 470, profit: 70, volume: 1880, profitRatio: 14.8 } }, monthlyData: { sales: [475, 71, 1890, 14.9], profit: [71, 14.9], profitRatio: [14.9] } },
        { name: "쿠팡", sales: 450, profit: 67, volume: 1800, profitRatio: 14.9, trend: "증가", mainItems: "이커머스", comparison: { prevMonth: { sales: 445, profit: 66, volume: 1790, profitRatio: 14.8 }, prevYear: { sales: 440, profit: 65, volume: 1780, profitRatio: 14.8 } }, monthlyData: { sales: [445, 66, 1790, 14.8], profit: [66, 14.8], profitRatio: [14.8] } },
        { name: "농협", sales: 420, profit: 63, volume: 1700, profitRatio: 15.0, trend: "유지", mainItems: "유통", comparison: { prevMonth: { sales: 415, profit: 62, volume: 1690, profitRatio: 14.9 }, prevYear: { sales: 410, profit: 61, volume: 1680, profitRatio: 14.8 } }, monthlyData: { sales: [415, 62, 1690, 14.9], profit: [62, 14.9], profitRatio: [14.9] } }
      ]
    },
    '철도': {
      title: '철도 상위거래처',
      icon: <Train className="w-12 h-12 text-red-600" />,
      color: 'red',
      data: [
        { name: "한국철도공사", sales: 320, profit: 48, volume: 1200, profitRatio: 15.0, trend: "증가", mainItems: "철도운송", comparison: { prevMonth: { sales: 315, profit: 47, volume: 1190, profitRatio: 14.9 }, prevYear: { sales: 310, profit: 46, volume: 1180, profitRatio: 14.8 } }, monthlyData: { sales: [315, 47, 1190, 14.9], profit: [47, 14.9], profitRatio: [14.9] } },
        { name: "포스코", sales: 280, profit: 42, volume: 1000, profitRatio: 15.0, trend: "유지", mainItems: "철강운송", comparison: { prevMonth: { sales: 275, profit: 41, volume: 990, profitRatio: 14.9 }, prevYear: { sales: 270, profit: 40, volume: 980, profitRatio: 14.8 } }, monthlyData: { sales: [275, 41, 990, 14.9], profit: [41, 14.9], profitRatio: [14.9] } },
        { name: "현대제철", sales: 250, profit: 37, volume: 900, profitRatio: 14.8, trend: "증가", mainItems: "철강운송", comparison: { prevMonth: { sales: 245, profit: 36, volume: 890, profitRatio: 14.7 }, prevYear: { sales: 240, profit: 35, volume: 880, profitRatio: 14.6 } }, monthlyData: { sales: [245, 36, 890, 14.7], profit: [36, 14.7], profitRatio: [14.7] } },
        { name: "동부제철", sales: 220, profit: 33, volume: 800, profitRatio: 15.0, trend: "유지", mainItems: "철강운송", comparison: { prevMonth: { sales: 215, profit: 32, volume: 790, profitRatio: 14.9 }, prevYear: { sales: 210, profit: 31, volume: 780, profitRatio: 14.8 } }, monthlyData: { sales: [215, 32, 790, 14.9], profit: [32, 14.9], profitRatio: [14.9] } },
        { name: "세아제철", sales: 200, profit: 30, volume: 750, profitRatio: 15.0, trend: "감소", mainItems: "철강운송", comparison: { prevMonth: { sales: 195, profit: 29, volume: 740, profitRatio: 14.9 }, prevYear: { sales: 190, profit: 28, volume: 730, profitRatio: 14.8 } }, monthlyData: { sales: [195, 29, 740, 14.9], profit: [29, 14.9], profitRatio: [14.9] } }
      ]
    }
  };

  function calculateGrowth(current: number, previous: number): number {
    return ((current - previous) / previous) * 100;
  }

  function GrowthIndicator({ value }: { value: number }) {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+{value.toFixed(1)}%</span>
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDownRight className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{value.toFixed(1)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-500">
          <Minus className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">0.0%</span>
        </div>
      );
    }
  }

  const currentData = transportData[selectedTab];

  const chartData = useMemo(() => {
    if (!selectedClient) {
      // 상위 5개 거래처의 합계 월별 데이터 계산
      const top5Data = currentData.data.slice(0, 5);
      const monthlySales = [0, 0, 0, 0, 0];
      const monthlyProfit = [0, 0, 0, 0, 0];
      
      top5Data.forEach(client => {
        client.monthlyData.sales.forEach((sale, index) => {
          monthlySales[index] += sale;
        });
        client.monthlyData.profit.forEach((profit, index) => {
          monthlyProfit[index] += profit;
        });
      });

      return {
        labels: ['1월', '2월', '3월', '4월', '5월'],
        datasets: [
          {
            label: '총 매출 (상위 5개)',
            data: monthlySales,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: '총 수익 (상위 5개)',
            data: monthlyProfit,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      };
    }

    const client = currentData.data.find(c => c.name === selectedClient);
    if (!client) {
      return {
        labels: ['1월', '2월', '3월', '4월', '5월'],
        datasets: []
      };
    }

    return {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      datasets: [
        {
          label: '매출',
          data: client.monthlyData.sales,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: '수익',
          data: client.monthlyData.profit,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [selectedClient, currentData.data]);

  function TopClientsPageContent() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
        <div className="relative z-10 p-6">


          {/* 탭 네비게이션 */}
          <div className="mb-8 relative">
            <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
              {Object.entries(transportData).map(([key, value]) => (
                <TabButton
                  key={key}
                  active={selectedTab === key}
                  onClick={() => {
                    // 즉시 화면 전환
                    setSelectedTab(key as TransportType);
                    setSelectedClient(''); // 탭 변경 시 선택된 거래처 초기화
                    
                    // 애니메이션 시작 (화면 전환과 독립적)
                    setAnimatingTab(key);
                    
                    // 3초 후 애니메이션만 종료
                    setTimeout(() => {
                      setAnimatingTab(null);
                    }, 3000);
                  }}
                  icon={value.icon}
                  label={key}
                  isAnimating={animatingTab === key}
                />
              ))}
            </div>
            
            {/* 오른쪽 노란색 선 영역 */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-yellow-400/30 to-yellow-400/50 rounded-r-2xl pointer-events-none">
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full"></div>
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-full"></div>
            </div>
            
            {/* 애니메이션 아이콘 - 전체 영역에서 움직임 */}
            {animatingTab && (
              <motion.div
                className="absolute z-50 pointer-events-none"
                initial={{ 
                  x: 850, // 철도 아이콘 옆에서 시작 (50px 더 오른쪽)
                  y: 0, 
                  opacity: 1, 
                  scale: 1.2 
                }}
                animate={{ 
                  x: [850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450], 
                  y: [0, -5, 5, -3, 0, 3, -3, 0, 2, -2, 0, 0, 0],
                  opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                  scale: [1.2, 1.3, 1.2, 1.25, 1.2, 1.3, 1.2, 1.25, 1.2, 1.3, 1.2, 1.25, 1]
                }}
                transition={{ 
                  duration: 3,
                  ease: "easeInOut"
                }}
                style={{
                  left: '20px', // 탭 버튼 시작 위치
                  top: '40%', // 더 위로 이동
                  transform: 'translateY(-50%)'
                }}
              >
                {transportData[animatingTab as TransportType]?.icon}
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 메인 테이블 */}
            <div className="lg:col-span-2">
              <Card className="p-6 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg p-2">
                    <BarChart2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{currentData.title}</h3>
                    <p className="text-sm text-slate-500">매출 및 수익 현황</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto flex-1">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-slate-700 font-semibold text-lg">거래처</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-right text-lg">매출 (억원)</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-right text-lg">수익 (억원)</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-right text-lg">물량 (톤)</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-right text-lg">수익률 (%)</TableHead>
                        <TableHead className="text-slate-700 font-semibold text-center text-lg">트렌드</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.data.map((client, index) => {
                        // division 카드 스타일 적용용 색상(예시)
                        const colors = [
                          'bg-blue-50/80 border-blue-200 text-blue-900 border-l-blue-500',
                          'bg-slate-50/80 border-slate-200 text-slate-700 border-l-slate-500',
                          'bg-amber-50/80 border-amber-200 text-amber-800 border-l-amber-500',
                          'bg-green-50/80 border-green-200 text-green-800 border-l-green-500',
                          'bg-purple-50/80 border-purple-200 text-purple-800 border-l-purple-500',
                          'bg-orange-50/80 border-orange-200 text-orange-800 border-l-orange-500',
                        ];
                        const color = colors[index % colors.length];
                        return (
                          <TableRow
                            key={client.name}
                            className={`overflow-hidden backdrop-blur-sm border-l-4 ${color} transition-all duration-200 ${selectedClient === client.name ? 'ring-2 ring-blue-400 scale-[1.01]' : ''}`}
                            onClick={() => setSelectedClient(client.name)}
                            style={{ cursor: 'pointer' }}
                          >
                            {/* 거래처명 + 순위 */}
                            <TableCell className="py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                                <span className={`text-base font-semibold ${color.split(' ')[2]}`}>{client.name}</span>
                              </div>
                            </TableCell>
                            {/* 매출 */}
                            <TableCell className="text-center py-4">
                              <span className={`text-2xl font-bold ${color.split(' ')[2]}`}>{client.sales.toLocaleString()}</span>
                              <span className="text-xs text-slate-500 ml-1">억원</span>
                            </TableCell>
                            {/* 수익 */}
                            <TableCell className="text-center py-4">
                              <span className={`text-lg font-semibold text-green-700`}>{client.profit.toLocaleString()}</span>
                              <span className="text-xs text-slate-500 ml-1">억원</span>
                            </TableCell>
                            {/* 물량 */}
                            <TableCell className="text-center py-4">
                              <span className={`text-lg font-semibold text-purple-700`}>{client.volume.toLocaleString()}</span>
                              <span className="text-xs text-slate-500 ml-1">톤</span>
                            </TableCell>
                            {/* 수익률 */}
                            <TableCell className="text-center py-4">
                              <span className="text-base font-bold text-orange-600">{client.profitRatio}%</span>
                            </TableCell>
                            {/* 트렌드 */}
                            <TableCell className="text-center py-4">
                              <GrowthIndicator value={calculateGrowth(client.sales, client.comparison.prevMonth.sales)} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {/* 합계(총계) Row */}
                      <TableRow className="bg-slate-600 text-white border-l-4 border-l-blue-700">
                        <TableCell className="py-4 font-semibold">합 계</TableCell>
                        <TableCell className="text-center py-4 text-2xl font-bold">{currentData.data.reduce((sum, c) => sum + c.sales, 0).toLocaleString()}<span className="text-xs ml-1">억원</span></TableCell>
                        <TableCell className="text-center py-4 text-lg font-semibold">{currentData.data.reduce((sum, c) => sum + c.profit, 0).toLocaleString()}<span className="text-xs ml-1">억원</span></TableCell>
                        <TableCell className="text-center py-4 text-lg font-semibold">{currentData.data.reduce((sum, c) => sum + c.volume, 0).toLocaleString()}<span className="text-xs ml-1">톤</span></TableCell>
                        <TableCell className="text-center py-4 text-base font-bold text-orange-200">{(currentData.data.reduce((sum, c) => sum + c.profitRatio, 0) / currentData.data.length).toFixed(1)}%</TableCell>
                        <TableCell className="text-center py-4 text-blue-200">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>

            {/* 상세 정보 */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg p-2">
                    <LineChart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">상세 정보</h3>
                    <p className="text-sm text-slate-500">선택된 거래처 정보</p>
                  </div>
                </div>

                {selectedClient ? (
                  <div className="space-y-4">
                    {(() => {
                      const client = currentData.data.find(c => c.name === selectedClient);
                      if (!client) return null;

                      return (
                        <>
                          <div className="text-center">
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">{client.name}</h4>
                            <p className="text-slate-600 mb-4">{client.mainItems}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                              <div className="text-sm text-blue-600 font-medium">매출</div>
                              <div className="text-2xl font-bold text-blue-800">{client.sales.toLocaleString()}억원</div>
                              <GrowthIndicator 
                                value={calculateGrowth(
                                  client.sales, 
                                  client.comparison.prevMonth.sales
                                )} 
                              />
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                              <div className="text-sm text-green-600 font-medium">수익</div>
                              <div className="text-2xl font-bold text-green-800">{client.profit.toLocaleString()}억원</div>
                              <GrowthIndicator 
                                value={calculateGrowth(
                                  client.profit, 
                                  client.comparison.prevMonth.profit
                                )} 
                              />
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                              <div className="text-sm text-purple-600 font-medium">물량</div>
                              <div className="text-2xl font-bold text-purple-800">{client.volume.toLocaleString()}톤</div>
                              <GrowthIndicator 
                                value={calculateGrowth(
                                  client.volume, 
                                  client.comparison.prevMonth.volume
                                )} 
                              />
                            </div>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                              <div className="text-sm text-orange-600 font-medium">수익률</div>
                              <div className="text-2xl font-bold text-orange-800">{client.profitRatio}%</div>
                              <GrowthIndicator 
                                value={calculateGrowth(
                                  client.profitRatio, 
                                  client.comparison.prevMonth.profitRatio
                                )} 
                              />
                            </div>
                          </div>

                          {/* 월별 차트 */}
                          {showCharts && (
                            <div className="mt-6">
                              <h5 className="text-lg font-semibold text-slate-800 mb-3">
                                {selectedClient ? '월별 추이' : '상위 5개 거래처 월별 추이'}
                              </h5>
                              <div className="h-48">
                                <Chart
                                  type="line"
                                  data={chartData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                      legend: {
                                        display: true,
                                        position: 'top',
                                        labels: {
                                          usePointStyle: true,
                                          padding: 20,
                                          color: '#475569',
                                          font: {
                                            weight: 600
                                          }
                                        }
                                      },
                                      tooltip: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        titleColor: '#1e293b',
                                        bodyColor: '#1e293b',
                                        borderColor: '#e2e8f0',
                                        borderWidth: 1,
                                        cornerRadius: 8
                                      }
                                    },
                                    scales: {
                                      x: {
                                        grid: {
                                          display: false
                                        },
                                        ticks: {
                                          color: '#64748b',
                                          font: {
                                            weight: 500
                                          }
                                        }
                                      },
                                      y: {
                                        grid: {
                                          color: '#f1f5f9'
                                        },
                                        ticks: {
                                          color: '#64748b',
                                          font: {
                                            weight: 500
                                          }
                                        }
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(() => {
                      // 탑5개 거래처의 합계 계산
                      const top5Data = currentData.data.slice(0, 5);
                      const totalSales = top5Data.reduce((sum, client) => sum + client.sales, 0);
                      const totalProfit = top5Data.reduce((sum, client) => sum + client.profit, 0);
                      const totalVolume = top5Data.reduce((sum, client) => sum + client.volume, 0);
                      const avgProfitRatio = top5Data.reduce((sum, client) => sum + client.profitRatio, 0) / top5Data.length;

                      return (
                        <>
                          <div className="text-center">
                            <h4 className="text-2xl font-bold text-slate-800 mb-2">탑 5 거래처 합계</h4>
                            <p className="text-slate-600 mb-4">상위 5개 거래처 통합 정보</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                              <div className="text-sm text-blue-600 font-medium">총 매출</div>
                              {isInitialLoad ? (
                                <CountUpAnimation 
                                  end={totalSales} 
                                  suffix="억원"
                                  className="text-2xl font-bold text-blue-800"
                                />
                              ) : (
                                <div className="text-2xl font-bold text-blue-800">{totalSales.toLocaleString()}억원</div>
                              )}
                              <div className="text-xs text-blue-600 mt-1">상위 5개 합계</div>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                              <div className="text-sm text-green-600 font-medium">총 수익</div>
                              {isInitialLoad ? (
                                <CountUpAnimation 
                                  end={totalProfit} 
                                  suffix="억원"
                                  className="text-2xl font-bold text-green-800"
                                />
                              ) : (
                                <div className="text-2xl font-bold text-green-800">{totalProfit.toLocaleString()}억원</div>
                              )}
                              <div className="text-xs text-green-600 mt-1">상위 5개 합계</div>
                            </div>
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                              <div className="text-sm text-purple-600 font-medium">총 물량</div>
                              {isInitialLoad ? (
                                <CountUpAnimation 
                                  end={totalVolume} 
                                  suffix="톤"
                                  className="text-2xl font-bold text-purple-800"
                                />
                              ) : (
                                <div className="text-2xl font-bold text-purple-800">{totalVolume.toLocaleString()}톤</div>
                              )}
                              <div className="text-xs text-purple-600 mt-1">상위 5개 합계</div>
                            </div>
                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                              <div className="text-sm text-orange-600 font-medium">평균 수익률</div>
                              {isInitialLoad ? (
                                <CountUpAnimation 
                                  end={avgProfitRatio} 
                                  suffix="%"
                                  className="text-2xl font-bold text-orange-800"
                                />
                              ) : (
                                <div className="text-2xl font-bold text-orange-800">{avgProfitRatio.toFixed(1)}%</div>
                              )}
                              <div className="text-xs text-orange-600 mt-1">상위 5개 평균</div>
                            </div>
                          </div>

                          {/* 월별 차트 */}
                          {showCharts && (
                            <div className="mt-6">
                              <h5 className="text-lg font-semibold text-slate-800 mb-3">상위 5개 거래처 월별 추이</h5>
                              <div className="h-48">
                                <Chart
                                  type="line"
                                  data={chartData}
                                  options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                      legend: {
                                        display: true,
                                        position: 'top',
                                        labels: {
                                          usePointStyle: true,
                                          padding: 20,
                                          color: '#475569',
                                          font: {
                                            weight: 600
                                          }
                                        }
                                      },
                                      tooltip: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        titleColor: '#1e293b',
                                        bodyColor: '#1e293b',
                                        borderColor: '#e2e8f0',
                                        borderWidth: 1,
                                        cornerRadius: 8
                                      }
                                    },
                                    scales: {
                                      x: {
                                        grid: {
                                          display: false
                                        },
                                        ticks: {
                                          color: '#64748b',
                                          font: {
                                            weight: 500
                                          }
                                        }
                                      },
                                      y: {
                                        grid: {
                                          color: '#f1f5f9'
                                        },
                                        ticks: {
                                          color: '#64748b',
                                          font: {
                                            weight: 500
                                          }
                                        }
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>


      </div>
    );
  }

  return (
    <AuthGuard>
      <TopClientsPageContent />
    </AuthGuard>
  );
} 