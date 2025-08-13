'use client';

import { Card } from "@/components/ui/card";
import { Chart } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Target, PieChart, BarChart3, Calendar, LineChart } from 'lucide-react';

interface TrendsTabProps {
  bottomChartData: any;
}

export function TrendsTab({ bottomChartData }: TrendsTabProps) {
  // 10년 트렌드 데이터에서 현재 값들 추출
  const currentTotalLoan = bottomChartData.datasets[0].data[bottomChartData.datasets[0].data.length - 1] || 3700;
  const currentDebtRatio = bottomChartData.datasets[1].data[bottomChartData.datasets[1].data.length - 1] || 22.4;
  const previousTotalLoan = bottomChartData.datasets[0].data[0] || 2800;
  const previousDebtRatio = bottomChartData.datasets[1].data[0] || 18.7;
  
  const totalLoanChange = ((currentTotalLoan - previousTotalLoan) / previousTotalLoan * 100).toFixed(1);
  const debtRatioChange = ((currentDebtRatio - previousDebtRatio) / previousDebtRatio * 100).toFixed(1);
  
  // 10년간 최대/최소값 계산
  const totalLoanValues = bottomChartData.datasets[0].data;
  const debtRatioValues = bottomChartData.datasets[1].data;
  const maxTotalLoan = Math.max(...totalLoanValues);
  const minTotalLoan = Math.min(...totalLoanValues);
  const maxDebtRatio = Math.max(...debtRatioValues);
  const minDebtRatio = Math.min(...debtRatioValues);

  return (
    <div className="px-2 lg:px-3 space-y-6">
      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-teal-500/20 via-teal-600/15 to-teal-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-teal-400/30 hover:border-teal-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg group-hover:shadow-teal-400/25 transition-all duration-300">
              <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-teal-200 mb-1 block">현재 총 차입금</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {currentTotalLoan.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-teal-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(totalLoanChange) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(totalLoanChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(totalLoanChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-amber-400/30 hover:border-amber-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg group-hover:shadow-amber-400/25 transition-all duration-300">
              <PieChart className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-amber-200 mb-1 block">현재 부채비율</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {currentDebtRatio}
                  </span>
                  <span className="text-lg font-medium text-amber-200 ml-1">%</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(debtRatioChange) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(debtRatioChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(debtRatioChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-lime-500/20 via-lime-600/15 to-lime-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-lime-400/30 hover:border-lime-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-lime-400 to-lime-600 rounded-xl shadow-lg group-hover:shadow-lime-400/25 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-lime-200 mb-1 block">최대 차입금</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {maxTotalLoan.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-lime-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-lime-300 px-2 py-1 rounded-full border backdrop-blur-sm bg-lime-600/30 border-lime-400/30">
              최고점
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-lime-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-rose-500/20 via-rose-600/15 to-rose-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-rose-400/30 hover:border-rose-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl shadow-lg group-hover:shadow-rose-400/25 transition-all duration-300">
              <TrendingDown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-rose-200 mb-1 block">최대 부채비율</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {maxDebtRatio}
                  </span>
                  <span className="text-lg font-medium text-rose-200 ml-1">%</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-rose-300 px-2 py-1 rounded-full border backdrop-blur-sm bg-rose-600/30 border-rose-400/30">
              최고점
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-600 opacity-60"></div>
        </motion.div>
      </div>

      {/* 주요 차트 */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 mt-8">
        <h3 className="text-white font-semibold text-2xl mb-8">10년간 총 차입금 및 부채비율 트렌드</h3>
        <div className="h-[500px]">
        <Chart
          type="bar"
          data={bottomChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: 'white',
                  font: {
                    size: 16
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: 'white',
                  font: {
                    size: 14
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'white',
                  font: {
                    size: 14
                  }
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: {
                  color: 'white',
                  font: {
                    size: 14
                  }
                }
              }
            },
            layout: {
              padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
              }
            }
          }}
        />
      </div>
    </Card>


    </div>
  );
}
