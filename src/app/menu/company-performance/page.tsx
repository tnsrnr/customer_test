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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 space-y-4">
      {/* 상단 헤더 */}
      <div className="flex justify-end items-center mb-2">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
          <button
            onClick={() => setPeriodType('monthly')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              periodType === 'monthly'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3 h-3" />
            월별조회
          </button>
          <button
            onClick={() => setPeriodType('cumulative')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              periodType === 'cumulative'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3 h-3" />
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
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">총 매출액</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-700 leading-none">2,619</span>
                  <span className="ml-1 text-base font-semibold text-blue-700">억원</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">▼ 967억원</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">영업이익</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-emerald-700 leading-none">26</span>
                  <span className="ml-1 text-base font-semibold text-emerald-700">억원</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">▼ 68억원</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <Percent className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">영업이익율</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-purple-700 leading-none">1.0</span>
                  <span className="ml-1 text-base font-semibold text-purple-700">%</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">▼ 1.6%</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-sky-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg shadow-md">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">달성율</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-sky-700 leading-none">73</span>
                  <span className="ml-1 text-base font-semibold text-sky-700">%</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">평균</span>
          </div>
        </motion.div>
      </div>

      {/* 테이블 섹션 */}
              <Card className="p-6 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
        <div className="overflow-x-auto flex-1">
          <PerformanceTable />
        </div>
      </Card>

      {/* 하단 차트 섹션 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 달성율% 카드 */}
        <Card className="bg-blue-50 border border-blue-100 shadow-sm rounded-xl overflow-hidden">
          <div className="h-1 w-full bg-blue-200 mb-2" />
          <div className="p-4">
            <div className="flex items-center gap-2 text-base font-bold text-blue-800 mb-2">
              <Percent className="w-5 h-5" />
              달성율
            </div>
            <div className="grid grid-cols-2 gap-6 relative">
              {/* 매출액 도넛 차트 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-600">매출액</div>
                  <div className="text-xs text-gray-500">단위: 억원</div>
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
                        <div className="text-2xl font-bold text-slate-600">73%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-xs text-gray-600">
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
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gray-200 -translate-x-1/2"></div>

              {/* 영업이익 도넛 차트 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-600">영업이익</div>
                  <div className="text-xs text-gray-500">단위: 억원</div>
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
                        <div className="text-2xl font-bold text-[#2E6BAE]">28%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-xs text-gray-600">
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
        <Card className="bg-slate-100 border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="h-1 w-full bg-slate-300 mb-2" />
          <div className="p-4">
            <div className="flex items-center gap-2 text-base font-bold text-blue-800 mb-2">
              <DollarSign className="w-5 h-5" />
              매출액
            </div>
            <div className="text-xs text-gray-500 text-right mb-2">단위: 억원</div>
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
                        color: '#666666',
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
                        color: '#E5E5E5'
                      },
                      ticks: {
                        color: '#666666',
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
                        color: '#666666',
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
        <Card className="bg-indigo-50 border border-indigo-100 shadow-sm rounded-xl overflow-hidden">
          <div className="h-1 w-full bg-indigo-200 mb-2" />
          <div className="p-4">
            <div className="flex items-center gap-2 text-base font-bold text-blue-800 mb-2">
              <TrendingUp className="w-5 h-5" />
              영업이익
            </div>
            <div className="text-xs text-gray-500 text-right mb-2">단위: 억원</div>
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
                        color: '#666666',
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
                        color: '#E5E5E5'
                      },
                      ticks: {
                        color: '#666666',
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
                        color: '#666666',
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
  );
} 