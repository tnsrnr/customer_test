'use client';

import { Card } from '@/common/components/ui/card';
import { BusinessDivisionTable } from './components/business_division_table';
import { useEffect } from 'react';
import { Building2, Factory, Globe2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useBusinessDivisionStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';
import CountUp from 'react-countup';

export default function BusinessDivisionPage() {
  const { 
    data, 
    loading, 
    error, 
    fetchAllData,
    currentYear,
    currentMonth
  } = useBusinessDivisionStore();

  const { setCurrentPage, isRefreshing } = useGlobalStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 전역 조회 이벤트 감지
  useEffect(() => {
    if (isRefreshing) {
      fetchAllData();
    }
  }, [isRefreshing, fetchAllData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 h-[calc(100vh-64px)] p-3 space-y-3 overflow-hidden">
        {/* 로딩 상태 표시 - 초기 로딩 시에만 표시 */}
        {loading && !data && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-2 text-white">데이터를 불러오는 중...</span>
    </div>
        )}

        {/* 에러 상태 표시 */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300">
            {error}
          </div>
        )}

        {/* 데이터가 로드된 경우에만 컨텐츠 표시 */}
        {data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
            {/* 그리드 테이블 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <BusinessDivisionTable 
                data={data.gridData.divisions} 
                loading={loading} 
                currentYear={currentYear}
                currentMonth={currentMonth}
              />
            </motion.div>

            {/* 분석 정보 섹션 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 overflow-y-auto"
            >
              <div className="space-y-3 h-full overflow-y-auto">
                {(() => {
                  // 총합계 제외한 팀별 데이터
                  const teamData = data.gridData.divisions.filter(d => d.team_name !== '총합계');
                  const teams = ['글로벌영업1팀', '글로벌영업2팀', '글로벌영업3팀', '해상영업그룹', '기타'];
                  
                  // 각 팀별 데이터 집계
                  const teamStats = teams.map(teamName => {
                    const teamItems = teamData.filter(d => d.team_name === teamName);
                    const revenue = teamItems.find(d => d.account_name === 'Revenue');
                    const profit = teamItems.find(d => d.account_name === 'Profit');
                    const operatingProfit = teamItems.find(d => d.account_name === '영업이익');
                    const visits = teamItems.find(d => d.account_name === '방문횟수');
                    
                    return {
                      teamName,
                      revenue: revenue?.year2025 || 0,
                      profit: profit?.year2025 || 0,
                      operatingProfit: operatingProfit?.year2025 || 0,
                      visits: visits?.year2025 || 0
                    };
                  });
                  
                  // 최대값 찾기
                  const maxRevenue = teamStats.reduce((max, team) => 
                    team.revenue > max.revenue ? team : max, teamStats[0]);
                  const maxProfit = teamStats.reduce((max, team) => 
                    team.profit > max.profit ? team : max, teamStats[0]);
                  const maxOperatingProfit = teamStats.reduce((max, team) => 
                    team.operatingProfit > max.operatingProfit ? team : max, teamStats[0]);
                  const maxVisits = teamStats.reduce((max, team) => 
                    team.visits > max.visits ? team : max, teamStats[0]);

                  return (
                    <div className="space-y-3">
                      {/* 최대 지표 통합 카드 */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative p-4 bg-gradient-to-br from-slate-600/20 via-slate-700/15 to-slate-800/10 backdrop-blur-md rounded-2xl shadow-xl border border-slate-400/30 hover:border-slate-300/50 transition-all duration-300 overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          {/* 최대매출 */}
                          <div className="relative p-3 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 rounded-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                              <div className="text-blue-200 text-xs font-medium mb-1">최대매출</div>
                              <div className="text-white text-base font-bold mb-1">{maxRevenue.teamName.replace('글로벌', '')}</div>
                              <div className="text-white text-lg font-bold">
                                {Math.round(maxRevenue.revenue / 100000000).toLocaleString()}억원
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
                          </div>

                          {/* 최대이익 */}
                          <div className="relative p-3 bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 rounded-xl border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                              <div className="text-emerald-200 text-xs font-medium mb-1">최대이익</div>
                              <div className="text-white text-base font-bold mb-1">{maxProfit.teamName.replace('글로벌', '')}</div>
                              <div className="text-white text-lg font-bold">
                                {Math.round(maxProfit.profit / 100000000).toLocaleString()}억원
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-60"></div>
                          </div>

                          {/* 최대영업이익 */}
                          <div className={`relative p-3 rounded-xl border transition-all duration-300 overflow-hidden group ${
                            maxOperatingProfit.operatingProfit >= 0
                              ? 'bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 border-purple-400/30 hover:border-purple-300/50'
                              : 'bg-gradient-to-br from-red-500/20 via-red-600/15 to-red-700/10 border-red-400/30 hover:border-red-300/50'
                          }`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${
                              maxOperatingProfit.operatingProfit >= 0 ? 'from-purple-400/5' : 'from-red-400/5'
                            } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className="relative">
                              <div className={`text-xs font-medium mb-1 ${
                                maxOperatingProfit.operatingProfit >= 0 ? 'text-purple-200' : 'text-red-200'
                              }`}>
                                최대영업이익
                              </div>
                              <div className={`text-base font-bold mb-1 ${
                                maxOperatingProfit.operatingProfit >= 0 ? 'text-purple-200' : 'text-red-200'
                              }`}>
                                {maxOperatingProfit.teamName.replace('글로벌', '')}
                              </div>
                              <div className={`text-lg font-bold ${
                                maxOperatingProfit.operatingProfit >= 0 ? 'text-purple-200' : 'text-red-200'
                              }`}>
                                {Math.round(maxOperatingProfit.operatingProfit / 100000000).toLocaleString()}억원
                              </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                              maxOperatingProfit.operatingProfit >= 0 ? 'from-purple-400 to-purple-600' : 'from-red-400 to-red-600'
                            } opacity-60`}></div>
                          </div>

                          {/* 최대방문 */}
                          <div className="relative p-3 bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10 rounded-xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative">
                              <div className="text-orange-200 text-xs font-medium mb-1">최대방문</div>
                              <div className="text-white text-base font-bold mb-1">{maxVisits.teamName.replace('글로벌', '')}</div>
                              <div className="text-white text-lg font-bold">
                                {maxVisits.visits.toLocaleString()}회
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 opacity-60"></div>
                          </div>
                        </div>
                      </motion.div>

                      {/* 2025년 총합계 */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="relative p-4 bg-gradient-to-br from-slate-600/30 via-slate-700/25 to-slate-800/20 backdrop-blur-md rounded-2xl shadow-xl border-2 border-slate-400/40 hover:border-slate-300/60 transition-all duration-300 overflow-hidden group mt-4"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <div className="text-slate-200 text-sm font-bold mb-3">2025년 총합계</div>
                          {(() => {
                            const totalData = data.gridData.divisions.filter(d => d.team_name === '총합계');
                            const revenue = totalData.find(d => d.account_name === 'Revenue');
                            const cost = totalData.find(d => d.account_name === 'Cost');
                            const directExpense = totalData.find(d => d.account_name === '직접경비');
                            const profit = totalData.find(d => d.account_name === 'Profit');
                            const indirectExpense = totalData.find(d => d.account_name === '간접경비');
                            const operatingProfit = totalData.find(d => d.account_name === '영업이익');
                            const visits = totalData.find(d => d.account_name === '방문횟수');
                            
                            return (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-xs">Revenue</span>
                                  <span className="text-white text-base font-bold">
                                    {revenue ? Math.round(revenue.year2025 / 100000000).toLocaleString() : '0'}억원
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-xs">Cost</span>
                                  <span className="text-white text-base font-bold">
                                    {cost ? Math.round(cost.year2025 / 100000000).toLocaleString() : '0'}억원
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-xs">직접경비</span>
                                  <span className="text-white text-base font-bold">
                                    {directExpense ? Math.round(directExpense.year2025 / 100000000).toLocaleString() : '0'}억원
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-xs">Profit</span>
                                  <span className="text-white text-base font-bold">
                                    {profit ? Math.round(profit.year2025 / 100000000).toLocaleString() : '0'}억원
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-xs">간접경비</span>
                                  <span className="text-white text-base font-bold">
                                    {indirectExpense ? Math.round(indirectExpense.year2025 / 100000000).toLocaleString() : '0'}억원
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 text-xs">영업이익</span>
                                  <span className={`text-base font-bold ${
                                    operatingProfit && operatingProfit.year2025 >= 0 ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {operatingProfit ? Math.round(operatingProfit.year2025 / 100000000).toLocaleString() : '0'}억원
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-500/30">
                                  <span className="text-slate-300 text-xs">방문횟수</span>
                                  <span className="text-white text-base font-bold">
                                    {visits ? visits.year2025.toLocaleString() : '0'}회
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 to-slate-600 opacity-60"></div>
                      </motion.div>
                    </div>
                  );
                })()}
            </div>
            </motion.div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <span className="text-white">데이터를 불러오는 중...</span>
        </div>
        )}
      </div>
    </div>
  );
}

