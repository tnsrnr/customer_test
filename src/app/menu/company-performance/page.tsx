'use client';

import { Card } from '@/components/card';
import { PerformanceTable } from './components/performance-table';
import { useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, BarChart3, Building2, Users, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Bar, Doughnut } from 'react-chartjs-2';
import { useCompanyPerformanceStore } from './store';

// 전역 Chart.js 설정 사용
import '@/lib/chart-config';

export default function CompanyPerformancePage() {
  const { periodType, setPeriodType } = useCompanyPerformanceStore();

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

        {/* KPI 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 w-full mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-1">총 매출액</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white leading-none">2,619</span>
                    <span className="ml-1 text-sm font-medium text-white">억원</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-red-300 bg-red-800/20 px-2 py-1 rounded-full border border-red-600/20">▼ 967억원</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-1">영업이익</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white leading-none">26</span>
                    <span className="ml-1 text-sm font-medium text-white">억원</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-red-300 bg-red-800/20 px-2 py-1 rounded-full border border-red-600/20">▼ 68억원</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-1">영업이익율</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white leading-none">1.0</span>
                    <span className="ml-1 text-sm font-medium text-white">%</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-red-300 bg-red-800/20 px-2 py-1 rounded-full border border-red-600/20">▼ 1.6%</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-1">달성율</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-white leading-none">73</span>
                    <span className="ml-1 text-sm font-medium text-white">%</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-300 bg-slate-700/20 px-2 py-1 rounded-full border border-slate-500/20">평균</span>
            </div>
          </motion.div>
        </div>

        {/* 테이블 섹션 */}
        <Card className="p-4 shadow-lg rounded-xl bg-white/5 backdrop-blur-md border border-white/10 h-[calc(100vh-36rem)]">
          <div className="overflow-x-auto flex-1">
            <PerformanceTable />
          </div>
        </Card>

        {/* 하단 차트 섹션 */}
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
      </div>
    </div>
  );
} 