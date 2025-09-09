'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Truck, Ship, Plane, Package, Users } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

// 숫자 카운팅 애니메이션 컴포넌트
const Counter = ({ value, suffix = "", className }: { value: number, suffix?: string, className: string }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, value, { duration: 1.5 });
    return animation.stop;
  }, [value]);

  return (
    <div className="flex items-baseline">
      <motion.span className={className}>{rounded}</motion.span>
      <span className={className}>{suffix}</span>
    </div>
  );
};

export default function OverseasPage() {
  const [showCharts, setShowCharts] = useState(false);
  const [chartRotation, setChartRotation] = useState(0);

  useEffect(() => {
    // 차트 표시 딜레이
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 차트 공통 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart' as const
    },
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
        animation: {
          duration: 200,
        },
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
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
            weight: 500 as const,
          },
          color: '#475569',
        },
        border: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Pretendard', sans-serif",
            weight: 500 as const,
          },
          color: '#475569',
          padding: 8,
        },
        border: {
          display: false,
        }
      },
    },
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

  // 스켈레톤 로딩 컴포넌트
  const ChartSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-[calc(100%-2rem)] bg-slate-100 rounded"></div>
    </div>
  );

  // 물결 효과가 있는 통계 카드 컴포넌트
  const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
    <motion.div 
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      className={`relative overflow-hidden bg-gradient-to-r ${color} text-white p-2 rounded-lg text-center group`}
    >
      <motion.div
        className="absolute inset-0 bg-white opacity-10"
        animate={{
          scale: [1, 1.5],
          opacity: [0.1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <div className="relative z-10">
        <div className="text-xs text-white/90">{title}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50/50 p-4 overflow-hidden">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ 
            scale: 1.02,
            rotate: [-1, 1],
            transition: {
              rotate: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.3
              }
            }
          }}
          className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl p-3 text-white shadow-lg shadow-sky-500/10"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-sky-100">누적 매출</span>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
            >
              <Truck className="w-5 h-5 text-sky-100" />
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <Counter value={2000} suffix="억" className="text-xl lg:text-2xl font-bold" />
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-xs lg:text-sm font-medium text-sky-200"
            >
              +15.2%
            </motion.span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ 
            scale: 1.02,
            rotate: [-1, 1],
            transition: {
              rotate: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.3
              }
            }
          }}
          className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-3 text-white shadow-lg shadow-teal-500/10"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-teal-100">누적 매입</span>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
            >
              <Ship className="w-5 h-5 text-teal-100" />
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <Counter value={1700} suffix="억" className="text-xl lg:text-2xl font-bold" />
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-xs lg:text-sm font-medium text-teal-200"
            >
              +12.8%
            </motion.span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ 
            scale: 1.02,
            rotate: [-1, 1],
            transition: {
              rotate: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.3
              }
            }
          }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-3 text-white shadow-lg shadow-indigo-500/10"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-indigo-100">누적 영업이익</span>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
            >
              <Package className="w-5 h-5 text-indigo-100" />
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <Counter value={300} suffix="억" className="text-xl lg:text-2xl font-bold" />
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-xs lg:text-sm font-medium text-indigo-200"
            >
              +18.5%
            </motion.span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ 
            scale: 1.02,
            rotate: [-1, 1],
            transition: {
              rotate: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.3
              }
            }
          }}
          className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-3 text-white shadow-lg shadow-amber-500/10"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-amber-100">총 인원</span>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
            >
              <Users className="w-5 h-5 text-amber-100" />
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <Counter value={2200} suffix="명" className="text-xl lg:text-2xl font-bold" />
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-xs lg:text-sm font-medium text-amber-200"
            >
              +5.2%
            </motion.span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ 
            scale: 1.02,
            rotate: [-1, 1],
            transition: {
              rotate: {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.3
              }
            }
          }}
          className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-3 text-white shadow-lg shadow-red-500/10"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-red-100">총 지법인수</span>
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }
              }}
            >
              <Plane className="w-5 h-5 text-red-100" />
            </motion.div>
          </div>
          <div className="flex items-end justify-between">
            <Counter value={42} suffix="개" className="text-xl lg:text-2xl font-bold" />
            <motion.span 
              whileHover={{ scale: 1.1 }}
              className="text-xs lg:text-sm font-medium text-red-200"
            >
              +2개
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100vh-12rem)]">
        {/* 좌측 차트 영역 */}
        <div className="grid grid-rows-[1fr,1fr] gap-3">
          {/* 국내 매출 현황 */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.7 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-xl p-3 shadow-lg shadow-slate-200 border border-slate-100 h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-slate-800">국내 매출 현황</h2>
                <p className="text-xs text-slate-500">Monthly Revenue Analysis</p>
              </div>
              <div className="text-xs text-sky-600">전년 대비 +15%</div>
            </div>
            <div className="h-[calc(100%-110px)]">
              <AnimatePresence>
                {!showCharts ? (
                  <ChartSkeleton />
                ) : (
                  <Bar options={chartOptions} data={domesticData} />
                )}
              </AnimatePresence>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <StatCard title="총매출" value="1000억" color="from-sky-500 to-sky-600" />
              <StatCard title="총매입" value="200억" color="from-sky-500 to-sky-600" />
              <StatCard title="총영업이익" value="800억" color="from-sky-500 to-sky-600" />
            </div>
          </motion.div>

          {/* 법인인원현황 */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.8 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-xl p-3 shadow-lg shadow-slate-200 border border-slate-100 h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-slate-800">법인인원현황</h2>
                <p className="text-xs text-slate-500">Employee Distribution</p>
              </div>
              <div className="text-xs text-indigo-600">전월 대비 +2%</div>
            </div>
            <div className="h-[calc(100%-110px)]">
              <Bar options={chartOptions} data={employeeData} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2 rounded-lg text-center"
              >
                <div className="text-xs text-indigo-100">국내법인</div>
                <div className="text-sm font-bold">220명</div>
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2 rounded-lg text-center"
              >
                <div className="text-xs text-indigo-100">해외법인</div>
                <div className="text-sm font-bold">500명</div>
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2 rounded-lg text-center"
              >
                <div className="text-xs text-indigo-100">총인원</div>
                <div className="text-sm font-bold">720명</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 우측 차트 영역 */}
        <div className="grid grid-rows-[1fr,1fr] gap-3">
          {/* 해외 매출 현황 */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.7 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-xl p-3 shadow-lg shadow-slate-200 border border-slate-100 h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-slate-800">해외 매출 현황</h2>
                <p className="text-xs text-slate-500">Global Revenue Analysis</p>
              </div>
              <div className="text-xs text-teal-600">전년 대비 +22%</div>
            </div>
            <div className="h-[calc(100%-110px)]">
              <Bar options={chartOptions} data={overseasData} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-2 rounded-lg text-center"
              >
                <div className="text-xs text-teal-100">총매출</div>
                <div className="text-sm font-bold">200억</div>
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-2 rounded-lg text-center"
              >
                <div className="text-xs text-teal-100">총매입</div>
                <div className="text-sm font-bold">100억</div>
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-2 rounded-lg text-center"
              >
                <div className="text-xs text-teal-100">총영업이익</div>
                <div className="text-sm font-bold">100억</div>
              </motion.div>
            </div>
          </motion.div>

          {/* 권역별 지점현황 */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.8 }}
            whileHover={{ 
              scale: 1.01,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            className="bg-white rounded-xl p-3 shadow-lg shadow-slate-200 border border-slate-100 h-full"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-slate-800">권역별 지점현황</h2>
                <p className="text-xs text-slate-500">Regional Branch Status</p>
              </div>
              <div className="text-xs text-amber-600">신규 지점 +2</div>
            </div>
            <motion.div 
              className="h-[calc(100%-110px)] flex items-center justify-center"
              animate={{ rotate: chartRotation }}
              transition={{ duration: 0.1, ease: "linear" }}
            >
              <AnimatePresence>
                {!showCharts ? (
                  <ChartSkeleton />
                ) : (
                  <div className="w-full h-full">
                    <Doughnut data={branchData} options={{
                      ...chartOptions,
                      maintainAspectRatio: false,
                      cutout: '75%',
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: 'right' as const,
                        }
                      }
                    }} />
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <StatCard title="국내지점" value="22개" color="from-amber-500 to-amber-600" />
              <StatCard title="해외지점" value="32개" color="from-amber-500 to-amber-600" />
              <StatCard title="총지점" value="54개" color="from-amber-500 to-amber-600" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 