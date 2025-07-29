'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { Card } from "@/components/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Truck, Ship, Plane, Package, Users, Building2, SquareStack, BoxSelect, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Separator } from '@/components/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
        data: [281, 276, 320, 271, 245],
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 12,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: [5, 7, 13, 1, 7],
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
        data: [72, 67, 94, 60, 61],
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 12,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: [5, 5, 7, 3, 4],
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
        data: [24, 24, 29, 17, 18],
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 12,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: [1, 0, 0, -1, -1],
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
            return value + '';
          },
          font: {
            size: 13
          }
        },
        min: 0,
        max: 350
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value: any) {
            return value + '';
          },
          font: {
            size: 13
          }
        },
        min: -5,
        max: 15,
        suggestedMin: -5,
        suggestedMax: 15
      }
    }
  };

  const tableData = [
    {
      id: "중국",
      계정명: "매출액",
      "25년1월": 72,
      "2월": 67,
      "3월": 94,
      "4월": 60,
      "5월": 61,
      전월대비: "▲1%"
    },
    {
      id: "중국",
      계정명: "영업이익",
      "25년1월": 5,
      "2월": 5,
      "3월": 7,
      "4월": 3,
      "5월": 4,
      전월대비: "▲49%"
    },
    {
      id: "아시아",
      계정명: "매출액",
      "25년1월": 24,
      "2월": 24,
      "3월": 29,
      "4월": 17,
      "5월": 18,
      전월대비: "▲3%"
    },
    {
      id: "아시아",
      계정명: "영업이익",
      "25년1월": 1,
      "2월": 0,
      "3월": 0,
      "4월": -1,
      "5월": -1,
      전월대비: "▼29%"
    },
    {
      id: "베트남",
      계정명: "매출액",
      "25년1월": 55,
      "2월": 55,
      "3월": 63,
      "4월": 55,
      "5월": 46,
      전월대비: "▼16%"
    },
    {
      id: "베트남",
      계정명: "영업이익",
      "25년1월": -2,
      "2월": -1,
      "3월": 0,
      "4월": -2,
      "5월": -0,
      전월대비: "▲93%"
    },
    {
      id: "유럽",
      계정명: "매출액",
      "25년1월": 107,
      "2월": 112,
      "3월": 107,
      "4월": 115,
      "5월": 104,
      전월대비: "▼10%"
    },
    {
      id: "유럽",
      계정명: "영업이익",
      "25년1월": 1,
      "2월": 3,
      "3월": 3,
      "4월": 1,
      "5월": 4,
      전월대비: "▲261%"
    },
    {
      id: "미국",
      계정명: "매출액",
      "25년1월": 23,
      "2월": 18,
      "3월": 27,
      "4월": 24,
      "5월": 17,
      전월대비: "▼30%"
    },
    {
      id: "미국",
      계정명: "영업이익",
      "25년1월": 0,
      "2월": 0,
      "3월": 2,
      "4월": -0,
      "5월": -1,
      전월대비: "▼601%"
    },
    {
      id: "합계",
      계정명: "매출액",
      "25년1월": 281,
      "2월": 276,
      "3월": 320,
      "4월": 271,
      "5월": 245,
      전월대비: "▼10%"
    },
    {
      id: "합계",
      계정명: "영업이익",
      "25년1월": 5,
      "2월": 7,
      "3월": 13,
      "4월": 1,
      "5월": 7,
      전월대비: "▲406%"
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
                <p className="text-base font-semibold text-slate-800">진출현황</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-700 leading-none">5</span>
                  <span className="ml-1 text-base font-semibold text-blue-700">개국</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">12개 지법인</span>
          </div>
        </motion.div>

        {/* 총 매출액 */}
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
                <p className="text-base font-semibold text-slate-800">총 매출액</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-emerald-700 leading-none">245</span>
                  <span className="ml-1 text-base font-semibold text-emerald-700">억원</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">글로벌 확장</span>
          </div>
        </motion.div>

        {/* 영업이익 */}
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
                <p className="text-base font-semibold text-slate-800">영업이익</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-purple-700 leading-none">7</span>
                  <span className="ml-1 text-base font-semibold text-purple-700">억원</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">▲ 406%</span>
          </div>
        </motion.div>

        {/* 영업이익률 */}
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
                <p className="text-base font-semibold text-slate-800">영업이익률</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-sky-700 leading-none">2.9</span>
                  <span className="ml-1 text-base font-semibold text-sky-700">%</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">▲ 2.4%p</span>
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
                  {/* 해외자회사 카드 */}
                  <Card className="flex-1 p-2 border border-slate-200">
                    <div className="h-[260px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={ipcChartData} options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: {
                              display: true,
                              text: '해외자회사',
                              align: 'center',
                              font: {
                                size: 16,
                                weight: 'bold'
                              },
                              padding: {
                                bottom: 10
                              }
                            },
                            legend: {
                              ...chartOptions.plugins.legend,
                              labels: {
                                ...chartOptions.plugins.legend.labels,
                                padding: 4,
                                font: {
                                  size: 12,
                                  family: "'Pretendard', sans-serif"
                                }
                              }
                            }
                          }
                        }} />
                      )}
                    </div>
                  </Card>

                  {/* 본부별 당월실적 카드 */}
                  <Card className="flex-1 p-2 border border-slate-200">
                    <div className="h-[260px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={{
                          labels: ['중국(2)', '아시아(5)', '베트남(1)', '유럽(3)', '미국(1)'],
                          datasets: [
                            {
                              type: 'bar' as const,
                              label: '매출',
                              data: [61, 18, 46, 104, 17],
                              backgroundColor: 'rgb(37, 99, 235)',
                              borderRadius: 2,
                              barThickness: 20,
                              yAxisID: 'y'
                            },
                            {
                              type: 'line' as const,
                              label: '영업이익',
                              data: [4, -1, 0, 4, -1],
                              borderColor: 'rgb(239, 68, 68)',
                              borderWidth: 2,
                              pointBackgroundColor: 'rgb(239, 68, 68)',
                              pointRadius: 4,
                              fill: false,
                              yAxisID: 'y1'
                            }
                          ]
                        }} options={{
                          ...chartOptions,
                          plugins: {
                            ...chartOptions.plugins,
                            title: {
                              display: true,
                              text: '본부별 당월실적',
                              align: 'center',
                              font: {
                                size: 16,
                                weight: 'bold'
                              },
                              padding: {
                                bottom: 10
                              }
                            },
                            legend: {
                              ...chartOptions.plugins.legend,
                              labels: {
                                ...chartOptions.plugins.legend.labels,
                                padding: 4,
                                font: {
                                  size: 12,
                                  family: "'Pretendard', sans-serif"
                                }
                              }
                            }
                          },
                          scales: {
                            ...chartOptions.scales,
                            y: {
                              ...chartOptions.scales.y,
                              max: 120
                            },
                            y1: {
                              ...chartOptions.scales.y1,
                              min: -2,
                              max: 5,
                              suggestedMin: -2,
                              suggestedMax: 5
                            }
                          }
                        }} />
                      )}
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
                                  {row.id === "중국" ? "중국(2)" :
                                  row.id === "아시아" ? "아시아(5)" :
                                  row.id === "베트남" ? "베트남(1)" :
                                  row.id === "유럽" ? "유럽(3)" :
                                  row.id === "미국" ? "미국(1)" :
                                  row.id}
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