'use client';

import { Card } from "@/components/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { PerformanceTable } from './components/performance-table';
import { useEffect } from 'react';
import { DollarSign, TrendingUp, Percent, BarChart3 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function CompanyPerformancePage() {
  useEffect(() => {
    console.log('CompanyPerformancePage mounted');
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 space-y-4">
      {/* 상단 섹션 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 왼쪽 카드 */}
        <Card className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4">
            <h2 className="text-base font-bold text-slate-800 mb-1">HTNS그룹 전사 경영실적 (1~5월)</h2>
            <p className="text-xs text-slate-500 mb-3">HTNS Business performance 2025.May</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-100 rounded-xl shadow-md p-5 flex flex-col items-start min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-slate-800">매출액</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-700">2,619 <span className="text-lg font-bold">억원</span></div>
              </div>
              <div className="flex-1 bg-slate-100 rounded-xl shadow-md p-5 flex flex-col items-start min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-slate-800">영업이익</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-700">26 <span className="text-lg font-bold">억원</span></div>
              </div>
              <div className="flex-1 bg-slate-100 rounded-xl shadow-md p-5 flex flex-col items-start min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-slate-800">영업이익율</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-700">1.0 <span className="text-lg font-bold">%</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* 오른쪽 카드 */}
        <Card className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4">
            <h2 className="text-base font-bold text-slate-800 mb-1">실적 달성율 (계획 比) 1~5월</h2>
            <p className="text-xs text-slate-500 mb-3">Attainment rate 2025.May</p>
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-100 rounded-xl shadow-md p-5 flex flex-col items-start min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-slate-800">본사</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-700">85%</div>
              </div>
              <div className="flex-1 bg-slate-100 rounded-xl shadow-md p-5 flex flex-col items-start min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-slate-800">국내자회사</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-700">82%</div>
              </div>
              <div className="flex-1 bg-slate-100 rounded-xl shadow-md p-5 flex flex-col items-start min-w-[140px]">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-medium text-slate-800">해외자회사</span>
                </div>
                <div className="text-2xl font-extrabold text-blue-700">65%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 테이블 섹션 */}
      <Card style={{ height: 400, width: '100%', padding: 0, boxSizing: 'border-box' }}>
        <div style={{ height: '100%' }}>
          <PerformanceTable />
        </div>
      </Card>

      {/* 하단 차트 섹션 */}
      <div className="grid grid-cols-3 gap-4">
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

