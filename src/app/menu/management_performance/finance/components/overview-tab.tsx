'use client';

import { motion } from "framer-motion";
import { Card } from "@/common/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
import { FinanceData } from '../types';

interface OverviewTabProps {
  data: FinanceData;
}

export function OverviewTab({ data }: OverviewTabProps) {
  // KPI 데이터 추출
  const { kpiMetrics, chartData, trendData } = data;
  
  // 차트 데이터 준비
  const capitalStructureChartData = {
    labels: chartData.capitalStructure.labels,
    datasets: [
      {
        label: '자산',
        data: chartData.capitalStructure.assets,
        backgroundColor: 'rgba(37, 99, 235, 0.4)',
        borderColor: 'rgba(96, 165, 250, 0.6)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: '부채',
        data: chartData.capitalStructure.debt,
        backgroundColor: 'rgba(220, 38, 38, 0.4)',
        borderColor: 'rgba(248, 113, 113, 0.6)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: '자본',
        data: chartData.capitalStructure.capital,
        backgroundColor: 'rgba(16, 185, 129, 0.4)',
        borderColor: 'rgba(52, 211, 153, 0.6)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const loanStructureChartData = {
    labels: chartData.loanStructure.labels,
    datasets: [
      {
        label: '단기차입금',
        data: chartData.loanStructure.shortTermLoan,
        backgroundColor: 'rgba(147, 51, 234, 0.4)',
        borderColor: 'rgba(196, 181, 253, 0.6)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: '장기차입금',
        data: chartData.loanStructure.longTermLoan,
        backgroundColor: 'rgba(219, 39, 119, 0.4)',
        borderColor: 'rgba(251, 113, 133, 0.6)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const trendChartData: any = {
    labels: trendData.labels,
    datasets: [
      {
        label: '차입금',
        data: trendData.totalLoan,
        backgroundColor: 'rgba(37, 99, 235, 0.4)',
        borderColor: 'rgba(96, 165, 250, 0.6)',
        borderWidth: 2,
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        label: '부채비율',
        data: trendData.debtRatio,
        borderColor: 'rgba(251, 146, 60, 0.6)',
        backgroundColor: 'rgba(251, 146, 60, 0.2)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(251, 146, 60, 0.6)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 2,
        yAxisID: 'y1',
        type: 'line',
      }
    ]
  };

  return (
    <div className="space-y-6 px-2 lg:px-3">
      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-400/25 transition-all duration-300">
              <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-emerald-200 mb-1 block">자산</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {Math.round(kpiMetrics.totalAssets).toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-emerald-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              kpiMetrics.totalAssetsChange >= 0 
                ? 'text-emerald-300 bg-emerald-600/30 border-emerald-400/30' 
                : 'text-red-300 bg-red-600/30 border-red-400/30'
            }`}>
              {kpiMetrics.totalAssetsChange >= 0 ? '▲' : '▼'} {Math.round(Math.abs(kpiMetrics.totalAssetsChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-red-500/20 via-red-600/15 to-red-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-red-400/30 hover:border-red-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg group-hover:shadow-red-400/25 transition-all duration-300">
              <TrendingDown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-red-200 mb-1 block">부채</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {Math.round(kpiMetrics.totalLiabilities).toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-red-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              kpiMetrics.totalLiabilitiesChange >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-emerald-300 bg-emerald-600/30 border-emerald-400/30'
            }`}>
              {kpiMetrics.totalLiabilitiesChange >= 0 ? '▲' : '▼'} {Math.round(Math.abs(kpiMetrics.totalLiabilitiesChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-blue-200 mb-1 block">자본</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {Math.round(kpiMetrics.totalEquity).toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-blue-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              kpiMetrics.totalEquityChange >= 0 
                ? 'text-blue-300 bg-blue-600/30 border-blue-400/30' 
                : 'text-red-300 bg-red-600/30 border-red-400/30'
            }`}>
              {kpiMetrics.totalEquityChange >= 0 ? '▲' : '▼'} {Math.round(Math.abs(kpiMetrics.totalEquityChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-400/25 transition-all duration-300">
              <Activity className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-purple-200 mb-1 block">부채비중</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {Math.round(kpiMetrics.debtWeight)}
                  </span>
                  <span className="text-lg font-medium text-purple-200 ml-1">%</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              kpiMetrics.debtWeightChange <= 0 
                ? 'text-purple-300 bg-purple-600/30 border-purple-400/30' 
                : 'text-red-300 bg-red-600/30 border-red-400/30'
            }`}>
              {kpiMetrics.debtWeightChange <= 0 ? '▼' : '▲'} {Math.round(Math.abs(kpiMetrics.debtWeightChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-60"></div>
        </motion.div>
      </div>

      {/* 요약 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">자산/부채/자본 비교</h3>
          <div className="h-[230px]">
            <Bar
              data={capitalStructureChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: 'white',
                      font: {
                        size: 11
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: 'white',
                      font: {
                        size: 10
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  y: {
                    ticks: {
                      color: 'white',
                      font: {
                        size: 10
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
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

        <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">단기/장기 차입금 현황</h3>
          <div className="h-[230px]">
            <Bar
              data={loanStructureChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: 'white',
                      font: {
                        size: 11
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: 'white',
                      font: {
                        size: 10
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  y: {
                    ticks: {
                      color: 'white',
                      font: {
                        size: 10
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
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

      {/* 10년 트렌드 차트 */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-4">10년간 차입금 및 부채비율 트렌드</h3>
        <div className="h-[230px]">
          <Bar
            data={trendChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: 'white',
                    font: {
                      size: 11
                    }
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: 'white',
                    font: {
                      size: 10
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
                      size: 10
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
                      size: 10
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
