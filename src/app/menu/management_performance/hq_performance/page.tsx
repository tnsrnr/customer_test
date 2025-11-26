'use client';

import { Card } from '@/common/components/ui/card';
import { HQPerformanceTable } from './components/hq_performance_table';
import { useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, Line } from 'react-chartjs-2';
import { useHQPerformanceStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';
import CountUp from 'react-countup';

// 전역 Chart.js 설정 사용
import '@/global/lib/chart';

export default function HQPerformancePage() {
  const { 
    data, 
    loading, 
    error, 
    fetchAllData,
    currentYear,
    currentMonth,
    setCurrentDate
  } = useHQPerformanceStore();

  const { setCurrentPage, isRefreshing, selectedYear, selectedMonth } = useGlobalStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 전역 조회 이벤트 감지
  useEffect(() => {
    if (isRefreshing) {
      fetchAllData();
    }
  }, [isRefreshing, fetchAllData]);

  // 날짜가 변경되면 데이터 조회 - 제거
  // useEffect(() => {
  //   if (currentYear && currentMonth) {
  //     fetchAllData();
  //   }
  // }, [currentYear, currentMonth, fetchAllData]);

  // 전역 조회 버튼 클릭 시 월 변경 적용 - 이 useEffect는 제거
  // useEffect(() => {
  //   if (isRefreshing && selectedYear && selectedMonth) {
  //     setCurrentDate(selectedYear, selectedMonth);
  //   }
  // }, [isRefreshing, selectedYear, selectedMonth, setCurrentDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 h-[calc(100vh-64px)] p-4 overflow-hidden">
        {/* 로딩 상태 표시 - 초기 로딩 시에만 표시 */}
        {loading && !data && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-2 text-white">데이터를 불러오는 중...</span>
          </div>
        )}

        {/* 에러 상태 표시 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        )}

        {/* 데이터가 로드된 경우에만 컨텐츠 표시 */}
        {data ? (
          <>
            {/* 통합된 상단 카드 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full mx-auto">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 overflow-hidden group"
              >
                {/* 배경 그라데이션 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* 아이콘 */}
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-400/25 transition-all duration-300">
                    <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-emerald-200 mb-1 block">매출 (누적)</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.actualSales} 
                            duration={2}
                            separator=","
                            decimals={1}
                            decimal="."
                            className="text-white"
                          />
                        </span>
                        <span className="text-lg font-medium text-emerald-200 ml-1">억원</span>
                    </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
                    data.kpiMetrics.actualSalesChange > 0 
                      ? 'text-emerald-300 bg-emerald-600/30 border-emerald-400/30' 
                      : 'text-red-300 bg-red-600/30 border-red-400/30'
                  }`}>
                    {data.kpiMetrics.actualSalesChange > 0 ? '▲' : '▼'} {Math.abs(data.kpiMetrics.actualSalesChange).toFixed(1)}억원
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-60"></div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-blue-200 mb-1 block">매입 (누적)</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.actualPurchases} 
                            duration={2}
                            separator=","
                            decimals={1}
                            decimal="."
                            className="text-white"
                          />
                        </span>
                        <span className="text-lg font-medium text-blue-200 ml-1">억원</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
                    data.kpiMetrics.actualPurchasesChange > 0 
                      ? 'text-blue-300 bg-blue-600/30 border-blue-400/30' 
                      : 'text-red-300 bg-red-600/30 border-red-400/30'
                  }`}>
                    {data.kpiMetrics.actualPurchasesChange > 0 ? '▲' : '▼'} {Math.abs(data.kpiMetrics.actualPurchasesChange).toFixed(1)}억원
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-400/25 transition-all duration-300">
                    <BarChart3 className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-orange-200 mb-1 block">영업이익 (누적)</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.actualOpProfit} 
                            duration={2}
                            separator=","
                            decimals={1}
                            className="text-white"
                          />
                        </span>
                        <span className="text-lg font-medium text-orange-200 ml-1">억원</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
                    data.kpiMetrics.actualOpProfitChange > 0 
                      ? 'text-orange-300 bg-orange-600/30 border-orange-400/30' 
                      : 'text-red-300 bg-red-600/30 border-red-400/30'
                  }`}>
                    {data.kpiMetrics.actualOpProfitChange > 0 ? '▲' : '▼'} {Math.abs(data.kpiMetrics.actualOpProfitChange).toFixed(1)}억원
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-60"></div>
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
                    <Percent className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-purple-200 mb-1 block">영업이익율 (누적)</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.actualOpMargin} 
                            duration={2}
                            separator=","
                            decimals={2}
                            className="text-white"
                          />
                        </span>
                        <span className="text-lg font-medium text-purple-200 ml-1">%</span>
                </div>
              </div>
                </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
                    data.kpiMetrics.actualOpMarginChange > 0 
                      ? 'text-purple-300 bg-purple-600/30 border-purple-400/30' 
                      : 'text-red-300 bg-red-600/30 border-red-400/30'
                  }`}>
                    {data.kpiMetrics.actualOpMarginChange > 0 ? '▲' : '▼'} {Math.abs(data.kpiMetrics.actualOpMarginChange).toFixed(2)}%
                  </span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-60"></div>
            </motion.div>
          </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10"
              >
              <div className="h-56">
                  <Line 
                    data={data.chartData.revenueChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      spanGaps: false,
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
                            },
                            callback: function(value: any) {
                              return typeof value === 'number' ? value.toFixed(1) + '억' : value;
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10"
              >
                <div className="h-56">
                  <Line 
                    data={data.chartData.profitChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      spanGaps: false,
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
            </motion.div>
          </div>

            {/* 그리드 테이블 섹션 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-4"
            >
              <HQPerformanceTable 
                data={data.gridData.monthlyDetails} 
                monthLabels={data.gridData.monthLabels}
                loading={loading} 
                currentYear={currentYear}
                currentMonth={currentMonth}
              />
            </motion.div>
          </>
        ) : (
          <div className="flex items-center justify-center h-32">
            <span className="text-white">데이터를 불러오는 중...</span>
          </div>
        )}
      </div>
    </div>
  );
} 