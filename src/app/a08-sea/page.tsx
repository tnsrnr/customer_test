'use client';

import { useEffect, useState } from 'react';
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
  ChartOptions,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Ship, Package, TrendingUp, DollarSign, Users, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

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

// 해상수출 데이터
const exportData = {
  매출: [52, 48, 55, 92, 63],
  매출이익: [2, 3, 3, 4, 3],
  영업이익: [-1, 0, 1, 0, 0],
  물동량: [2500, 2300, 2600, 3200, 2800],
  인원: [28, 28, 28, 28, 28],
  건수: [3500, 3600, 3900, 4200, 3900],
  인당일평처리건수: [8, 8, 9, 9, 9]
};

// 해상수입 데이터
const importData = {
  매출: [25, 22, 24, 23, 24],
  매출이익: [1, 0, 0, 0, 1],
  영업이익: [-1, -1, -1, -1, -1],
  물동량: [1000, 950, 980, 990, 970],
  인원: [15, 15, 14, 14, 14],
  건수: [2800, 2750, 2900, 3000, 2800],
  인당일평처리건수: [11, 11, 13, 13, 12]
};

export default function SeaPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

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

  // 차트 옵션
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
            size: 12,
            weight: 'bold',
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
                <span className="text-6xl font-bold text-blue-600 leading-none">87</span>
                <span className="ml-2 text-2xl font-medium text-blue-600 self-end mb-1">억원</span>
              </div>
              <span className="text-base font-medium text-red-500 mt-1">▼ 28억원 vs 전월</span>
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
                <Ship className="w-12 h-12 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-600">총 물동량</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <span className="text-6xl font-bold text-emerald-600 leading-none">3,770</span>
                <span className="ml-2 text-2xl font-medium text-emerald-600 self-end mb-1">ton</span>
              </div>
              <span className="text-base font-medium text-red-500 mt-1">▼ 420ton vs 전월</span>
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
                <span className="text-6xl font-bold text-purple-600 leading-none">42</span>
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
                <span className="text-6xl font-bold text-sky-600 leading-none">6,700</span>
                <span className="ml-2 text-2xl font-medium text-sky-600 self-end mb-1">HBL</span>
              </div>
              <span className="text-base font-medium text-red-500 mt-1">▼ 500건 vs 전월</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-[95%] mx-auto">
        {/* 좌측 컴포넌트들 */}
        <div className="lg:col-span-5">
          <div className="grid grid-cols-1 gap-6">
            {/* 해상수출 차트 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="relative"
            >
              <Card className="p-5 shadow-lg shadow-blue-900/5 border border-slate-200">
                <div className="flex flex-col gap-4">
                  <div className="h-[220px] w-full">
                    {showCharts && <Chart type='bar' data={exportChartData} options={chartOptions} />}
                  </div>
                  <div className="text-center text-sm font-medium text-slate-700">
                    <span>해상수출</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 해상수입 차트 */}
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="relative"
            >
              <Card className="p-5 shadow-lg shadow-emerald-900/5 border border-slate-200">
                <div className="flex flex-col gap-4">
                  <div className="h-[220px] w-full">
                    {showCharts && <Chart type='bar' data={importChartData} options={chartOptions} />}
                  </div>
                  <div className="text-center text-sm font-medium text-slate-700">해상수입</div>
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
                    {/* 해상수출 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={7} className="py-2 px-3 text-center font-medium text-slate-700 bg-slate-50">해상수출</td>
                      <td className="py-2 px-3 text-center font-medium text-slate-700">매출</td>
                      {exportData.매출.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center text-red-500">▼29</td>
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
                      <td className="py-2 px-3 text-center text-red-500">▼400</td>
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
                      <td className="py-2 px-3 text-center text-red-500">▼300</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 px-3 text-center font-medium text-slate-700">인당일평처리건수</td>
                      {exportData.인당일평처리건수.map((value, index) => (
                        <td key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </td>
                      ))}
                      <td className="py-2 px-3 text-center">0</td>
                    </tr>

                    {/* 해상수입 데이터 */}
                    <tr className="border-b border-slate-200">
                      <td rowSpan={7} className="py-2 px-3 text-center font-medium text-slate-700 bg-slate-50">해상수입</td>
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
                      <td className="py-2 px-3 text-center text-blue-600">▲1</td>
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
                      <td className="py-2 px-3 text-center text-red-500">▼20</td>
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
                      <td className="py-2 px-3 text-center text-red-500">▼200</td>
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