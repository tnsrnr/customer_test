'use client';

import { useEffect } from 'react';
import { Card } from "@/components/card";
import { AuthGuard } from "@/components/auth-guard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Chart } from 'react-chartjs-2';
import { useFinanceStore } from './store';
import { useGlobalStore } from '@/store/global';
import { TrendingUp, DollarSign, BarChart3, Activity, RefreshCw } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function FinancePageContent() {
  const { data, loading, error, fetchFinanceData } = useFinanceStore();
  const { isRefreshing } = useGlobalStore();

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  // 전역 조회 이벤트 감지
  useEffect(() => {
    if (isRefreshing) {
      fetchFinanceData();
    }
  }, [isRefreshing, fetchFinanceData]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
          <p className="text-blue-100 text-lg font-medium">재무 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 shadow-2xl rounded-2xl bg-white/90 border-0">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <div className="text-red-600 text-xl font-bold mb-2">오류가 발생했습니다</div>
            <p className="text-slate-600 mb-6">{error}</p>
            <button 
              onClick={fetchFinanceData}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-lg font-bold shadow-md hover:from-blue-700 hover:to-sky-600 transition-all duration-200"
            >
              다시 시도
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 shadow-2xl rounded-2xl bg-white/90 border-0">
          <div className="text-center">
            <div className="text-slate-400 text-4xl mb-4">📊</div>
            <p className="text-slate-600 text-lg">데이터가 없습니다.</p>
          </div>
        </Card>
      </div>
    );
  }

  // 상단 차트 데이터 (자본, 부채, 자산)
  const topChartData = {
    labels: data.topChart.labels,
    datasets: [
      {
        label: '자본',
        data: data.topChart.capital,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: '부채',
        data: data.topChart.debt,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: '자산',
        data: data.topChart.assets,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // 우측 상단 차트 데이터 (단기차입금, 장기차입금)
  const rightTopChartData = {
    labels: data.rightTopChart.labels,
    datasets: [
      {
        label: '단기차입금',
        data: data.rightTopChart.shortTermLoan,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: '장기차입금',
        data: data.rightTopChart.longTermLoan,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  // 하단 차트 데이터 (총 차입금과 부채비율)
  const bottomChartData = {
    labels: data.bottomChart.labels,
    datasets: [
      {
        label: '총 차입금',
        data: data.bottomChart.totalLoan,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y',
      },
      {
        label: '부채비율',
        data: data.bottomChart.debtRatio,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        yAxisID: 'y1',
        type: 'line' as const,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-[28rem] h-[28rem] opacity-10" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#2563eb" strokeWidth="40" strokeDasharray="40 40" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-[32rem] h-[32rem] opacity-20" viewBox="0 0 512 512" fill="none">
          <text
            x="256"
            y="320"
            textAnchor="middle"
            fontSize="110"
            fontWeight="900"
            fill="#3b82f6"
            opacity="0.5"
            style={{ letterSpacing: 32 }}
          >
            HTNS
          </text>
        </svg>
      </div>

      <div className="relative z-10 p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* 상단 좌측 - 자본/부채/자산 차트 */}
          <div className="col-span-7">
            <Card className="p-6 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-lg p-2">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">자본/부채/자산</h3>
                  <p className="text-sm text-slate-500">단위: 억원</p>
                </div>
              </div>
              <div className="h-64">
                <Bar
                  data={topChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          color: '#475569',
                          font: {
                            weight: '600'
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#1e293b',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}억원`;
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
                          color: '#64748b',
                          font: {
                            weight: '500'
                          }
                        }
                      },
                      y: {
                        grid: {
                          color: '#f1f5f9'
                        },
                        ticks: {
                          color: '#64748b',
                          font: {
                            weight: '500'
                          },
                          callback: function(value) {
                            return (value as number).toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </div>
          
          {/* 상단 우측 - 단기/장기 차입금 차트 */}
          <div className="col-span-5">
            <Card className="p-6 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-lg p-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">차입금 현황</h3>
                  <p className="text-sm text-slate-500">단위: 억원</p>
                </div>
              </div>
              <div className="h-64">
                <Bar
                  data={rightTopChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          color: '#475569',
                          font: {
                            weight: '600'
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#1e293b',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}억원`;
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
                          color: '#64748b',
                          font: {
                            weight: '500'
                          }
                        }
                      },
                      y: {
                        grid: {
                          color: '#f1f5f9'
                        },
                        ticks: {
                          color: '#64748b',
                          font: {
                            weight: '500'
                          },
                          callback: function(value) {
                            return (value as number).toLocaleString();
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </div>

          {/* 하단 - 총 차입금과 부채비율 차트 */}
          <div className="col-span-12">
            <Card className="p-6 shadow-2xl rounded-2xl bg-white/90 border-0 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-lg p-2">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">총 차입금 / 부채비율</h3>
                  <p className="text-sm text-slate-500">단위: 억원 / %</p>
                </div>
              </div>
              <div className="h-80">
                <Chart
                  type="bar"
                  data={bottomChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          color: '#475569',
                          font: {
                            weight: '600'
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#1e293b',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                          label: function(context) {
                            if (context.dataset.label === '총 차입금') {
                              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}억원`;
                            } else {
                              return `${context.dataset.label}: ${context.parsed.y}%`;
                            }
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
                          color: '#64748b',
                          font: {
                            weight: '500'
                          }
                        }
                      },
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                          color: '#f1f5f9'
                        },
                        ticks: {
                          color: '#64748b',
                          font: {
                            weight: '500'
                          },
                          callback: function(value) {
                            return (value as number).toLocaleString();
                          }
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          color: '#64748b',
                          font: {
                            weight: '500'
                          },
                          callback: function(value) {
                            return `${value}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  return (
    <AuthGuard>
      <FinancePageContent />
    </AuthGuard>
  );
} 