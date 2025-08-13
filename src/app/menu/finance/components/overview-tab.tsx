'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Calendar, Target, PieChart } from 'lucide-react';

interface OverviewTabProps {
  data: any;
  currentCapital: number;
  currentDebt: number;
  currentAssets: number;
  capitalChange: string;
  debtChange: string;
  assetsChange: string;
  topLeftChartData: any;
  topRightChartData: any;
  bottomChartData: any;
}

export function OverviewTab({
  data,
  currentCapital,
  currentDebt,
  currentAssets,
  capitalChange,
  debtChange,
  assetsChange,
  topLeftChartData,
  topRightChartData,
  bottomChartData
}: OverviewTabProps) {
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
                <span className="text-sm font-medium text-emerald-200 mb-1 block">자본</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {currentCapital.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-emerald-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(capitalChange) >= 0 
                ? 'text-emerald-300 bg-emerald-600/30 border-emerald-400/30' 
                : 'text-red-300 bg-red-600/30 border-red-400/30'
            }`}>
              {parseFloat(capitalChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(capitalChange))}%
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
                    {currentDebt.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-red-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(debtChange) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-emerald-300 bg-emerald-600/30 border-emerald-400/30'
            }`}>
              {parseFloat(debtChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(debtChange))}%
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
                <span className="text-sm font-medium text-blue-200 mb-1 block">자산</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {currentAssets.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-blue-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(assetsChange) >= 0 
                ? 'text-blue-300 bg-blue-600/30 border-blue-400/30' 
                : 'text-red-300 bg-red-600/30 border-red-400/30'
            }`}>
              {parseFloat(assetsChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(assetsChange))}%
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
                <span className="text-sm font-medium text-purple-200 mb-1 block">총차입금</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {(data.topRightChart.shortTermLoan[data.topRightChart.shortTermLoan.length - 1] + data.topRightChart.longTermLoan[data.topRightChart.longTermLoan.length - 1]).toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-purple-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              (data.topRightChart.shortTermLoan[data.topRightChart.shortTermLoan.length - 1] + data.topRightChart.longTermLoan[data.topRightChart.longTermLoan.length - 1]) > (data.topRightChart.shortTermLoan[0] + data.topRightChart.longTermLoan[0])
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-purple-300 bg-purple-600/30 border-purple-400/30'
            }`}>
              {(data.topRightChart.shortTermLoan[data.topRightChart.shortTermLoan.length - 1] + data.topRightChart.longTermLoan[data.topRightChart.longTermLoan.length - 1]) > (data.topRightChart.shortTermLoan[0] + data.topRightChart.longTermLoan[0]) ? '▲' : '▼'} {Math.abs(((data.topRightChart.shortTermLoan[data.topRightChart.shortTermLoan.length - 1] + data.topRightChart.longTermLoan[data.topRightChart.longTermLoan.length - 1]) - (data.topRightChart.shortTermLoan[0] + data.topRightChart.longTermLoan[0])) / (data.topRightChart.shortTermLoan[0] + data.topRightChart.longTermLoan[0]) * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-60"></div>
        </motion.div>
      </div>

      {/* 요약 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
          <h3 className="text-white font-semibold text-lg mb-4">자본/부채/자산 비교</h3>
          <div className="h-[230px]">
            <Bar
              data={topLeftChartData}
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
              data={topRightChartData}
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
        <h3 className="text-white font-semibold text-lg mb-4">10년간 총 차입금 및 부채비율 트렌드</h3>
        <div className="h-[230px]">
          <Bar
            data={bottomChartData}
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

      {/* 추가 정보 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-md rounded-xl border border-blue-400/20"
        >
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-blue-300 mr-2" />
            <h4 className="text-blue-200 font-medium">최근 업데이트</h4>
          </div>
          <p className="text-blue-100 text-sm">2024년 12월 기준</p>
          <p className="text-blue-100 text-sm">분기별 실시간 업데이트</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-md rounded-xl border border-green-400/20"
        >
          <div className="flex items-center mb-3">
            <Target className="w-5 h-5 text-green-300 mr-2" />
            <h4 className="text-green-200 font-medium">재무 목표</h4>
          </div>
          <p className="text-green-100 text-sm">부채비율 25% 이하</p>
          <p className="text-green-100 text-sm">자본금 1조원 달성</p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-md rounded-xl border border-purple-400/20"
        >
          <div className="flex items-center mb-3">
            <PieChart className="w-5 h-5 text-purple-300 mr-2" />
            <h4 className="text-purple-200 font-medium">주요 비율</h4>
          </div>
          <p className="text-purple-100 text-sm">자본비율: {((currentCapital / currentAssets) * 100).toFixed(1)}%</p>
          <p className="text-purple-100 text-sm">부채비율: {((currentDebt / currentAssets) * 100).toFixed(1)}%</p>
        </motion.div>
      </div>
    </div>
  );
}
