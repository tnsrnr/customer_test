'use client';

import { Card } from "@/common/components/ui/card";
import { Bar, Line, Chart } from 'react-chartjs-2';

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

// Chart.js 설정 import
import '@/global/lib/chart';

interface DivisionChartProps {
  divisionData?: {
    name: string;
    color: string;
    revenue: number[];
    profit: number[];
  };
  months: string[];
  loading?: boolean;
}

export function DivisionChart({ divisionData, months, loading }: DivisionChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white">차트 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (!divisionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-white">부문을 선택해주세요.</span>
      </div>
    );
  }

  // 색상 매핑
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string; chart: string } } = {
      blue: {
        bg: 'bg-blue-500/20',
        border: 'border-blue-400/30',
        text: 'text-blue-200',
        chart: 'rgba(59, 130, 246, 0.8)'
      },
      emerald: {
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-400/30',
        text: 'text-emerald-200',
        chart: 'rgba(16, 185, 129, 0.8)'
      },
      yellow: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-400/30',
        text: 'text-yellow-200',
        chart: 'rgba(234, 179, 8, 0.8)'
      },
      orange: {
        bg: 'bg-orange-500/20',
        border: 'border-orange-400/30',
        text: 'text-orange-200',
        chart: 'rgba(249, 115, 22, 0.8)'
      },
      pink: {
        bg: 'bg-pink-500/20',
        border: 'border-pink-400/30',
        text: 'text-pink-200',
        chart: 'rgba(236, 72, 153, 0.8)'
      },
      cyan: {
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-400/30',
        text: 'text-cyan-200',
        chart: 'rgba(6, 182, 212, 0.8)'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(divisionData.color);
  
  // 복합 차트 데이터 (막대 + 라인)
  const chartData = {
    labels: months,
    datasets: [
      {
        label: '매출',
        data: divisionData.revenue,
        backgroundColor: colors.chart,
        borderColor: colors.chart,
        borderWidth: 2,
        borderRadius: 4,
        yAxisID: 'y',
        order: 2
      },
      {
        label: '영업이익',
        data: divisionData.profit,
        type: 'line' as const,
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgba(239, 68, 68, 0.8)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        yAxisID: 'y1',
        order: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: 'white',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: 'white',
          font: {
            size: 11
          }
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    },
    layout: {
      padding: {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1
      }
    }
  };

  // 통계 계산
  const totalRevenue = divisionData.revenue.reduce((sum, val) => sum + val, 0);
  const totalProfit = divisionData.profit.reduce((sum, val) => sum + val, 0);
  const avgRevenue = totalRevenue / divisionData.revenue.length;
  const avgProfit = totalProfit / divisionData.profit.length;
  const maxRevenue = Math.max(...divisionData.revenue);
  const minRevenue = Math.min(...divisionData.revenue);
  const maxProfit = Math.max(...divisionData.profit);
  const minProfit = Math.min(...divisionData.profit);

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${colors.text} mb-2`}>
          {divisionData.name} 부문 상세 분석
        </h2>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full mx-auto">
        {/* 총 매출 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">총 매출</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>

        {/* 총 영업이익 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              {totalProfit >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-300 drop-shadow-lg" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-300 drop-shadow-lg" />
              )}
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">총 영업이익</span>
                <div className="flex items-center justify-center">
                  <span className={`text-3xl font-bold drop-shadow-sm ${totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {Math.round(totalProfit)}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>

        {/* 평균 매출 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <Activity className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">평균 매출</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {Math.round(avgRevenue)}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원/월</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>

        {/* 평균 영업이익 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <Activity className={`w-8 h-8 drop-shadow-lg ${avgProfit >= 0 ? 'text-green-300' : 'text-red-300'}`} />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">평균 영업이익</span>
                <div className="flex items-center justify-center">
                  <span className={`text-3xl font-bold drop-shadow-sm ${avgProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {Math.round(avgProfit)}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원/월</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>
      </div>

      {/* 메인 차트 */}
      <Card className="p-6 bg-white/5 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">매출 및 영업이익 트렌드</h3>
        <div className="h-80">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </Card>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 w-full mx-auto">
        {/* 최고 매출 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">최고 매출</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {maxRevenue.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>

        {/* 최저 매출 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <TrendingDown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">최저 매출</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {minRevenue.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>

        {/* 최고 영업이익 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <TrendingUp className={`w-8 h-8 drop-shadow-lg ${maxProfit >= 0 ? 'text-green-300' : 'text-red-300'}`} />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">최고 영업이익</span>
                <div className="flex items-center justify-center">
                  <span className={`text-3xl font-bold drop-shadow-sm ${maxProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {Math.round(maxProfit)}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>

        {/* 최저 영업이익 카드 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`relative p-6 ${colors.bg} backdrop-blur-md rounded-2xl shadow-xl border ${colors.border} hover:border-white/50 transition-all duration-300 overflow-hidden group`}
        >
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-white/20 to-white/10 rounded-xl shadow-lg group-hover:shadow-white/25 transition-all duration-300">
              <TrendingDown className={`w-8 h-8 drop-shadow-lg ${minProfit >= 0 ? 'text-green-300' : 'text-red-300'}`} />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-white/80 mb-1 block">최저 영업이익</span>
                <div className="flex items-center justify-center">
                  <span className={`text-3xl font-bold drop-shadow-sm ${minProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {Math.round(minProfit)}
                  </span>
                  <span className="text-lg font-medium text-white/80 ml-1">억원</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 장식선 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/20 opacity-60"></div>
        </motion.div>
      </div>
    </div>
  );
}
