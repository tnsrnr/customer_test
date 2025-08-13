'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from 'lucide-react';

interface CapitalTabProps {
  topLeftChartData: any;
  currentCapital: number;
  currentDebt: number;
  currentAssets: number;
  capitalChange: string;
  debtChange: string;
  assetsChange: string;
}

export function CapitalTab({
  topLeftChartData,
  currentCapital,
  currentDebt,
  currentAssets,
  capitalChange,
  debtChange,
  assetsChange
}: CapitalTabProps) {
  return (
    <div className="space-y-4 px-2 lg:px-3">
      {/* 주요 차트 */}
      <Card className="p-3 bg-white/10 backdrop-blur-md border border-white/20">
        <h3 className="text-white font-semibold text-lg mb-3">자본/부채/자산 비교 차트</h3>
        <div className="h-52">
          <Bar
            data={topLeftChartData}
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
                <span className="text-emerald-200 font-semibold">{((currentCapital / currentAssets) * 100).toFixed(1)}%</span>
                <div className="text-emerald-300 text-xs">건전한 수준</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">부채비율</span>
              <div className="text-right">
                <span className="text-emerald-200 font-semibold">{((currentDebt / currentAssets) * 100).toFixed(1)}%</span>
                <div className="text-emerald-300 text-xs">적정 수준</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-emerald-500/10 rounded-lg">
              <span className="text-emerald-100 text-sm">자본증가율</span>
              <div className="text-right">
                <span className={`font-semibold ${parseFloat(capitalChange) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {parseFloat(capitalChange) >= 0 ? '+' : ''}{capitalChange}%
                </span>
                <div className={`text-xs ${parseFloat(capitalChange) >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {parseFloat(capitalChange) >= 0 ? '양호' : '개선 필요'}
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
                <span className="text-blue-200 font-semibold">{currentCapital.toLocaleString()}억원</span>
                <div className={`text-xs ${parseFloat(capitalChange) >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
                  {parseFloat(capitalChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(capitalChange))}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg">
              <span className="text-blue-100 text-sm">부채 변화</span>
              <div className="text-right">
                <span className="text-blue-200 font-semibold">{currentDebt.toLocaleString()}억원</span>
                <div className={`text-xs ${parseFloat(debtChange) >= 0 ? 'text-red-300' : 'text-blue-300'}`}>
                  {parseFloat(debtChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(debtChange))}%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-500/10 rounded-lg">
              <span className="text-blue-100 text-sm">자산 변화</span>
              <div className="text-right">
                <span className="text-blue-200 font-semibold">{currentAssets.toLocaleString()}억원</span>
                <div className={`text-xs ${parseFloat(assetsChange) >= 0 ? 'text-blue-300' : 'text-red-300'}`}>
                  {parseFloat(assetsChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(assetsChange))}%
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
                {((currentCapital / currentAssets) * 100).toFixed(1)}%
              </div>
              <div className="text-purple-100 text-sm">자본비율</div>
            </div>
            <div className="text-center p-2 bg-purple-500/10 rounded-lg">
              <div className="text-2xl font-bold text-purple-200 mb-1">
                {((currentDebt / currentAssets) * 100).toFixed(1)}%
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
                {parseFloat(capitalChange) >= 0 ? '+' : ''}{capitalChange}%
              </div>
              <div className="text-orange-100 text-sm">자본증가율</div>
            </div>
            <div className="text-center p-2 bg-orange-500/10 rounded-lg">
              <div className="text-2xl font-bold text-orange-200 mb-1">
                {parseFloat(assetsChange) >= 0 ? '+' : ''}{assetsChange}%
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
                {((currentDebt / currentAssets) * 100).toFixed(1)}%
              </div>
              <div className="text-red-100 text-sm">부채비율</div>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded-lg">
              <div className="text-2xl font-bold text-red-200 mb-1">
                {parseFloat(debtChange) >= 0 ? '+' : ''}{debtChange}%
              </div>
              <div className="text-red-100 text-sm">부채증가율</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 종합 평가 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="p-3 bg-gradient-to-br from-slate-500/15 to-slate-600/10 backdrop-blur-md rounded-xl border border-slate-400/25"
      >
        <div className="flex items-center mb-3">
          <div className="p-2 bg-slate-500/30 rounded-lg mr-3">
            <DollarSign className="w-5 h-5 text-slate-300" />
          </div>
          <h4 className="text-slate-200 font-semibold text-lg">종합 재무 평가</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="text-slate-200 font-medium">긍정적 요소</h5>
            <ul className="space-y-2 text-slate-100 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                자본비율이 건전한 수준 유지
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                자산 규모 지속적 확대
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                안정적인 재무 구조
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-slate-200 font-medium">개선 필요 요소</h5>
            <ul className="space-y-2 text-slate-100 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                부채 증가율 모니터링 필요
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                자본 효율성 개선 여지
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                리스크 관리 강화
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
