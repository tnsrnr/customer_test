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
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Target, BarChart3 } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 h-[calc(100vh-64px)] p-4 space-y-4 overflow-hidden">
        {/* 상단 좌측 - 핵심 KPI 대시보드 */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
            >
              <div className="bg-white/10 text-white text-center py-2 -mx-5 -mt-5 mb-4 rounded-t-xl">
                <div className="text-sm font-semibold">핵심 성과 지표 (KPI)</div>
              </div>
              <div className="space-y-3">
                {/* 핵심 지표 - 합쳐진 카드 */}
                <div className="bg-blue-500/20 rounded-lg p-3 border-l-4 border-blue-400">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-blue-100 font-medium mb-1">당월 매출</div>
                      <div className="text-lg font-bold text-white">188억원</div>
                      <div className="text-xs text-amber-300">▼11% (전월대비)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-100 font-medium mb-1">목표 달성률</div>
                      <div className="text-lg font-bold text-white">85%</div>
                      <div className="text-xs text-slate-300">매출 기준</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-500/20 rounded-lg p-3 border-l-4 border-amber-400">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-amber-100 font-medium mb-1">영업이익</div>
                      <div className="text-lg font-bold text-white">0.0억원</div>
                      <div className="text-xs text-amber-300">손익분기점 달성</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-100 font-medium mb-1">영업이익율</div>
                      <div className="text-lg font-bold text-white">0.03%</div>
                      <div className="text-xs text-amber-300">개선</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 세부 지표 */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-300 mb-1">매출총이익</div>
                  <div className="text-sm font-semibold text-white">8.6억원</div>
                  <div className="text-xs text-emerald-400">▲50%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-300 mb-1">관리비</div>
                  <div className="text-sm font-semibold text-white">8.5억원</div>
                  <div className="text-xs text-red-400">▲3%</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 상단 우측 - 월별 트렌드 차트 */}
          <div className="col-span-9">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
            >
              <div className="bg-white/10 text-white text-center py-2 -mx-5 -mt-5 mb-4 rounded-t-xl">
                <div className="text-sm font-semibold">월별 트렌드 (최근 12개월)</div>
              </div>
              <div className="text-right text-xs text-slate-300 mb-2">단위: 억원</div>
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
                          color: '#cbd5e1',
                          font: {
                            size: 11
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#f1f5f9',
                        bodyColor: '#e2e8f0',
                        borderColor: '#475569',
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
                          color: '#cbd5e1',
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
                          color: '#cbd5e1',
                          font: {
                            size: 10
                          }
                        },
                        grid: {
                          color: 'rgba(203, 213, 225, 0.2)'
                        },
                        ticks: {
                          color: '#cbd5e1',
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
                          color: '#cbd5e1',
                          font: {
                            size: 10
                          }
                        },
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          color: '#cbd5e1',
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
            </motion.div>
          </div>

          {/* 하단 - 상세 분석 테이블 */}
          <div className="col-span-12">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
            >
              <div className="bg-white/10 text-white text-center py-2 -mx-5 -mt-5 mb-4 rounded-t-xl">
                <div className="text-sm font-semibold">월별 상세 분석</div>
              </div>
              <div className="text-right text-xs text-slate-300 mb-2">단위: 억원 (영업이익율 제외)</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/15 text-white">
                      <th className="py-2 px-3 text-center font-medium border-r border-white/20">구분</th>
                      <th className="py-2 px-3 text-center font-medium border-r border-white/20">1월</th>
                      <th className="py-2 px-3 text-center font-medium border-r border-white/20">2월</th>
                      <th className="py-2 px-3 text-center font-medium border-r border-white/20">3월</th>
                      <th className="py-2 px-3 text-center font-medium border-r border-white/20">4월</th>
                      <th className="py-2 px-3 text-center font-medium bg-red-500/40 border-2 border-red-400">5월 (당월)</th>
                      <th className="py-2 px-3 text-center font-medium border-r border-white/20">누계</th>
                      <th className="py-2 px-3 text-center font-medium">전월대비</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {monthlyDetailData.map((row, index) => (
                      <tr key={index} className={`hover:bg-white/5 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                        <td className="py-2 px-3 text-center font-semibold text-white border-r border-white/20">{row.category}</td>
                        <td className="py-2 px-3 text-center text-white border-r border-white/20">{row.jan}</td>
                        <td className="py-2 px-3 text-center text-white border-r border-white/20">{row.feb}</td>
                        <td className="py-2 px-3 text-center text-white border-r border-white/20">{row.mar}</td>
                        <td className="py-2 px-3 text-center text-white border-r border-white/20">{row.apr}</td>
                        <td className="py-2 px-3 text-center bg-red-500/20 border-l-2 border-r-2 border-red-400 font-bold text-white">
                          {row.may}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-white border-r border-white/20">{row.total}</td>
                        <td className="py-2 px-3 text-center">
                          {row.growth && (
                            <span className={`font-semibold ${
                              row.growth.includes('▲') ? 'text-emerald-400' : 
                              row.growth.includes('▼') ? 'text-blue-400' : 
                              'text-emerald-400'
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
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-300 mb-1">매출 증감률</div>
                    <div className="text-sm font-bold text-blue-400">▼11%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-300 mb-1">이익 개선도</div>
                    <div className="text-sm font-bold text-emerald-400">+2.6억원</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-300 mb-1">원가율</div>
                    <div className="text-sm font-bold text-white">95.2%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-300 mb-1">관리비율</div>
                    <div className="text-sm font-bold text-white">4.5%</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 