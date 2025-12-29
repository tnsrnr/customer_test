'use client';

import { Card } from '@/common/components/ui/card';
import { PerformanceTable } from './components/performance_table';
import { useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, Doughnut } from 'react-chartjs-2';
import { useCompanyPerformanceStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';
import CountUp from 'react-countup';

// 전역 Chart.js 설정 사용
import '@/global/lib/chart';

export default function CompanyPerformancePage() {
  const { 
    data, 
    loading, 
    error, 
    yearType, 
    setYearType, 
    fetchAllData,
    currentYear,
    currentMonth
  } = useCompanyPerformanceStore();

  const { setCurrentPage, isRefreshing } = useGlobalStore();

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

  // 년도 타입 변경 시 데이터 재로드 (부드러운 전환)
  useEffect(() => {
    if (data) {
      // 기존 데이터를 유지하면서 새 데이터 로드
      fetchAllData();
    }
  }, [yearType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 h-[calc(100vh-64px)] p-4 space-y-4 overflow-hidden">
        {/* 년도 선택 버튼 - 계획대비 숨김, 직전년도만 표시 */}
        <div className="flex justify-end mb-2">
          <div className="flex space-x-1 p-0.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                yearType === 'previous' 
                  ? 'bg-white/20 text-white shadow-md border border-white/30' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setYearType('previous')}
            >
              직전년도
            </button>
          </div>
        </div>

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
        {data && (
          <>
            {/* 1번째 API: 상위 4개 KPI 컴포넌트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full mx-auto">
              {/* 총 매출액 카드 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 overflow-hidden group"
              >
                {/* 배경 그라데이션 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-400/25 transition-all duration-300">
                    <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-emerald-200 mb-1 block">총 매출액</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.ACTUAL_SALES || 0} 
                            duration={2}
                            separator=","
                            className="text-white"
                          />
                        </span>
                        <span className="text-lg font-medium text-emerald-200 ml-1">억원</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${data.kpiMetrics.ACTUAL_SALES_CHANGE >= 0 ? 'text-emerald-300 bg-emerald-600/30 border-emerald-400/30' : 'text-red-300 bg-red-600/30 border-red-400/30'}`}>
                    {data.kpiMetrics.ACTUAL_SALES_CHANGE >= 0 ? '+' : ''}{data.kpiMetrics.ACTUAL_SALES_CHANGE.toLocaleString()}억원
                  </span>
                </div>
                
                {/* 하단 장식선 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-60"></div>
              </motion.div>

              {/* 영업이익 카드 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group"
              >
                {/* 배경 그라데이션 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-blue-200 mb-1 block">영업이익</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.ACTUAL_OP_PROFIT || 0} 
                            duration={2}
                            separator=","
                            className="text-white"
                          />
                        </span>
                        <span className="text-lg font-medium text-blue-200 ml-1">억원</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${data.kpiMetrics.ACTUAL_OP_PROFIT_CHANGE >= 0 ? 'text-blue-300 bg-blue-600/30 border-blue-400/30' : 'text-red-300 bg-red-600/30 border-red-400/30'}`}>
                    {data.kpiMetrics.ACTUAL_OP_PROFIT_CHANGE >= 0 ? '+' : ''}{data.kpiMetrics.ACTUAL_OP_PROFIT_CHANGE.toLocaleString()}억원
                  </span>
                </div>
                
                {/* 하단 장식선 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
              </motion.div>

              {/* 영업이익률 카드 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 overflow-hidden group"
              >
                {/* 배경 그라데이션 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-400/25 transition-all duration-300">
                    <Percent className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-purple-200 mb-1 block">영업이익률</span>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white drop-shadow-sm">
                          <CountUp 
                            end={data.kpiMetrics.ACTUAL_OP_MARGIN || 0} 
                            duration={2}
                            separator=","
                            decimals={1}
                            decimal="."
                            suffix="%"
                            className="text-white"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${data.kpiMetrics.ACTUAL_OP_MARGIN_CHANGE >= 0 ? 'text-purple-300 bg-purple-600/30 border-purple-400/30' : 'text-red-300 bg-red-600/30 border-red-400/30'}`}>
                    {data.kpiMetrics.ACTUAL_OP_MARGIN_CHANGE >= 0 ? '+' : ''}{data.kpiMetrics.ACTUAL_OP_MARGIN_CHANGE.toFixed(2)}%
                  </span>
                </div>
                
                {/* 하단 장식선 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-60"></div>
              </motion.div>

              {/* 매출증감률 카드 */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-6 bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 overflow-hidden group"
              >
                {/* 배경 그라데이션 효과 */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex items-center h-full">
                  <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-400/25 transition-all duration-300">
                    <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="flex-1 flex items-center justify-center ml-4">
                    <div className="text-center">
                      <span className="text-sm font-medium text-orange-200 mb-1 block">매출증감률</span>
                      <div className="flex items-center justify-center">
                        <span className={`text-3xl font-bold drop-shadow-sm ${
                          (() => {
                            const previousYearSales = data.kpiMetrics.ACTUAL_SALES - data.kpiMetrics.ACTUAL_SALES_CHANGE;
                            const growthRate = previousYearSales !== 0 ? (data.kpiMetrics.ACTUAL_SALES_CHANGE / previousYearSales) * 100 : 0;
                            return growthRate >= 0 ? 'text-emerald-400' : 'text-red-400';
                          })()
                        }`}>
                          <CountUp 
                            end={(() => {
                              const previousYearSales = data.kpiMetrics.ACTUAL_SALES - data.kpiMetrics.ACTUAL_SALES_CHANGE;
                              return previousYearSales !== 0 ? (data.kpiMetrics.ACTUAL_SALES_CHANGE / previousYearSales) * 100 : 0;
                            })()} 
                            duration={2}
                            separator=","
                            decimals={1}
                            decimal="."
                            prefix={data.kpiMetrics.ACTUAL_SALES_CHANGE >= 0 ? '+' : ''}
                            suffix="%"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 하단 장식선 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-60"></div>
              </motion.div>
            </div>

            {/* 2번째 API: 중간 그리드 테이블 */}
            <div className="mb-4">
              <PerformanceTable 
                data={data.gridData.divisions} 
                loading={loading} 
                yearType={yearType}
                currentYear={currentYear}
                currentMonth={currentMonth}
                kpiMetrics={data.kpiMetrics}
              />
            </div>

            {/* 3~5번째 API: 하단 3개 카드 컴포넌트 */}
            <div className="grid grid-cols-3 gap-4">
              {/* 달성율% 카드 */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-1 w-full bg-white/20 mb-3" />
                <div className="p-3">
                  <div className="flex items-center justify-end mb-2">
                    <div className="text-xs text-slate-200">단위: 억원</div>
                  </div>
                  {data?.chartData1 && data.chartData1.labels.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 relative">
                      {/* 매출액 도넛 차트 */}
                      <div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32">
                            <Doughnut
                              data={{
                                labels: ['달성', '미달성'],
                                datasets: [{
                                  data: [
                                    data.chartData1.ACTUAL_SALES, 
                                    data.chartData1.PLANNED_SALES - data.chartData1.ACTUAL_SALES
                                  ],
                                  backgroundColor: ['#3b82f6', '#64748b'],
                                  borderWidth: 0
                                }]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '70%',
                                plugins: {
                                  legend: {
                                    display: false
                                  }
                                }
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl font-bold text-blue-100">
                                  {data.chartData1.PLANNED_SALES && data.chartData1.ACTUAL_SALES 
                                    ? Math.round((data.chartData1.ACTUAL_SALES / data.chartData1.PLANNED_SALES) * 100)
                                    : 0}%
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center text-sm text-blue-100 mt-2 gap-4">
                            <div className="flex items-center whitespace-nowrap">
                              <span className="inline-block w-2 h-2 bg-slate-400 mr-1"></span>
                              계획: {data.chartData1.PLANNED_SALES.toLocaleString()}
                            </div>
                            <div className="flex items-center whitespace-nowrap">
                              <span className="inline-block w-2 h-2 bg-blue-500 mr-1"></span>
                              실적: {data.chartData1.ACTUAL_SALES.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <div className="text-sm font-medium text-blue-100">매출액</div>
                        </div>
                      </div>

                      {/* 영업이익 도넛 차트 */}
                      <div>
                        <div className="flex flex-col items-center">
                          <div className="relative w-32 h-32">
                            <Doughnut
                              data={{
                                labels: ['달성', '미달성'],
                                datasets: [{
                                  data: [
                                    data.chartData1.ACTUAL_OP_PROFIT, 
                                    data.chartData1.PLANNED_OP_PROFIT - data.chartData1.ACTUAL_OP_PROFIT
                                  ],
                                  backgroundColor: ['#10b981', '#64748b'],
                                  borderWidth: 0
                                }]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                cutout: '70%',
                                plugins: {
                                  legend: {
                                    display: false
                                  }
                                }
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl font-bold text-emerald-100">
                                  {data.chartData1.PLANNED_OP_PROFIT && data.chartData1.ACTUAL_OP_PROFIT 
                                    ? Math.round((data.chartData1.ACTUAL_OP_PROFIT / data.chartData1.PLANNED_OP_PROFIT) * 100)
                                    : 0}%
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center text-sm text-emerald-100 mt-2 gap-4">
                            <div className="flex items-center whitespace-nowrap">
                              <span className="inline-block w-2 h-2 bg-slate-400 mr-1"></span>
                              계획: {data.chartData1.PLANNED_OP_PROFIT.toLocaleString()}
                            </div>
                            <div className="flex items-center whitespace-nowrap">
                              <span className="inline-block w-2 h-2 bg-emerald-500 mr-1"></span>
                              실적: {data.chartData1.ACTUAL_OP_PROFIT.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <div className="text-sm font-medium text-emerald-100">영업이익</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-white/50">
                      데이터를 불러오는 중...
                    </div>
                  )}
                </div>
              </Card>

              {/* 매출액 차트 */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-1 w-full bg-white/20 mb-3" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-base font-medium text-white">
                      <DollarSign className="w-5 h-5" />
                      매출액
                    </div>
                    <div className="text-xs text-slate-200">단위: 억원</div>
                  </div>
                  <div style={{ height: '160px' }}>
                    {data?.chartData2 && data.chartData2.labels.length > 0 ? (
                      <Bar 
                        data={data.chartData2}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              align: 'end',
                              labels: {
                                boxWidth: 12,
                                padding: 12,
                                color: '#f1f5f9',
                                font: {
                                  size: 11,
                                  weight: 'normal'
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              border: {
                                display: false
                              },
                              grid: {
                                color: '#475569'
                              },
                              ticks: {
                                color: '#f1f5f9',
                                font: {
                                  size: 11,
                                  weight: 'normal'
                                }
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                color: '#f1f5f9',
                                font: {
                                  size: 11,
                                  weight: 'normal'
                                }
                              }
                            }
                          },
                          // 차트 렌더링 개선을 위한 설정
                          layout: {
                            padding: {
                              top: 10,
                              bottom: 10,
                              left: 5,
                              right: 5
                            }
                          },
                          elements: {
                            bar: {
                              borderWidth: 2,
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 4
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white/50">
                        {loading ? '데이터를 불러오는 중...' : '데이터가 없습니다'}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* 영업이익 차트 */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-1 w-full bg-white/20 mb-3" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-base font-medium text-white">
                      <TrendingUp className="w-5 h-5" />
                      영업이익
                    </div>
                    <div className="text-xs text-slate-200">단위: 억원</div>
                  </div>
                  <div style={{ height: '160px' }}>
                    {data?.chartData3 && data.chartData3.labels.length > 0 ? (
                      <Bar
                        data={data.chartData3}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              align: 'end',
                              labels: {
                                boxWidth: 12,
                                padding: 12,
                                color: '#f1f5f9',
                                font: {
                                  size: 11,
                                  weight: 'normal'
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              border: {
                                display: false
                              },
                              grid: {
                                color: '#475569'
                              },
                              ticks: {
                                color: '#f1f5f9',
                                font: {
                                  size: 11,
                                  weight: 'normal'
                                }
                              }
                            },
                            x: {
                              grid: {
                                display: false
                              },
                              ticks: {
                                color: '#f1f5f9',
                                font: {
                                  size: 11,
                                  weight: 'normal'
                                }
                              }
                            }
                          },
                          layout: {
                            padding: {
                              top: 10,
                              bottom: 10,
                              left: 5,
                              right: 5
                            }
                          },
                          elements: {
                            bar: {
                              borderWidth: 2,
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: 4
                            }
                          }
                        }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-white/50">
                          {loading ? '데이터를 불러오는 중...' : '데이터가 없습니다'}
                        </div>
                      )}
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 