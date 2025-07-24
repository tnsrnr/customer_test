'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/card";
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

  // 컴포넌트 마운트 시 데이터 조회 (인증된 상태에서만)
  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">재무 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">오류가 발생했습니다</div>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={fetchFinanceData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">데이터가 없습니다.</p>
        </div>
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
        backgroundColor: 'rgb(59, 130, 246)',
        borderRadius: 4,
      },
      {
        label: '부채',
        data: data.topChart.debt,
        backgroundColor: 'rgb(239, 68, 68)',
        borderRadius: 4,
      },
      {
        label: '자산',
        data: data.topChart.assets,
        backgroundColor: 'rgb(34, 197, 94)',
        borderRadius: 4,
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
        backgroundColor: 'rgb(59, 130, 246)',
        borderRadius: 4,
      },
      {
        label: '장기차입금',
        data: data.rightTopChart.longTermLoan,
        backgroundColor: 'rgb(99, 102, 241)',
        borderRadius: 4,
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
        backgroundColor: 'rgb(59, 130, 246)',
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        label: '부채비율',
        data: data.bottomChart.debtRatio,
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(245, 158, 11)',
        yAxisID: 'y1',
        type: 'line' as const,
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* 페이지 헤더 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 bg-slate-600 rounded"></div>
          <h1 className="text-xl font-bold text-slate-800">HTNS 본사 재무현황 (5월)</h1>
        </div>
        <p className="text-sm text-slate-500">HTNS Financial Status 2025. May</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* 상단 좌측 - 자본/부채/자산 차트 */}
        <div className="col-span-7">
          <Card className="p-3">
            <div className="bg-slate-600 text-white text-center py-2 -mx-3 -mt-3 mb-3">
              <div className="text-sm font-medium">자본/부채/자산</div>
            </div>
            <div className="text-right text-xs text-slate-500 mb-2">단위: 억원</div>
            <div className="h-48">
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
                        color: '#6b7280'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'white',
                      titleColor: '#1f2937',
                      bodyColor: '#1f2937',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
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
                        color: '#6b7280'
                      }
                    },
                    y: {
                      grid: {
                        color: '#f3f4f6'
                      },
                      ticks: {
                        color: '#6b7280',
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
          <Card className="p-3">
            <div className="bg-slate-600 text-white text-center py-2 -mx-3 -mt-3 mb-3">
              <div className="text-sm font-medium">단기차입금</div>
            </div>
            <div className="text-right text-xs text-slate-500 mb-2">단위: 억원</div>
            <div className="h-48">
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
                        color: '#6b7280'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'white',
                      titleColor: '#1f2937',
                      bodyColor: '#1f2937',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
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
                        color: '#6b7280'
                      }
                    },
                    y: {
                      grid: {
                        color: '#f3f4f6'
                      },
                      ticks: {
                        color: '#6b7280',
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
          <Card className="p-3">
            <div className="bg-slate-600 text-white text-center py-2 -mx-3 -mt-3 mb-3">
              <div className="text-sm font-medium">총 차입금 / 부채비율</div>
            </div>
            <div className="text-right text-xs text-slate-500 mb-2">단위: 억원 / %</div>
            <div className="h-60">
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
                        color: '#6b7280'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'white',
                      titleColor: '#1f2937',
                      bodyColor: '#1f2937',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
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
                        color: '#6b7280'
                      }
                    },
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      grid: {
                        color: '#f3f4f6'
                      },
                      ticks: {
                        color: '#6b7280',
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
                        color: '#6b7280',
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
  );
}

export default function FinancePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return null; // 인증되지 않은 경우 아무것도 렌더링하지 않음
  }

  return (
    <FinancePageContent />
  );
} 