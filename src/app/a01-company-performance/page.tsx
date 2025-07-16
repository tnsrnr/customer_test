'use client';

import { Card } from "@/components/ui/card";
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
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 space-y-4">
      {/* 상단 섹션 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 왼쪽 카드 */}
        <Card className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4">
            <h2 className="text-base font-bold text-slate-800 mb-1">HTNS그룹 전사 경영실적 (1~5월)</h2>
            <p className="text-xs text-slate-500 mb-3">HTNS Business performance 2025.May</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-600 rounded-lg p-3 text-white ring-1 ring-slate-400/20">
                <div className="text-xs text-slate-100 mb-1">매출액</div>
                <div className="text-xl font-bold tracking-tight">2,619<span className="text-sm ml-1">억원</span></div>
              </div>
              <div className="bg-slate-600 rounded-lg p-3 text-white ring-1 ring-slate-400/20">
                <div className="text-xs text-slate-100 mb-1">영업이익</div>
                <div className="text-xl font-bold tracking-tight">26<span className="text-sm ml-1">억원</span></div>
              </div>
              <div className="bg-slate-700 rounded-lg p-3 text-white ring-1 ring-slate-400/20">
                <div className="text-xs text-slate-100 mb-1">영업이익율</div>
                <div className="text-xl font-bold tracking-tight">1.0<span className="text-sm ml-1">%</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* 오른쪽 카드 */}
        <Card className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4">
            <h2 className="text-base font-bold text-slate-800 mb-1">실적 달성율 (계획 比) 1~5월</h2>
            <p className="text-xs text-slate-500 mb-3">Attainment rate 2025.May</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-600 rounded-lg p-3 text-white ring-1 ring-slate-400/20">
                <div className="text-xs text-slate-100 mb-1">본사</div>
                <div className="text-xl font-bold tracking-tight">85%</div>
              </div>
              <div className="bg-slate-600 rounded-lg p-3 text-white ring-1 ring-slate-400/20">
                <div className="text-xs text-slate-100 mb-1">국내자회사</div>
                <div className="text-xl font-bold tracking-tight">82%</div>
              </div>
              <div className="bg-slate-600 rounded-lg p-3 text-white ring-1 ring-slate-400/20">
                <div className="text-xs text-slate-100 mb-1">해외자회사</div>
                <div className="text-xl font-bold tracking-tight">65%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 테이블 섹션 */}
      <Card className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2.5 px-3 text-left font-semibold text-gray-600" rowSpan={2}>구분</th>
                <th colSpan={3} className="py-2.5 px-3 text-center font-semibold text-gray-800 bg-blue-100/50 border-l-2 border-r-2 border-gray-200">계획 ('25년 5월 누적)</th>
                <th colSpan={3} className="py-2.5 px-3 text-center font-semibold text-gray-800 bg-emerald-100/50 border-r-2 border-gray-200">실적 ('25년 5월 누적)</th>
                <th colSpan={2} className="py-2.5 px-3 text-center font-semibold text-gray-800 bg-violet-100/50">달성율 (계획 比)</th>
              </tr>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-blue-100/50 border-l-2 border-gray-200">매출액</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-blue-100/50">영업이익</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-blue-100/50 border-r-2 border-gray-200">영업이익율</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-emerald-100/50">매출액</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-emerald-100/50">영업이익</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-emerald-100/50 border-r-2 border-gray-200">영업이익율</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-violet-100/50">매출액</th>
                <th className="py-2.5 px-3 text-center font-medium text-gray-600 bg-violet-100/50">영업이익</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-200 hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-semibold text-gray-700">본사</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-l-2 border-gray-200">1,095</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30">37</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/30 border-r-2 border-gray-200">3.4%</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30">934</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 text-red-600 font-medium">-9</td>
                <td className="py-2.5 px-3 text-right bg-emerald-50/30 text-red-600 border-r-2 border-gray-200">-0.9%</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/30 text-blue-700 font-semibold">85%</td>
                <td className="py-2.5 px-3 text-right bg-violet-50/20 font-medium">적자</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-semibold text-gray-700">국내자회사</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/20 border-l-2 border-gray-200">360</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/20">11</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/20 border-r-2 border-gray-200">3.1%</td>
                <td className="py-2.5 px-3 text-right bg-green-50/20">294</td>
                <td className="py-2.5 px-3 text-right bg-green-50/20">3</td>
                <td className="py-2.5 px-3 text-right bg-green-50/20 border-r-2 border-gray-200">0.9%</td>
                <td className="py-2.5 px-3 text-right bg-purple-50/20 text-blue-700 font-semibold">82%</td>
                <td className="py-2.5 px-3 text-right bg-purple-50/20 font-medium">24%</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-semibold text-gray-700">해외자회사</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/20 border-l-2 border-gray-200">2,131</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/20">46</td>
                <td className="py-2.5 px-3 text-right bg-blue-50/20 border-r-2 border-gray-200">2.1%</td>
                <td className="py-2.5 px-3 text-right bg-green-50/20">1,392</td>
                <td className="py-2.5 px-3 text-right bg-green-50/20">32</td>
                <td className="py-2.5 px-3 text-right bg-green-50/20 border-r-2 border-gray-200">2.3%</td>
                <td className="py-2.5 px-3 text-right bg-purple-50/20 text-blue-700 font-semibold">65%</td>
                <td className="py-2.5 px-3 text-right bg-purple-50/20 font-medium">70%</td>
              </tr>
              <tr className="border-b-2 border-gray-200 bg-gray-50/50">
                <td className="py-2.5 px-3 font-bold text-gray-800">합계</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-blue-50/30 border-l-2 border-gray-200">3,586</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-blue-50/30">94</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-blue-50/30 border-r-2 border-gray-200">2.6%</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-green-50/30">2,619</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-green-50/30">26</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-green-50/30 border-r-2 border-gray-200">1.0%</td>
                <td className="py-2.5 px-3 text-right font-bold text-blue-700 bg-purple-50/30">73%</td>
                <td className="py-2.5 px-3 text-right font-bold text-gray-800 bg-purple-50/30">28%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 하단 차트 섹션 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 달성율% 카드 */}
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-600 py-2 px-3">
            <h3 className="text-base text-white text-center font-normal">달성율%</h3>
          </div>
          <div className="p-4">
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
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-600 py-2 px-3">
            <h3 className="text-base text-white text-center font-normal">매출액</h3>
          </div>
          <div className="p-4">
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
        <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-600 py-2 px-3">
            <h3 className="text-base text-white text-center font-normal">영업이익</h3>
          </div>
          <div className="p-4">
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

