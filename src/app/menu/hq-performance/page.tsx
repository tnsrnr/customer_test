'use client';

import { Card } from "@/components/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function HQPerformancePage() {
  // 월별 상세 데이터
  const monthlyDetailData = [
    {
      category: '매출',
      jan: 175,
      feb: 165,
      mar: 195,
      apr: 211,
      may: 188,
      total: 934,
      growth: '▼11%'
    },
    {
      category: '매출원가',
      jan: 169,
      feb: 160,
      mar: 187,
      apr: 205,
      may: 179,
      total: 900,
      growth: '▼13%'
    },
    {
      category: '매출총이익',
      jan: 5.6,
      feb: 5.9,
      mar: 8.1,
      apr: 5.7,
      may: 8.6,
      total: 34,
      growth: '▲50%'
    },
    {
      category: '관리비',
      jan: 8.6,
      feb: 9.1,
      mar: 8.1,
      apr: 8.3,
      may: 8.5,
      total: 43,
      growth: '▲3%'
    },
    {
      category: '영업이익',
      jan: -3.0,
      feb: -3.2,
      mar: 0.1,
      apr: -2.6,
      may: 0.0,
      total: -8.6,
      growth: '손익분기점'
    },
    {
      category: '영업이익율',
      jan: '-1.73%',
      feb: '-1.91%',
      mar: '0.03%',
      apr: '-1.22%',
      may: '0.03%',
      total: '-0.92%',
      growth: '개선'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* 페이지 헤더 */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-slate-600 rounded"></div>
          <h1 className="text-lg font-bold text-slate-800">HTNS 본사 당월실적 현황 (5월)</h1>
        </div>
        <p className="text-xs text-slate-500">HTNS Head office Performance 2025. May</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 상단 좌측 - 핵심 KPI 대시보드 */}
        <div className="col-span-3">
          <Card className="overflow-hidden h-full">
            <div className="bg-slate-600 text-white text-center py-2">
              <div className="text-sm font-semibold">핵심 성과 지표 (KPI)</div>
            </div>
            <div className="p-3">
              {/* 핵심 지표 - 합쳐진 카드 */}
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-900">
                  <div className="flex items-center gap-2 mx-16">
                    <div className="flex-1">
                      <div className="text-xs text-blue-900 font-medium mb-1">당월 매출</div>
                      <div className="text-lg font-bold text-blue-900">188억원</div>
                      <div className="text-xs text-amber-700">▼11% (전월대비)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-900 font-medium mb-1">목표 달성률</div>
                      <div className="text-lg font-bold text-blue-900">85%</div>
                      <div className="text-xs text-slate-600">매출 기준</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-800">
                  <div className="flex items-center gap-2 mx-16">
                    <div className="flex-1">
                      <div className="text-xs text-amber-800 font-medium mb-1">영업이익</div>
                      <div className="text-lg font-bold text-amber-900">0.0억원</div>
                      <div className="text-xs text-amber-700">손익분기점 달성</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-800 font-medium mb-1">영업이익율</div>
                      <div className="text-lg font-bold text-amber-900">0.03%</div>
                      <div className="text-xs text-amber-700">개선</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 세부 지표 */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-slate-100 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-500 mb-1">매출총이익</div>
                  <div className="text-sm font-semibold text-slate-700">8.6억원</div>
                  <div className="text-xs text-green-500">▲50%</div>
                </div>
                <div className="bg-slate-100 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-500 mb-1">관리비</div>
                  <div className="text-sm font-semibold text-slate-700">8.5억원</div>
                  <div className="text-xs text-red-500">▲3%</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 상단 우측 - 월별 트렌드 차트 */}
        <div className="col-span-9">
          <Card className="p-3 h-full">
            <div className="bg-slate-600 text-white text-center py-2 -mx-3 -mt-3 mb-3">
              <div className="text-sm font-semibold">월별 트렌드 (최근 12개월)</div>
            </div>
            <div className="text-right text-xs text-slate-500 mb-2">단위: 억원</div>
            <div className="h-56">
              <Chart
                type="line"
                data={{
                  labels: ['24년6월', '7월', '8월', '9월', '10월', '11월', '12월', '25년1월', '2월', '3월', '4월', '5월'],
                  datasets: [
                    {
                      type: 'bar' as const,
                      label: '매출',
                      data: [237, 247, 238, 210, 215, 214, 232, 175, 165, 195, 211, 188],
                      backgroundColor: 'rgba(30, 58, 138, 0.8)',
                      borderColor: 'rgb(30, 58, 138)',
                      borderWidth: 1,
                      yAxisID: 'y',
                    },
                    {
                      type: 'bar' as const,
                      label: '매출원가',
                      data: [228, 238, 230, 203, 208, 207, 224, 169, 160, 187, 205, 179],
                      backgroundColor: 'rgba(75, 85, 99, 0.8)',
                      borderColor: 'rgb(75, 85, 99)',
                      borderWidth: 1,
                      yAxisID: 'y',
                    },
                    {
                      type: 'line' as const,
                      label: '영업이익',
                      data: [0.8, 0.2, -0.8, -1.2, -1.8, -1.5, -0.3, -3.0, -3.2, 0.1, -2.6, 0.0],
                      borderColor: 'rgb(120, 53, 15)',
                      backgroundColor: 'rgba(120, 53, 15, 0.1)',
                      borderWidth: 3,
                      tension: 0.3,
                      pointRadius: 5,
                      pointBackgroundColor: 'rgb(120, 53, 15)',
                      pointBorderColor: 'white',
                      pointBorderWidth: 2,
                      yAxisID: 'y1',
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
                      labels: {
                        usePointStyle: true,
                        padding: 12,
                        color: '#64748b',
                        font: {
                          size: 11
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'white',
                      titleColor: '#1f2937',
                      bodyColor: '#1f2937',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      callbacks: {
                        label: function(context) {
                          const value = context.raw as number;
                          return context.dataset.label + ': ' + value.toLocaleString() + '억원';
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 10
                        }
                      }
                    },
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: '매출 (억원)',
                        color: '#6b7280',
                        font: {
                          size: 10
                        }
                      },
                      grid: {
                        color: '#f3f4f6'
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 9
                        },
                        callback: function(value) {
                          return (value as number).toLocaleString();
                        }
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: '이익 (억원)',
                        color: '#6b7280',
                        font: {
                          size: 10
                        }
                      },
                      grid: {
                        drawOnChartArea: false,
                      },
                      ticks: {
                        color: '#6b7280',
                        font: {
                          size: 9
                        },
                        callback: function(value) {
                          return (value as number).toLocaleString();
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </Card>
        </div>

        {/* 하단 - 상세 분석 테이블 */}
        <div className="col-span-12">
          <Card className="p-3">
            <div className="bg-slate-600 text-white text-center py-2 -mx-3 -mt-3 mb-3">
              <div className="text-sm font-semibold">월별 상세 분석</div>
            </div>
            <div className="text-right text-xs text-slate-500 mb-2">단위: 억원 (영업이익율 제외)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-600 text-white">
                    <th className="py-2 px-3 text-center font-medium">구분</th>
                    <th className="py-2 px-3 text-center font-medium">1월</th>
                    <th className="py-2 px-3 text-center font-medium">2월</th>
                    <th className="py-2 px-3 text-center font-medium">3월</th>
                    <th className="py-2 px-3 text-center font-medium">4월</th>
                    <th className="py-2 px-3 text-center font-medium bg-red-500 border-2 border-red-400">5월 (당월)</th>
                    <th className="py-2 px-3 text-center font-medium">누계</th>
                    <th className="py-2 px-3 text-center font-medium">전월대비</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyDetailData.map((row, index) => (
                    <tr key={index} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                      <td className="py-2 px-3 text-center font-semibold bg-slate-100">{row.category}</td>
                      <td className="py-2 px-3 text-center">{row.jan}</td>
                      <td className="py-2 px-3 text-center">{row.feb}</td>
                      <td className="py-2 px-3 text-center">{row.mar}</td>
                      <td className="py-2 px-3 text-center">{row.apr}</td>
                      <td className="py-2 px-3 text-center bg-red-50 border-l-2 border-r-2 border-red-500 font-bold text-red-700">
                        {row.may}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-700">{row.total}</td>
                      <td className="py-2 px-3 text-center">
                        {row.growth && (
                          <span className={`font-semibold ${
                            row.growth.includes('▲') ? 'text-red-500' : 
                            row.growth.includes('▼') ? 'text-blue-500' : 
                            'text-green-500'
                          }`}>
                            {row.growth}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 하단 요약 */}
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-xs text-slate-500 mb-1">매출 증감률</div>
                  <div className="text-sm font-bold text-blue-600">▼11%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">이익 개선도</div>
                  <div className="text-sm font-bold text-green-600">+2.6억원</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">원가율</div>
                  <div className="text-sm font-bold text-slate-700">95.2%</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">관리비율</div>
                  <div className="text-sm font-bold text-slate-700">4.5%</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 