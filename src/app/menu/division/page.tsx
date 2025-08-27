'use client';

import { Card } from "@/components/ui/card";
import { DivisionTable } from './components/division_table';
import { DivisionChart } from './components/division_chart';
import { useEffect } from 'react';
import { Plane, Ship, Truck, Warehouse, Building, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useDivisionStore } from './store';
import { useGlobalStore } from '@/store/slices/global';

import { AuthGuard } from "@/components/auth_guard";

// 아이콘 매핑
const iconMap: { [key: string]: any } = {
  Plane,
  Ship,
  Truck,
  Warehouse,
  Building,
  Package
};

// 부문 카드 컴포넌트
const DivisionCard = ({ 
  division, 
  isSelected, 
  onSelect 
}: { 
  division: any; 
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const IconComponent = iconMap[division.icon];
  
  return (
    <div 
      className={`${division.color} border-l-4 ${division.borderColor} overflow-hidden backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-white/50 shadow-lg scale-[1.02]' 
          : ''
      }`}
      onClick={() => onSelect(division.id)}
    >
              <div className="p-4">
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* 부문 */}
            <div className="col-span-2 flex items-center gap-2">
            <IconComponent className={`w-5 h-5 ${division.textColor}`} />
                          <span className={`text-lg font-semibold ${division.textColor}`}>
              {division.name}
            </span>
          </div>
          
          {/* 매출 */}
          <div className="col-span-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <span className={`text-3xl font-bold ${division.textColor}`}>
                {division.revenue.toLocaleString()}
              </span>
              <span className="text-sm text-slate-300">억원</span>
            </div>
          </div>
          
          {/* 매출 전월 比 */}
          <div className="col-span-4 text-center">
            <div className="flex items-center justify-center gap-1 min-w-0">
              <span className={`text-lg font-semibold ${division.growth >= 0 ? 'text-emerald-400' : 'text-blue-400'} truncate`}>
                {division.growth >= 0 ? '▲' : '▼'}
              </span>
              <span className={`text-lg font-semibold ${division.growth >= 0 ? 'text-emerald-400' : 'text-blue-400'} truncate`}>
                {Math.abs(division.growth)}%
              </span>
            </div>
          </div>
          
          {/* 영업이익 */}
          <div className="col-span-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <span className={`text-lg font-semibold ${division.profit >= 0 ? 'text-white' : 'text-red-400'}`}>
                {division.profit > 0 ? '+' : ''}
                {Math.round(division.profit)}
              </span>
              <span className="text-sm text-slate-300">억원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DivisionPage() {
  const { 
    data, 
    loading, 
    error, 
    selectedDivision,
    currentYear,
    currentMonth,
    displayYear,
    displayMonth,
    fetchDivisionData: fetchAllData,
    setSelectedDivision,
    setCurrentDate
  } = useDivisionStore();

  const { setCurrentPage, isRefreshing } = useGlobalStore();

  // 컴포넌트 마운트 시 데이터 로드 및 현재 페이지 설정
  useEffect(() => {
    console.log('🚀 division 페이지 마운트');
    setCurrentPage('division');
    fetchAllData();
  }, [setCurrentPage]);

  // 전역 조회 이벤트 감지
  useEffect(() => {
    console.log('🔄 division isRefreshing 변경:', isRefreshing);
    if (isRefreshing) {
      console.log('✅ division 조회 버튼 클릭으로 인한 데이터 조회');
      fetchAllData();
    }
  }, [isRefreshing]);



  const totalRevenue = data?.divisionCards.reduce((sum, item) => sum + item.revenue, 0) || 0;

  function DivisionPageContent() {
    console.log('🔄 DivisionPageContent 렌더링:', { displayYear, displayMonth });
    
    return (
      <div className="h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden flex items-center justify-center">
        {/* 고급스러운 배경 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>

        <div className="relative z-10 h-[calc(100vh-64px)] p-2 space-y-2 overflow-hidden flex flex-col">
          {/* 로딩 상태 표시 */}
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
            <div className="grid grid-cols-12 gap-2" style={{ height: 'calc(100vh - 200px)' }}>
              {/* 좌측 - 부문별 카드 테이블 형태 */}
              <div className="col-span-3">
                <div className="h-full p-3 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transition-all duration-300 flex flex-col">
                  {/* 헤더 */}
                  <div className="bg-white/10 text-white text-center py-3 -mx-3 -mt-3 mb-3 rounded-t-xl">
                    <div className="text-2xl font-bold">부문별 실적</div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 mb-3 px-2">
                    <div className="col-span-2 text-lg font-semibold text-white">부문</div>
                    <div className="col-span-3 text-center text-lg font-semibold text-white">매출</div>
                    <div className="col-span-4 text-center text-lg font-semibold text-white">매출 전월 比</div>
                    <div className="col-span-3 text-center text-lg font-semibold text-white">영업이익</div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden pb-2">
                    {data.divisionCards.map((division) => (
                      <DivisionCard 
                        key={division.id} 
                        division={division} 
                        isSelected={selectedDivision === division.id}
                        onSelect={setSelectedDivision}
                      />
                    ))}
                    
                    {/* 합계 카드 */}
                    <div 
                      className={`bg-white/20 text-white border-0 backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer transition-all duration-300 mb-1 ${
                        selectedDivision === 'total' 
                          ? 'ring-2 ring-white/50 shadow-lg scale-[1.02]' 
                          : ''
                      }`}
                      onClick={() => setSelectedDivision('total')}
                    >
                      <div className="p-4">
                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-2">
                            <span className="text-lg font-semibold">합 계</span>
                          </div>
                          <div className="col-span-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-3xl font-bold">
                                {totalRevenue.toLocaleString()}
                              </span>
                              <span className="text-sm">억원</span>
                            </div>
                          </div>
                          <div className="col-span-4 text-center">
                            <span className="text-base text-blue-400">▼11%</span>
                          </div>
                          <div className="col-span-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-base font-semibold">0.0</span>
                              <span className="text-sm">억원</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측 - 부문별 실적 테이블 또는 차트 */}
              <div className="col-span-9">
                <div className="h-full p-3 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transition-all duration-300 flex flex-col">
                  <div className="bg-white/10 text-white text-center py-3 -mx-3 -mt-3 mb-3 rounded-t-xl">
                    <div className="text-2xl font-bold">
                      {selectedDivision ? '부문별 상세 분석' : '부문별 상세 실적'}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {selectedDivision && selectedDivision !== 'total' ? (
                      <DivisionChart 
                        divisionData={data.divisionTable.divisions.find(d => {
                          const divisionMap: { [key: string]: string } = {
                            'air': '항공',
                            'sea': '해상',
                            'transport': '운송',
                            'warehouse': '창고',
                            'construction': '도급',
                            'other': '기타'
                          };
                          return d.name === divisionMap[selectedDivision];
                        })}
                        months={data.divisionTable.months}
                        loading={loading}
                      />
                    ) : (
                                    <DivisionTable 
                data={data.divisionTable.monthlyDetails}
                monthLabels={data.divisionTable.monthLabels}
                loading={loading}
                selectedYear={currentYear}
                selectedMonth={currentMonth}
              />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <DivisionPageContent />
    </AuthGuard>
  );
} 