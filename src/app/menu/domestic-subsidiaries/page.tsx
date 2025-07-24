'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import { Card } from "@/components/ui/card";
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
import { Truck, Ship, Plane, Package, Users, Building2, SquareStack, BoxSelect, PieChart, TrendingUp, AlertCircle, BarChart2, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
      id: "하나로에스",
      계정명: "매출액",
      "25년1월": 24,
      "2월": 27,
      "3월": 29,
      "4월": 24,
      "5월": 23,
      전월대비: "▼7%"
    },
    {
      id: "하나로에스",
      계정명: "영업이익",
      "25년1월": -2.1,
      "2월": -1.3,
      "3월": 0.2,
      "4월": -0.4,
      "5월": -0.4,
      전월대비: "▼3%"
    },
    {
      id: "하나로넷",
      계정명: "매출액",
      "25년1월": 37,
      "2월": 32,
      "3월": 33,
      "4월": 32,
      "5월": 33,
      전월대비: "▲2%"
    },
    {
      id: "하나로넷",
      계정명: "영업이익",
      "25년1월": -4.0,
      "2월": 5.0,
      "3월": 6.4,
      "4월": 4.3,
      "5월": -4.9,
      전월대비: "▼214%",
      비고: "1.5월 상여지급"
    },
    {
      id: "총합",
      계정명: "매출액",
      "25년1월": 60,
      "2월": 58,
      "3월": 62,
      "4월": 57,
      "5월": 56,
      전월대비: "▼2%"
    },
    {
      id: "총합",
      계정명: "영업이익",
      "25년1월": -6.1,
      "2월": 4.0,
      "3월": 7.0,
      "4월": 4.0,
      "5월": -5.3,
      전월대비: "▼238%"
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
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-blue-100 rounded-xl">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">국내 법인 현황</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-medium text-blue-400 mr-2">(본사제외)</span>
                  <span className="text-5xl font-bold text-blue-600 leading-none">2</span>
                  <span className="text-xl font-medium text-blue-600 self-end mb-1">개 법인</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 총 매출액 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-emerald-100 rounded-xl">
                <SquareStack className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">총 매출액</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-6xl font-bold text-emerald-600 leading-none">56</span>
              <span className="ml-2 text-2xl font-medium text-emerald-600 self-end mb-1">억원</span>
            </div>
          </div>
        </motion.div>

        {/* 영업이익 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-purple-100 rounded-xl">
                <BoxSelect className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">영업이익</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-purple-600 leading-none">-5.3</span>
                <span className="ml-2 text-2xl font-medium text-purple-600 self-end mb-1">억원</span>
              </div>
              <span className="text-base font-medium text-purple-400 mt-1">전월대비 ▼238%</span>
            </div>
          </div>
        </motion.div>

        {/* 영업이익률 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-sky-100 rounded-xl">
                <PieChart className="w-12 h-12 text-sky-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">영업이익률</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-sky-600 leading-none">-9.5</span>
                <span className="ml-2 text-2xl font-medium text-sky-600 self-end mb-1">%</span>
              </div>
              <span className="text-base font-medium text-sky-400 mt-1">전월대비 ▼16.8%p</span>
            </div>
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
                    <div className="h-[300px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={{
                          labels: ['25년 1월', '2월', '3월', '4월', '5월'],
                          datasets: [
                            {
                              type: 'bar' as const,
                              label: '매출',
                              data: [24, 27, 29, 24, 23],
                              backgroundColor: '#2196F3',
                              borderRadius: 2,
                              barThickness: 20,
                              yAxisID: 'y'
                            },
                            {
                              type: 'line' as const,
                              label: '영업이익',
                              data: [-2, -1, 0.2, -0.4, -0.4],
                              borderColor: '#F44336',
                              borderWidth: 2,
                              pointStyle: 'circle',
                              pointRadius: 4,
                              pointBackgroundColor: '#F44336',
                              borderDash: [5, 5],
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
                              text: '하나로에스',
                              align: 'center',
                              font: {
                                size: 16,
                                weight: 'bold'
                              },
                              padding: {
                                bottom: 15
                              }
                            }
                          },
                          scales: {
                            ...chartOptions.scales,
                            y: {
                              ...chartOptions.scales.y,
                              position: 'left',
                              min: 0,
                              max: 40,
                              ticks: {
                                stepSize: 10
                              }
                            },
                            y1: {
                              position: 'right',
                              grid: {
                                drawOnChartArea: false
                              },
                              min: -6,
                              max: 6,
                              ticks: {
                                stepSize: 2
                              }
                            }
                          }
                        }} />
                      )}
                    </div>
                  </Card>

                  {/* 본부별 당월실적 카드 */}
                  <Card className="flex-1 p-2 border border-slate-200">
                    <div className="h-[300px] w-full">
                      {showCharts && (
                        <Chart type='bar' data={{
                          labels: ['25년 1월', '2월', '3월', '4월', '5월'],
                          datasets: [
                            {
                              type: 'bar' as const,
                              label: '매출',
                              data: [37, 32, 33, 32, 33],
                              backgroundColor: '#2196F3',
                              borderRadius: 2,
                              barThickness: 20,
                              yAxisID: 'y'
                            },
                            {
                              type: 'line' as const,
                              label: '영업이익',
                              data: [-4, 5, 6, 4, -4.9],
                              borderColor: '#F44336',
                              borderWidth: 2,
                              pointStyle: 'circle',
                              pointRadius: 4,
                              pointBackgroundColor: '#F44336',
                              borderDash: [5, 5],
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
                              text: '하나로넷',
                              align: 'center',
                              font: {
                                size: 16,
                                weight: 'bold'
                              },
                              padding: {
                                bottom: 15
                              }
                            }
                          },
                          scales: {
                            ...chartOptions.scales,
                            y: {
                              ...chartOptions.scales.y,
                              position: 'left',
                              min: 0,
                              max: 40,
                              ticks: {
                                stepSize: 10
                              }
                            },
                            y1: {
                              position: 'right',
                              grid: {
                                drawOnChartArea: false
                              },
                              min: -6,
                              max: 6,
                              ticks: {
                                stepSize: 2
                              }
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
                          <TableHead className="w-[140px] py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-base sticky left-0 z-10">구분</TableHead>
                          <TableHead className="w-[100px] py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-base">계정명</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">25년1월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">2월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">3월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm">4월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-blue-600 text-sm">5월</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm whitespace-nowrap">전월대비</TableHead>
                          <TableHead className="py-2 px-1.5 border-y border-slate-200 text-center font-bold bg-slate-100 text-sm whitespace-nowrap">비고</TableHead>
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
                              <TableCell className="py-2 px-1.5 border-x border-slate-200 text-left text-sm">{row.비고}</TableCell>
                            </TableRow>
                          );
                          return acc;
                        }, [])}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                <Separator className="my-6" />
                
                {/* 주요 인사이트 섹션 */}
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h3 className="text-base font-bold text-slate-700 mb-2">주요 인사이트</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex items-start space-x-1.5">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">하나로넷 실적 개선</p>
                        <p className="text-xs text-slate-500">1분기 영업이익 흑자전환 (6.4억)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-1.5">
                      <div className="p-1.5 bg-red-100 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">5월 실적 하락</p>
                        <p className="text-xs text-slate-500">상여금 지급 영향 (-4.9억)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-1.5">
                      <div className="p-1.5 bg-emerald-100 rounded-lg">
                        <BarChart2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">매출 안정성</p>
                        <p className="text-xs text-slate-500">하나로넷 매출 32~33억 유지</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-1.5">
                      <div className="p-1.5 bg-amber-100 rounded-lg">
                        <Target className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">개선 필요사항</p>
                        <p className="text-xs text-slate-500">하나로에스 영업이익 적자 지속</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}