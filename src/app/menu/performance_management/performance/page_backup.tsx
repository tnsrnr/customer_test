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

// 매출 추이 분석 컴포넌트 (수직 스택 레이아웃)
const RevenueTrendsAnalysis = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-4">
      {/* 수직 스택 KPI 카드들 */}
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-500/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-300 text-sm font-medium">총 매출</p>
              <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()}억</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs">본사</p>
              <p className="text-white font-semibold">{randomStats.hqRevenue.toLocaleString()}억</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs">국내</p>
              <p className="text-white font-semibold">{randomStats.domesticRevenue.toLocaleString()}억</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs">해외</p>
              <p className="text-white font-semibold">{randomStats.overseasRevenue.toLocaleString()}억</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-500/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-300 text-sm font-medium">전년대비</p>
              <p className="text-2xl font-bold text-white">+{randomStats.yearOverYearGrowth}%</p>
            </div>
            <div className="text-right">
              <p className="text-green-200 text-xs">본사</p>
              <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-green-200 text-xs">국내</p>
              <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-green-200 text-xs">해외</p>
              <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-300 text-sm font-medium">전월대비</p>
              <p className="text-2xl font-bold text-white">+{randomStats.monthOverMonthGrowth}%</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs">본사</p>
              <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs">국내</p>
              <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-purple-200 text-xs">해외</p>
              <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3">매출 추이 분석</h3>
        <div className="h-64">
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
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#94a3b8',
                  font: { size: 11 },
                  callback: function(value: any) {
                    return value.toLocaleString() + '억';
                  }
                },
                grid: {
                  color: '#334155'
                }
              },
              x: {
                ticks: {
                  color: '#94a3b8',
                  font: { size: 11 }
                },
                grid: {
                  color: '#334155'
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

// 지역별 분석 컴포넌트 (원형 배치)
const RegionalAnalysis = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-6">
      {/* 원형 배치 KPI 카드들 */}
      <div className="relative flex justify-center items-center h-80">
        {/* 중앙 카드 */}
        <div className="absolute bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-full p-8 border border-blue-500/50 w-48 h-48 flex flex-col justify-center items-center">
          <p className="text-blue-300 text-sm font-medium mb-2">총 매출</p>
          <p className="text-2xl font-bold text-white text-center">{totalRevenue.toLocaleString()}억</p>
        </div>
        
        {/* 상단 카드 */}
        <div className="absolute -top-8 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-500/50 w-32 h-20 flex flex-col justify-center items-center">
          <p className="text-green-300 text-xs font-medium">전년대비</p>
          <p className="text-lg font-bold text-white">+{randomStats.yearOverYearGrowth}%</p>
        </div>
        
        {/* 하단 카드 */}
        <div className="absolute -bottom-8 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/50 w-32 h-20 flex flex-col justify-center items-center">
          <p className="text-purple-300 text-xs font-medium">전월대비</p>
          <p className="text-lg font-bold text-white">+{randomStats.monthOverMonthGrowth}%</p>
        </div>
        
        {/* 좌측 카드 */}
        <div className="absolute -left-16 bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-lg p-4 border border-orange-500/50 w-24 h-32 flex flex-col justify-center items-center">
          <p className="text-orange-300 text-xs font-medium mb-1">본사</p>
          <p className="text-white font-semibold text-sm">{randomStats.hqRevenue.toLocaleString()}억</p>
          <p className="text-orange-200 text-xs mt-1">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
        </div>
        
        {/* 우측 카드 */}
        <div className="absolute -right-16 bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-4 border border-cyan-500/50 w-24 h-32 flex flex-col justify-center items-center">
          <p className="text-cyan-300 text-xs font-medium mb-1">해외</p>
          <p className="text-white font-semibold text-sm">{randomStats.overseasRevenue.toLocaleString()}억</p>
          <p className="text-cyan-200 text-xs mt-1">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
        </div>
        
        {/* 국내 카드 (우하단) */}
        <div className="absolute top-16 -right-8 bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-4 border border-emerald-500/50 w-24 h-32 flex flex-col justify-center items-center">
          <p className="text-emerald-300 text-xs font-medium mb-1">국내</p>
          <p className="text-white font-semibold text-sm">{randomStats.domesticRevenue.toLocaleString()}억</p>
          <p className="text-emerald-200 text-xs mt-1">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3">지역별 매출 분석</h3>
        <div className="h-64">
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
                  font: { size: 12, weight: 'bold' as const }
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

// 비교 분석 컴포넌트 (대각선 배치)
const ComparisonAnalysis = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-6">
      {/* 대각선 배치 KPI 카드들 */}
      <div className="relative h-64">
        {/* 좌상단 카드 */}
        <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-500/50 w-40 h-24 flex flex-col justify-center items-center">
          <p className="text-blue-300 text-sm font-medium">총 매출</p>
          <p className="text-xl font-bold text-white">{totalRevenue.toLocaleString()}억</p>
        </div>
        
        {/* 중앙 카드 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-500/50 w-40 h-24 flex flex-col justify-center items-center">
          <p className="text-green-300 text-sm font-medium">전년대비</p>
          <p className="text-xl font-bold text-white">+{randomStats.yearOverYearGrowth}%</p>
        </div>
        
        {/* 우하단 카드 */}
        <div className="absolute bottom-0 right-0 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/50 w-40 h-24 flex flex-col justify-center items-center">
          <p className="text-purple-300 text-sm font-medium">전월대비</p>
          <p className="text-xl font-bold text-white">+{randomStats.monthOverMonthGrowth}%</p>
        </div>
        
        {/* 우상단 - 본사 */}
        <div className="absolute top-8 right-8 bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-lg p-3 border border-orange-500/50 w-28 h-20 flex flex-col justify-center items-center">
          <p className="text-orange-300 text-xs font-medium">본사</p>
          <p className="text-white font-semibold text-sm">{randomStats.hqRevenue.toLocaleString()}억</p>
        </div>
        
        {/* 좌하단 - 국내 */}
        <div className="absolute bottom-8 left-8 bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-3 border border-emerald-500/50 w-28 h-20 flex flex-col justify-center items-center">
          <p className="text-emerald-300 text-xs font-medium">국내</p>
          <p className="text-white font-semibold text-sm">{randomStats.domesticRevenue.toLocaleString()}억</p>
        </div>
        
        {/* 중앙하단 - 해외 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-3 border border-cyan-500/50 w-28 h-20 flex flex-col justify-center items-center">
          <p className="text-cyan-300 text-xs font-medium">해외</p>
          <p className="text-white font-semibold text-sm">{randomStats.overseasRevenue.toLocaleString()}억</p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3">비교 분석</h3>
        <div className="h-64">
          <Line data={{
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [
              {
                label: '본사',
                data: [randomStats.hqRevenue * 0.8, randomStats.hqRevenue * 0.9, randomStats.hqRevenue * 1.1, randomStats.hqRevenue * 0.95, randomStats.hqRevenue * 1.05, randomStats.hqRevenue],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
              },
              {
                label: '국내',
                data: [randomStats.domesticRevenue * 0.9, randomStats.domesticRevenue * 1.1, randomStats.domesticRevenue * 0.8, randomStats.domesticRevenue * 1.2, randomStats.domesticRevenue * 0.95, randomStats.domesticRevenue],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
              },
              {
                label: '해외',
                data: [randomStats.overseasRevenue * 1.1, randomStats.overseasRevenue * 0.9, randomStats.overseasRevenue * 1.2, randomStats.overseasRevenue * 0.8, randomStats.overseasRevenue * 1.1, randomStats.overseasRevenue],
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
                  font: { size: 12 }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#94a3b8',
                  font: { size: 11 },
                  callback: function(value: any) {
                    return value.toLocaleString() + '억';
                  }
                },
                grid: {
                  color: '#334155'
                }
              },
              x: {
                ticks: {
                  color: '#94a3b8',
                  font: { size: 11 }
                },
                grid: {
                  color: '#334155'
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

// 매출 예측 컴포넌트 (카드형 테이블 레이아웃)
const RevenueForecast = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-6">
      {/* 카드형 테이블 KPI */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-4">매출 예측 분석</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 총 매출 행 */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-500/50">
            <div className="text-center">
              <p className="text-blue-300 text-sm font-medium mb-2">총 매출</p>
              <p className="text-2xl font-bold text-white mb-3">{totalRevenue.toLocaleString()}억</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-blue-200">본사</p>
                  <p className="text-white font-semibold">{randomStats.hqRevenue.toLocaleString()}억</p>
                </div>
                <div>
                  <p className="text-blue-200">국내</p>
                  <p className="text-white font-semibold">{randomStats.domesticRevenue.toLocaleString()}억</p>
                </div>
                <div>
                  <p className="text-blue-200">해외</p>
                  <p className="text-white font-semibold">{randomStats.overseasRevenue.toLocaleString()}억</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 전년대비 행 */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-500/50">
            <div className="text-center">
              <p className="text-green-300 text-sm font-medium mb-2">전년대비</p>
              <p className="text-2xl font-bold text-white mb-3">+{randomStats.yearOverYearGrowth}%</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-green-200">본사</p>
                  <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-green-200">국내</p>
                  <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-green-200">해외</p>
                  <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 전월대비 행 */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/50">
            <div className="text-center">
              <p className="text-purple-300 text-sm font-medium mb-2">전월대비</p>
              <p className="text-2xl font-bold text-white mb-3">+{randomStats.monthOverMonthGrowth}%</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-purple-200">본사</p>
                  <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-purple-200">국내</p>
                  <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-purple-200">해외</p>
                  <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 예측 차트 영역 */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3">매출 예측 모델</h3>
        <div className="h-64">
          <Line data={{
            labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            datasets: [
              {
                label: '실제 매출',
                data: [totalRevenue * 0.8, totalRevenue * 0.9, totalRevenue * 1.1, totalRevenue * 0.95, totalRevenue * 1.05, totalRevenue, null, null, null, null, null, null],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                borderDash: []
              },
              {
                label: '예측 매출',
                data: [null, null, null, null, null, totalRevenue, totalRevenue * 1.1, totalRevenue * 1.15, totalRevenue * 1.2, totalRevenue * 1.1, totalRevenue * 1.25, totalRevenue * 1.3],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                borderDash: [5, 5]
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
                  font: { size: 12 }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#94a3b8',
                  font: { size: 11 },
                  callback: function(value: any) {
                    return value.toLocaleString() + '억';
                  }
                },
                grid: {
                  color: '#334155'
                }
              },
              x: {
                ticks: {
                  color: '#94a3b8',
                  font: { size: 11 }
                },
                grid: {
                  color: '#334155'
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};

// 인사이트 컴포넌트 (타일형 그리드 레이아웃)
const RevenueInsights = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-6">
      {/* 타일형 그리드 KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 총 매출 타일 */}
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-3 border border-blue-500/50 col-span-2">
          <div className="text-center">
            <p className="text-blue-300 text-sm font-medium mb-1">총 매출</p>
            <p className="text-2xl font-bold text-white mb-2">{totalRevenue.toLocaleString()}억</p>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div>
                <p className="text-blue-200">본사</p>
                <p className="text-white font-semibold">{randomStats.hqRevenue.toLocaleString()}억</p>
              </div>
              <div>
                <p className="text-blue-200">국내</p>
                <p className="text-white font-semibold">{randomStats.domesticRevenue.toLocaleString()}억</p>
              </div>
              <div>
                <p className="text-blue-200">해외</p>
                <p className="text-white font-semibold">{randomStats.overseasRevenue.toLocaleString()}억</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 전년대비 타일 */}
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-3 border border-green-500/50">
          <div className="text-center">
            <p className="text-green-300 text-xs font-medium mb-1">전년대비</p>
            <p className="text-xl font-bold text-white mb-2">+{randomStats.yearOverYearGrowth}%</p>
            <div className="space-y-1 text-xs">
              <div>
                <p className="text-green-200">본사</p>
                <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-green-200">국내</p>
                <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-green-200">해외</p>
                <p className="text-white font-semibold">+{(randomStats.yearOverYearGrowth + (Math.random() - 0.5) * 5).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 전월대비 타일 */}
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-3 border border-purple-500/50">
          <div className="text-center">
            <p className="text-purple-300 text-xs font-medium mb-1">전월대비</p>
            <p className="text-xl font-bold text-white mb-2">+{randomStats.monthOverMonthGrowth}%</p>
            <div className="space-y-1 text-xs">
              <div>
                <p className="text-purple-200">본사</p>
                <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-purple-200">국내</p>
                <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-purple-200">해외</p>
                <p className="text-white font-semibold">+{(randomStats.monthOverMonthGrowth + (Math.random() - 0.5) * 3).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 인사이트 차트 영역 */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
        <h3 className="text-lg font-bold text-white mb-3">핵심 인사이트</h3>
        <div className="h-64">
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
                  font: { size: 12, weight: 'bold' as const }
                }
              }
            }
          }} />
        </div>
      </div>
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

  const currentData = analysisType === 'revenue' ? revenueData : profitData;
  const chartTitle = analysisType === 'revenue' ? '지역별 매출 비교' : '지역별 영업이익 비교';

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
        <h3 className="text-xl font-bold text-white mb-6 text-center">{chartTitle}</h3>
        <div className="h-80">
          <Bar data={currentData} options={comparisonOptions} />
        </div>
      </div>
    </div>
  );
};

// 분석 대시보드 컴포넌트
const Tab2BarChart = ({ randomStats, analysisType }: { randomStats: any; analysisType: string }) => {
    const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
    const totalProfit = (randomStats.hqRevenue - randomStats.hqCost) + (randomStats.domesticRevenue - randomStats.domesticCost) + (randomStats.overseasRevenue - randomStats.overseasCost);
    const profitMargin = (totalProfit / totalRevenue * 100).toFixed(1);
    
  const isRevenue = analysisType === 'revenue';
  const totalValue = isRevenue ? totalRevenue : totalProfit;
  const title = isRevenue ? '매출' : '영업이익';
  
  const chartData = useMemo(() => ({
    labels: isRevenue ? ['본사', '국내', '해외'] : ['본사', '국내', '해외'],
    datasets: [
      {
        label: isRevenue ? '매출' : '영업이익',
        data: isRevenue 
          ? [randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue]
          : [randomStats.hqRevenue - randomStats.hqCost, randomStats.domesticRevenue - randomStats.domesticCost, randomStats.overseasRevenue - randomStats.overseasCost],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
        borderRadius: 12,
      }
    ]
  }), [randomStats, isRevenue]);

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

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 14,
            weight: 'normal' as const
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#ffffff',
          font: {
            size: 24,
            weight: 'bold' as const
          }
        },
        grid: {
          color: '#374151',
          drawBorder: false
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: '#e2e8f0',
          font: {
            size: 14,
            weight: 'normal' as const
          }
        },
        grid: {
          color: '#374151',
          drawBorder: false
        }
      }
    }
  }), []);

    return (
    <div className="space-y-6">
      {/* 요약 카드 - 매출개요 탭 스타일 */}
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

      {/* 성장률 카드 - 획기적인 표현 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`rounded-lg p-4 border transition-all duration-500 ${
          randomStats.yearOverYearGrowth > 0 
            ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/50' 
            : randomStats.yearOverYearGrowth < 0 
            ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/50'
            : 'bg-slate-800 border-slate-600'
        }`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {randomStats.yearOverYearGrowth > 0 ? (
                <div className="text-green-400 text-2xl animate-pulse">↗️</div>
              ) : randomStats.yearOverYearGrowth < 0 ? (
                <div className="text-red-400 text-2xl animate-pulse">↘️</div>
              ) : (
                <div className="text-gray-400 text-2xl">➡️</div>
              )}
              <div className={`text-3xl font-bold ${
                randomStats.yearOverYearGrowth > 0 
                  ? 'text-green-400' 
                  : randomStats.yearOverYearGrowth < 0 
                  ? 'text-red-400'
                  : 'text-white'
              }`}>
                {randomStats.yearOverYearGrowth > 0 ? '+' : ''}{randomStats.yearOverYearGrowth}%
              </div>
            </div>
            <div className="text-slate-300 text-sm">전년대비 증감률</div>
            <div className={`text-xs mt-1 ${
              randomStats.yearOverYearGrowth > 0 
                ? 'text-green-300' 
                : randomStats.yearOverYearGrowth < 0 
                ? 'text-red-300'
                : 'text-gray-400'
            }`}>
              {randomStats.yearOverYearGrowth > 0 ? '상승 추세' : randomStats.yearOverYearGrowth < 0 ? '하락 추세' : '보합세'}
            </div>
            </div>
          </div>

        <div className={`rounded-lg p-4 border transition-all duration-500 ${
          randomStats.monthOverMonthGrowth > 0 
            ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/50' 
            : randomStats.monthOverMonthGrowth < 0 
            ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/50'
            : 'bg-slate-800 border-slate-600'
        }`}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {randomStats.monthOverMonthGrowth > 0 ? (
                <div className="text-green-400 text-2xl animate-pulse">↗️</div>
              ) : randomStats.monthOverMonthGrowth < 0 ? (
                <div className="text-red-400 text-2xl animate-pulse">↘️</div>
              ) : (
                <div className="text-gray-400 text-2xl">➡️</div>
              )}
              <div className={`text-3xl font-bold ${
                randomStats.monthOverMonthGrowth > 0 
                  ? 'text-green-400' 
                  : randomStats.monthOverMonthGrowth < 0 
                  ? 'text-red-400'
                  : 'text-white'
              }`}>
                {randomStats.monthOverMonthGrowth > 0 ? '+' : ''}{randomStats.monthOverMonthGrowth}%
              </div>
            </div>
            <div className="text-slate-300 text-sm">전월대비 증감률</div>
            <div className={`text-xs mt-1 ${
              randomStats.monthOverMonthGrowth > 0 
                ? 'text-green-300' 
                : randomStats.monthOverMonthGrowth < 0 
                ? 'text-red-300'
                : 'text-gray-400'
            }`}>
              {randomStats.monthOverMonthGrowth > 0 ? '상승 추세' : randomStats.monthOverMonthGrowth < 0 ? '하락 추세' : '보합세'}
            </div>
            </div>
          </div>
        </div>

      {/* 차트 영역 - 매출개요 탭 스타일 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-white mb-4 text-center">{title} 비중 분석</h3>
          <div className="h-64">
            <Doughnut data={pieData} options={pieOptions} />
            </div>
                  </div>
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
          <h3 className="text-lg font-bold text-white mb-4 text-center">지역별 {title} 비교</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
  );
};

// 매출 대시보드 컴포넌트
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

// 매출 추이 분석 컴포넌트 - 패턴 1: 대시보드 구조 복사
const RevenueTrendsAnalysis = ({ randomStats }: { randomStats: any }) => {
    const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;
  
  return (
    <div className="space-y-6">
      {/* 핵심 KPI 카드 - 추이 분석용 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 rounded-lg p-6 border border-emerald-500/50">
          <div className="flex items-center justify-between">
                  <div>
              <p className="text-emerald-300 text-sm font-medium">최고 성장률</p>
              <p className="text-3xl font-bold text-white">+{Math.max(randomStats.yearOverYearGrowth, randomStats.monthOverMonthGrowth)}%</p>
                  </div>
            <TrendingUp className="h-8 w-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-6 border border-blue-500/50">
          <div className="flex items-center justify-between">
                  <div>
              <p className="text-blue-300 text-sm font-medium">평균 성장률</p>
              <p className="text-3xl font-bold text-white">+{((randomStats.yearOverYearGrowth + randomStats.monthOverMonthGrowth) / 2).toFixed(1)}%</p>
                  </div>
            <Activity className="h-8 w-8 text-blue-400" />
                </div>
                </div>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-6 border border-purple-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">성장 가속도</p>
              <p className="text-3xl font-bold text-white">+{(randomStats.monthOverMonthGrowth - randomStats.yearOverYearGrowth).toFixed(1)}%</p>
              </div>
            <Zap className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        
        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-lg p-6 border border-orange-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm font-medium">예상 연간 성장</p>
              <p className="text-3xl font-bold text-white">+{(randomStats.yearOverYearGrowth * 1.2).toFixed(1)}%</p>
        </div>
            <Target className="h-8 w-8 text-orange-400" />
      </div>
        </div>
      </div>

      {/* 추이 분석 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            12개월 상세 추이
          </h3>
          <div className="h-64">
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
                    font: { size: 12, weight: 'bold' as const },
                    usePointStyle: true
          }
        }
      },
      scales: {
        x: {
                  ticks: { color: '#e2e8f0', font: { size: 10 } },
                  grid: { color: '#374151' }
                },
                y: {
          ticks: {
            color: '#e2e8f0',
                    font: { size: 10 },
                    callback: function(value: any) { return value + '억'; }
                  },
                  grid: { color: '#374151' }
                }
              }
            }} />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            월별 성장률 비교
          </h3>
          <div className="h-64">
            <Bar data={{
              labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
              datasets: [{
                label: '성장률 (%)',
                data: [5, 8, 12, 7, 10, randomStats.monthOverMonthGrowth],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
                borderRadius: 8
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
                  grid: { display: false }
        },
        y: {
          ticks: {
            color: '#e2e8f0',
                    font: { size: 12 },
                    callback: function(value: any) { return value + '%'; }
                  },
                  grid: { color: '#374151' }
                }
              }
            }} />
            </div>
          </div>
            </div>
          </div>
  );
};

// 지역별 분석 컴포넌트 - 패턴 2: 대시보드 구조 복사
const RegionalAnalysis = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;

    return (
    <div className="space-y-6">
      {/* 핵심 KPI 카드 - 지역별 분석용 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-6 border border-blue-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">본사 매출</p>
              <p className="text-3xl font-bold text-white">{randomStats.hqRevenue.toLocaleString()}억</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
          </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-6 border border-green-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">국내 매출</p>
              <p className="text-3xl font-bold text-white">{randomStats.domesticRevenue.toLocaleString()}억</p>
            </div>
            <MapPin className="h-8 w-8 text-green-400" />
          </div>
          </div>

        <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-lg p-6 border border-orange-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300 text-sm font-medium">해외 매출</p>
              <p className="text-3xl font-bold text-white">{randomStats.overseasRevenue.toLocaleString()}억</p>
            </div>
            <Globe className="h-8 w-8 text-orange-400" />
          </div>
          </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-6 border border-purple-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">총 매출</p>
              <p className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()}억</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
          </div>
        </div>

      {/* 지역별 분석 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            지역별 매출 비중
          </h3>
          <div className="h-64">
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
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            지역별 성장률 비교
          </h3>
          <div className="h-64">
            <Bar data={{
              labels: ['본사', '국내', '해외'],
              datasets: [{
                label: '성장률 (%)',
                data: [randomStats.yearOverYearGrowth, randomStats.monthOverMonthGrowth, ((randomStats.yearOverYearGrowth + randomStats.monthOverMonthGrowth) / 2)],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderRadius: 8
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
          ticks: {
            color: '#e2e8f0',
                    font: { size: 16, weight: 'bold' as const }
          },
                  grid: { display: false }
        },
        y: {
          ticks: {
            color: '#e2e8f0',
                    font: { size: 12 },
                    callback: function(value: any) { return value + '%'; }
                  },
                  grid: { color: '#374151' }
                }
              }
            }} />
        </div>
          </div>
      </div>
    </div>
  );
};

// 비교 분석 컴포넌트 - 패턴 3: 대시보드 구조 복사
const ComparisonAnalysis = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;

    return (
    <div className="space-y-6">
      {/* 핵심 KPI 카드 - 비교 분석용 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 rounded-lg p-6 border border-indigo-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm font-medium">최대 매출</p>
              <p className="text-3xl font-bold text-white">{Math.max(randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue).toLocaleString()}억</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-400" />
              </div>
          </div>

        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-lg p-6 border border-cyan-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 text-sm font-medium">최소 매출</p>
              <p className="text-3xl font-bold text-white">{Math.min(randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue).toLocaleString()}억</p>
            </div>
            <Activity className="h-8 w-8 text-cyan-400" />
              </div>
          </div>

        <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 rounded-lg p-6 border border-pink-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-300 text-sm font-medium">매출 격차</p>
              <p className="text-3xl font-bold text-white">{(Math.max(randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue) - Math.min(randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue)).toLocaleString()}억</p>
            </div>
            <Target className="h-8 w-8 text-pink-400" />
            </div>
          </div>

        <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/20 rounded-lg p-6 border border-teal-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-300 text-sm font-medium">평균 매출</p>
              <p className="text-3xl font-bold text-white">{(totalRevenue / 3).toFixed(0)}억</p>
            </div>
            <DollarSign className="h-8 w-8 text-teal-400" />
              </div>
          </div>
        </div>

      {/* 비교 분석 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            지역별 매출 비교
          </h3>
          <div className="h-64">
            <Bar data={{
              labels: ['본사', '국내', '해외'],
              datasets: [{
                label: '매출액 (억원)',
                data: [randomStats.hqRevenue, randomStats.domesticRevenue, randomStats.overseasRevenue],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                borderRadius: 8
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
                  ticks: { 
                    color: '#e2e8f0', 
                    font: { size: 16, weight: 'bold' as const }
                  },
                  grid: { display: false }
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

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            매출 비중 비교
          </h3>
          <div className="h-64">
            <Line data={{
              labels: ['본사', '국내', '해외'],
              datasets: [{
                label: '비중 (%)',
                data: [
                  (randomStats.hqRevenue / totalRevenue * 100),
                  (randomStats.domesticRevenue / totalRevenue * 100),
                  (randomStats.overseasRevenue / totalRevenue * 100)
                ],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
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
                  ticks: { 
                    color: '#e2e8f0', 
                    font: { size: 16, weight: 'bold' as const }
                  },
                  grid: { display: false }
                },
                y: {
                  ticks: { 
                    color: '#e2e8f0', 
                    font: { size: 12 },
                    callback: function(value: any) { return value + '%'; }
                  },
                  grid: { color: '#374151' }
                }
              }
            }} />
            </div>
              </div>
              </div>
              </div>
  );
};

// 매출 예측 컴포넌트 - 패턴 4: 대시보드 구조 복사
const RevenueForecast = ({ randomStats }: { randomStats: any }) => {
  const totalRevenue = randomStats.hqRevenue + randomStats.domesticRevenue + randomStats.overseasRevenue;

    return (
    <div className="space-y-6">
      {/* 핵심 KPI 카드 - 예측 분석용 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-900/30 to-violet-800/20 rounded-lg p-6 border border-violet-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-300 text-sm font-medium">다음 달 예측</p>
              <p className="text-3xl font-bold text-white">{(totalRevenue * 1.05).toLocaleString()}억</p>
            </div>
            <Brain className="h-8 w-8 text-violet-400" />
            </div>
          </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-6 border border-purple-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">3개월 후 예측</p>
              <p className="text-3xl font-bold text-white">{(totalRevenue * 1.15).toLocaleString()}억</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>

        <div className="bg-gradient-to-br from-fuchsia-900/30 to-fuchsia-800/20 rounded-lg p-6 border border-fuchsia-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fuchsia-300 text-sm font-medium">6개월 후 예측</p>
              <p className="text-3xl font-bold text-white">{(totalRevenue * 1.25).toLocaleString()}억</p>
            </div>
            <Target className="h-8 w-8 text-fuchsia-400" />
              </div>
          </div>

        <div className="bg-gradient-to-br from-rose-900/30 to-rose-800/20 rounded-lg p-6 border border-rose-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-300 text-sm font-medium">연간 예측</p>
              <p className="text-3xl font-bold text-white">{(totalRevenue * 1.35).toLocaleString()}억</p>
            </div>
            <DollarSign className="h-8 w-8 text-rose-400" />
              </div>
          </div>
        </div>

      {/* 예측 분석 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            매출 예측 추이
          </h3>
          <div className="h-64">
            <Line data={{
              labels: ['현재', '1개월 후', '3개월 후', '6개월 후', '12개월 후'],
              datasets: [{
                label: '예측 매출 (억원)',
                data: [totalRevenue, totalRevenue * 1.05, totalRevenue * 1.15, totalRevenue * 1.25, totalRevenue * 1.35],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8
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

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            성장률 예측
          </h3>
          <div className="h-64">
            <Bar data={{
              labels: ['1개월', '3개월', '6개월', '12개월'],
              datasets: [{
                label: '예상 성장률 (%)',
                data: [5, 15, 25, 35],
                backgroundColor: ['#8b5cf6', '#a855f7', '#c084fc', '#e879f9'],
                borderRadius: 8
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
                  ticks: { 
                    color: '#e2e8f0', 
                    font: { size: 12 }
                  },
                  grid: { display: false }
                },
                y: {
                  ticks: { 
                    color: '#e2e8f0', 
                    font: { size: 12 },
                    callback: function(value: any) { return value + '%'; }
                  },
                  grid: { color: '#374151' }
                }
              }
            }} />
            </div>
              </div>
              </div>
              </div>
  );
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