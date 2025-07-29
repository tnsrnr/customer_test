'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { Card } from "@/components/card";
import { Chart } from 'react-chartjs-2';
import { Truck, Ship, Plane, Package, Users, Building2, SquareStack, BoxSelect, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Separator } from '@/components/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

// 전역 Chart.js 설정 사용
import '@/lib/chart-config';

type ChartType = 'bar';

const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

function CountUpAnimation({ end, duration = 2000, delay = 0, suffix = "", prefix = "" }: CountUpAnimationProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = end / (duration / 16);
      const animate = () => {
        start += step;
        if (start < end) {
          setCount(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <>{prefix}{formatNumber(count)}{suffix}</>;
}

interface MetricCardProps {
  title: string;
  value: number;
  unit?: string;
  suffix?: string;
}

function MetricCard({ title, value, unit = "백만원", suffix }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-0.5 bg-white/50 rounded-lg p-2 hover:bg-white/80 transition-colors">
      <span className="text-base text-slate-600 font-medium">{title}</span>
      <div className="text-2xl font-bold text-blue-600">
        {value.toLocaleString()}{suffix} {unit}
      </div>
    </div>
  );
}

interface AchievementCardProps {
  title: string;
  value: number;
}

function AchievementCard({ title, value }: AchievementCardProps) {
  return (
    <div className="flex flex-col gap-0.5 bg-white/50 rounded-lg p-2 hover:bg-white/80 transition-colors">
      <span className="text-base text-slate-600 font-medium">{title}</span>
      <div className="text-2xl font-bold text-emerald-600">
        {value}%
      </div>
    </div>
  );
}

interface BranchResultRowProps {
  name: string;
  sales: number;
  salesCost: number;
  salesProfit: number;
  adminCost: number;
  operatingProfit: number;
}

function BranchResultRow({ name, sales, salesCost, salesProfit, adminCost, operatingProfit }: BranchResultRowProps) {
  const profitColor = operatingProfit >= 0 ? 'text-blue-600' : 'text-red-500';

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="py-2 px-3 text-center font-medium">{name}</td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={sales} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={salesCost} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={salesProfit} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={adminCost} />
      </td>
      <td className={`py-2 px-3 text-right font-medium ${profitColor}`}>
        <CountUpAnimation end={operatingProfit} />
      </td>
    </tr>
  );
}

interface MonthlyResultRowProps {
  month: string;
  sales: number;
  salesCost: number;
  salesProfit: number;
  adminCost: number;
  operatingProfit: number;
  operatingProfitRatio: number;
}

function MonthlyResultRow({ month, sales, salesCost, salesProfit, adminCost, operatingProfit, operatingProfitRatio }: MonthlyResultRowProps) {
  return (
    <tr className="border-b border-slate-200">
      <td className="py-2 px-3 text-center font-medium">{month}</td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={sales} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={salesCost} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={salesProfit} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={adminCost} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={operatingProfit} />
      </td>
      <td className="py-2 px-3 text-right">
        <CountUpAnimation end={operatingProfitRatio} suffix="%" />
      </td>
    </tr>
  );
}

interface MonthlyDataType {
  name: string;
  value: number;
  isPercent?: boolean;
}

export default function Test7Page() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // 항공수출 데이터
  const exportData = {
    매출: [45, 41, 49, 87, 56],
    매출이익: [1, 2, 2, 3, 2],
    영업이익: [-2, -1, 0, -1, -1],
    물동량: [2062, 1937, 2239, 2839, 2257],
    인원: [24, 24, 24, 24, 24],
    건수: [3208, 3334, 3786, 4048, 3701],
    인당일평처리건수: [7, 7, 8, 8, 8]
  };

  // 항공수입 데이터
  const importData = {
    매출: [19, 15, 19, 18, 18],
    매출이익: [0, -1, -1, -1, 0],
    영업이익: [-2, -2, -2, -2, -2],
    물동량: [804, 698, 771, 782, 717],
    인원: [12, 12, 11, 11, 11],
    건수: [2510, 2509, 2790, 2905, 2650],
    인당일평처리건수: [10, 10, 13, 13, 12]
  };

  // 남양주센터 데이터
  const namyangData = {
    매출액: [12.5, 11.8, 13.2],
    원가: [8.2, 8.0, 8.5],
    직접경비: [2.8, 2.6, 2.9],
    매출총이익: [1.5, 1.2, 1.8],
    영업이익: [0.8, 0.5, 1.1]
  };

  // 아암센터 데이터
  const aarmData = {
    매출액: [28.5, 27.8, 31.2],
    원가: [18.2, 18.0, 18.5],
    직접경비: [5.8, 5.6, 5.9],
    매출총이익: [4.5, 4.2, 6.8],
    영업이익: [3.2, 2.8, 5.2]
  };

  // IPC 데이터
  const ipcChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출액',
        data: [0.9, 0.8, 1.0, 1.0, 1.0].map(num => Math.round(num * 10) / 10),
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 12,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: [0.0, 0.0, 0.0, 0.0, 0.0].map(num => Math.round(num * 10) / 10),
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 3,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  // 일죽 데이터
  const iljukChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출액',
        data: [7.9, 7.9, 9.6, 9.6, 10.5].map(num => Math.round(num * 10) / 10),
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 12,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: [-0.2, -0.2, -0.2, -0.2, -0.3].map(num => Math.round(num * 10) / 10),
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 3,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  // SP 데이터
  const spChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출액',
        data: [8.9, 8.2, 8.4, 8.5, 8.7].map(num => Math.round(num * 10) / 10),
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 12,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: [0.5, 0.8, 0.8, 0.9, 0.8].map(num => Math.round(num * 10) / 10),
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 3,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  // 차트 옵션 수정
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 10,
          padding: 4,
          font: {
            size: 13,
            family: "'Pretendard', sans-serif"
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
          font: {
            size: 13
          }
        }
      },
      y: {
        position: 'left' as const,
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1) + '억';
          },
          font: {
            size: 13
          }
        },
        min: 0,
        max: 12
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1) + '억';
          },
          font: {
            size: 13
          }
        },
        min: -0.5,
        max: 1.0,
        suggestedMin: -0.5,
        suggestedMax: 1.0
      }
    }
  };

  const tableData = [
    {
      id: "IPC",
      계정명: "매출액",
      "25년1월": 0.9,
      "2월": 0.8,
      "3월": 1.0,
      "4월": 1.0,
      "5월": 1.0,
      전월대비: "▼4%"
    },
    {
      id: "IPC",
      계정명: "매출증가익",
      "25년1월": Math.round(0.1 * 10) / 10,
      "2월": Math.round(0.1 * 10) / 10,
      "3월": Math.round(0.1 * 10) / 10,
      "4월": Math.round(0.1 * 10) / 10,
      "5월": Math.round(0.1 * 10) / 10,
      전월대비: "▲4%"
    },
    {
      id: "IPC",
      계정명: "영업이익",
      "25년1월": Math.round(0.0 * 10) / 10,
      "2월": Math.round(0.0 * 10) / 10,
      "3월": Math.round(0.0 * 10) / 10,
      "4월": Math.round(0.0 * 10) / 10,
      "5월": Math.round(0.0 * 10) / 10,
      전월대비: "▼1%"
    },
    {
      id: "일죽",
      계정명: "매출액",
      "25년1월": Math.round(7.9 * 10) / 10,
      "2월": Math.round(7.9 * 10) / 10,
      "3월": Math.round(9.6 * 10) / 10,
      "4월": Math.round(9.6 * 10) / 10,
      "5월": Math.round(10.5 * 10) / 10,
      전월대비: "▲9%"
    },
    {
      id: "일죽",
      계정명: "매출증가익",
      "25년1월": Math.round(0.0 * 10) / 10,
      "2월": Math.round(0.1 * 10) / 10,
      "3월": Math.round(0.1 * 10) / 10,
      "4월": Math.round(0.1 * 10) / 10,
      "5월": Math.round(0.1 * 10) / 10,
      전월대비: "▲2%"
    },
    {
      id: "일죽",
      계정명: "영업이익",
      "25년1월": Math.round(-0.2 * 10) / 10,
      "2월": Math.round(-0.2 * 10) / 10,
      "3월": Math.round(-0.2 * 10) / 10,
      "4월": Math.round(-0.2 * 10) / 10,
      "5월": Math.round(-0.3 * 10) / 10,
      전월대비: "▼34%"
    },
    {
      id: "SP",
      계정명: "매출액",
      "25년1월": Math.round(8.9 * 10) / 10,
      "2월": Math.round(8.2 * 10) / 10,
      "3월": Math.round(8.4 * 10) / 10,
      "4월": Math.round(8.5 * 10) / 10,
      "5월": Math.round(8.7 * 10) / 10,
      전월대비: "▲2%"
    },
    {
      id: "SP",
      계정명: "매출증가익",
      "25년1월": Math.round(0.8 * 10) / 10,
      "2월": Math.round(1.1 * 10) / 10,
      "3월": Math.round(1.1 * 10) / 10,
      "4월": Math.round(1.1 * 10) / 10,
      "5월": Math.round(1.1 * 10) / 10,
      전월대비: "▼%"
    },
    {
      id: "SP",
      계정명: "영업이익",
      "25년1월": Math.round(0.5 * 10) / 10,
      "2월": Math.round(0.8 * 10) / 10,
      "3월": Math.round(0.8 * 10) / 10,
      "4월": Math.round(0.9 * 10) / 10,
      "5월": Math.round(0.8 * 10) / 10,
      전월대비: "▼5%"
    },
    {
      id: "소계",
      계정명: "매출액",
      "25년1월": Math.round(17.7 * 10) / 10,
      "2월": Math.round(17.0 * 10) / 10,
      "3월": Math.round(19.0 * 10) / 10,
      "4월": Math.round(19.1 * 10) / 10,
      "5월": Math.round(20.1 * 10) / 10,
      전월대비: "▲5%"
    },
    {
      id: "소계",
      계정명: "매출증가익",
      "25년1월": Math.round(0.9 * 10) / 10,
      "2월": Math.round(1.2 * 10) / 10,
      "3월": Math.round(1.2 * 10) / 10,
      "4월": Math.round(1.2 * 10) / 10,
      "5월": Math.round(1.2 * 10) / 10,
      전월대비: "▲%"
    },
    {
      id: "소계",
      계정명: "간접경비",
      "25년1월": Math.round(0.6 * 10) / 10,
      "2월": Math.round(0.6 * 10) / 10,
      "3월": Math.round(0.6 * 10) / 10,
      "4월": Math.round(0.5 * 10) / 10,
      "5월": Math.round(0.7 * 10) / 10,
      전월대비: "▲22%"
    },
    {
      id: "소계",
      계정명: "영업이익",
      "25년1월": Math.round(0.3 * 10) / 10,
      "2월": Math.round(0.6 * 10) / 10,
      "3월": Math.round(0.6 * 10) / 10,
      "4월": Math.round(0.7 * 10) / 10,
      "5월": Math.round(0.6 * 10) / 10,
      전월대비: "▼17%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      {/* KPI 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 w-full mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">센터개수</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-700 leading-none">2</span>
                  <span className="ml-1 text-base font-semibold text-blue-700">센터</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">안정 운영</span>
          </div>
        </motion.div>

        {/* 총 면적 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
                <SquareStack className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">총 면적</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-emerald-700 leading-none">28,580</span>
                  <span className="ml-1 text-base font-semibold text-emerald-700">평</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">확장 완료</span>
          </div>
        </motion.div>

        {/* 사용 면적 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <BoxSelect className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">사용 면적</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-purple-700 leading-none">15,927</span>
                  <span className="ml-1 text-base font-semibold text-purple-700">평</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">56% 가동률</span>
          </div>
        </motion.div>

        {/* 가동률 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-sky-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg shadow-md">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">가동률</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-sky-700 leading-none">56</span>
                  <span className="ml-1 text-base font-semibold text-sky-700">%</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">공실률 44%</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-[98%] mx-auto">
        {/* 좌측 컴포넌트들 */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 gap-4">
            {/* 차트 영역 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative h-full"
            >
              <Card className="p-3 shadow-lg shadow-blue-900/5 border border-slate-200 h-full">
                <div className="flex flex-col gap-3 h-full">
                  {/* IPC 카드 */}
                  <Card className="flex-1 p-2 border border-slate-200">
                    <div className="h-[145px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={ipcChartData} options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: {
                              ...chartOptions.plugins.legend,
                              labels: {
                                ...chartOptions.plugins.legend.labels,
                                padding: 4,
                                font: {
                                  size: 9,
                                  family: "'Pretendard', sans-serif"
                                }
                              }
                            }
                          },
                          scales: {
                            ...chartOptions.scales,
                            x: {
                              ...chartOptions.scales.x,
                              ticks: {
                                font: {
                                  size: 9
                                }
                              }
                            },
                            y: {
                              ...chartOptions.scales.y,
                              ticks: {
                                ...chartOptions.scales.y.ticks,
                                font: {
                                  size: 9
                                }
                              }
                            },
                            y1: {
                              ...chartOptions.scales.y1,
                              ticks: {
                                ...chartOptions.scales.y1.ticks,
                                font: {
                                  size: 9
                                }
                              }
                            }
                          }
                        }} />
                      )}
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-bold text-slate-700">IPC</span>
                    </div>
                  </Card>

                  {/* 일죽 카드 */}
                  <Card className="flex-1 p-2 border border-slate-200">
                    <div className="h-[145px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={iljukChartData} options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: {
                              ...chartOptions.plugins.legend,
                              labels: {
                                ...chartOptions.plugins.legend.labels,
                                padding: 4,
                                font: {
                                  size: 9,
                                  family: "'Pretendard', sans-serif"
                                }
                              }
                            }
                          },
                          scales: {
                            ...chartOptions.scales,
                            x: {
                              ...chartOptions.scales.x,
                              ticks: {
                                font: {
                                  size: 9
                                }
                              }
                            },
                            y: {
                              ...chartOptions.scales.y,
                              ticks: {
                                ...chartOptions.scales.y.ticks,
                                font: {
                                  size: 9
                                }
                              }
                            },
                            y1: {
                              ...chartOptions.scales.y1,
                              ticks: {
                                ...chartOptions.scales.y1.ticks,
                                font: {
                                  size: 9
                                }
                              }
                            }
                          }
                        }} />
                      )}
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-bold text-slate-700">일죽</span>
                    </div>
                  </Card>

                  {/* SP 카드 */}
                  <Card className="flex-1 p-2 border border-slate-200">
                    <div className="h-[145px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={spChartData} options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            legend: {
                              ...chartOptions.plugins.legend,
                              labels: {
                                ...chartOptions.plugins.legend.labels,
                                padding: 4,
                                font: {
                                  size: 9,
                                  family: "'Pretendard', sans-serif"
                                }
                              }
                            }
                          },
                          scales: {
                            ...chartOptions.scales,
                            x: {
                              ...chartOptions.scales.x,
                              ticks: {
                                font: {
                                  size: 9
                                }
                              }
                            },
                            y: {
                              ...chartOptions.scales.y,
                              ticks: {
                                ...chartOptions.scales.y.ticks,
                                font: {
                                  size: 9
                                }
                              }
                            },
                            y1: {
                              ...chartOptions.scales.y1,
                              ticks: {
                                ...chartOptions.scales.y1.ticks,
                                font: {
                                  size: 9
                                }
                              }
                            }
                          }
                        }} />
                      )}
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-sm font-bold text-slate-700">SP</span>
                    </div>
                  </Card>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* 우측 표 */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="relative h-full"
          >
            <Card className="p-3 shadow-lg shadow-slate-900/5 border border-slate-200 h-full">
              <div className="overflow-x-auto">
                {/* 테이블 섹션 */}
                <Card className="p-1">
                  <div className="flex flex-col">
                    <Table>
                      <TableHeader className="bg-slate-100">
                        <TableRow className="bg-slate-100">
                          <TableHead className="w-[80px] py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-base sticky left-0 z-10">구분</TableHead>
                          <TableHead className="w-[100px] py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-base">계정명</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">25년1월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">2월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">3월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">4월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-blue-600 text-sm">5월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm whitespace-nowrap">전월대비</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.reduce((acc: React.ReactElement[], row, index, array) => {
                          const isFirstInGroup = index === 0 || array[index - 1].id !== row.id;
                          const rowSpan = array.filter((r, i) => i >= index && r.id === row.id).length;
                          const isLastInGroup = index + 1 === array.length || array[index + 1].id !== row.id;
                          
                          acc.push(
                            <TableRow 
                              key={index} 
                              className={`
                                ${row.id === "소계" ? "bg-slate-50 font-medium" : "hover:bg-blue-50/30"}
                                ${isLastInGroup ? "border-b-2 border-slate-200" : ""}
                                transition-colors
                              `}
                            >
                              {isFirstInGroup && (
                                <TableCell 
                                  className="font-bold py-2 px-1.5 border-x border-slate-200 text-center text-base sticky left-0 bg-white" 
                                  rowSpan={rowSpan}
                                  style={{
                                    boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.05)'
                                  }}
                                >
                                  {row.id}
                                </TableCell>
                              )}
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-base font-medium">{row.계정명}</TableCell>
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-right text-sm tabular-nums">{row["25년1월"]}</TableCell>
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-right text-sm tabular-nums">{row["2월"]}</TableCell>
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-right text-sm tabular-nums">{row["3월"]}</TableCell>
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-right text-sm tabular-nums">{row["4월"]}</TableCell>
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-right font-medium text-blue-600 text-sm tabular-nums">{row["5월"]}</TableCell>
                              <TableCell 
                                className={`py-2 px-1.5 border-x border-slate-200 text-right text-sm tabular-nums font-medium ${
                                  row.전월대비.includes("▲") ? "text-red-500" : 
                                  row.전월대비.includes("▼") ? "text-blue-500" : ""
                                }`}
                              >
                                {row.전월대비}
                              </TableCell>
                            </TableRow>
                          );
                          return acc;
                        }, [])}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}