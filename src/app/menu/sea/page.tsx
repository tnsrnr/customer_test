'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Chart } from 'react-chartjs-2';
import { Ship, Package, TrendingUp, DollarSign, Users, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

// 전역 Chart.js 설정 사용
import '@/lib/chart_config';

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
          boxWidth: 20,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold' as const,
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
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">총 매출액</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-700 leading-none">77</span>
                  <span className="ml-1 text-base font-semibold text-blue-700">억원</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">▼ 5억원</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">총 물동량</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-emerald-700 leading-none">3,770</span>
                  <span className="ml-1 text-base font-semibold text-emerald-700">ton</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">▼ 420ton</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">총 인원</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-purple-700 leading-none">42</span>
                  <span className="ml-1 text-base font-semibold text-purple-700">명</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">전월 동일</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-sky-200/50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg shadow-md">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold text-slate-800">총 처리건수</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-sky-700 leading-none">6,700</span>
                  <span className="ml-1 text-base font-semibold text-sky-700">HBL</span>
                </div>
              </div>
            </div>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">▼ 500건</span>
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
              <Card className="p-5 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg p-2">
                    <Ship className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">해상수출</h3>
                    <p className="text-sm text-slate-500">매출 및 영업이익 현황</p>
                  </div>
                </div>
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
              <Card className="p-5 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg p-2">
                    <Ship className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">해상수입</h3>
                    <p className="text-sm text-slate-500">매출 및 영업이익 현황</p>
                  </div>
                </div>
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
            <Card className="p-5 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-violet-500 rounded-lg p-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">월별 실적</h3>
                  <p className="text-sm text-slate-500">해상수출/수입 상세 데이터</p>
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <Table className="w-full text-sm">
                  <TableHeader className="border-b border-slate-200">
                    <TableRow className="border-b border-slate-200">
                      <TableHead colSpan={2} className="py-2.5 px-3 text-center font-bold text-slate-700 bg-slate-100/80">구분</TableHead>
                      <TableHead className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50">1월</TableHead>
                      <TableHead className="py-2.5 px-3 text-center font-bold text-blue-700">2월</TableHead>
                      <TableHead className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50">3월</TableHead>
                      <TableHead className="py-2.5 px-3 text-center font-bold text-blue-700">4월</TableHead>
                      <TableHead className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/80 border-x border-blue-200">5월</TableHead>
                      <TableHead className="py-2.5 px-3 text-center font-bold text-slate-700 bg-slate-100/80">전월대비</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-sm">
                    {/* 해상수출 데이터 */}
                    <TableRow className="border-b border-slate-200">
                      <TableCell rowSpan={7} className="py-2 px-3 text-center font-medium text-slate-700 bg-slate-50">해상수출</TableCell>
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">매출</TableCell>
                      {exportData.매출.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼29</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">매출이익</TableCell>
                      {exportData.매출이익.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼1</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">영업이익</TableCell>
                      {exportData.영업이익.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center">0</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">물동량(ton)</TableCell>
                      {exportData.물동량.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼400</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">인원(명)</TableCell>
                      {exportData.인원.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center">0</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">건수(HBL)</TableCell>
                      {exportData.건수.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼300</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">인당일평처리건수</TableCell>
                      {exportData.인당일평처리건수.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center">0</TableCell>
                    </TableRow>

                    {/* 해상수입 데이터 */}
                    <TableRow className="border-b border-slate-200">
                      <TableCell rowSpan={7} className="py-2 px-3 text-center font-medium text-slate-700 bg-slate-50">해상수입</TableCell>
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">매출</TableCell>
                      {importData.매출.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-blue-600">▲1</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">매출이익</TableCell>
                      {importData.매출이익.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-blue-600">▲1</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">영업이익</TableCell>
                      {importData.영업이익.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center">0</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">물동량(ton)</TableCell>
                      {importData.물동량.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼20</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">인원(명)</TableCell>
                      {importData.인원.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center">0</TableCell>
                    </TableRow>
                    <TableRow className="border-b border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">건수(HBL)</TableCell>
                      {importData.건수.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value.toLocaleString()}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼200</TableCell>
                    </TableRow>
                    <TableRow className="border-b-2 border-slate-200">
                      <TableCell className="py-2 px-3 text-center font-medium text-slate-700">인당일평처리건수</TableCell>
                      {importData.인당일평처리건수.map((value, index) => (
                        <TableCell key={index} className={`py-2 px-3 text-center ${index === 4 ? 'font-medium bg-blue-50/50 border-x border-blue-200' : index % 2 === 0 ? 'bg-blue-50/30' : ''}`}>
                          {value}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 px-3 text-center text-red-500">▼1</TableCell>
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