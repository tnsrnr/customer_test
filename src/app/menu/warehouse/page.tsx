'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Chart } from 'react-chartjs-2';
import { Truck, Ship, Plane, Package, Users, Building2, SquareStack, BoxSelect, PieChart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import annotationPlugin from 'chartjs-plugin-annotation';

// 전역 Chart.js 설정 사용
import '@/lib/chart_config';

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
    <div className="flex flex-col gap-1 bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-colors">
      <span className="text-sm text-slate-600 font-medium">{title}</span>
      <div className="text-xl font-bold text-blue-600">
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
    <div className="flex flex-col gap-1 bg-white/50 rounded-lg p-3 hover:bg-white/80 transition-colors">
      <span className="text-sm text-slate-600 font-medium">{title}</span>
      <div className="text-xl font-bold text-emerald-600">
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

  // 차트 데이터 설정
  const namyangChartData = {
    labels: ['3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출액',
        data: namyangData.매출액,
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 20,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: namyangData.영업이익,
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 4,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  const aarmChartData = {
    labels: ['3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출액',
        data: aarmData.매출액,
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 20,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: aarmData.영업이익,
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 4,
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
          boxWidth: 15,
          padding: 15,
          font: {
            size: 11,
            family: "'Pretendard', sans-serif"
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        position: 'left' as const,
        grid: {
          color: '#e2e8f0'
        },
        ticks: {
          callback: function(value: any) {
            return value + '억';
          },
          font: {
            size: 11
          }
        }
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value: any) {
            return value + '억';
          },
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      {/* KPI 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 w-full mx-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-[95%] mx-auto">
        {/* 좌측 컴포넌트들 */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 gap-6">
            {/* 남양주센터 차트 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative"
            >
              <Card className="p-5 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg p-2">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">창고 운영 현황</h3>
                    <p className="text-sm text-slate-500">센터별 창고 손익 및 가동율</p>
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <div className="h-[220px] w-full">
                    {showCharts && <Chart type='bar' data={namyangChartData} options={{
                      ...chartOptions,
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          labels: {
                            ...chartOptions.plugins.legend.labels,
                            font: {
                              size: 11,
                              weight: 'bold',
                              family: "'Pretendard', sans-serif"
                            }
                          }
                        }
                      }
                    }} />}
                  </div>
                  <div className="text-center text-sm font-medium text-slate-700">
                    <span>남양주센터(B동)</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 아암센터 차트 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="relative"
            >
              <Card className="p-5 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg p-2">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">창고 운영 현황</h3>
                    <p className="text-sm text-slate-500">센터별 창고 손익 및 가동율</p>
                  </div>
                </div>
                <div className="overflow-x-auto flex-1">
                  <div className="h-[220px] w-full">
                    {showCharts && <Chart type='bar' data={aarmChartData} options={{
                      ...chartOptions,
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          labels: {
                            ...chartOptions.plugins.legend.labels,
                            font: {
                              size: 11,
                              weight: 'bold',
                              family: "'Pretendard', sans-serif"
                            }
                          }
                        }
                      }
                    }} />}
                  </div>
                  <div className="text-center text-sm font-medium text-slate-700">아암센터</div>
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
            <Card className="p-5 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-violet-500 rounded-lg p-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">창고 손익 현황</h3>
                  <p className="text-sm text-slate-500">센터별 상세 손익 및 가동율</p>
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <Table className="w-full text-sm">
                  <TableHeader className="bg-slate-100/80">
                    <TableRow>
                      <TableHead className="py-2 px-3 text-center font-bold text-slate-700">센터명</TableHead>
                      <TableHead className="py-2 px-3 text-center font-bold text-slate-700">계정과목명</TableHead>
                      <TableHead colSpan={4} className="py-2 px-3 text-center font-bold text-slate-700">창고손익</TableHead>
                      <TableHead colSpan={2} className="py-2 px-3 text-center font-bold text-slate-700">창고 가동율 현황</TableHead>
                      <TableHead className="py-2 px-3 text-center font-bold text-slate-700">비고</TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead className="py-1.5 px-2 text-center font-bold text-blue-700">3월</TableHead>
                      <TableHead className="py-1.5 px-2 text-center font-bold text-blue-700">4월</TableHead>
                      <TableHead className="py-1.5 px-2 text-center font-bold text-blue-700 bg-blue-50/80 border-x border-blue-200">5월</TableHead>
                      <TableHead className="py-1.5 px-2 text-center font-bold text-slate-700 bg-slate-100/80">합계</TableHead>
                      <TableHead className="py-1.5 px-2 text-center font-bold text-slate-700 bg-slate-100/80">연직지표</TableHead>
                      <TableHead className="py-1.5 px-2 text-center font-bold text-slate-700">연직(%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm">
                    {/* 남양주센터 데이터 */}
                    <TableRow className="border-b border-slate-200">
                      <TableCell rowSpan={4} className="py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-50">남양주센터<br/>(B동)</TableCell>
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">매출액</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">총보관면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">1,440</TableCell>
                      <TableCell rowSpan={4} className="py-1.5 px-2 text-left text-xs">25.4월 핫시즈너(계약하나로S)<br/>보관위탁계약<br/>(저온창고 409평 사용예정)</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">원가</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">2</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">2</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">2</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">9</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">사용면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">200</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">직접경비</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공실면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">1,240</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">매출총이익</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-1.7</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-1.6</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/50 border-x border-blue-200">-1.6</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-8</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공실률</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">86%</TableCell>
                    </TableRow>

                    {/* 아암센터 데이터 */}
                    <TableRow className="border-b border-slate-200">
                      <TableCell rowSpan={4} className="py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-50">아암센터</TableCell>
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">매출액</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">9</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">9</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">11</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">47</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">총보관면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">27,140</TableCell>
                      <TableCell rowSpan={4} className="py-1.5 px-2 text-left text-sm">25.2월,3월,4월 로봇 보관위탁계약체결<br/>로봇 JYP360<br/>손해배상 청구<br/>3월 4승 로직스템리에프엑스 신규계약<br/>신세계 인터내셔널<br/>5월 신세계인터내셔널(홍보물)<br/>점유구 1.95㎡<br/>신세계 시장외인물 4천만원/월<br/>매출 원의예정</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">원가</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">10</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">10</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">10</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">50</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">사용면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">15,728</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">직접경비</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공실면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">11,413</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">매출총이익</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-1.2</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-1.0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-blue-600 bg-blue-50/50 border-x border-blue-200">0.9</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-4</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공실률</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">42%</TableCell>
                    </TableRow>

                    {/* 합계 데이터 */}
                    <TableRow className="border-b border-slate-200">
                      <TableCell rowSpan={6} className="py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-50">합계</TableCell>
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">매출액</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">9</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">9</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">11</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">47</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">총보관면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">28,580</TableCell>
                      <TableCell rowSpan={6} className="py-1.5 px-2 text-center">-</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">원가</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">12</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">12</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">12</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">59</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">사용면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">15,928</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">직접경비</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공실면적</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">12,653</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">매출총이익</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-3.0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-2.6</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/50 border-x border-blue-200">-0.7</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-12.1</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공실률</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">44%</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">간접경비</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/30">0</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">1</TableCell>
                      <TableCell className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">2</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">5</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">누적평당매출액</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">56%</TableCell>
                    </TableRow>
                    <TableRow className="border-b-2 border-slate-200">
                      <TableCell className="py-1.5 px-2 text-center font-medium text-slate-700">영업이익</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-3</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-4</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500 bg-blue-50/50 border-x border-blue-200">-3</TableCell>
                      <TableCell className="py-1.5 px-2 text-center text-red-500">-17</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">공간가동효율</TableCell>
                      <TableCell className="py-1.5 px-2 text-center">56%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}