'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Building2, TrendingUp, Package, DollarSign, BarChart2, ArrowUpRight, Plane, Ship, Truck, Train, ArrowDownRight, Minus, Trophy, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

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
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        active 
          ? 'bg-blue-100 text-blue-700 font-medium' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
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
  const [showCharts, setShowCharts] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TransportType>('항공수출');
  const [selectedClient, setSelectedClient] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 500);

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
      icon: <Train className="w-12 h-12 text-rose-600" />,
      color: 'rose',
      data: [
        { name: "코레일", sales: 420, profit: 63, volume: 1800, profitRatio: 15.0, trend: "증가", mainItems: "컨테이너", comparison: { prevMonth: { sales: 415, profit: 62, volume: 1790, profitRatio: 14.9 }, prevYear: { sales: 410, profit: 61, volume: 1780, profitRatio: 14.8 } }, monthlyData: { sales: [415, 62, 1790, 14.9], profit: [62, 14.9], profitRatio: [14.9] } },
        { name: "현대글로비스", sales: 380, profit: 57, volume: 1600, profitRatio: 15.0, trend: "유지", mainItems: "자동차", comparison: { prevMonth: { sales: 375, profit: 56, volume: 1590, profitRatio: 14.9 }, prevYear: { sales: 370, profit: 55, volume: 1580, profitRatio: 14.8 } }, monthlyData: { sales: [375, 56, 1590, 14.9], profit: [56, 14.9], profitRatio: [14.9] } },
        { name: "CJ대한통운", sales: 350, profit: 52, volume: 1500, profitRatio: 14.9, trend: "증가", mainItems: "복합운송", comparison: { prevMonth: { sales: 345, profit: 51, volume: 1490, profitRatio: 14.8 }, prevYear: { sales: 340, profit: 50, volume: 1480, profitRatio: 14.7 } }, monthlyData: { sales: [345, 51, 1490, 14.8], profit: [51, 14.8], profitRatio: [14.8] } },
        { name: "한진", sales: 320, profit: 48, volume: 1400, profitRatio: 15.0, trend: "유지", mainItems: "컨테이너", comparison: { prevMonth: { sales: 315, profit: 47, volume: 1390, profitRatio: 14.9 }, prevYear: { sales: 310, profit: 46, volume: 1380, profitRatio: 14.8 } }, monthlyData: { sales: [315, 47, 1390, 14.9], profit: [47, 14.9], profitRatio: [14.9] } },
        { name: "롯데로지스틱스", sales: 300, profit: 45, volume: 1300, profitRatio: 15.0, trend: "감소", mainItems: "복합운송", comparison: { prevMonth: { sales: 295, profit: 44, volume: 1290, profitRatio: 14.8 }, prevYear: { sales: 290, profit: 43, volume: 1280, profitRatio: 14.7 } }, monthlyData: { sales: [295, 44, 1290, 14.8], profit: [44, 14.8], profitRatio: [14.8] } }
      ]
    }
  };

  // 증감률 계산 함수 추가
  function calculateGrowth(current: number, previous: number): number {
    return ((current - previous) / previous) * 100;
  }

  // 증감률 표시 컴포넌트 추가
  function GrowthIndicator({ value }: { value: number }) {
    const color = value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600';
    const icon = value > 0 ? <ArrowUpRight className="w-4 h-4" /> : value < 0 ? <ArrowDownRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />;
    
    return (
      <div className={`flex items-center ${color}`}>
        {icon}
        <span className="ml-1">{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  }

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          font: {
            size: 13,
            weight: 500
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        titleFont: {
          size: 14,
          weight: 600
        },
        bodyColor: '#475569',
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.dataset.label === '이익률' 
                ? context.parsed.y.toFixed(1) + '%'
                : context.parsed.y.toLocaleString() + '억원';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 13,
            weight: 500
          },
          padding: 8
        },
        border: {
          display: false
        }
      },
      y: {
        position: 'left' as const,
        grid: {
          color: 'rgba(226, 232, 240, 0.6)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 13
          },
          padding: 8,
          callback: function(value: any) {
            return value.toLocaleString() + '억원';
          }
        },
        border: {
          display: false
        }
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          font: {
            size: 13
          },
          padding: 8,
          callback: function(value: any) {
            return value.toFixed(1) + '%';
          }
        },
        border: {
          display: false
        }
      }
    }
  } as const;

  // 선택된 탭의 데이터로 차트 데이터 생성
  const selectedData = transportData[selectedTab];
  const monthlyData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출액',
        data: [4200, 4500, 4800, 4300, 4480],
        backgroundColor: function(context: any) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          if (selectedTab === '항공수출' || selectedTab === '항공수입') {
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0.7)');
          } else if (selectedTab === '해상수출' || selectedTab === '해상수입') {
            gradient.addColorStop(0, 'rgba(5, 150, 105, 0.2)');
            gradient.addColorStop(1, 'rgba(5, 150, 105, 0.7)');
          } else if (selectedTab === '운송') {
            gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
            gradient.addColorStop(1, 'rgba(245, 158, 11, 0.7)');
          } else {
            gradient.addColorStop(0, 'rgba(225, 29, 72, 0.2)');
            gradient.addColorStop(1, 'rgba(225, 29, 72, 0.7)');
          }
          return gradient;
        },
        borderRadius: 4,
        borderSkipped: false,
        barThickness: 24,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '이익률',
        data: [13.5, 14.2, 14.8, 13.9, 14.1],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2.5,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(239, 68, 68)',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true,
        yAxisID: 'y1'
      }
    ]
  };

  // 차트 데이터 생성 함수 수정
  const getChartData = (selectedClient: string | null) => {
    const monthLabels = ['1월', '2월', '3월', '4월', '5월'];
    
    if (!selectedClient) {
      // 전체 데이터 (기존 로직)
      return {
        labels: monthLabels,
        datasets: [
          {
            type: 'bar' as const,
            label: '매출액',
            data: [4200, 4500, 4800, 4300, 4480],
            backgroundColor: function(context: any) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) {
                return null;
              }
              const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              if (selectedTab === '항공수출' || selectedTab === '항공수입') {
                gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
                gradient.addColorStop(1, 'rgba(37, 99, 235, 0.7)');
              } else if (selectedTab === '해상수출' || selectedTab === '해상수입') {
                gradient.addColorStop(0, 'rgba(5, 150, 105, 0.2)');
                gradient.addColorStop(1, 'rgba(5, 150, 105, 0.7)');
              } else if (selectedTab === '운송') {
                gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
                gradient.addColorStop(1, 'rgba(245, 158, 11, 0.7)');
              } else {
                gradient.addColorStop(0, 'rgba(225, 29, 72, 0.2)');
                gradient.addColorStop(1, 'rgba(225, 29, 72, 0.7)');
              }
              return gradient;
            },
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 24,
            yAxisID: 'y'
          },
          {
            type: 'line' as const,
            label: '이익률',
            data: [13.5, 14.2, 14.8, 13.9, 14.1],
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2.5,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: 'white',
            pointBorderColor: 'rgb(239, 68, 68)',
            pointBorderWidth: 2,
            tension: 0.3,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      };
    }

    // 선택된 거래처의 데이터
    const clientData = transportData[selectedTab].data.find(c => c.name === selectedClient);
    if (!clientData) {
      return {
        labels: monthLabels,
        datasets: []
      };
    }

    return {
      labels: monthLabels,
      datasets: [
        {
          type: 'bar' as const,
          label: '매출액',
          data: clientData.monthlyData.sales,
          backgroundColor: function(context: any) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) {
              return null;
            }
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0.7)');
            return gradient;
          },
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 24,
          yAxisID: 'y'
        },
        {
          type: 'bar' as const,
          label: '영업이익',
          data: clientData.monthlyData.profit,
          backgroundColor: function(context: any) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) {
              return null;
            }
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(5, 150, 105, 0.2)');
            gradient.addColorStop(1, 'rgba(5, 150, 105, 0.7)');
            return gradient;
          },
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 24,
          yAxisID: 'y'
        },
        {
          type: 'line' as const,
          label: '이익률',
          data: clientData.monthlyData.profitRatio,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2.5,
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: 'white',
          pointBorderColor: 'rgb(239, 68, 68)',
          pointBorderWidth: 2,
          tension: 0.3,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      {/* 전체 레이아웃 컨테이너 */}
      <div className="flex flex-col gap-6">
        {/* 탭 메뉴 */}
        <div className="flex flex-wrap gap-2">
          <TabButton
            active={selectedTab === '항공수출'}
            onClick={() => setSelectedTab('항공수출')}
            icon={<Plane className="w-5 h-5" />}
            label="항공수출"
          />
          <TabButton
            active={selectedTab === '항공수입'}
            onClick={() => setSelectedTab('항공수입')}
            icon={<Plane className="w-5 h-5 rotate-180" />}
            label="항공수입"
          />
          <TabButton
            active={selectedTab === '해상수출'}
            onClick={() => setSelectedTab('해상수출')}
            icon={<Ship className="w-5 h-5" />}
            label="해상수출"
          />
          <TabButton
            active={selectedTab === '해상수입'}
            onClick={() => setSelectedTab('해상수입')}
            icon={<Ship className="w-5 h-5 rotate-180" />}
            label="해상수입"
          />
          <TabButton
            active={selectedTab === '운송'}
            onClick={() => setSelectedTab('운송')}
            icon={<Truck className="w-5 h-5" />}
            label="운송"
          />
          <TabButton
            active={selectedTab === '철도'}
            onClick={() => setSelectedTab('철도')}
            icon={<Train className="w-5 h-5" />}
            label="철도"
          />
        </div>

        {/* 상단 컴포넌트들 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 거래처 목록 */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="p-4 h-[514px] flex flex-col bg-gradient-to-br from-slate-50 to-white overflow-hidden">
                <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center shrink-0">
                  <Trophy className="w-4 h-4 text-amber-500 mr-2" />
                  {selectedTab} TOP 5 거래처
                </h3>
                <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto">
                  {transportData[selectedTab].data.map((client, index) => (
                    <div 
                      key={index}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer border shrink-0 ${
                        selectedClient === client.name 
                          ? 'bg-blue-50/80 border-blue-200 shadow-sm' 
                          : 'bg-white/50 border-slate-100 hover:bg-blue-50/30 hover:border-blue-100'
                      }`}
                      onClick={() => setSelectedClient(client.name)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                            ${index === 0 ? 'bg-amber-100 text-amber-700' :
                              index === 1 ? 'bg-slate-100 text-slate-700' :
                              index === 2 ? 'bg-orange-100/70 text-orange-700' :
                              'bg-slate-50 text-slate-600'}`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-sm font-semibold text-slate-700 truncate">{client.name}</span>
                        </div>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 ml-2">{client.mainItems}</span>
                      </div>
                      <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5 shrink-0">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full transition-all
                            ${selectedClient === client.name ? 'bg-blue-500' : 'bg-blue-400'}`}
                          style={{ 
                            width: `${(client.sales / transportData[selectedTab].data[0].sales) * 100}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1 shrink-0">
                          <span className="text-sm font-bold text-slate-800">
                            {client.sales.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500">억원</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center bg-slate-50 rounded-full px-1.5 py-0.5">
                            <span className="text-xs font-medium text-slate-600 mr-0.5">MoM</span>
                            <GrowthIndicator 
                              value={calculateGrowth(client.sales, client.comparison.prevMonth.sales)} 
                            />
                          </div>
                          <div className="flex items-center bg-slate-50 rounded-full px-1.5 py-0.5">
                            <span className="text-xs font-medium text-slate-600 mr-0.5">YoY</span>
                            <GrowthIndicator 
                              value={calculateGrowth(client.sales, client.comparison.prevYear.sales)} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* 실적 추이 차트 */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="p-4 h-[514px] flex flex-col bg-gradient-to-br from-slate-50 to-white overflow-hidden">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-base font-bold text-slate-800 flex items-center">
                    <LineChart className="w-4 h-4 text-blue-500 mr-2 shrink-0" />
                    <span className="truncate">{selectedClient ? `${selectedClient} 월별 실적 추이` : `${selectedTab} 전체 실적 추이`}</span>
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">단위: 억원</span>
                    {selectedClient && (
                      <button
                        onClick={() => setSelectedClient('')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap"
                      >
                        전체보기
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  {showCharts && (
                    <Chart type="bar" data={getChartData(selectedClient)} options={chartOptions} />
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* 선택된 거래처 상세 정보 */}
        <motion.div 
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="p-4 h-[200px] bg-gradient-to-br from-slate-50 to-white overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center">
                <Building2 className="w-4 h-4 text-purple-500 mr-2" />
                {selectedClient ? `${selectedClient} 상세 정보` : `${selectedTab} TOP 5 합계`}
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-3 h-[140px]">
              <div className="bg-white/70 rounded-xl p-3 flex flex-col justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">매출이익</span>
                <div>
                  <div className="text-base font-bold text-slate-800 mb-1">
                    {selectedClient 
                      ? transportData[selectedTab].data.find(c => c.name === selectedClient)?.profit.toLocaleString()
                      : transportData[selectedTab].data.reduce((sum, client) => sum + client.profit, 0).toLocaleString()}
                    <span className="text-xs font-medium text-slate-600 ml-1">억원</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[10px] font-medium text-slate-500 mr-1">전년 대비</span>
                    <GrowthIndicator 
                      value={calculateGrowth(
                        selectedClient
                          ? (transportData[selectedTab].data.find(c => c.name === selectedClient)?.profit || 0)
                          : transportData[selectedTab].data.reduce((sum, client) => sum + client.profit, 0),
                        selectedClient
                          ? (transportData[selectedTab].data.find(c => c.name === selectedClient)?.comparison.prevYear.profit || 0)
                          : transportData[selectedTab].data.reduce((sum, client) => sum + client.comparison.prevYear.profit, 0)
                      )} 
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white/70 rounded-xl p-3 flex flex-col justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">물동량</span>
                <div>
                  <div className="text-base font-bold text-slate-800 mb-1">
                    {selectedClient
                      ? transportData[selectedTab].data.find(c => c.name === selectedClient)?.volume.toLocaleString()
                      : transportData[selectedTab].data.reduce((sum, client) => sum + client.volume, 0).toLocaleString()}
                    <span className="text-xs font-medium text-slate-600 ml-1">TEU</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[10px] font-medium text-slate-500 mr-1">전년 대비</span>
                    <GrowthIndicator 
                      value={calculateGrowth(
                        selectedClient
                          ? (transportData[selectedTab].data.find(c => c.name === selectedClient)?.volume || 0)
                          : transportData[selectedTab].data.reduce((sum, client) => sum + client.volume, 0),
                        selectedClient
                          ? (transportData[selectedTab].data.find(c => c.name === selectedClient)?.comparison.prevYear.volume || 0)
                          : transportData[selectedTab].data.reduce((sum, client) => sum + client.comparison.prevYear.volume, 0)
                      )} 
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white/70 rounded-xl p-3 flex flex-col justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">이익률</span>
                <div>
                  <div className="text-base font-bold text-slate-800 mb-1">
                    {selectedClient
                      ? transportData[selectedTab].data.find(c => c.name === selectedClient)?.profitRatio.toFixed(1)
                      : (transportData[selectedTab].data.reduce((sum, client) => sum + (client.profit), 0) / 
                         transportData[selectedTab].data.reduce((sum, client) => sum + (client.sales), 0) * 100).toFixed(1)}
                    <span className="text-xs font-medium text-slate-600 ml-1">%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[10px] font-medium text-slate-500 mr-1">전년 대비</span>
                    <GrowthIndicator 
                      value={calculateGrowth(
                        selectedClient
                          ? (transportData[selectedTab].data.find(c => c.name === selectedClient)?.profitRatio || 0)
                          : (transportData[selectedTab].data.reduce((sum, client) => sum + (client.profit), 0) / 
                             transportData[selectedTab].data.reduce((sum, client) => sum + (client.sales), 0) * 100),
                        selectedClient
                          ? (transportData[selectedTab].data.find(c => c.name === selectedClient)?.comparison.prevYear.profitRatio || 0)
                          : (transportData[selectedTab].data.reduce((sum, client) => sum + client.comparison.prevYear.profit, 0) / 
                             transportData[selectedTab].data.reduce((sum, client) => sum + client.comparison.prevYear.sales, 0) * 100)
                      )} 
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white/70 rounded-xl p-3 flex flex-col justify-between border border-slate-100">
                <span className="text-xs font-medium text-slate-600">주요 품목</span>
                <div className="flex flex-wrap gap-1 overflow-y-auto">
                  {selectedClient
                    ? transportData[selectedTab].data.find(c => c.name === selectedClient)?.mainItems.split(',').map((item, index) => (
                        <span key={index} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.trim()}
                        </span>
                      ))
                    : Array.from(new Set(transportData[selectedTab].data.flatMap(client => 
                        client.mainItems.split(',').map(item => item.trim())
                      ))).map((item, index) => (
                        <span key={index} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item}
                        </span>
                      ))
                  }
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 