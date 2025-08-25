'use client';

import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Target, PieChart, BarChart3 } from 'lucide-react';
import { FinanceData } from '../types';

interface LoansTabProps {
  data: FinanceData;
}

export function LoansTab({ data }: LoansTabProps) {
  const { chartData } = data;
  
  // 차트 데이터 준비
  const loanStructureChartData = {
    labels: chartData.loanStructure.labels,
    datasets: [
      {
        label: '단기차입금',
        data: chartData.loanStructure.shortTermLoan,
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: 'rgba(168, 85, 247, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '장기차입금',
        data: chartData.loanStructure.longTermLoan,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgba(236, 72, 153, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  // 차입금 데이터에서 현재 값들 추출
  const currentShortTerm = chartData.loanStructure.shortTermLoan[chartData.loanStructure.shortTermLoan.length - 1] || 2100;
  const currentLongTerm = chartData.loanStructure.longTermLoan[chartData.loanStructure.longTermLoan.length - 1] || 1600;
  const previousShortTerm = chartData.loanStructure.shortTermLoan[0] || 1800;
  const previousLongTerm = chartData.loanStructure.longTermLoan[0] || 1400;
  
  const totalCurrent = currentShortTerm + currentLongTerm;
  const totalPrevious = previousShortTerm + previousLongTerm;
  const shortTermChange = ((currentShortTerm - previousShortTerm) / previousShortTerm * 100).toFixed(1);
  const longTermChange = ((currentLongTerm - previousLongTerm) / previousLongTerm * 100).toFixed(1);
  const totalChange = ((totalCurrent - totalPrevious) / totalPrevious * 100).toFixed(1);

  return (
    <div className="px-2 lg:px-3 space-y-6">
      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-400/25 transition-all duration-300">
              <Activity className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-purple-200 mb-1 block">단기차입금</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {currentShortTerm.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-purple-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(shortTermChange) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(shortTermChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(shortTermChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-pink-500/20 via-pink-600/15 to-pink-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-pink-400/30 hover:border-pink-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl shadow-lg group-hover:shadow-pink-400/25 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-pink-200 mb-1 block">장기차입금</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {currentLongTerm.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-pink-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(longTermChange) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(longTermChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(longTermChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-pink-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
              <DollarSign className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-blue-200 mb-1 block">총 차입금</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {totalCurrent.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium text-blue-200 ml-1">억원</span>
                </div>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
              parseFloat(totalChange) >= 0 
                ? 'text-red-300 bg-red-600/30 border-red-400/30' 
                : 'text-green-300 bg-green-600/30 border-green-400/30'
            }`}>
              {parseFloat(totalChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(totalChange))}%
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative p-6 bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10 backdrop-blur-md rounded-2xl shadow-xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center h-full">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-400/25 transition-all duration-300">
              <PieChart className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1 flex items-center justify-center ml-4">
              <div className="text-center">
                <span className="text-sm font-medium text-orange-200 mb-1 block">단기차입금 비율</span>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-sm">
                    {((currentShortTerm / totalCurrent) * 100).toFixed(1)}
                  </span>
                  <span className="text-lg font-medium text-orange-200 ml-1">%</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-orange-300 px-2 py-1 rounded-full border backdrop-blur-sm bg-orange-600/30 border-orange-400/30">
              비율
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-60"></div>
        </motion.div>
      </div>

      {/* 주요 차트 */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20">
      <h3 className="text-white font-semibold text-lg mb-6">단기/장기 차입금 상세 분석</h3>
              <div className="h-90">
        <Bar
          data={loanStructureChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: 'white',
                  font: {
                    size: 11
                  }
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: 'white',
                  font: {
                    size: 10
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              },
              y: {
                ticks: {
                  color: 'white',
                  font: {
                    size: 10
                  }
                },
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
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

      {/* 상세 분석 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 차입금 구조 분석 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-4 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 backdrop-blur-md rounded-xl border border-emerald-400/25"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-emerald-500/30 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-emerald-300" />
            </div>
            <h4 className="text-emerald-200 font-semibold text-lg">차입금 구조 분석</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">단기차입금 비중</span>
              <div className="text-right">
                <span className="text-emerald-200 font-semibold">{((currentShortTerm / totalCurrent) * 100).toFixed(1)}%</span>
                <div className="text-emerald-300 text-xs">유동성 관리</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">장기차입금 비중</span>
              <div className="text-right">
                <span className="text-emerald-200 font-semibold">{((currentLongTerm / totalCurrent) * 100).toFixed(1)}%</span>
                <div className="text-emerald-300 text-xs">안정적 자금</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">단기/장기 비율</span>
              <div className="text-right">
                <span className="text-emerald-200 font-semibold">{(currentShortTerm / currentLongTerm).toFixed(2)}:1</span>
                <div className="text-emerald-300 text-xs">건전한 수준</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 리스크 분석 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-4 bg-gradient-to-br from-red-500/15 to-red-600/10 backdrop-blur-md rounded-xl border border-red-400/25"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-500/30 rounded-lg mr-3">
              <AlertTriangle className="w-5 h-5 text-red-300" />
            </div>
            <h4 className="text-red-200 font-semibold text-lg">리스크 분석</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
              <span className="text-red-100 text-sm">단기차입금 증가율</span>
              <div className="text-right">
                <span className={`font-semibold ${parseFloat(shortTermChange) >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {parseFloat(shortTermChange) >= 0 ? '+' : ''}{shortTermChange}%
                </span>
                <div className={`text-xs ${parseFloat(shortTermChange) >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {parseFloat(shortTermChange) >= 0 ? '주의 필요' : '양호'}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
              <span className="text-red-100 text-sm">장기차입금 증가율</span>
              <div className="text-right">
                <span className={`font-semibold ${parseFloat(longTermChange) >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {parseFloat(longTermChange) >= 0 ? '+' : ''}{longTermChange}%
                </span>
                <div className={`text-xs ${parseFloat(longTermChange) >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {parseFloat(longTermChange) >= 0 ? '모니터링' : '개선'}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
              <span className="text-red-100 text-sm">총 차입금 증가율</span>
              <div className="text-right">
                <span className={`font-semibold ${parseFloat(totalChange) >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {parseFloat(totalChange) >= 0 ? '+' : ''}{totalChange}%
                </span>
                <div className={`text-xs ${parseFloat(totalChange) >= 0 ? 'text-red-300' : 'text-green-300'}`}>
                  {parseFloat(totalChange) >= 0 ? '관리 필요' : '양호'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
