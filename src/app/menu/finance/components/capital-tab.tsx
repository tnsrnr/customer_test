'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, HelpCircle } from 'lucide-react';
import { FinanceData } from '../types';

interface CapitalTabProps {
  data: FinanceData;
}

export function CapitalTab({ data }: CapitalTabProps) {
  const { kpiMetrics, chartData } = data;
  
  // 재무 비율 평가 함수들
  const getCapitalRatioStatus = (ratio: number) => {
    if (ratio >= 50) return { 
      text: '매우 건전', 
      color: 'text-green-300', 
      bgColor: 'bg-green-500/10'
    };
    if (ratio >= 30) return { 
      text: '건전', 
      color: 'text-emerald-300', 
      bgColor: 'bg-emerald-500/10'
    };
    if (ratio >= 20) return { 
      text: '적정', 
      color: 'text-yellow-300', 
      bgColor: 'bg-yellow-500/10'
    };
    return { 
      text: '개선 필요', 
      color: 'text-red-300', 
      bgColor: 'bg-red-500/10'
    };
  };

  const getDebtRatioStatus = (ratio: number) => {
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

  const getGrowthStatus = (change: number) => {
    if (change >= 10) return { 
      text: '매우 양호', 
      color: 'text-green-300', 
      bgColor: 'bg-green-500/10'
    };
    if (change >= 5) return { 
      text: '양호', 
      color: 'text-emerald-300', 
      bgColor: 'bg-emerald-500/10'
    };
    if (change >= 0) return { 
      text: '안정', 
      color: 'text-blue-300', 
      bgColor: 'bg-blue-500/10'
    };
    if (change >= -5) return { 
      text: '주의', 
      color: 'text-yellow-300', 
      bgColor: 'bg-yellow-500/10'
    };
    return { 
      text: '개선 필요', 
      color: 'text-red-300', 
      bgColor: 'bg-red-500/10'
    };
  };


  
  // 차트 데이터 준비
  const capitalStructureChartData = {
    labels: chartData.capitalStructure.labels,
    datasets: [
      {
        label: '자본금',
        data: chartData.capitalStructure.capital,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '부채',
        data: chartData.capitalStructure.debt,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '총자산',
        data: chartData.capitalStructure.assets,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className="space-y-4 px-2 lg:px-3">
      {/* 주요 차트 */}
      <Card className="p-3 bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-3">자본/부채/자산 비교 차트</h3>
        <div className="h-52">
          <Bar
            data={capitalStructureChartData}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 재무 비율 분석 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-3 bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 backdrop-blur-md rounded-xl border border-emerald-400/25"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-emerald-500/30 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-emerald-300" />
            </div>
            <h4 className="text-emerald-200 font-semibold text-lg">재무 비율 분석</h4>
            <div className="ml-2 relative group">
              <HelpCircle className="w-4 h-4 text-emerald-300 cursor-help" />
              {/* 통합 툴팁 */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                <div className="font-semibold mb-1">재무 비율 평가 기준</div>
                <div className="mb-2">
                  <div className="font-medium">자본비율:</div>
                  • 50% 이상: 매우 건전한 재무상태<br/>
                  • 30-50%: 건전한 재무상태<br/>
                  • 20-30%: 적정한 수준<br/>
                  • 20% 미만: 자본 확충 필요
                </div>
                <div className="mb-2">
                  <div className="font-medium">부채비율:</div>
                  • 30% 이하: 매우 양호한 부채상태<br/>
                  • 30-50%: 양호한 부채상태<br/>
                  • 50-70%: 적정한 수준<br/>
                  • 70% 초과: 부채 위험 수준
                </div>
                <div>
                  <div className="font-medium">성장률:</div>
                  • 10% 이상: 매우 양호한 성장세<br/>
                  • 5-10%: 양호한 성장세<br/>
                  • 0-5%: 안정적인 상태<br/>
                  • -5-0%: 주의가 필요한 상태<br/>
                  • -5% 미만: 개선이 필요한 상태
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {(() => {
              const capitalRatio = (kpiMetrics.totalEquity / kpiMetrics.totalAssets) * 100;
              const capitalStatus = getCapitalRatioStatus(capitalRatio);
              return (
                <div className={`flex justify-between items-center p-2 ${capitalStatus.bgColor} rounded-lg`}>
                  <span className="text-emerald-100 text-sm">자본비율</span>
                  <div className="text-right">
                    <span className="text-emerald-200 font-semibold">{capitalRatio.toFixed(1)}%</span>
                    <div className={`text-xs ${capitalStatus.color}`}>{capitalStatus.text}</div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const debtRatio = (kpiMetrics.totalLiabilities / kpiMetrics.totalAssets) * 100;
              const debtStatus = getDebtRatioStatus(debtRatio);
              return (
                <div className={`flex justify-between items-center p-2 ${debtStatus.bgColor} rounded-lg`}>
                  <span className="text-emerald-100 text-sm">부채비율</span>
                  <div className="text-right">
                    <span className="text-emerald-200 font-semibold">{debtRatio.toFixed(1)}%</span>
                    <div className={`text-xs ${debtStatus.color}`}>{debtStatus.text}</div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const growthStatus = getGrowthStatus(kpiMetrics.totalEquityChange);
              return (
                <div className={`flex justify-between items-center p-2 ${growthStatus.bgColor} rounded-lg`}>
                  <span className="text-emerald-100 text-sm">자본증가율</span>
                  <div className="text-right">
                    <span className={`font-semibold ${growthStatus.color}`}>
                      {kpiMetrics.totalEquityChange >= 0 ? '+' : ''}{kpiMetrics.totalEquityChange}%
                    </span>
                    <div className={`text-xs ${growthStatus.color}`}>{growthStatus.text}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>

        {/* 연도별 변화 분석 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-3 bg-gradient-to-br from-blue-500/15 to-blue-600/10 backdrop-blur-md rounded-xl border border-blue-400/25"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-500/30 rounded-lg mr-3">
              <BarChart3 className="w-5 h-5 text-blue-300" />
            </div>
            <h4 className="text-blue-200 font-semibold text-lg">연도별 변화 분석</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg">
              <span className="text-blue-100 text-sm">자본 변화</span>
              <div className="text-right">
                <span className="text-blue-200 font-semibold">{kpiMetrics.totalEquity.toLocaleString()}억원</span>
                <div className={`text-xs ${kpiMetrics.totalEquityChange >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
                  {kpiMetrics.totalEquityChange >= 0 ? '▲' : '▼'} {Math.abs(kpiMetrics.totalEquityChange)}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg">
              <span className="text-blue-100 text-sm">부채 변화</span>
              <div className="text-right">
                <span className="text-blue-200 font-semibold">{kpiMetrics.totalLiabilities.toLocaleString()}억원</span>
                <div className={`text-xs ${kpiMetrics.totalLiabilitiesChange >= 0 ? 'text-red-300' : 'text-blue-300'}`}>
                  {kpiMetrics.totalLiabilitiesChange >= 0 ? '▲' : '▼'} {Math.abs(kpiMetrics.totalLiabilitiesChange)}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg">
              <span className="text-blue-100 text-sm">자산 변화</span>
              <div className="text-right">
                <span className="text-blue-200 font-semibold">{kpiMetrics.totalAssets.toLocaleString()}억원</span>
                <div className={`text-xs ${kpiMetrics.totalAssetsChange >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
                  {kpiMetrics.totalAssetsChange >= 0 ? '▲' : '▼'} {Math.abs(kpiMetrics.totalAssetsChange)}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 추가 분석 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 재무 건전성 지표 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-3 bg-gradient-to-br from-purple-500/15 to-purple-600/10 backdrop-blur-md rounded-xl border border-purple-400/25"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-500/30 rounded-lg mr-3">
              <Target className="w-5 h-5 text-purple-300" />
            </div>
            <h4 className="text-purple-200 font-semibold text-lg">재무 건전성</h4>
          </div>
          
          <div className="space-y-2">
            <div className="text-center p-2 bg-purple-500/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-200 mb-1">
                {((kpiMetrics.totalEquity / kpiMetrics.totalAssets) * 100).toFixed(1)}%
              </div>
              <div className="text-purple-100 text-sm">자본비율</div>
            </div>
            <div className="text-center p-2 bg-purple-500/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-200 mb-1">
                {((kpiMetrics.totalLiabilities / kpiMetrics.totalAssets) * 100).toFixed(1)}%
              </div>
              <div className="text-purple-100 text-sm">부채비율</div>
            </div>
          </div>
        </motion.div>

        {/* 성장성 지표 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-3 bg-gradient-to-br from-orange-500/15 to-orange-600/10 backdrop-blur-md rounded-xl border border-orange-400/25"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-orange-500/30 rounded-lg mr-3">
              <TrendingUp className="w-5 h-5 text-orange-300" />
            </div>
            <h4 className="text-orange-200 font-semibold text-lg">성장성 지표</h4>
          </div>
          
          <div className="space-y-2">
            <div className="text-center p-2 bg-orange-500/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-200 mb-1">
                {kpiMetrics.totalEquityChange >= 0 ? '+' : ''}{kpiMetrics.totalEquityChange}%
              </div>
              <div className="text-orange-100 text-sm">자본증가율</div>
            </div>
            <div className="text-center p-2 bg-orange-500/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-200 mb-1">
                {kpiMetrics.totalAssetsChange >= 0 ? '+' : ''}{kpiMetrics.totalAssetsChange}%
              </div>
              <div className="text-orange-100 text-sm">자산증가율</div>
            </div>
          </div>
        </motion.div>

        {/* 위험도 지표 */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-3 bg-gradient-to-br from-red-500/15 to-red-600/10 backdrop-blur-md rounded-xl border border-red-400/25"
        >
          <div className="flex items-center mb-3">
            <div className="p-2 bg-red-500/30 rounded-lg mr-3">
              <TrendingDown className="w-5 h-5 text-red-300" />
            </div>
            <h4 className="text-red-200 font-semibold text-lg">위험도 지표</h4>
          </div>
          
          <div className="space-y-2">
            <div className="text-center p-2 bg-red-500/10 rounded-lg">
              <div className="text-2xl font-bold text-red-200 mb-1">
                {((kpiMetrics.totalLiabilities / kpiMetrics.totalAssets) * 100).toFixed(1)}%
              </div>
              <div className="text-red-100 text-sm">부채비율</div>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded-lg">
              <div className="text-2xl font-bold text-red-200 mb-1">
                {kpiMetrics.totalLiabilitiesChange >= 0 ? '+' : ''}{kpiMetrics.totalLiabilitiesChange}%
              </div>
              <div className="text-red-100 text-sm">부채증가율</div>
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  );
}
