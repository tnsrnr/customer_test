'use client';

import { useEffect, useState } from 'react';
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
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-blue-100 rounded-xl">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">센터개수</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-6xl font-bold text-blue-600 leading-none">2</span>
              <span className="ml-2 text-2xl font-medium text-blue-600 self-end mb-1">센터</span>
            </div>
          </div>
        </motion.div>

        {/* 총 면적 */}
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
                <p className="text-lg font-medium text-slate-600">총 면적</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-6xl font-bold text-emerald-600 leading-none">28,580</span>
              <span className="ml-2 text-2xl font-medium text-emerald-600 self-end mb-1">평</span>
            </div>
          </div>
        </motion.div>

        {/* 사용 면적 */}
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
                <p className="text-lg font-medium text-slate-600">사용 면적</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-purple-600 leading-none">15,927</span>
                <span className="ml-2 text-2xl font-medium text-purple-600 self-end mb-1">평</span>
              </div>
              <span className="text-base font-medium text-purple-400 mt-1">56% 가동률</span>
            </div>
          </div>
        </motion.div>

        {/* 가동률 */}
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
                <p className="text-lg font-medium text-slate-600">가동률/공실률</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-sky-600 leading-none">56</span>
                <span className="ml-2 text-2xl font-medium text-sky-600 self-end mb-1">%</span>
              </div>
              <span className="text-base font-medium text-sky-400 mt-1">공실률 44%</span>
            </div>
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
              <Card className="p-5 shadow-lg shadow-blue-900/5 border border-slate-200">
                <div className="flex flex-col gap-4">
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
              <Card className="p-5 shadow-lg shadow-emerald-900/5 border border-slate-200">
                <div className="flex flex-col gap-4">
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
            <Card className="p-5 shadow-lg shadow-slate-900/5 border border-slate-200 h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th rowSpan={2} className="py-2 px-3 text-center font-bold text-slate-700 bg-slate-100/80">센터명</th>
                      <th rowSpan={2} className="py-2 px-3 text-center font-bold text-slate-700 bg-slate-100/80">계정과목명</th>
                      <th colSpan={4} className="py-2 px-3 text-center font-bold text-slate-700 bg-slate-100/80">창고손익</th>
                      <th colSpan={2} className="py-2 px-3 text-center font-bold text-slate-700 bg-slate-100/80">창고 가동율 현황</th>
                      <th rowSpan={2} className="py-2 px-3 text-center font-bold text-slate-700 bg-slate-100/80">비고</th>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <th className="py-1.5 px-2 text-center font-bold text-blue-700 bg-blue-50/50">3월</th>
                      <th className="py-1.5 px-2 text-center font-bold text-blue-700">4월</th>
                      <th className="py-1.5 px-2 text-center font-bold text-blue-700 bg-blue-50/80 border-x border-blue-200">5월</th>
                      <th className="py-1.5 px-2 text-center font-bold text-slate-700 bg-slate-100/80">합계</th>
                      <th className="py-1.5 px-2 text-center font-bold text-slate-700 bg-slate-100/80">연직지표</th>
                      <th className="py-1.5 px-2 text-center font-bold text-slate-700 bg-slate-100/80">연직(%)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* 남양주센터 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={4} className="py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-50">남양주센터<br/>(B동)</td>
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">매출액</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center">총보관면적</td>
                      <td className="py-1.5 px-2 text-center">1,440</td>
                      <td rowSpan={4} className="py-1.5 px-2 text-left text-xs">25.4월 핫시즈너(계약하나로S)<br/>보관위탁계약<br/>(저온창고 409평 사용예정)</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">원가</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">2</td>
                      <td className="py-1.5 px-2 text-center">2</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">2</td>
                      <td className="py-1.5 px-2 text-center">9</td>
                      <td className="py-1.5 px-2 text-center">사용면적</td>
                      <td className="py-1.5 px-2 text-center">200</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">직접경비</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center">공실면적</td>
                      <td className="py-1.5 px-2 text-center">1,240</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">매출총이익</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-1.7</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-1.6</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/50 border-x border-blue-200">-1.6</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-8</td>
                      <td className="py-1.5 px-2 text-center">공실률</td>
                      <td className="py-1.5 px-2 text-center">86%</td>
                    </tr>

                    {/* 아암센터 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={4} className="py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-50">아암센터</td>
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">매출액</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">9</td>
                      <td className="py-1.5 px-2 text-center">9</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">11</td>
                      <td className="py-1.5 px-2 text-center">47</td>
                      <td className="py-1.5 px-2 text-center">총보관면적</td>
                      <td className="py-1.5 px-2 text-center">27,140</td>
                      <td rowSpan={4} className="py-1.5 px-2 text-left text-sm">25.2월,3월,4월 로봇 보관위탁계약체결<br/>로봇 JYP360<br/>손해배상 청구<br/>3월 4승 로직스템리에프엑스 신규계약<br/>신세계 인터내셔널<br/>5월 신세계인터내셔널(홍보물)<br/>점유구 1.95㎡<br/>신세계 시장외인물 4천만원/월<br/>매출 원의예정</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">원가</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">10</td>
                      <td className="py-1.5 px-2 text-center">10</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">10</td>
                      <td className="py-1.5 px-2 text-center">50</td>
                      <td className="py-1.5 px-2 text-center">사용면적</td>
                      <td className="py-1.5 px-2 text-center">15,728</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">직접경비</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center">공실면적</td>
                      <td className="py-1.5 px-2 text-center">11,413</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">매출총이익</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-1.2</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-1.0</td>
                      <td className="py-1.5 px-2 text-center text-blue-600 bg-blue-50/50 border-x border-blue-200">0.9</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-4</td>
                      <td className="py-1.5 px-2 text-center">공실률</td>
                      <td className="py-1.5 px-2 text-center">42%</td>
                    </tr>

                    {/* 합계 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={6} className="py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-50">합계</td>
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">매출액</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">9</td>
                      <td className="py-1.5 px-2 text-center">9</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">11</td>
                      <td className="py-1.5 px-2 text-center">47</td>
                      <td className="py-1.5 px-2 text-center">총보관면적</td>
                      <td className="py-1.5 px-2 text-center">28,580</td>
                      <td rowSpan={6} className="py-1.5 px-2 text-center">-</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">원가</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">12</td>
                      <td className="py-1.5 px-2 text-center">12</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">12</td>
                      <td className="py-1.5 px-2 text-center">59</td>
                      <td className="py-1.5 px-2 text-center">사용면적</td>
                      <td className="py-1.5 px-2 text-center">15,928</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">직접경비</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">0</td>
                      <td className="py-1.5 px-2 text-center">0</td>
                      <td className="py-1.5 px-2 text-center">공실면적</td>
                      <td className="py-1.5 px-2 text-center">12,653</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">매출총이익</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-3.0</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-2.6</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/50 border-x border-blue-200">-0.7</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-12.1</td>
                      <td className="py-1.5 px-2 text-center">공실률</td>
                      <td className="py-1.5 px-2 text-center">44%</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">간접경비</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/30">0</td>
                      <td className="py-1.5 px-2 text-center">1</td>
                      <td className="py-1.5 px-2 text-center bg-blue-50/50 border-x border-blue-200">2</td>
                      <td className="py-1.5 px-2 text-center">5</td>
                      <td className="py-1.5 px-2 text-center">누적평당매출액</td>
                      <td className="py-1.5 px-2 text-center">56%</td>
                    </tr>
                    <tr className="border-b-2 border-slate-200">
                      <td className="py-1.5 px-2 text-center font-medium text-slate-700">영업이익</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/30">-3</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-4</td>
                      <td className="py-1.5 px-2 text-center text-red-500 bg-blue-50/50 border-x border-blue-200">-3</td>
                      <td className="py-1.5 px-2 text-center text-red-500">-17</td>
                      <td className="py-1.5 px-2 text-center">공간가동효율</td>
                      <td className="py-1.5 px-2 text-center">56%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}