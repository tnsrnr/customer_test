'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from 'lucide-react';
import { FinanceData } from '../types';

interface CapitalTabProps {
  data: FinanceData;
}

export function CapitalTab({ data }: CapitalTabProps) {
  const { kpiMetrics, chartData } = data;
  
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
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">자본비율</span>
              <div className="text-right">
                <span className="text-emerald-200 font-semibold">{((kpiMetrics.totalEquity / kpiMetrics.totalAssets) * 100).toFixed(1)}%</span>
                <div className="text-emerald-300 text-xs">건전한 수준</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">부채비율</span>
              <div className="text-right">
                <span className="text-emerald-200 font-semibold">{((kpiMetrics.totalLiabilities / kpiMetrics.totalAssets) * 100).toFixed(1)}%</span>
                <div className="text-emerald-300 text-xs">적정 수준</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">자본증가율</span>
              <div className="text-right">
                <span className={`font-semibold ${kpiMetrics.totalEquityChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {kpiMetrics.totalEquityChange >= 0 ? '+' : ''}{kpiMetrics.totalEquityChange}%
                </span>
                <div className={`text-xs ${kpiMetrics.totalEquityChange >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {kpiMetrics.totalEquityChange >= 0 ? '양호' : '개선 필요'}
                </div>
              </div>
            </div>
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
