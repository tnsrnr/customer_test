'use client';

import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Target, PieChart, BarChart3, HelpCircle } from 'lucide-react';
import { FinanceData } from '../types';

interface LoansTabProps {
  data: FinanceData;
}

export function LoansTab({ data }: LoansTabProps) {
  const { chartData } = data;
  
  // 차입금 구조 평가 함수들
  const getShortTermRatioStatus = (ratio: number) => {
    if (ratio <= 30) return { 
      text: '매우 양호', 
      color: 'text-green-300', 
      bgColor: 'bg-green-500/10'
    };
    if (ratio <= 50) return { 
      text: '양호', 
      color: 'text-emerald-300', 
      bgColor: 'bg-emerald-500/10'
    };
    if (ratio <= 70) return { 
      text: '적정', 
      color: 'text-yellow-300', 
      bgColor: 'bg-yellow-500/10'
    };
    return { 
      text: '위험', 
      color: 'text-red-300', 
      bgColor: 'bg-red-500/10'
    };
  };

  const getShortLongRatioStatus = (ratio: number) => {
    if (ratio <= 0.5) return { 
      text: '매우 건전', 
      color: 'text-green-300', 
      bgColor: 'bg-green-500/10'
    };
    if (ratio <= 1.0) return { 
      text: '건전', 
      color: 'text-emerald-300', 
      bgColor: 'bg-emerald-500/10'
    };
    if (ratio <= 1.5) return { 
      text: '적정', 
      color: 'text-yellow-300', 
      bgColor: 'bg-yellow-500/10'
    };
    return { 
      text: '위험', 
      color: 'text-red-300', 
      bgColor: 'bg-red-500/10'
    };
  };

  const getLoanGrowthStatus = (change: number) => {
    if (change <= -10) return { 
      text: '매우 양호', 
      color: 'text-green-300', 
      bgColor: 'bg-green-500/10'
    };
    if (change <= -5) return { 
      text: '양호', 
      color: 'text-emerald-300', 
      bgColor: 'bg-emerald-500/10'
    };
    if (change <= 0) return { 
      text: '안정', 
      color: 'text-blue-300', 
      bgColor: 'bg-blue-500/10'
    };
    if (change <= 10) return { 
      text: '주의', 
      color: 'text-yellow-300', 
      bgColor: 'bg-yellow-500/10'
    };
    return { 
      text: '위험', 
      color: 'text-red-300', 
      bgColor: 'bg-red-500/10'
    };
  };
  
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
      <Card className="p-3 pb-2 bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-2">단기/장기 차입금 상세 분석</h3>
        <div className="h-72">
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
                      size: 12,
                      weight: 'bold'
                    }
                  },
                  position: 'top' as const
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: 'white',
                    font: {
                      size: 14,
                      weight: 'bold'
                    },
                    padding: 8
                  },
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  }
                },
                y: {
                  ticks: {
                    color: 'white',
                    font: {
                      size: 11
                    },
                    callback: function(value) {
                      return value + '억원';
                    }
                  },
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              },
              layout: {
                padding: {
                  top: 8,
                  bottom: 4,
                  left: 8,
                  right: 8
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
            <div className="ml-2 relative group">
              <HelpCircle className="w-4 h-4 text-emerald-300 cursor-help" />
              {/* 통합 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                <div className="font-semibold mb-1">차입금 구조 평가 기준</div>
                <div className="mb-2">
                  <div className="font-medium">단기차입금 비중:</div>
                  • 30% 이하: 매우 양호한 유동성<br/>
                  • 30-50%: 양호한 유동성<br/>
                  • 50-70%: 적정한 수준<br/>
                  • 70% 초과: 유동성 위험
                </div>
                <div className="mb-2">
                  <div className="font-medium">단기/장기 비율:</div>
                  • 0.5 이하: 매우 건전한 구조<br/>
                  • 0.5-1.0: 건전한 구조<br/>
                  • 1.0-1.5: 적정한 수준<br/>
                  • 1.5 초과: 구조적 위험
                </div>
                <div>
                  <div className="font-medium">차입금 증가율:</div>
                  • -10% 이하: 매우 양호한 감소<br/>
                  • -5~-10%: 양호한 감소<br/>
                  • 0~-5%: 안정적인 상태<br/>
                  • 0~10%: 주의가 필요한 증가<br/>
                  • 10% 초과: 위험한 증가
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {(() => {
              const shortTermRatio = (currentShortTerm / totalCurrent) * 100;
              const shortTermStatus = getShortTermRatioStatus(shortTermRatio);
              return (
                <div className={`flex justify-between items-center p-3 ${shortTermStatus.bgColor} rounded-lg`}>
                  <span className="text-emerald-100 text-sm">단기차입금 비중</span>
                  <div className="text-right">
                    <span className="text-emerald-200 font-semibold">{shortTermRatio.toFixed(1)}%</span>
                    <div className={`text-xs ${shortTermStatus.color}`}>{shortTermStatus.text}</div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const longTermRatio = (currentLongTerm / totalCurrent) * 100;
              return (
                <div className="flex justify-between items-center p-3 bg-emerald-500/10 rounded-lg">
                  <span className="text-emerald-100 text-sm">장기차입금 비중</span>
                  <div className="text-right">
                    <span className="text-emerald-200 font-semibold">{longTermRatio.toFixed(1)}%</span>
                    <div className="text-emerald-300 text-xs">안정적 자금</div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const shortLongRatio = currentShortTerm / currentLongTerm;
              const shortLongStatus = getShortLongRatioStatus(shortLongRatio);
              return (
                <div className={`flex justify-between items-center p-3 ${shortLongStatus.bgColor} rounded-lg`}>
                  <span className="text-emerald-100 text-sm">단기/장기 비율</span>
                  <div className="text-right">
                    <span className="text-emerald-200 font-semibold">{shortLongRatio.toFixed(2)}:1</span>
                    <div className={`text-xs ${shortLongStatus.color}`}>{shortLongStatus.text}</div>
                  </div>
                </div>
              );
            })()}
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
            <div className="ml-2 relative group">
              <HelpCircle className="w-4 h-4 text-red-300 cursor-help" />
              {/* 통합 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                <div className="font-semibold mb-1">차입금 리스크 평가 기준</div>
                <div className="mb-2">
                  <div className="font-medium">단기차입금 증가율:</div>
                  • -10% 이하: 매우 양호한 감소<br/>
                  • -5~-10%: 양호한 감소<br/>
                  • 0~-5%: 안정적인 상태<br/>
                  • 0~10%: 주의가 필요한 증가<br/>
                  • 10% 초과: 위험한 증가
                </div>
                <div className="mb-2">
                  <div className="font-medium">장기차입금 증가율:</div>
                  • -10% 이하: 매우 양호한 감소<br/>
                  • -5~-10%: 양호한 감소<br/>
                  • 0~-5%: 안정적인 상태<br/>
                  • 0~10%: 주의가 필요한 증가<br/>
                  • 10% 초과: 위험한 증가
                </div>
                <div>
                  <div className="font-medium">총 차입금 증가율:</div>
                  • -10% 이하: 매우 양호한 감소<br/>
                  • -5~-10%: 양호한 감소<br/>
                  • 0~-5%: 안정적인 상태<br/>
                  • 0~10%: 주의가 필요한 증가<br/>
                  • 10% 초과: 위험한 증가
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {(() => {
              const shortTermGrowth = parseFloat(shortTermChange);
              const shortTermGrowthStatus = getLoanGrowthStatus(shortTermGrowth);
              return (
                <div className={`flex justify-between items-center p-3 ${shortTermGrowthStatus.bgColor} rounded-lg`}>
                  <span className="text-red-100 text-sm">단기차입금 증가율</span>
                  <div className="text-right">
                    <span className={`font-semibold ${shortTermGrowthStatus.color}`}>
                      {shortTermGrowth >= 0 ? '+' : ''}{shortTermChange}%
                    </span>
                    <div className={`text-xs ${shortTermGrowthStatus.color}`}>
                      {shortTermGrowthStatus.text}
                    </div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const longTermGrowth = parseFloat(longTermChange);
              const longTermGrowthStatus = getLoanGrowthStatus(longTermGrowth);
              return (
                <div className={`flex justify-between items-center p-3 ${longTermGrowthStatus.bgColor} rounded-lg`}>
                  <span className="text-red-100 text-sm">장기차입금 증가율</span>
                  <div className="text-right">
                    <span className={`font-semibold ${longTermGrowthStatus.color}`}>
                      {longTermGrowth >= 0 ? '+' : ''}{longTermChange}%
                    </span>
                    <div className={`text-xs ${longTermGrowthStatus.color}`}>
                      {longTermGrowthStatus.text}
                    </div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const totalGrowth = parseFloat(totalChange);
              const totalGrowthStatus = getLoanGrowthStatus(totalGrowth);
              return (
                <div className={`flex justify-between items-center p-3 ${totalGrowthStatus.bgColor} rounded-lg`}>
                  <span className="text-red-100 text-sm">총 차입금 증가율</span>
                  <div className="text-right">
                    <span className={`font-semibold ${totalGrowthStatus.color}`}>
                      {totalGrowth >= 0 ? '+' : ''}{totalChange}%
                    </span>
                    <div className={`text-xs ${totalGrowthStatus.color}`}>
                      {totalGrowthStatus.text}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
