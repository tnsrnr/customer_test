'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Truck, Ship, Plane, Package, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Card } from "@/components/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  annotationPlugin
);

const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export default function OverseasPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Pretendard', sans-serif",
            weight: 600 as const,
          },
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: {
          size: 13,
          family: "'Pretendard', sans-serif",
          weight: 600 as const,
        },
        bodyFont: {
          size: 12,
          family: "'Pretendard', sans-serif",
        },
        boxPadding: 6,
        usePointStyle: true,
      }
    }
  };

  const baseBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Pretendard', sans-serif",
            weight: 'bold',
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
            weight: 'normal',
          },
          color: '#475569',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
            weight: 'normal',
          },
          color: '#475569',
        },
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    ...baseBarOptions,
    plugins: {
      ...baseBarOptions.plugins,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 1860,
            yMax: 1860,
            borderColor: 'rgba(75, 85, 99, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: '평균: 1,860억',
              position: 'end',
              backgroundColor: 'rgba(75, 85, 99, 0.8)',
              font: {
                family: "'Pretendard', sans-serif",
              }
            }
          }
        }
      }
    }
  };

  const barOptionsOverseas: ChartOptions<'bar'> = {
    ...baseBarOptions,
    plugins: {
      ...baseBarOptions.plugins,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 1260,
            yMax: 1260,
            borderColor: 'rgba(75, 85, 99, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: '평균: 1,260억',
              position: 'end',
              backgroundColor: 'rgba(75, 85, 99, 0.8)',
              font: {
                family: "'Pretendard', sans-serif",
              }
            }
          }
        }
      }
    }
  };

  const barOptionsEmployee: ChartOptions<'bar'> = {
    ...baseBarOptions,
    plugins: {
      ...baseBarOptions.plugins,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 396,
            yMax: 396,
            borderColor: 'rgba(75, 85, 99, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: '평균: 396명',
              position: 'end',
              backgroundColor: 'rgba(75, 85, 99, 0.8)',
              font: {
                family: "'Pretendard', sans-serif",
              }
            }
          }
        }
      }
    }
  };

  const barOptionsBranch: ChartOptions<'bar'> = {
    ...baseBarOptions,
    plugins: {
      ...baseBarOptions.plugins,
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 52,
            yMax: 52,
            borderColor: 'rgba(75, 85, 99, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            label: {
              display: true,
              content: '평균: 52개',
              position: 'end',
              backgroundColor: 'rgba(75, 85, 99, 0.8)',
              font: {
                family: "'Pretendard', sans-serif",
              }
            }
          }
        }
      }
    }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    ...commonOptions,
    cutout: '70%',
    radius: '90%'
  };

  // 국내 매출 데이터
  const domesticData = {
    labels: months,
    datasets: [
      {
        label: '매출액',
        data: [100, 120, 150, 130, 160, 180, 140, 170, 190, 200, 180, 220],
        backgroundColor: 'rgba(2, 132, 199, 0.85)',
        borderRadius: 8,
        barThickness: 12,
      },
      {
        label: '매입액',
        data: [70, 85, 105, 90, 115, 125, 95, 120, 135, 140, 125, 155],
        backgroundColor: 'rgba(56, 189, 248, 0.6)',
        borderRadius: 8,
        barThickness: 12,
      },
    ],
  };

  // 해외 매출 데이터
  const overseasData = {
    labels: months,
    datasets: [
      {
        label: '매출액',
        data: [50, 60, 70, 65, 80, 90, 70, 85, 95, 100, 90, 110],
        backgroundColor: 'rgba(20, 184, 166, 0.85)',
        borderRadius: 8,
        barThickness: 12,
      },
      {
        label: '매입액',
        data: [35, 42, 50, 45, 55, 65, 50, 60, 70, 75, 65, 80],
        backgroundColor: 'rgba(45, 212, 191, 0.6)',
        borderRadius: 8,
        barThickness: 12,
      },
    ],
  };

  // 법인인원현황 데이터
  const employeeData = {
    labels: months,
    datasets: [
      {
        label: '국내법인',
        data: Array(12).fill(220),
        backgroundColor: 'rgba(79, 70, 229, 0.85)',
        stack: 'stack',
        barThickness: 20,
      },
      {
        label: '해외법인',
        data: Array(12).fill(500),
        backgroundColor: 'rgba(129, 140, 248, 0.6)',
        stack: 'stack',
        barThickness: 20,
      },
    ],
  };

  // 권역별 지점현황 데이터
  const branchData = {
    labels: ['국내1팀', '동남아', '중국', '미주', '유럽'],
    datasets: [
      {
        data: [22, 32, 54, 32, 12],
        backgroundColor: [
          'rgba(2, 132, 199, 0.85)',
          'rgba(20, 184, 166, 0.85)',
          'rgba(79, 70, 229, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(190, 18, 60, 0.85)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="relative z-10 h-[calc(100vh-64px)] p-4 overflow-hidden">
        {/* 차트 그리드 */}
        <div className="grid grid-cols-4 gap-4">
          {/* 그룹사현황 카드 */}
          <Card className="col-span-2 pt-2 pb-4 px-4 h-[calc(100vh-7.5rem)] bg-gradient-to-br from-blue-900/90 via-slate-800/80 to-slate-700/90 backdrop-blur-md border border-blue-800/40 shadow-2xl">
            <div className="mb-0.5 text-center">
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-800/60 to-blue-700/60 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-600/50 shadow-lg w-full">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg flex items-center justify-center shadow-md border border-blue-500/50">
                  <svg className="w-3 h-3 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-blue-100 drop-shadow-lg tracking-wide">그룹사현황</h2>
              </div>
            </div>
            <div className="grid grid-rows-5 gap-3 h-[calc(100%-4rem)]">
              {/* 상단 2개 컴포넌트 (3/5 비율) */}
              <div className="row-span-3 grid grid-cols-2 gap-3">
                {/* 국내 매출 현황 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-3 border border-sky-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">국내 매출 현황</h3>
                      <p className="text-xs text-slate-500">Monthly Revenue</p>
                    </div>
                    <div className="text-xs text-sky-600">+15%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar options={baseBarOptions} data={domesticData} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-sky-100">총매출</div>
                      <div className="text-xs font-bold">1000억</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-sky-100">총매입</div>
                      <div className="text-xs font-bold">200억</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.1 }}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-sky-100">영업이익</div>
                      <div className="text-xs font-bold">800억</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* 해외 매출 현황 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">해외 매출 현황</h3>
                      <p className="text-xs text-slate-500">Global Revenue</p>
                    </div>
                    <div className="text-xs text-teal-600">+22%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar options={baseBarOptions} data={overseasData} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                      className="bg-teal-500 to-teal-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-teal-100">총매출</div>
                      <div className="text-xs font-bold">200억</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                      className="bg-teal-500 to-teal-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-teal-100">총매입</div>
                      <div className="text-xs font-bold">100억</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.1 }}
                      className="bg-teal-500 to-teal-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-teal-100">영업이익</div>
                      <div className="text-xs font-bold">100억</div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* 하단 2개 컴포넌트 (2/5 비율) */}
              <div className="row-span-2 grid grid-cols-2 gap-3">
                {/* 법인인원현황 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">법인인원현황</h3>
                      <p className="text-xs text-slate-500">Employee Distribution</p>
                    </div>
                    <div className="text-xs text-indigo-600">+2%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar options={baseBarOptions} data={employeeData} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-indigo-100">국내법인</div>
                      <div className="text-xs font-bold">220명</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-indigo-100">해외법인</div>
                      <div className="text-xs font-bold">500명</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.1 }}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-indigo-100">총인원</div>
                      <div className="text-xs font-bold">720명</div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* 권역별 지점현황 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">권역별 지점현황</h3>
                      <p className="text-xs text-slate-500">Regional Branch</p>
                    </div>
                    <div className="text-xs text-amber-600">+2</div>
                  </div>
                  <div className="h-[calc(100%-100px)] flex items-center justify-center">
                    <div className="w-full h-full">
                      {showCharts && <Doughnut data={branchData} options={{
                        ...doughnutOptions,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                          ...doughnutOptions.plugins,
                          legend: {
                            position: 'right' as const,
                            labels: {
                              padding: 20,
                              font: {
                                size: 12,
                                family: "'Pretendard', sans-serif",
                                weight: 600 as const,
                              },
                              usePointStyle: true,
                              pointStyle: 'rectRounded',
                            },
                          }
                        }
                      }} />}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 }}
                      className="bg-amber-500 to-amber-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-amber-100">국내지점</div>
                      <div className="text-xs font-bold">22개</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                      className="bg-amber-500 to-amber-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-amber-100">해외지점</div>
                      <div className="text-xs font-bold">32개</div>
                    </motion.div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 1.1 }}
                      className="bg-amber-500 to-amber-600 text-white p-1 rounded text-center"
                    >
                      <div className="text-xs text-amber-100">총지점</div>
                      <div className="text-xs font-bold">54개</div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>

          {/* 그룹사추이 카드 */}
          <Card className="col-span-2 pt-2 pb-4 px-4 h-[calc(100vh-7.5rem)] bg-gradient-to-br from-blue-900/90 via-slate-800/80 to-slate-700/90 backdrop-blur-md border border-blue-800/40 shadow-2xl">
            <div className="mb-0.5 text-center">
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-800/60 to-blue-700/60 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-600/50 shadow-lg w-full">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg flex items-center justify-center shadow-md border border-blue-500/50">
                  <svg className="w-3 h-3 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-blue-100 drop-shadow-lg tracking-wide">그룹사추이</h2>
              </div>
            </div>
            <div className="grid grid-rows-5 gap-3 h-[calc(100%-4rem)]">
              {/* 상단 2개 컴포넌트 (3/5 비율) */}
              <div className="row-span-3 grid grid-cols-2 gap-3">
                {/* 국내 매출 추이 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-3 border border-sky-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">국내 매출 추이</h3>
                      <p className="text-xs text-slate-500">Domestic Revenue Trend</p>
                    </div>
                    <div className="text-xs text-sky-600">+13.6%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar 
                      options={barOptions}
                      data={{
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        datasets: [
                          {
                            label: '매출액',
                            data: [1500, 1300, 1800, 2200, 2500],
                            backgroundColor: 'rgb(14, 165, 233)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                          {
                            label: '매입액',
                            data: [1200, 1000, 1500, 1800, 2000],
                            backgroundColor: 'rgb(186, 230, 253)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                        ],
                      }} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="bg-sky-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-sky-600 font-medium">최고 매출</div>
                      <div className="text-xs font-bold text-sky-700">2,500억</div>
                    </div>
                    <div className="bg-sky-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-sky-600 font-medium">최저 매출</div>
                      <div className="text-xs font-bold text-sky-700">1,300억</div>
                    </div>
                    <div className="bg-sky-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-sky-600 font-medium">평균</div>
                      <div className="text-xs font-bold text-sky-700">1,860억</div>
                    </div>
                  </div>
                </motion.div>

                {/* 해외 매출 추이 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">해외 매출 추이</h3>
                      <p className="text-xs text-slate-500">Overseas Revenue Trend</p>
                    </div>
                    <div className="text-xs text-teal-600">+22.5%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar 
                      options={barOptionsOverseas}
                      data={{
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        datasets: [
                          {
                            label: '매출액',
                            data: [800, 1000, 1200, 1500, 1800],
                            backgroundColor: 'rgb(20, 184, 166)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                          {
                            label: '매입액',
                            data: [600, 800, 1000, 1200, 1500],
                            backgroundColor: 'rgb(153, 246, 228)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                        ],
                      }} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="bg-teal-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-teal-600 font-medium">최고 매출</div>
                      <div className="text-xs font-bold text-teal-700">1,800억</div>
                    </div>
                    <div className="bg-teal-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-teal-600 font-medium">최저 매출</div>
                      <div className="text-xs font-bold text-teal-700">800억</div>
                    </div>
                    <div className="bg-teal-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-teal-600 font-medium">평균</div>
                      <div className="text-xs font-bold text-teal-700">1,260억</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 하단 2개 컴포넌트 (2/5 비율) */}
              <div className="row-span-2 grid grid-cols-2 gap-3">
                {/* 법인인원 추이 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">법인인원 추이</h3>
                      <p className="text-xs text-slate-500">Employee Trend</p>
                    </div>
                    <div className="text-xs text-purple-600">+15.2%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar 
                      options={barOptionsEmployee}
                      data={{
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        datasets: [
                          {
                            label: '정규직',
                            data: [250, 280, 320, 380, 450],
                            backgroundColor: 'rgb(147, 51, 234)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                          {
                            label: '계약직',
                            data: [50, 60, 80, 90, 100],
                            backgroundColor: 'rgb(233, 213, 255)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                        ],
                      }} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="bg-purple-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-purple-600 font-medium">최대 인원</div>
                      <div className="text-xs font-bold text-purple-700">550명</div>
                    </div>
                    <div className="bg-purple-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-purple-600 font-medium">최소 인원</div>
                      <div className="text-xs font-bold text-purple-700">300명</div>
                    </div>
                    <div className="bg-purple-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-purple-600 font-medium">평균</div>
                      <div className="text-xs font-bold text-purple-700">396명</div>
                    </div>
                  </div>
                </motion.div>

                {/* 권역별 지점 추이 */}
                <motion.div 
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">권역별 지점 추이</h3>
                      <p className="text-xs text-slate-500">Branch Trend</p>
                    </div>
                    <div className="text-xs text-amber-600">+8.5%</div>
                  </div>
                  <div className="h-[calc(100%-100px)]">
                    {showCharts && <Bar 
                      options={barOptionsBranch}
                      data={{
                        labels: ['2019', '2020', '2021', '2022', '2023'],
                        datasets: [
                          {
                            label: '국내지점',
                            data: [15, 18, 20, 22, 25],
                            backgroundColor: 'rgb(245, 158, 11)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                          {
                            label: '해외지점',
                            data: [20, 25, 28, 30, 35],
                            backgroundColor: 'rgb(251, 191, 36)',
                            borderRadius: 4,
                            barThickness: 12,
                          },
                        ],
                      }} />}
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2">
                    <div className="bg-rose-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-rose-600 font-medium">최대 지점</div>
                      <div className="text-xs font-bold text-rose-700">74개</div>
                    </div>
                    <div className="bg-rose-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-rose-600 font-medium">최소 지점</div>
                      <div className="text-xs font-bold text-rose-700">35개</div>
                    </div>
                    <div className="bg-rose-50 px-2 py-1 rounded text-center">
                      <div className="text-xs text-rose-600 font-medium">평균</div>
                      <div className="text-xs font-bold text-rose-700">52개</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 