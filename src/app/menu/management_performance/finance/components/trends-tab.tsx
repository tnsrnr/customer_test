'use client';

import { useState } from 'react';
import { Card } from "@/common/components/ui/card";
import { Chart } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Target, PieChart, BarChart3, Calendar, LineChart } from 'lucide-react';
import { FinanceData } from '../types';

interface TrendsTabProps {
  data: FinanceData;
}

type TrendOption = 'totalLoan_debtRatio' | 'debtAmount_loanRatio' | 'totalAssets_debtWeight';

export function TrendsTab({ data }: TrendsTabProps) {
  const { trendData } = data;
  const [selectedTrend, setSelectedTrend] = useState<TrendOption>('totalLoan_debtRatio');
  
  // 선택된 옵션에 따른 차트 데이터 준비
  const getChartData = () => {
    const baseData = {
      labels: trendData.labels,
      datasets: [] as any[]
    };

    switch (selectedTrend) {
      case 'totalLoan_debtRatio':
        baseData.datasets = [
          {
            label: '총 차입금',
            data: trendData.totalLoan,
            backgroundColor: 'rgba(37, 99, 235, 0.4)',
            borderColor: 'rgba(96, 165, 250, 0.6)',
            borderWidth: 2,
            borderRadius: 4,
            yAxisID: 'y',
          },
          {
            label: '부채비율',
            data: trendData.debtRatio,
            borderColor: 'rgba(251, 146, 60, 0.6)',
            backgroundColor: 'rgba(251, 146, 60, 0.2)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(251, 146, 60, 0.6)',
            pointBorderColor: 'rgba(255, 255, 255, 0.8)',
            pointBorderWidth: 2,
            yAxisID: 'y1',
            type: 'line',
          }
        ];
        break;
      
      case 'debtAmount_loanRatio':
        // 부채금액 (총자산 - 총자본)과 차입금비율 (차입금/총자산 * 100)
        const debtAmount = trendData.totalLoan.map((loan, index) => {
          // 부채금액 = 총자산 - 총자본 (근사치로 계산)
          const totalAssets = loan * 4; // 차입금의 약 4배가 총자산이라고 가정
          const totalCapital = totalAssets * (1 - trendData.debtRatio[index] / 100);
          return Math.round((totalAssets - totalCapital) * 10) / 10;
        });
        const loanRatio = trendData.totalLoan.map((loan, index) => {
          const totalAssets = loan * 4;
          return Math.round((loan / totalAssets) * 100 * 10) / 10;
        });
        
        baseData.datasets = [
          {
            label: '부채금액',
            data: debtAmount,
            backgroundColor: 'rgba(16, 185, 129, 0.4)',
            borderColor: 'rgba(52, 211, 153, 0.6)',
            borderWidth: 2,
            borderRadius: 4,
            yAxisID: 'y',
          },
          {
            label: '차입금비율',
            data: loanRatio,
            borderColor: 'rgba(196, 181, 253, 0.6)',
            backgroundColor: 'rgba(196, 181, 253, 0.2)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(196, 181, 253, 0.6)',
            pointBorderColor: 'rgba(255, 255, 255, 0.8)',
            pointBorderWidth: 2,
            yAxisID: 'y1',
            type: 'line',
          }
        ];
        break;
      
      case 'totalAssets_debtWeight':
        // 총자산과 부채비중 (부채/총자산 * 100)
        const totalAssets = trendData.totalLoan.map((loan, index) => {
          return Math.round(loan * 4 * 10) / 10; // 차입금의 4배가 총자산
        });
        const debtWeight = trendData.debtRatio; // 부채비율과 동일
        
        baseData.datasets = [
          {
            label: '총자산',
            data: totalAssets,
            backgroundColor: 'rgba(220, 38, 38, 0.4)',
            borderColor: 'rgba(248, 113, 113, 0.6)',
            borderWidth: 2,
            borderRadius: 4,
            yAxisID: 'y',
          },
          {
            label: '부채비중',
            data: debtWeight,
            borderColor: 'rgba(251, 146, 60, 0.6)',
            backgroundColor: 'rgba(251, 146, 60, 0.2)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(251, 146, 60, 0.6)',
            pointBorderColor: 'rgba(255, 255, 255, 0.8)',
            pointBorderWidth: 2,
            yAxisID: 'y1',
            type: 'line',
          }
        ];
        break;
    }

    return baseData;
  };

  const trendChartData = getChartData();

  // 선택된 옵션에 따른 카드 데이터 계산
  const getCardData = () => {
    const currentTotalLoan = trendData.totalLoan[trendData.totalLoan.length - 1] || 3700;
    const currentDebtRatio = trendData.debtRatio[trendData.debtRatio.length - 1] || 22.4;
    const previousTotalLoan = trendData.totalLoan[0] || 2800;
    const previousDebtRatio = trendData.debtRatio[0] || 18.7;

    switch (selectedTrend) {
      case 'totalLoan_debtRatio':
        return {
          primary: {
            label: '현재 총 차입금',
            value: currentTotalLoan,
            unit: '억원',
            change: ((currentTotalLoan - previousTotalLoan) / previousTotalLoan * 100).toFixed(1),
            maxValue: Math.max(...trendData.totalLoan),
            maxLabel: '최대 차입금'
          },
          secondary: {
            label: '현재 부채비율',
            value: currentDebtRatio,
            unit: '%',
            change: ((currentDebtRatio - previousDebtRatio) / previousDebtRatio * 100).toFixed(1),
            maxValue: Math.max(...trendData.debtRatio),
            maxLabel: '최대 부채비율'
          }
        };
      
      case 'debtAmount_loanRatio':
        const currentDebtAmount = currentTotalLoan * 4 * (currentDebtRatio / 100);
        const previousDebtAmount = previousTotalLoan * 4 * (previousDebtRatio / 100);
        const currentLoanRatio = (currentTotalLoan / (currentTotalLoan * 4)) * 100;
        const previousLoanRatio = (previousTotalLoan / (previousTotalLoan * 4)) * 100;
        
        return {
          primary: {
            label: '현재 부채금액',
            value: Math.round(currentDebtAmount * 10) / 10,
            unit: '억원',
            change: ((currentDebtAmount - previousDebtAmount) / previousDebtAmount * 100).toFixed(1),
            maxValue: Math.max(...trendData.totalLoan.map((loan, i) => loan * 4 * (trendData.debtRatio[i] / 100))),
            maxLabel: '최대 부채금액'
          },
          secondary: {
            label: '현재 차입금비율',
            value: Math.round(currentLoanRatio * 10) / 10,
            unit: '%',
            change: ((currentLoanRatio - previousLoanRatio) / previousLoanRatio * 100).toFixed(1),
            maxValue: Math.max(...trendData.totalLoan.map(loan => (loan / (loan * 4)) * 100)),
            maxLabel: '최대 차입금비율'
          }
        };
      
      case 'totalAssets_debtWeight':
        const currentTotalAssets = currentTotalLoan * 4;
        const previousTotalAssets = previousTotalLoan * 4;
        
        return {
          primary: {
            label: '현재 총자산',
            value: Math.round(currentTotalAssets * 10) / 10,
            unit: '억원',
            change: ((currentTotalAssets - previousTotalAssets) / previousTotalAssets * 100).toFixed(1),
            maxValue: Math.max(...trendData.totalLoan.map(loan => loan * 4)),
            maxLabel: '최대 총자산'
          },
          secondary: {
            label: '현재 부채비중',
            value: currentDebtRatio,
            unit: '%',
            change: ((currentDebtRatio - previousDebtRatio) / previousDebtRatio * 100).toFixed(1),
            maxValue: Math.max(...trendData.debtRatio),
            maxLabel: '최대 부채비중'
          }
        };
    }
  };

  const cardData = getCardData();

  return (
    <div className="px-2 lg:px-3 space-y-6">
      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-teal-500/20 via-teal-600/15 to-teal-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-teal-400/30 hover:border-teal-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg group-hover:shadow-teal-400/25 transition-all duration-300">
              <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-xs font-medium text-teal-200 whitespace-nowrap">{cardData.primary.label}</span>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-white drop-shadow-sm">
                    {cardData.primary.value.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-teal-200 ml-1">{cardData.primary.unit}</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(cardData.primary.change) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(cardData.primary.change) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(cardData.primary.change))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-amber-500/20 via-amber-600/15 to-amber-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-amber-400/30 hover:border-amber-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg group-hover:shadow-amber-400/25 transition-all duration-300">
              <PieChart className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-xs font-medium text-amber-200 whitespace-nowrap">{cardData.secondary.label}</span>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-white drop-shadow-sm">
                    {cardData.secondary.value}
                  </span>
                  <span className="text-sm font-medium text-amber-200 ml-1">{cardData.secondary.unit}</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(cardData.secondary.change) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(cardData.secondary.change) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(cardData.secondary.change))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-lime-500/20 via-lime-600/15 to-lime-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-lime-400/30 hover:border-lime-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-lime-400 to-lime-600 rounded-xl shadow-lg group-hover:shadow-lime-400/25 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-xs font-medium text-lime-200 whitespace-nowrap">{cardData.primary.maxLabel}</span>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-white drop-shadow-sm">
                    {cardData.primary.maxValue.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-lime-200 ml-1">{cardData.primary.unit}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-lime-300 px-2 py-1 rounded-full border backdrop-blur-sm bg-lime-600/30 border-lime-400/30">
              최고점
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 to-lime-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-rose-500/20 via-rose-600/15 to-rose-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-rose-400/30 hover:border-rose-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-rose-400 to-rose-600 rounded-xl shadow-lg group-hover:shadow-rose-400/25 transition-all duration-300">
              <TrendingDown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-xs font-medium text-rose-200 whitespace-nowrap">{cardData.secondary.maxLabel}</span>
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-white drop-shadow-sm">
                    {cardData.secondary.maxValue}
                  </span>
                  <span className="text-sm font-medium text-rose-200 ml-1">{cardData.secondary.unit}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-rose-300 px-2 py-1 rounded-full border backdrop-blur-sm bg-rose-600/30 border-rose-400/30">
              최고점
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-600 opacity-60"></div>
        </motion.div>
      </div>

      {/* 주요 차트 */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 mt-8">
        <div className="flex justify-between items-start mb-8">
          <h3 className="text-white font-semibold text-2xl">
            {selectedTrend === 'totalLoan_debtRatio' && '10년간 총 차입금 및 부채비율 트렌드'}
            {selectedTrend === 'debtAmount_loanRatio' && '10년간 부채금액 및 차입금비율 트렌드'}
            {selectedTrend === 'totalAssets_debtWeight' && '10년간 총자산 및 부채비중 트렌드'}
          </h3>
          
          {/* 라디오 버튼 선택 */}
          <div className="flex flex-col gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <span className="text-white text-sm font-medium">지표 선택</span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="trendOption"
                  value="totalLoan_debtRatio"
                  checked={selectedTrend === 'totalLoan_debtRatio'}
                  onChange={(e) => setSelectedTrend(e.target.value as TrendOption)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-white text-xs">총차입금/부채비율</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="trendOption"
                  value="debtAmount_loanRatio"
                  checked={selectedTrend === 'debtAmount_loanRatio'}
                  onChange={(e) => setSelectedTrend(e.target.value as TrendOption)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-white text-xs">부채금액/차입금비율</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="trendOption"
                  value="totalAssets_debtWeight"
                  checked={selectedTrend === 'totalAssets_debtWeight'}
                  onChange={(e) => setSelectedTrend(e.target.value as TrendOption)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-white text-xs">총자산/부채비중</span>
              </label>
            </div>
          </div>
        </div>
        <div className="h-[450px]">
        <Chart
          type="bar"
          data={trendChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: 'white',
                  font: {
                    size: 16
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: 'white',
                  font: {
                    size: 14
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'white',
                  font: {
                    size: 14
                  }
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: {
                  color: 'white',
                  font: {
                    size: 14
                  }
                }
              }
            },
            layout: {
              padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
              }
            }
          }}
        />
      </div>
    </Card>


    </div>
  );
}
