'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Building2, 
  Globe, 
  Home,
  DollarSign,
  Users,
  Package,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Calculator,
  Target,
  PieChart,
  BarChart,
  Layers
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  annotationPlugin
);

export default function PerformanceDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('tab1');

  const randomStats = useMemo(() => ({
    hqRevenue: Math.floor(Math.random() * 1000 + 2000),
    domesticRevenue: Math.floor(Math.random() * 800 + 1500),
    overseasRevenue: Math.floor(Math.random() * 600 + 800),
    hqCost: Math.floor(Math.random() * 700 + 1000),
    domesticCost: Math.floor(Math.random() * 500 + 800),
    overseasCost: Math.floor(Math.random() * 400 + 500),
  }), []);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Activity className="w-3 h-3 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  // 탭 1: 도넛 차트형
  const Tab1DonutChart = () => {
    const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
    const totalProfit = (randomStats.hqRevenue - randomStats.hqCost) + (randomStats.domesticRevenue - randomStats.domesticCost) + (randomStats.overseasRevenue - randomStats.overseasCost);
    
    const chartData = {
      labels: ['본사', '국내', '해외'],
      datasets: [{
        data: [randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue],
        backgroundColor: ['#06b6d4', '#10b981', '#f97316'],
        borderWidth: 0,
        cutout: '70%'
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">₩{totalRevenue.toLocaleString()}억</div>
          <div className="text-slate-300 mb-4">전체 매출</div>
          <div className="text-2xl font-bold text-emerald-400">₩{totalProfit.toLocaleString()}억</div>
          <div className="text-emerald-300">전체 영업이익</div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-80 h-80">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">매출</div>
                <div className="text-lg text-slate-300">분석</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-4 h-4 bg-cyan-400 rounded-full mx-auto mb-2"></div>
            <div className="text-white font-semibold">본사</div>
            <div className="text-cyan-400 font-bold">₩{randomStats.hqRevenue.toLocaleString()}억</div>
            <div className="text-emerald-400 text-sm">₩{(randomStats.hqRevenue - randomStats.hqCost).toLocaleString()}억</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-emerald-400 rounded-full mx-auto mb-2"></div>
            <div className="text-white font-semibold">국내</div>
            <div className="text-emerald-400 font-bold">₩{randomStats.domesticRevenue.toLocaleString()}억</div>
            <div className="text-emerald-400 text-sm">₩{(randomStats.domesticRevenue - randomStats.domesticCost).toLocaleString()}억</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-orange-400 rounded-full mx-auto mb-2"></div>
            <div className="text-white font-semibold">해외</div>
            <div className="text-orange-400 font-bold">₩{randomStats.overseasRevenue.toLocaleString()}억</div>
            <div className="text-emerald-400 text-sm">₩{(randomStats.overseasRevenue - randomStats.overseasCost).toLocaleString()}억</div>
          </div>
        </div>
      </div>
    );
  };

  // 탭 2: 스택 바 차트형
  const Tab2BarChart = () => {
    const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
    const totalProfit = (randomStats.hqRevenue - randomStats.hqCost) + (randomStats.domesticRevenue - randomStats.domesticCost) + (randomStats.overseasRevenue - randomStats.overseasCost);
    
    const chartData = {
      labels: ['전체 매출', '전체 영업이익'],
      datasets: [
        {
          label: '본사',
          data: [randomStats.hqRevenue, randomStats.hqRevenue - randomStats.hqCost],
          backgroundColor: '#06b6d4',
          borderRadius: 8,
        },
        {
          label: '국내',
          data: [randomStats.domesticRevenue, randomStats.domesticRevenue - randomStats.domesticCost],
          backgroundColor: '#10b981',
          borderRadius: 8,
        },
        {
          label: '해외',
          data: [randomStats.overseasRevenue, randomStats.overseasRevenue - randomStats.overseasCost],
          backgroundColor: '#f97316',
          borderRadius: 8,
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#e2e8f0',
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#e2e8f0'
          },
          grid: {
            color: '#374151'
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#e2e8f0'
          },
          grid: {
            color: '#374151'
          }
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-8 border border-slate-600/30 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-8">
            {/* 전체 매출 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300 text-lg font-medium">전체 매출</span>
              </div>
              <div className="text-5xl font-black text-white mb-2">₩{totalRevenue.toLocaleString()}억</div>
              <div className="text-slate-400 text-sm">Revenue</div>
            </div>
            
            {/* 구분선 */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-slate-600"></div>
            
            {/* 전체 영업이익 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <span className="text-slate-300 text-lg font-medium">전체 영업이익</span>
              </div>
              <div className="text-5xl font-black text-emerald-400 mb-2">₩{totalProfit.toLocaleString()}억</div>
              <div className="text-slate-400 text-sm">Operating Profit</div>
            </div>
          </div>
          
          {/* 수익률 표시 */}
          <div className="mt-6 pt-6 border-t border-slate-600/30">
            <div className="text-center">
              <div className="text-slate-400 text-sm mb-1">수익률</div>
              <div className="text-2xl font-bold text-emerald-400">{(totalProfit / totalRevenue * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* 범례 정보 */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span className="text-white font-semibold">본사</span>
            </div>
            <div className="text-cyan-400 font-bold">₩{randomStats.hqRevenue.toLocaleString()}억</div>
            <div className="text-emerald-400 text-sm">₩{(randomStats.hqRevenue - randomStats.hqCost).toLocaleString()}억</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span className="text-white font-semibold">국내</span>
            </div>
            <div className="text-emerald-400 font-bold">₩{randomStats.domesticRevenue.toLocaleString()}억</div>
            <div className="text-emerald-400 text-sm">₩{(randomStats.domesticRevenue - randomStats.domesticCost).toLocaleString()}억</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span className="text-white font-semibold">해외</span>
            </div>
            <div className="text-orange-400 font-bold">₩{randomStats.overseasRevenue.toLocaleString()}억</div>
            <div className="text-emerald-400 text-sm">₩{(randomStats.overseasRevenue - randomStats.overseasCost).toLocaleString()}억</div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'tab1', name: '도넛차트', icon: PieChart, component: Tab1DonutChart },
    { id: 'tab2', name: '바차트', icon: BarChart3, component: Tab2BarChart },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800">
      <div className="relative z-10 p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <p className="text-blue-200 text-3xl font-bold mb-1">실시간 성과 대시보드</p>
              <p className="text-blue-200 text-2xl font-semibold">매출 • 영업이익 분석</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="text-white font-mono text-lg">
                  {currentTime.toLocaleTimeString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-white/10 text-slate-300 border border-white/10 hover:bg-white/15'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
            {tabs.find(tab => tab.id === activeTab)?.component()}
          </div>
        </div>
      </div>
    </div>
  );
}