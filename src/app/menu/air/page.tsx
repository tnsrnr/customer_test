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
  ChartOptions,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Truck, Ship, Plane, Package, Users, TrendingUp, DollarSign } from 'lucide-react';
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
  Legend,
  Filler
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

export default function AirPage() {
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

  // 차트 데이터 설정
  const exportChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출',
        data: exportData.매출,
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 20,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: exportData.영업이익,
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointRadius: 4,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  const importChartData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        type: 'bar' as const,
        label: '매출',
        data: importData.매출,
        backgroundColor: 'rgb(37, 99, 235)',
        borderRadius: 2,
        barThickness: 20,
        yAxisID: 'y'
      },
      {
        type: 'line' as const,
        label: '영업이익',
        data: importData.영업이익,
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
          padding: 15
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
          callback: function(value) {
            return value + '억';
          }
        }
      },
      y1: {
        position: 'right' as const,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value) {
            return value + '억';
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
                <Package className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">총 매출액</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-blue-600 leading-none">74</span>
                <span className="ml-2 text-2xl font-medium text-blue-600 self-end mb-1">억원</span>
              </div>
              <span className="text-base font-medium text-red-500 mt-1">▼ 31억원 vs 전월</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-emerald-100 rounded-xl">
                <Plane className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">총 물동량</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-emerald-600 leading-none">2,974</span>
                <span className="ml-2 text-2xl font-medium text-emerald-600 self-end mb-1">ton</span>
              </div>
              <span className="text-base font-medium text-red-500 mt-1">▼ 647ton vs 전월</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-purple-100 rounded-xl">
                <Users className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">총 인원</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-purple-600 leading-none">35</span>
                <span className="ml-2 text-2xl font-medium text-purple-600 self-end mb-1">명</span>
              </div>
              <span className="text-base font-medium text-slate-500 mt-1">전월 동일</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center h-full">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-4 bg-sky-100 rounded-xl">
                <Truck className="w-12 h-12 text-sky-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">총 처리건수</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-sky-600 leading-none">6,351</span>
                <span className="ml-2 text-2xl font-medium text-sky-600 self-end mb-1">HBL</span>
              </div>
              <span className="text-base font-medium text-red-500 mt-1">▼ 602건 vs 전월</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-[95%] mx-auto">
        {/* 좌측 컴포넌트들 */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 gap-6">
            {/* 항공수출 차트 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative"
            >
              <Card className="p-5 shadow-lg shadow-blue-900/5 border border-slate-200">
                <div className="flex flex-col gap-4">
                  <div className="h-[220px] w-full">
                    {showCharts && <Chart type='bar' data={exportChartData} options={{
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
                              size: 12,
                              weight: 'bold',
                              family: "'Pretendard', sans-serif"
                            }
                          }
                        }
                      }
                    }} />}
                  </div>
                  <div className="text-center text-sm font-medium text-slate-700">
                    <span>항공수출</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 항공수입 차트 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="relative"
            >
              <Card className="p-5 shadow-lg shadow-emerald-900/5 border border-slate-200">
                <div className="flex flex-col gap-4">
                  <div className="h-[220px] w-full">
                    {showCharts && <Chart type='bar' data={importChartData} options={{
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
                              size: 12,
                              weight: 'bold',
                              family: "'Pretendard', sans-serif"
                            }
                          }
                        }
                      }
                    }} />}
                  </div>
                  <div className="text-center text-sm font-medium text-slate-700">항공수입</div>
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
                      <th colSpan={2} className="py-2.5 px-3 text-center font-bold text-slate-700 bg-slate-100/80">구분</th>
                      <th className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50">1월</th>
                      <th className="py-2.5 px-3 text-center font-bold text-blue-700">2월</th>
                      <th className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50">3월</th>
                      <th className="py-2.5 px-3 text-center font-bold text-blue-700">4월</th>
                      <th className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/80 border-x border-blue-200">5월</th>
                      <th className="py-2.5 px-3 text-center font-bold text-slate-700 bg-slate-100/80">전월대비</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* 항공수출 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={7} className="py-2 px-3 text-center font-medium text-slate-700 bg-slate-50">항공수출</td>
                      <td className="py-2 px-3 text-center font-medium text-slate-700">매출</td>
                      {exportData.매출.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼31</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">매출이익</td>
                      {exportData.매출이익.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼1</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">영업이익</td>
                      {exportData.영업이익.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">0</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">물동량(ton)</td>
                      {exportData.물동량.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼582</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">인원(명)</td>
                      {exportData.인원.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">0</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">건수(HBL)</td>
                      {exportData.건수.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼347</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">인당일평처리건수</td>
                      {exportData.인당일평처리건수.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼1</td>
                    </tr>

                    {/* 항공수입 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={7} className="py-2 px-3 text-center font-medium text-slate-700 bg-slate-50">항공수입</td>
                      <td className="py-2 px-3 text-center font-medium text-slate-700">매출</td>
                      {importData.매출.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-blue-600">▲1</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">매출이익</td>
                      {importData.매출이익.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">0</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">영업이익</td>
                      {importData.영업이익.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">0</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">물동량(ton)</td>
                      {importData.물동량.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼65</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">인원(명)</td>
                      {importData.인원.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">0</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">건수(HBL)</td>
                      {importData.건수.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼255</td>
                    </tr>
                    <tr className="border-b-2 border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">인당일평처리건수</td>
                      {importData.인당일평처리건수.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼1</td>
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