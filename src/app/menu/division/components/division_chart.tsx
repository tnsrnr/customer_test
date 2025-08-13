'use client';

import { Card } from "@/components/ui/card";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Chart } from 'react-chartjs-2';

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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
      purple: {
        bg: 'bg-purple-500/20',
        border: 'border-purple-400/30',
        text: 'text-purple-200',
        chart: 'rgba(147, 51, 234, 0.8)'
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
        <p className="text-white/70 text-sm">2024년 9월 ~ 2025년 8월 (12개월)</p>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`p-4 ${colors.bg} backdrop-blur-md rounded-xl border ${colors.border} hover:border-white/50 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">총 매출</p>
              <p className={`text-xl font-bold ${colors.text}`}>
                {totalRevenue.toLocaleString()}
              </p>
              <p className="text-white/50 text-xs">억원</p>
            </div>
            <DollarSign className={`w-6 h-6 ${colors.text}`} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`p-4 ${colors.bg} backdrop-blur-md rounded-xl border ${colors.border} hover:border-white/50 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">총 영업이익</p>
              <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {totalProfit.toFixed(1)}
              </p>
              <p className="text-white/50 text-xs">억원</p>
            </div>
            {totalProfit >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-300" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-300" />
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`p-4 ${colors.bg} backdrop-blur-md rounded-xl border ${colors.border} hover:border-white/50 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">평균 매출</p>
              <p className={`text-xl font-bold ${colors.text}`}>
                {avgRevenue.toFixed(0)}
              </p>
              <p className="text-white/50 text-xs">억원/월</p>
            </div>
            <Activity className={`w-6 h-6 ${colors.text}`} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`p-4 ${colors.bg} backdrop-blur-md rounded-xl border ${colors.border} hover:border-white/50 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">평균 영업이익</p>
              <p className={`text-xl font-bold ${avgProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {avgProfit.toFixed(1)}
              </p>
              <p className="text-white/50 text-xs">억원/월</p>
            </div>
            <Activity className={`w-6 h-6 ${avgProfit >= 0 ? 'text-green-300' : 'text-red-300'}`} />
          </div>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-3 ${colors.bg} backdrop-blur-md rounded-lg border ${colors.border}`}>
          <p className="text-white/70 text-xs">최고 매출</p>
          <p className={`text-lg font-semibold ${colors.text}`}>
            {maxRevenue.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 ${colors.bg} backdrop-blur-md rounded-lg border ${colors.border}`}>
          <p className="text-white/70 text-xs">최저 매출</p>
          <p className={`text-lg font-semibold ${colors.text}`}>
            {minRevenue.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 ${colors.bg} backdrop-blur-md rounded-lg border ${colors.border}`}>
          <p className="text-white/70 text-xs">최고 영업이익</p>
          <p className={`text-lg font-semibold ${maxProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {maxProfit.toFixed(1)}
          </p>
        </div>
        <div className={`p-3 ${colors.bg} backdrop-blur-md rounded-lg border ${colors.border}`}>
          <p className="text-white/70 text-xs">최저 영업이익</p>
          <p className={`text-lg font-semibold ${minProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {minProfit.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
