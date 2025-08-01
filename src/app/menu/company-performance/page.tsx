'use client';

import { Card } from '@/components/card';
import { PerformanceTable } from './components/performance-table';
import { useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, BarChart3, Building2, Users, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import { useCompanyPerformanceStore } from './store';
import { useGlobalStore } from '@/store/global';

// 전역 Chart.js 설정 사용
import '@/lib/chart-config';

export default function CompanyPerformancePage() {
  const { 
    data, 
    loading, 
    error, 
    periodType, 
    setPeriodType, 
    fetchAllData,
    kpiLoading,
    gridLoading,
    chart1Loading,
    chart2Loading,
    chart3Loading
  } = useCompanyPerformanceStore();

  const { setCurrentPage, isRefreshing } = useGlobalStore();

  // 컴포넌트 마운트 시 데이터 로드 및 현재 페이지 설정
  useEffect(() => {
    setCurrentPage('company-performance');
    fetchAllData();
  }, [fetchAllData, setCurrentPage]);

  // 전역 조회 이벤트 감지
  useEffect(() => {
    if (isRefreshing) {
      console.log('🔄 company-performance 페이지 조회 실행');
      // 부드러운 데이터 갱신을 위해 로딩 상태만 변경
      fetchAllData();
    }
  }, [isRefreshing, fetchAllData]);

  // 기간 변경 시 데이터 재로드
  useEffect(() => {
    if (data) {
      fetchAllData();
    }
  }, [periodType, fetchAllData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 h-[calc(100vh-64px)] p-4 space-y-4 overflow-hidden">
        {/* 기간 선택 버튼 */}
        <div className="flex justify-end mb-2">
          <div className="flex space-x-1 p-0.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                periodType === 'monthly' 
                  ? 'bg-white/20 text-white shadow-md border border-white/30' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setPeriodType('monthly')}
            >
              월별조회
            </button>
            <button
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                periodType === 'cumulative' 
                  ? 'bg-white/20 text-white shadow-md border border-white/30' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setPeriodType('cumulative')}
            >
              누적조회
            </button>
          </div>
        </div>

        {/* 로딩 상태 표시 */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 w-full mx-auto">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center h-full">
                  <div className="p-2.5 bg-white/10 rounded-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-blue-100">총 매출액</span>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-white">{data.kpiMetrics.ACTUAL_SALES}</span>
                        <span className="text-lg font-medium text-white ml-1">억원</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-300 bg-slate-700/20 px-3 py-1.5 rounded-full border border-slate-500/20">실시간</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center h-full">
                  <div className="p-2.5 bg-white/10 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-blue-100">영업이익</span>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-white">{data.kpiMetrics.ACTUAL_OP_PROFIT}</span>
                        <span className="text-lg font-medium text-white ml-1">억원</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-300 bg-slate-700/20 px-3 py-1.5 rounded-full border border-slate-500/20">실시간</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center h-full">
                  <div className="p-2.5 bg-white/10 rounded-lg">
                    <Percent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-blue-100">영업이익률</span>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-white">{data.kpiMetrics.ACTUAL_OP_MARGIN}</span>
                        <span className="text-lg font-medium text-white ml-1">%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-300 bg-slate-700/20 px-3 py-1.5 rounded-full border border-slate-500/20">실시간</span>
                </div>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center h-full">
                  <div className="p-2.5 bg-white/10 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-medium text-blue-100">매출 달성률</span>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-white">{data.kpiMetrics.SALES_ACHIEVEMENT}</span>
                        <span className="text-lg font-medium text-white ml-1">%</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-300 bg-slate-700/20 px-3 py-1.5 rounded-full border border-slate-500/20">실시간</span>
                </div>
              </motion.div>
            </div>

            {/* 2번째 API: 중간 그리드 테이블 */}
            <div className="mb-4">
              <PerformanceTable data={data.gridData.divisions} loading={gridLoading} />
            </div>

            {/* 3~5번째 API: 하단 3개 카드 컴포넌트 */}
            <div className="grid grid-cols-3 gap-4">
              {/* 달성율% 카드 */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-1 w-full bg-white/20 mb-3" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-base font-medium text-white mb-3">
                    <Percent className="w-5 h-5" />
                    달성율
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative">
                    {/* 매출액 도넛 차트 */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-blue-100">매출액</div>
                        <div className="text-xs text-blue-200">단위: 억원</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20">
                          <Doughnut
                            data={{
                              labels: ['달성', '미달성'],
                              datasets: [{
                                data: [73, 27],
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
                              <div className="text-lg font-bold text-blue-100">73%</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center text-xs text-blue-100">
                          <div className="flex items-center whitespace-nowrap mb-1">
                            <span className="inline-block w-2 h-2 bg-slate-400 mr-1.5"></span>
                            계획: 3,586
                          </div>
                          <div className="flex items-center whitespace-nowrap">
                            <span className="inline-block w-2 h-2 bg-blue-500 mr-1.5"></span>
                            실적: 2,619
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 영업이익 도넛 차트 */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium text-blue-100">영업이익</div>
                        <div className="text-xs text-blue-200">단위: 억원</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative w-20 h-20">
                          <Doughnut
                            data={{
                              labels: ['달성', '미달성'],
                              datasets: [{
                                data: [28, 72],
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
                              <div className="text-lg font-bold text-emerald-100">28%</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center text-xs text-blue-100">
                          <div className="flex items-center whitespace-nowrap mb-1">
                            <span className="inline-block w-2 h-2 bg-slate-400 mr-1.5"></span>
                            계획: 94
                          </div>
                          <div className="flex items-center whitespace-nowrap">
                            <span className="inline-block w-2 h-2 bg-emerald-500 mr-1.5"></span>
                            실적: 26
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 매출액 차트 */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-1 w-full bg-white/20 mb-3" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-base font-medium text-white mb-3">
                    <DollarSign className="w-5 h-5" />
                    매출액
                  </div>
                  <div className="text-xs text-slate-200 text-right mb-2">단위: 억원</div>
                  <div style={{ height: '140px' }}>
                    <Bar 
                      data={{
                        labels: ['본사', '국내자회사', '해외자회사'],
                        datasets: [
                          {
                            label: '계획',
                            data: [1195, 376, 2015],
                            backgroundColor: '#94a3b8',
                            borderRadius: 0,
                            barThickness: 20,
                          },
                          {
                            label: '실적',
                            data: [934, 294, 1392],
                            backgroundColor: '#475569',
                            borderRadius: 0,
                            barThickness: 20,
                          }
                        ]
                      }}
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
                        }
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* 영업이익 차트 */}
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-1 w-full bg-white/20 mb-3" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-base font-medium text-white mb-3">
                    <TrendingUp className="w-5 h-5" />
                    영업이익
                  </div>
                  <div className="text-xs text-slate-200 text-right mb-2">단위: 억원</div>
                  <div style={{ height: '140px' }}>
                    <Bar
                      data={{
                        labels: ['본사', '국내자회사', '해외자회사'],
                        datasets: [
                          {
                            label: '계획',
                            data: [37, 11, 46],
                            backgroundColor: '#94a3b8',
                            borderRadius: 0,
                            barThickness: 20,
                          },
                          {
                            label: '실적',
                            data: [-9, 3, 32],
                            backgroundColor: '#475569',
                            borderRadius: 0,
                            barThickness: 20,
                          }
                        ]
                      }}
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
                        }
                      }}
                    />
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