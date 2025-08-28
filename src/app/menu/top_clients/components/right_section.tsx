'use client';

import { useTopClientsStore } from '../store';
import { Card } from "@/components/ui/card";
import { LineChart, DollarSign, TrendingUp, Package, BarChart2, Users } from 'lucide-react';
import { Chart } from 'react-chartjs-2';
import { useMemo } from 'react';

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function CountUpAnimation({ end, duration = 2000, delay = 0, suffix = "", prefix = "", className = "" }: CountUpAnimationProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <span className={className}>{prefix}{formatNumber(end)}{suffix}</span>;
}

function GrowthIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <div className="flex items-center text-emerald-400">
        <span className="text-xs font-medium">+{value.toFixed(1)}%</span>
      </div>
    );
  } else if (value < 0) {
    return (
      <div className="flex items-center text-blue-400">
        <span className="text-xs font-medium">{value.toFixed(1)}%</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-slate-400">
        <span className="text-xs font-medium">0.0%</span>
      </div>
    );
  }
}

function calculateGrowth(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

function RightIcon() {
  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-lg p-2">
      <LineChart className="w-6 h-6 text-white" />
    </div>
  );
}

export function RightSection() {
  const { selectedClient, transportData, selectedTab, showCharts, isInitialLoad } = useTopClientsStore();

  const currentData = transportData[selectedTab];

  const chartData = useMemo(() => {
    if (!selectedClient) {
      // 상위 5개 거래처의 합계 월별 데이터 계산
      const top5Data = currentData.data.slice(0, 5);
      const monthlySales = [0, 0, 0, 0, 0];
      const monthlyProfit = [0, 0, 0, 0, 0];
      
      top5Data.forEach(client => {
        client.monthlyData.sales.forEach((sale, index) => {
          monthlySales[index] += sale;
        });
        client.monthlyData.profit.forEach((profit, index) => {
          monthlyProfit[index] += profit;
        });
      });

      return {
        labels: ['1월', '2월', '3월', '4월', '5월'],
        datasets: [
          {
            label: '총 매출 (상위 5개)',
            data: monthlySales,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: '총 수익 (상위 5개)',
            data: monthlyProfit,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      };
    }

    const client = currentData.data.find(c => c.name === selectedClient);
    if (!client) {
      return {
        labels: ['1월', '2월', '3월', '4월', '5월'],
        datasets: []
      };
    }

    return {
      labels: ['1월', '2월', '3월', '4월', '5월'],
      datasets: [
        {
          label: '매출',
          data: client.monthlyData.sales,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: '수익',
          data: client.monthlyData.profit,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [selectedClient, currentData.data]);

  return (
    <div>
      {selectedClient && selectedClient !== 'TOTAL' ? (
        <Card className="p-6 shadow-2xl rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm h-full">
          <div className="space-y-6">
            {(() => {
              const client = currentData.data.find(c => c.name === selectedClient);
              if (!client) return null;

              return (
                <>
                  {/* 거래처 정보 헤더 */}
                  <div className="text-center bg-gradient-to-r from-slate-700/80 to-slate-800/80 p-4 rounded-xl border border-slate-600/50">
                    <h4 className="text-2xl font-bold text-white mb-2">{client.name}</h4>
                  </div>

                  {/* 주요 지표 카드들 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/40 to-blue-700/40 p-5 rounded-xl border border-blue-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-blue-200">매출</span>
                        <DollarSign className="w-5 h-5 text-blue-300" />
                      </div>
                      {isInitialLoad ? (
                        <CountUpAnimation 
                          end={client.sales} 
                          suffix="백만"
                          className="text-3xl font-bold text-blue-100"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-blue-100">
                          {client.sales}<span className="text-2xl text-blue-300 ml-1">백만</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-600/40 to-green-700/40 p-5 rounded-xl border border-green-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-green-200">영업이익</span>
                        <TrendingUp className="w-5 h-5 text-green-300" />
                      </div>
                      {isInitialLoad ? (
                        <CountUpAnimation 
                          end={client.profit} 
                          suffix="백만"
                          className="text-3xl font-bold text-green-100"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-green-100">
                          {client.profit}<span className="text-2xl text-green-300 ml-1">백만</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-600/40 to-amber-700/40 p-5 rounded-xl border border-amber-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-amber-200">진행건수</span>
                        <Package className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="text-3xl font-bold text-amber-100">
                        {client.progressCount.toLocaleString()}<span className="text-2xl text-amber-300 ml-1">건</span>
                      </div>
                      <GrowthIndicator 
                        value={calculateGrowth(
                          client.progressCount, 
                          client.comparison.prevMonth.progressCount
                        )} 
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-600/40 to-orange-700/40 p-5 rounded-xl border border-orange-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-orange-200">영업담당자</span>
                        <BarChart2 className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="text-3xl font-bold text-orange-100">
                        {client.salesManager}
                      </div>
                      <GrowthIndicator 
                        value={0} 
                      />
                    </div>
                  </div>

                  {/* 월별 차트 */}
                  {showCharts && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <LineChart className="w-5 h-5 text-slate-300" />
                        <h5 className="text-lg font-semibold text-white">
                          월별 추이
                        </h5>
                      </div>
                      <div className="h-48 bg-slate-700/50 rounded-xl p-3">
                        <Chart
                          type="line"
                          data={chartData}
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
                                  color: '#e2e8f0',
                                  font: {
                                    weight: 600
                                  }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                titleColor: '#f1f5f9',
                                bodyColor: '#f1f5f9',
                                borderColor: '#475569',
                                borderWidth: 1,
                                cornerRadius: 8
                              }
                            },
                            scales: {
                              x: {
                                grid: {
                                  display: false
                                },
                                ticks: {
                                  color: '#cbd5e1',
                                  font: {
                                    weight: 500
                                  }
                                }
                              },
                              y: {
                                grid: {
                                  color: '#475569'
                                },
                                ticks: {
                                  color: '#cbd5e1',
                                  font: {
                                    weight: 500
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </Card>
      ) : (
        <Card className="p-6 shadow-2xl rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-sm h-full">
          <div className="space-y-6">
            {(() => {
              // 탑5개 거래처의 합계 계산
              const top5Data = currentData.data.slice(0, 5);
              const totalSales = top5Data.reduce((sum, client) => sum + client.sales, 0);
              const totalProfit = top5Data.reduce((sum, client) => sum + client.profit, 0);
              const totalProgressCount = top5Data.reduce((sum, client) => sum + client.progressCount, 0);

              return (
                <>
                  {/* 합계 정보 헤더 */}
                  <div className="text-center bg-gradient-to-r from-slate-700/80 to-slate-800/80 p-4 rounded-xl border border-slate-600/50">
                    <h4 className="text-2xl font-bold text-white mb-2">탑 5 거래처 합계</h4>
                  </div>

                  {/* 주요 지표 카드들 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/40 to-blue-700/40 p-5 rounded-xl border border-blue-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-blue-200">총 매출</span>
                        <DollarSign className="w-5 h-5 text-blue-300" />
                      </div>
                      {isInitialLoad ? (
                        <CountUpAnimation 
                          end={totalSales} 
                          suffix="백만"
                          className="text-3xl font-bold text-blue-100"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-blue-100">
                          {totalSales}<span className="text-2xl text-blue-300 ml-1">백만</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-600/40 to-green-700/40 p-5 rounded-xl border border-green-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-green-200">총 영업이익</span>
                        <TrendingUp className="w-5 h-5 text-green-300" />
                      </div>
                      {isInitialLoad ? (
                        <CountUpAnimation 
                          end={totalProfit} 
                          suffix="백만"
                          className="text-3xl font-bold text-green-100"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-green-100">
                          {totalProfit}<span className="text-2xl text-green-300 ml-1">백만</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-600/40 to-amber-700/40 p-5 rounded-xl border border-amber-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-amber-200">총 진행건수</span>
                        <Package className="w-5 h-5 text-amber-300" />
                      </div>
                      {isInitialLoad ? (
                        <CountUpAnimation 
                          end={totalProgressCount} 
                          suffix="건"
                          className="text-3xl font-bold text-amber-100"
                        />
                      ) : (
                        <div className="text-3xl font-bold text-amber-100">
                          {totalProgressCount.toLocaleString()}<span className="text-2xl text-amber-300 ml-1">건</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-600/40 to-orange-700/40 p-5 rounded-xl border border-orange-500/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-medium text-orange-200">담당자</span>
                        <Users className="w-5 h-5 text-orange-300" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg mb-2">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-sm text-orange-300">5개 거래처</span>
                      </div>
                    </div>
                  </div>

                  {/* 월별 차트 */}
                  {showCharts && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <LineChart className="w-5 h-5 text-slate-300" />
                        <h5 className="text-lg font-semibold text-white">상위 5개 거래처 월별 추이</h5>
                      </div>
                      <div className="h-48 bg-slate-700/50 rounded-xl p-3">
                        <Chart
                          type="line"
                          data={chartData}
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
                                  color: '#e2e8f0',
                                  font: {
                                    weight: 600
                                  }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                                titleColor: '#f1f5f9',
                                bodyColor: '#f1f5f9',
                                borderColor: '#475569',
                                borderWidth: 1,
                                cornerRadius: 8
                              }
                            },
                            scales: {
                              x: {
                                grid: {
                                  display: false
                                },
                                ticks: {
                                  color: '#cbd5e1',
                                  font: {
                                    weight: 500
                                  }
                                }
                              },
                              y: {
                                grid: {
                                  color: '#475569'
                                },
                                ticks: {
                                  color: '#cbd5e1',
                                  font: {
                                    weight: 500
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
