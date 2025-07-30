'use client';

import { Card } from "@/components/card";
import { Bar, Doughnut } from 'react-chartjs-2';
import { PerformanceTable } from './components/performance-table';
import { useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, BarChart3, Building2, Users, Target, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// 전역 Chart.js 설정 사용
import '@/lib/chart-config';

export default function CompanyPerformancePage() {
  const [periodType, setPeriodType] = useState<'monthly' | 'cumulative'>('cumulative');
  
  useEffect(() => {
    console.log('CompanyPerformancePage mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900/80 via-slate-900/80 to-slate-800/80 relative overflow-hidden">
      <div className="relative z-10 h-[calc(100vh-64px)] p-6 space-y-4 overflow-hidden">
        {/* 기간 선택 버튼 */}
        <div className="flex justify-end mb-2">
          <div className="flex space-x-1 p-0.5 bg-white/20 backdrop-blur-sm rounded-lg shadow-lg border border-white/30">
            <button
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${periodType === 'monthly' ? 'bg-white/30 text-white border border-white/40' : 'text-blue-200 hover:bg-white/15 hover:text-white'}`}
              onClick={() => setPeriodType('monthly')}
            >
              월별조회
            </button>
            <button
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${periodType === 'cumulative' ? 'bg-white/30 text-white border border-white/40' : 'text-blue-200 hover:bg-white/15 hover:text-white'}`}
              onClick={() => setPeriodType('cumulative')}
            >
              누적조회
            </button>
          </div>
        </div>

        {/* KPI 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 w-full mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-4 bg-gradient-to-br from-blue-800/40 to-blue-700/40 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-600/30"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-600/60 to-blue-500/60 rounded-lg shadow-md">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-base font-semibold text-white">총 매출액</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-blue-100 leading-none">2,619</span>
                    <span className="ml-1 text-base font-semibold text-blue-100">억원</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-300 bg-red-800/30 px-3 py-1 rounded-full border border-red-600/30">▼ 967억원</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 bg-gradient-to-br from-emerald-800/40 to-emerald-700/40 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-emerald-600/30"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-600/60 to-emerald-500/60 rounded-lg shadow-md">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-base font-semibold text-white">영업이익</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-emerald-100 leading-none">26</span>
                    <span className="ml-1 text-base font-semibold text-emerald-100">억원</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-300 bg-red-800/30 px-3 py-1 rounded-full border border-red-600/30">▼ 68억원</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-4 bg-gradient-to-br from-purple-800/40 to-purple-700/40 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-600/30"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-600/60 to-purple-500/60 rounded-lg shadow-md">
                  <Percent className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-base font-semibold text-white">영업이익율</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-purple-100 leading-none">1.0</span>
                    <span className="ml-1 text-base font-semibold text-purple-100">%</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-300 bg-red-800/30 px-3 py-1 rounded-full border border-red-600/30">▼ 1.6%</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 bg-gradient-to-br from-sky-800/40 to-sky-700/40 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-sky-600/30"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-sky-600/60 to-sky-500/60 rounded-lg shadow-md">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-base font-semibold text-white">달성율</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-sky-100 leading-none">73</span>
                    <span className="ml-1 text-base font-semibold text-sky-100">%</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-300 bg-slate-700/30 px-3 py-1 rounded-full border border-slate-500/30">평균</span>
            </div>
          </motion.div>
        </div>

        {/* 테이블 섹션 */}
        <Card className="p-6 shadow-2xl rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 h-[calc(100vh-36rem)]">
          <div className="overflow-x-auto flex-1">
            <PerformanceTable />
          </div>
        </Card>

        {/* 하단 차트 섹션 */}
        <div className="grid grid-cols-3 gap-2">
          {/* 달성율% 카드 */}
          <Card className="bg-blue-800/40 border border-blue-600/30 shadow-sm rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="h-1 w-full bg-blue-600/40 mb-2" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-base font-bold text-white mb-2">
                <Percent className="w-5 h-5" />
                달성율
              </div>
              <div className="grid grid-cols-2 gap-6 relative">
                {/* 매출액 도넛 차트 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-blue-200">매출액</div>
                    <div className="text-xs text-blue-300">단위: 억원</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-[140px]" style={{ height: '140px' }}>
                      <Doughnut
                        data={{
                          labels: ['달성', '미달성'],
                          datasets: [{
                            data: [73, 27],
                            backgroundColor: ['#475569', '#E2E8F0'],
                            borderWidth: 0
                          }]
                        }}
                        options={{
                          cutout: '70%',
                          rotation: 0,
                          circumference: 360,
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              enabled: false
                            }
                          },
                          responsive: true,
                          maintainAspectRatio: true
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-200">73%</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center text-xs text-blue-200">
                      <div className="flex items-center whitespace-nowrap mb-1">
                        <span className="inline-block w-2 h-2 bg-[#E5E5E5] mr-1.5"></span>
                        <span>계획: 3,586</span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className="inline-block w-2 h-2 bg-slate-600 mr-1.5"></span>
                        <span>실적: 2,619</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="absolute left-1/2 top-4 bottom-4 w-px bg-blue-600/40 -translate-x-1/2"></div>

                {/* 영업이익 도넛 차트 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-blue-200">영업이익</div>
                    <div className="text-xs text-blue-300">단위: 억원</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-[140px]" style={{ height: '140px' }}>
                      <Doughnut
                        data={{
                          labels: ['달성', '미달성'],
                          datasets: [{
                            data: [28, 72],
                            backgroundColor: ['#2E6BAE', '#E5E5E5'],
                            borderWidth: 0
                          }]
                        }}
                        options={{
                          cutout: '70%',
                          rotation: 0,
                          circumference: 360,
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              enabled: false
                            }
                          },
                          responsive: true,
                          maintainAspectRatio: true
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-300">28%</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center text-xs text-blue-200">
                      <div className="flex items-center whitespace-nowrap mb-1">
                        <span className="inline-block w-2 h-2 bg-[#E5E5E5] mr-1.5"></span>
                        <span>계획: 94</span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className="inline-block w-2 h-2 bg-[#2E6BAE] mr-1.5"></span>
                        <span>실적: 26</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 매출액 차트 */}
          <Card className="bg-slate-700/40 border border-slate-600/30 shadow-sm rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="h-1 w-full bg-slate-600/40 mb-2" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-base font-bold text-white mb-2">
                <DollarSign className="w-5 h-5" />
                매출액
              </div>
              <div className="text-xs text-slate-300 text-right mb-2">단위: 억원</div>
              <div style={{ height: '140px' }}>
                <Bar
                  data={{
                    labels: ['본사', '국내자회사', '해외자회사'],
                    datasets: [
                      {
                        label: '계획',
                        data: [1095, 360, 2131],
                        backgroundColor: '#E2E8F0',
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
                          color: '#E5E7EB',
                          font: {
                            size: 11
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
                          color: '#374151'
                        },
                        ticks: {
                          color: '#E5E7EB',
                          font: {
                            size: 11
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          color: '#E5E7EB',
                          font: {
                            size: 11
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
          <Card className="bg-indigo-800/40 border border-indigo-600/30 shadow-sm rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="h-1 w-full bg-indigo-600/40 mb-2" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-base font-bold text-white mb-2">
                <TrendingUp className="w-5 h-5" />
                영업이익
              </div>
              <div className="text-xs text-indigo-300 text-right mb-2">단위: 억원</div>
              <div style={{ height: '140px' }}>
                <Bar
                  data={{
                    labels: ['본사', '국내자회사', '해외자회사'],
                    datasets: [
                      {
                        label: '계획',
                        data: [37, 11, 46],
                        backgroundColor: '#E2E8F0',
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
                          color: '#E5E7EB',
                          font: {
                            size: 11
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
                          color: '#374151'
                        },
                        ticks: {
                          color: '#E5E7EB',
                          font: {
                            size: 11
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          color: '#E5E7EB',
                          font: {
                            size: 11
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