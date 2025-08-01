'use client';

import { Card } from "@/components/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { Plane, Ship, Truck, Warehouse, Building, Package } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { motion } from "framer-motion";
import { useState, useCallback, memo } from "react";

// 부문 카드 컴포넌트를 메모이제이션
const DivisionCard = memo(({ 
  division, 
  isSelected, 
  onSelect 
}: { 
  division: any; 
  isSelected: boolean; 
  onSelect: (id: string) => void; 
}) => (
  <div 
    className={`${division.color} border-l-4 ${division.borderColor} overflow-hidden backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'ring-2 ring-white/50 shadow-lg scale-[1.02]' 
        : 'hover:scale-[1.01] hover:shadow-md'
    }`}
    onClick={() => onSelect(division.id)}
  >
    <div className="p-4">
      <div className="grid grid-cols-12 gap-3 items-center">
        {/* 부문 */}
        <div className="col-span-2 flex items-center gap-2">
          <division.icon className={`w-5 h-5 ${division.textColor}`} />
          <span className={`text-base font-semibold ${division.textColor}`}>
            {division.name}
          </span>
        </div>
        
        {/* 매출 */}
        <div className="col-span-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className={`text-2xl font-bold ${division.textColor}`}>
              {division.revenue}
            </span>
            <span className="text-sm text-slate-300">억원</span>
          </div>
        </div>
        
        {/* 매출 전월 比 */}
        <div className="col-span-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className={`text-base font-semibold ${division.growth >= 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {division.growth >= 0 ? '▲' : '▼'}
            </span>
            <span className={`text-base font-semibold ${division.growth >= 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {Math.abs(division.growth)}%
            </span>
          </div>
        </div>
        
        {/* 영업이익 */}
        <div className="col-span-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className={`text-base font-semibold ${division.profit >= 0 ? 'text-white' : 'text-red-400'}`}>
              {division.profit > 0 ? '+' : ''}{division.profit}
            </span>
            <span className="text-sm text-slate-300">억원</span>
          </div>
        </div>
      </div>
    </div>
  </div>
));

// 테이블 행 컴포넌트를 메모이제이션
const TableRowComponent = memo(({ 
  divisionId, 
  divisionName, 
  isSelected, 
  children 
}: { 
  divisionId: string; 
  divisionName: string; 
  isSelected: boolean; 
  children: React.ReactNode; 
}) => (
  <TableRow className={`border-b border-white/20 transition-all duration-300 ${
    isSelected 
      ? 'bg-white/20 ring-2 ring-white/50 shadow-lg' 
      : 'hover:bg-white/10'
  }`}>
    <TableCell className="py-3 px-3 text-center font-semibold text-white border-r-2 border-white/30">
      {divisionName}
    </TableCell>
    {children}
  </TableRow>
));

export default function DivisionPage() {
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const handleDivisionSelect = useCallback((divisionId: string) => {
    setSelectedDivision(divisionId);
  }, []);

  const divisionData = [
    {
      id: 'air',
      name: '항공',
      icon: Plane,
      revenue: 75,
      growth: -29,
      profit: -2.4,
      color: 'bg-blue-500/20 border-blue-400',
      textColor: 'text-blue-100',
      borderColor: 'border-l-blue-400'
    },
    {
      id: 'sea',
      name: '해상',
      icon: Ship,
      revenue: 33,
      growth: 1,
      profit: 0.1,
      color: 'bg-slate-500/20 border-slate-400',
      textColor: 'text-slate-100',
      borderColor: 'border-l-slate-400'
    },
    {
      id: 'transport',
      name: '운송',
      icon: Truck,
      revenue: 26,
      growth: -4,
      profit: 0.5,
      color: 'bg-amber-500/20 border-amber-400',
      textColor: 'text-amber-100',
      borderColor: 'border-l-amber-400'
    },
    {
      id: 'warehouse',
      name: '창고',
      icon: Warehouse,
      revenue: 16,
      growth: 3,
      profit: -1.7,
      color: 'bg-green-500/20 border-green-400',
      textColor: 'text-green-100',
      borderColor: 'border-l-green-400'
    },
    {
      id: 'construction',
      name: '도급',
      icon: Building,
      revenue: 20,
      growth: 5,
      profit: 0.6,
      color: 'bg-purple-500/20 border-purple-400',
      textColor: 'text-purple-100',
      borderColor: 'border-l-purple-400'
    },
    {
      id: 'other',
      name: '기타',
      icon: Package,
      revenue: 17,
      growth: 59,
      profit: 3.0,
      color: 'bg-orange-500/20 border-orange-400',
      textColor: 'text-orange-100',
      borderColor: 'border-l-orange-400'
    }
  ];

  // 월별 상세 데이터
  const monthlyData = [
    {
      division: '항공',
      jan: 64, feb: 56, mar: 68, apr: 104, may: 75,
      total: 367, growth: '▼29%', growthColor: 'text-blue-600'
    },
    {
      division: '해상',
      jan: 41, feb: 40, mar: 56, apr: 33, may: 33,
      total: 203, growth: '▲1%', growthColor: 'text-red-500'
    },
    {
      division: '운송',
      jan: 26, feb: 27, mar: 27, apr: 28, may: 26,
      total: 134, growth: '▼4%', growthColor: 'text-blue-600'
    },
    {
      division: '창고',
      jan: 16, feb: 16, mar: 16, apr: 16, may: 16,
      total: 81, growth: '▲3%', growthColor: 'text-red-500'
    },
    {
      division: '도급',
      jan: 18, feb: 17, mar: 19, apr: 19, may: 20,
      total: 93, growth: '▲5%', growthColor: 'text-red-500'
    },
    {
      division: '기타',
      jan: 9, feb: 10, mar: 9, apr: 11, may: 17,
      total: 56, growth: '▲59%', growthColor: 'text-red-500'
    }
  ];

  // 영업이익 데이터
  const profitData = [
    { division: '항공', jan: -3.3, feb: -3.1, mar: -1.9, apr: -3.0, may: -2.4, total: -13.7, growth: '▲18%' },
    { division: '해상', jan: -0.7, feb: -1.0, mar: 0.9, apr: 0.2, may: 0.1, total: -0.4, growth: '▼40%' },
    { division: '운송', jan: 0.9, feb: 0.5, mar: 0.9, apr: 0.7, may: 0.5, total: 3.4, growth: '▼37%' },
    { division: '창고', jan: -3.4, feb: -3.3, mar: -3.4, apr: -4.2, may: -1.7, total: -16.1, growth: '▲59%' },
    { division: '도급', jan: 0.3, feb: 0.6, mar: 0.6, apr: 0.7, may: 0.6, total: 2.8, growth: '▼17%' },
    { division: '기타', jan: 3.2, feb: 3.2, mar: 2.9, apr: 2.9, may: 3.0, total: 15.3, growth: '▲3%' }
  ];

  const totalRevenue = divisionData.reduce((sum, item) => sum + item.revenue, 0);

  function DivisionPageContent() {
    return (
      <div
        className="h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden flex items-center justify-center"
      >
        

        <div className="relative z-10 h-[calc(100vh-64px)] p-4 space-y-4 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* 좌측 - 부문별 카드 테이블 형태 */}
            <div className="col-span-3">
              <div 
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
              >
                {/* 헤더 */}
                <div className="bg-white/10 text-white text-center py-2 -mx-5 -mt-5 mb-4 rounded-t-xl">
                  <div className="text-sm font-semibold">부문별 실적</div>
                </div>
                <div className="grid grid-cols-12 gap-3 mb-5 px-3">
                  <div className="col-span-2 text-lg font-semibold text-white">부문</div>
                  <div className="col-span-3 text-center text-lg font-semibold text-white">매출</div>
                  <div className="col-span-4 text-center text-lg font-semibold text-white">매출 전월 比</div>
                  <div className="col-span-3 text-center text-lg font-semibold text-white">영업이익</div>
                </div>

                <div className="space-y-3">
                  {divisionData.map((division) => (
                    <DivisionCard 
                      key={division.id} 
                      division={division} 
                      isSelected={selectedDivision === division.id} 
                      onSelect={handleDivisionSelect}
                    />
                  ))}
                </div>

                {/* 합계 카드 */}
                <div 
                  className="bg-white/20 text-white mt-4 border-0 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  <div className="p-4">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-2">
                        <span className="text-base font-semibold">합 계</span>
                      </div>
                      <div className="col-span-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-2xl font-bold">{totalRevenue}</span>
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

            {/* 우측 - 부문별 실적 테이블 */}
            <div className="col-span-9">
              <div 
                className="p-5 bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full"
              >
                <div className="bg-white/10 text-white text-center py-2 -mx-5 -mt-5 mb-4 rounded-t-xl">
                  <div className="text-sm font-semibold">부문별 상세 실적</div>
                </div>
                <div className="overflow-x-auto h-full">
                  <Table>
                    <TableHeader>
                      {/* 첫 번째 헤더 행 - 매출/영업이익 구분 */}
                      <TableRow className="text-2xl border-b-2 border-white/30">
                        <TableHead className="py-5 px-4 text-center font-extrabold text-white bg-white/20 border-r-2 border-white/30">구분</TableHead>
                        <TableHead colSpan={7} className="py-5 px-3 text-center text-4xl font-extrabold text-blue-200 bg-blue-500/30 border-r-2 border-white/30">매출</TableHead>
                        <TableHead colSpan={7} className="py-5 px-3 text-center text-4xl font-extrabold text-emerald-200 bg-emerald-500/30">영업이익</TableHead>
                      </TableRow>
                      {/* 두 번째 헤더 행 - 월별 헤더 */}
                      <TableRow className="text-lg border-b-2 border-white/30">
                        <TableHead className="py-5 px-4 text-center font-bold text-white bg-white/20 border-r-2 border-white/30">부문</TableHead>
                        {/* 매출 헤더 */}
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30">1월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30">2월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30">3월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30">4월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30">5월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30">누계</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-blue-200 bg-blue-500/30 border-r-2 border-white/30">전월비</TableHead>
                        {/* 영업이익 헤더 */}
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">1월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">2월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">3월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">4월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">5월</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">누계</TableHead>
                        <TableHead className="py-5 px-4 text-center font-bold text-emerald-200 bg-emerald-500/30">전월비</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-lg divide-y divide-white/30">
                      {/* 항공 */}
                      <TableRowComponent 
                        divisionId="air" 
                        divisionName="항공" 
                        isSelected={selectedDivision === 'air'} 
                      >
                        {/* 매출 데이터 */}
                        <TableCell className="py-5 px-4 text-center bg-blue-500/20 text-white text-lg">123</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-blue-500/20 text-white text-lg">123</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-blue-500/20 text-white text-lg">123</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-blue-500/20 text-white text-lg">123</TableCell>
                        <TableCell className="py-5 px-4 text-center font-bold bg-blue-500/20 text-white text-lg">123</TableCell>
                        <TableCell className="py-5 px-4 text-center font-bold bg-blue-500/20 text-white text-lg">615</TableCell>
                        <TableCell className="py-5 px-4 text-center border-r-2 border-white/30 bg-blue-500/20 text-white text-lg">0%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-5 px-4 text-center bg-emerald-500/20 text-white text-lg">12</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-emerald-500/20 text-white text-lg">12</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-emerald-500/20 text-white text-lg">12</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-emerald-500/20 text-white text-lg">12</TableCell>
                        <TableCell className="py-5 px-4 text-center font-bold bg-emerald-500/20 text-white text-lg">12</TableCell>
                        <TableCell className="py-5 px-4 text-center font-bold bg-emerald-500/20 text-white text-lg">60</TableCell>
                        <TableCell className="py-5 px-4 text-center bg-emerald-500/20 text-white text-lg">0%</TableCell>
                      </TableRowComponent>
                      {/* 해상 */}
                      <TableRowComponent 
                        divisionId="sea" 
                        divisionName="해상" 
                        isSelected={selectedDivision === 'sea'} 
                      >
                        {/* 매출 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">41</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">40</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">56</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">33</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">33</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">203</TableCell>
                        <TableCell className="py-3 px-3 text-center text-emerald-300 border-r-2 border-white/30 bg-blue-500/20 text-lg">▲1%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-0.7</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-1.0</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.9</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.2</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">0.1</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">0.5</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-emerald-300 text-lg">▲1%</TableCell>
                      </TableRowComponent>
                      {/* 운송 */}
                      <TableRowComponent 
                        divisionId="transport" 
                        divisionName="운송" 
                        isSelected={selectedDivision === 'transport'} 
                      >
                        {/* 매출 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">26</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">27</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">27</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">28</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">26</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">134</TableCell>
                        <TableCell className="py-3 px-3 text-center text-blue-300 border-r-2 border-white/30 bg-blue-500/20 text-lg">▼4%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.5</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.5</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.5</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.5</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">0.5</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">2.5</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-emerald-300 text-lg">0%</TableCell>
                      </TableRowComponent>
                      {/* 창고 */}
                      <TableRowComponent 
                        divisionId="warehouse" 
                        divisionName="창고" 
                        isSelected={selectedDivision === 'warehouse'} 
                      >
                        {/* 매출 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">16</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">16</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">16</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">16</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">16</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">81</TableCell>
                        <TableCell className="py-3 px-3 text-center text-emerald-300 border-r-2 border-white/30 bg-blue-500/20 text-lg">▲3%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-3.4</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-3.3</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-3.4</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-4.2</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold text-red-300 bg-emerald-500/20 text-lg">-1.7</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">-16.1</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 bg-emerald-500/20 text-lg">▲59%</TableCell>
                      </TableRowComponent>
                      {/* 도급 */}
                      <TableRowComponent 
                        divisionId="construction" 
                        divisionName="도급" 
                        isSelected={selectedDivision === 'construction'} 
                      >
                        {/* 매출 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">18</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">17</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">19</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">19</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">20</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">93</TableCell>
                        <TableCell className="py-3 px-3 text-center text-emerald-300 border-r-2 border-white/30 bg-blue-500/20 text-lg">▲5%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.3</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.6</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.6</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">0.7</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">0.6</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">2.8</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-blue-300 text-lg">▼17%</TableCell>
                      </TableRowComponent>
                      {/* 기타 */}
                      <TableRowComponent 
                        divisionId="other" 
                        divisionName="기타" 
                        isSelected={selectedDivision === 'other'} 
                      >
                        {/* 매출 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">9</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">10</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">9</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-blue-500/20 text-white text-lg">11</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">17</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-blue-500/20 text-white text-lg">56</TableCell>
                        <TableCell className="py-3 px-3 text-center text-emerald-300 border-r-2 border-white/30 bg-blue-500/20 text-lg">▲59%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">3.2</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">3.2</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">2.9</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-white text-lg">2.9</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">3.0</TableCell>
                        <TableCell className="py-3 px-3 text-center font-semibold bg-emerald-500/20 text-white text-lg">15.3</TableCell>
                        <TableCell className="py-3 px-3 text-center bg-emerald-500/20 text-emerald-300 text-lg">▲3%</TableCell>
                      </TableRowComponent>
                      {/* 소계 */}
                      <TableRow className="bg-white/25 text-white">
                        <TableCell className="py-3 px-3 text-center font-bold border-r-2 border-white/30">소계</TableCell>
                        {/* 매출 데이터 */}
                        <TableCell className="py-3 px-3 text-center text-white text-lg">175</TableCell>
                        <TableCell className="py-3 px-3 text-center text-white text-lg">165</TableCell>
                        <TableCell className="py-3 px-3 text-center text-white text-lg">195</TableCell>
                        <TableCell className="py-3 px-3 text-center text-white text-lg">211</TableCell>
                        <TableCell className="py-3 px-3 text-center font-bold text-white text-lg">188</TableCell>
                        <TableCell className="py-3 px-3 text-center font-bold text-white text-lg">934</TableCell>
                        <TableCell className="py-3 px-3 text-center border-r-2 border-white/30 text-blue-300 text-lg">▼11%</TableCell>
                        {/* 영업이익 데이터 */}
                        <TableCell className="py-3 px-3 text-center text-red-300 text-lg">-3.0</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 text-lg">-3.2</TableCell>
                        <TableCell className="py-3 px-3 text-center text-white text-lg">0.1</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 text-lg">-2.6</TableCell>
                        <TableCell className="py-3 px-3 text-center font-bold text-white text-lg">0.0</TableCell>
                        <TableCell className="py-3 px-3 text-center text-red-300 text-lg">-8.6</TableCell>
                        <TableCell className="py-3 px-3 text-center text-white text-lg">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
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