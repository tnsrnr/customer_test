'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  DollarSign,
  BarChart3,
  TrendingUp,
  Target,
  PieChart,
  LineChart,
  Calendar,
  Building2,
  Globe,
  MapPin,
  Users,
  Activity,
  Zap,
  Brain,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus
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
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// 매출 개요 컴포넌트
const RevenueOverview = ({ randomStats, analysisType }: { randomStats: any; analysisType: string }) => {
    const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
    const totalProfit = (randomStats.hqRevenue - randomStats.hqCost) + (randomStats.domesticRevenue - randomStats.domesticCost) + (randomStats.overseasRevenue - randomStats.overseasCost);
  
  const isRevenue = analysisType === 'revenue';
  const totalValue = isRevenue ? totalRevenue : totalProfit;
  const title = isRevenue ? '매출' : '영업이익';
    
  const pieData = useMemo(() => ({
      labels: ['본사', '국내', '해외'],
      datasets: [{
      data: isRevenue 
        ? [randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue]
        : [randomStats.hqRevenue - randomStats.hqCost, randomStats.domesticRevenue - randomStats.domesticCost, randomStats.overseasRevenue - randomStats.overseasCost],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderWidth: 0,
      cutout: '60%'
    }]
  }), [randomStats, isRevenue]);

  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          font: { size: 16, weight: 'bold' as const }
        }
      }
    }
  }), []);

  // 12개월 추이 데이터 생성
  const monthlyTrendData = useMemo(() => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    // 각 지역별 12개월 데이터 생성 (현재 데이터를 기준으로 변동)
    const hqData = months.map((_, index) => {
      const baseValue = isRevenue ? randomStats.hqRevenue : (randomStats.hqRevenue - randomStats.hqCost);
      const variation = (Math.random() - 0.5) * 0.3; // ±15% 변동
      return Math.round(baseValue * (1 + variation));
    });
    
    const domesticData = months.map((_, index) => {
      const baseValue = isRevenue ? randomStats.domesticRevenue : (randomStats.domesticRevenue - randomStats.domesticCost);
      const variation = (Math.random() - 0.5) * 0.3;
      return Math.round(baseValue * (1 + variation));
    });
    
    const overseasData = months.map((_, index) => {
      const baseValue = isRevenue ? randomStats.overseasRevenue : (randomStats.overseasRevenue - randomStats.overseasCost);
      const variation = (Math.random() - 0.5) * 0.3;
      return Math.round(baseValue * (1 + variation));
    });

    return {
      labels: months,
      datasets: [
        {
          label: '본사',
          data: hqData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: '국내',
          data: domesticData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: '해외',
          data: overseasData,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };
  }, [randomStats, isRevenue]);

  const lineOptions = useMemo(() => ({
      responsive: true,
      maintainAspectRatio: false,
    animation: { duration: 0 },
      plugins: {
        legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          font: { size: 14, weight: 'bold' as const },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 12, weight: 'normal' as const }
        },
        grid: { color: '#374151', drawBorder: false }
      },
      y: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 12, weight: 'normal' as const },
          callback: function(value: any) {
            return value + '억';
          }
        },
        grid: { color: '#374151', drawBorder: false }
      }
    }
  }), []);

    return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{totalValue.toLocaleString()}억</div>
            <div className="text-slate-300 text-sm">총 {title}</div>
              </div>
            </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {isRevenue ? randomStats.hqRevenue.toLocaleString() : (randomStats.hqRevenue - randomStats.hqCost).toLocaleString()}억
            </div>
            <div className="text-slate-300 text-sm">본사 {title}</div>
          </div>
              </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {isRevenue ? randomStats.domesticRevenue.toLocaleString() : (randomStats.domesticRevenue - randomStats.domesticCost).toLocaleString()}억
            </div>
            <div className="text-slate-300 text-sm">국내 {title}</div>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {isRevenue ? randomStats.overseasRevenue.toLocaleString() : (randomStats.overseasRevenue - randomStats.overseasCost).toLocaleString()}억
            </div>
            <div className="text-slate-300 text-sm">해외 {title}</div>
          </div>
        </div>
      </div>

      {/* 비중 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-2 border border-slate-600">
          <div className="h-56">
            <Doughnut data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 text-center">지역별 {title} 12개월 추이</h3>
          <div className="h-64">
            <Line data={monthlyTrendData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

// 매출 대시보드 컴포넌트 (3열 그리드 + 하단 세부 정보)
const RevenueDashboard = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-6">
      {/* 핵심 KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-500/50">
          <div className="mb-3">
            <p className="text-blue-300 text-sm font-medium mb-1">총 매출</p>
            <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()}억</p>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <p className="text-blue-200 mb-1">본사</p>
              <p className="text-white font-semibold">{randomStats.hqRevenue.toLocaleString()}억</p>
              </div>
            <div className="text-center">
              <p className="text-blue-200 mb-1">국내</p>
              <p className="text-white font-semibold">{randomStats.domesticRevenue.toLocaleString()}억</p>
            </div>
            <div className="text-center">
              <p className="text-blue-200 mb-1">해외</p>
              <p className="text-white font-semibold">{randomStats.overseasRevenue.toLocaleString()}억</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-500/50">
          <div className="mb-3">
            <p className="text-green-300 text-sm font-medium mb-1">전년대비</p>
            <p className="text-2xl font-bold text-white">+{randomStats.yearOverYearGrowth}%</p>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <p className="text-green-200 mb-1">본사</p>
              <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
            </div>
                  <div className="text-center">
              <p className="text-green-200 mb-1">국내</p>
              <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
                  </div>
            <div className="text-center">
              <p className="text-green-200 mb-1">해외</p>
              <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
                </div>
              </div>
            </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/50">
          <div className="mb-3">
            <p className="text-purple-300 text-sm font-medium mb-1">전월대비</p>
            <p className="text-2xl font-bold text-white">+{randomStats.monthOverMonthGrowth}%</p>
          </div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <p className="text-purple-200 mb-1">본사</p>
              <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-purple-200 mb-1">국내</p>
              <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
                  </div>
            <div className="text-center">
              <p className="text-purple-200 mb-1">해외</p>
              <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
                  </div>
                </div>
                </div>
              </div>

      {/* 매출 구성 및 추이 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-white mb-3">매출 구성 비율</h3>
          <div className="h-56">
            <Doughnut data={{
              labels: ['본사', '국내', '해외'],
              datasets: [{
                data: [randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderWidth: 0,
                cutout: '60%'
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 0 },
              plugins: {
                legend: {
                  position: 'bottom' as const,
                  labels: {
                    color: '#e2e8f0',
                    font: { size: 14, weight: 'bold' as const }
                  }
                }
              }
            }} />
                </div>
              </div>

        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-white mb-3">월별 매출 추이</h3>
          <div className="h-56">
            <Line data={{
              labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
              datasets: [{
                label: '총 매출',
                data: [totalRevenue * 0.8, totalRevenue * 0.9, totalRevenue * 1.1, totalRevenue * 0.95, totalRevenue * 1.05, totalRevenue],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
              }]
            }} options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 0 },
              plugins: {
                legend: {
                  labels: {
                    color: '#e2e8f0',
                    font: { size: 12, weight: 'bold' as const }
                  }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#e2e8f0', font: { size: 12 } },
                  grid: { color: '#374151' }
                },
                y: {
                  ticks: { 
                    color: '#e2e8f0', 
                    font: { size: 12 },
                    callback: function(value: any) { return value + '억'; }
                  },
                  grid: { color: '#374151' }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* 12개월 상세 추이 - 추가 섹션 */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3">12개월 상세 추이 분석</h3>
        <div className="h-40">
          <Line data={{
            labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      datasets: [
        {
          label: '본사',
                data: [randomStats.hqRevenue * 0.8, randomStats.hqRevenue * 0.9, randomStats.hqRevenue * 1.1, randomStats.hqRevenue * 0.95, randomStats.hqRevenue * 1.05, randomStats.hqRevenue, randomStats.hqRevenue * 1.1, randomStats.hqRevenue * 0.9, randomStats.hqRevenue * 1.2, randomStats.hqRevenue * 0.85, randomStats.hqRevenue * 1.15, randomStats.hqRevenue],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
        },
        {
          label: '국내',
                data: [randomStats.domesticRevenue * 0.9, randomStats.domesticRevenue * 1.1, randomStats.domesticRevenue * 0.8, randomStats.domesticRevenue * 1.2, randomStats.domesticRevenue * 0.95, randomStats.domesticRevenue, randomStats.domesticRevenue * 1.05, randomStats.domesticRevenue * 0.85, randomStats.domesticRevenue * 1.1, randomStats.domesticRevenue * 0.9, randomStats.domesticRevenue * 1.2, randomStats.domesticRevenue],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
        },
        {
          label: '해외',
                data: [randomStats.overseasRevenue * 1.1, randomStats.overseasRevenue * 0.8, randomStats.overseasRevenue * 1.2, randomStats.overseasRevenue * 0.9, randomStats.overseasRevenue * 1.1, randomStats.overseasRevenue, randomStats.overseasRevenue * 0.95, randomStats.overseasRevenue * 1.15, randomStats.overseasRevenue * 0.85, randomStats.overseasRevenue * 1.2, randomStats.overseasRevenue * 0.9, randomStats.overseasRevenue],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4
              }
            ]
          }} options={{
      responsive: true,
      maintainAspectRatio: false,
            animation: { duration: 0 },
      plugins: {
        legend: {
                position: 'top' as const,
          labels: {
            color: '#e2e8f0',
                  font: { size: 14, weight: 'bold' as const },
                  usePointStyle: true
          }
        }
      },
      scales: {
        x: {
                ticks: { color: '#e2e8f0', font: { size: 12 } },
                grid: { color: '#374151' }
        },
        y: {
          ticks: {
            color: '#e2e8f0',
                  font: { size: 12 },
                  callback: function(value: any) { return value + '억'; }
                },
                grid: { color: '#374151' }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

// 매출 추이 분석 컴포넌트
const RevenueTrendsAnalysis = ({ randomStats }: { randomStats: any }) => {
    return (
    <div className="text-center text-slate-400 py-20">
      추후 구현 예정
            </div>
  );
};

// 지역별 분석 컴포넌트
const RegionalAnalysis = ({ randomStats }: { randomStats: any }) => {
  return (
    <div className="text-center text-slate-400 py-20">
      추후 구현 예정
          </div>
  );
};

// 비교 분석 컴포넌트
const ComparisonAnalysis = ({ randomStats }: { randomStats: any }) => {
  return (
    <div className="text-center text-slate-400 py-20">
      추후 구현 예정
            </div>
  );
};

// 매출 예측 컴포넌트
const RevenueForecast = ({ randomStats }: { randomStats: any }) => {
  return (
    <div className="text-center text-slate-400 py-20">
      추후 구현 예정
          </div>
  );
};

// 인사이트 컴포넌트
const RevenueInsights = ({ randomStats }: { randomStats: any }) => {
  return (
    <div className="text-center text-slate-400 py-20">
      추후 구현 예정
          </div>
  );
};

// 라디오 버튼 컴포넌트
const RadioButtonGroup = ({ 
  options, 
  selectedValue, 
  onChange, 
  label 
}: { 
  options: { value: string; label: string }[]; 
  selectedValue: string; 
  onChange: (value: string) => void; 
  label: string; 
}) => {
  return (
    <div className="flex items-center gap-6">
      <span className="text-white font-medium text-lg">{label}:</span>
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-500 focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-slate-300 text-base">{option.label}</span>
          </label>
        ))}
            </div>
          </div>
  );
};

// 매출 추이 컴포넌트
const RevenueTrend = ({ analysisType }: { analysisType: string }) => {

  const revenueData = useMemo(() => ({
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '본사',
        data: [2400, 2600, 2500, 2800, 2700, 2850],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: '국내',
        data: [1800, 1900, 1850, 2000, 1950, 1980],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: '해외',
        data: [1100, 1200, 1150, 1300, 1250, 1250],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      }
    ]
  }), []);

  const profitData = useMemo(() => ({
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '본사',
        data: [1200, 1300, 1250, 1400, 1350, 1430],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      },
      {
        label: '국내',
        data: [680, 780, 730, 880, 830, 860],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: '해외',
        data: [420, 480, 470, 620, 570, 570],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      }
    ]
  }), []);

  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
          font: { size: 14, weight: 'bold' as const }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 14, weight: 'normal' as const }
        },
        grid: { color: '#374151', drawBorder: false }
      },
      y: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 14, weight: 'normal' as const }
        },
        grid: { color: '#374151', drawBorder: false }
      }
    }
  }), []);

  const currentData = analysisType === 'revenue' ? revenueData : profitData;
  const chartTitle = analysisType === 'revenue' ? '월별 매출 추이' : '월별 영업이익 추이';

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
        <h3 className="text-xl font-bold text-white mb-6 text-center">{chartTitle}</h3>
        <div className="h-80">
          <Line data={currentData} options={lineOptions} />
          </div>
        </div>
      </div>
    );
  };

// 매출 비교 컴포넌트
const RevenueComparison = ({ randomStats, analysisType }: { randomStats: any; analysisType: string }) => {

  const revenueData = useMemo(() => ({
    labels: ['본사', '국내', '해외'],
    datasets: [
      {
        label: '매출',
        data: [randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderRadius: 8
      }
    ]
  }), [randomStats]);

  const profitData = useMemo(() => ({
    labels: ['본사', '국내', '해외'],
    datasets: [
      {
        label: '영업이익',
        data: [
          randomStats.hqRevenue - randomStats.hqCost,
          randomStats.domesticRevenue - randomStats.domesticCost,
          randomStats.overseasRevenue - randomStats.overseasCost
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderRadius: 8
      }
    ]
  }), [randomStats]);

  const comparisonOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 16, weight: 'bold' as const }
        },
        grid: { display: false }
      },
      y: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 14, weight: 'normal' as const }
        },
        grid: { color: '#374151', drawBorder: false }
      }
    }
  }), []);
};


export default function PerformanceDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState('revenue');

  const randomStats = useMemo(() => ({
    hqRevenue: 2850,
    domesticRevenue: 1980,
    overseasRevenue: 1250,
    hqCost: 1420,
    domesticCost: 1120,
    overseasCost: 680,
    // 전년대비 증감률 데이터
    yearOverYearGrowth: 12.5,
    monthOverMonthGrowth: 3.2,
    quarterlyGrowth: 8.7,
  }), []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = [
    { id: 'overview', name: '📊 매출 대시보드', icon: BarChart3, component: () => <RevenueDashboard randomStats={randomStats} /> },
    { id: 'trends', name: '📈 매출 추이 분석', icon: LineChart, component: () => <RevenueTrendsAnalysis randomStats={randomStats} /> },
    { id: 'regional', name: '🌍 지역별 분석', icon: MapPin, component: () => <RegionalAnalysis randomStats={randomStats} /> },
    { id: 'comparison', name: '⚖️ 비교 분석', icon: Building2, component: () => <ComparisonAnalysis randomStats={randomStats} /> },
    { id: 'forecast', name: '🔮 매출 예측', icon: Brain, component: () => <RevenueForecast randomStats={randomStats} /> },
    { id: 'insights', name: '💡 인사이트', icon: Eye, component: () => <RevenueInsights randomStats={randomStats} /> }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">로딩 중...</p>
                    </div>
                  </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-bold">매출 분석 대시보드</h1>
              <p className="text-slate-300 text-base">종합적인 매출 분석 및 인사이트</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-slate-300 text-sm">
              실시간 매출 분석
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex gap-2 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
            {tabs.find(tab => tab.id === activeTab)?.component()}
          </div>
        </div>
      </div>
    </div>
  );
} 