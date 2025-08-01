'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";

interface DivisionData {
  name: string;                    // DIVISION
  plannedSales: number;            // PLANNED_SALES (억원)
  plannedOpProfit: number;         // PLANNED_OP_PROFIT (억원)
  plannedOpMargin: number;         // PLANNED_OP_MARGIN (%)
  actualSales: number;             // ACTUAL_SALES (억원)
  actualOpProfit: number;          // ACTUAL_OP_PROFIT (억원)
  actualOpMargin: number;          // ACTUAL_OP_MARGIN (%)
  salesAchievement: number;        // SALES_ACHIEVEMENT (%)
  opProfitAchievement: number;     // OP_PROFIT_ACHIEVEMENT (%)
}

interface PerformanceTableProps {
  data?: DivisionData[];
  loading?: boolean;
}

export function PerformanceTable({ data, loading }: PerformanceTableProps) {
  useEffect(() => {
    console.log('PerformanceTable mounted');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white">테이블 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="text-white">데이터가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto flex-1">
      <Table>
        <TableHeader>
          {/* 상위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead 
              className="text-white font-bold text-2xl text-center align-middle border-r border-white/20 py-4"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
            >
              구분
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
              colSpan={3}
            >
              계획 ('25년 5월 누적)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
              colSpan={3}
            >
              실적 ('25년 5월 누적)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md py-4"
              colSpan={2}
            >
              달성율 (계획 比)
            </TableHead>
          </TableRow>
          {/* 하위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              구분
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              영업이익
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              영업이익율
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              영업이익
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              영업이익율
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center py-4">
              영업이익
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((division, index) => (
            <TableRow 
              key={division.name}
              className={`hover:bg-white/5 transition-colors duration-200 border-b border-white/20 ${
                division.name === '합계' ? 'bg-white/10 font-bold' : ''
              }`}
            >
              <TableCell className="text-white font-semibold text-xl text-center border-r border-white/20 py-4">
                {division.name}
              </TableCell>
              {/* 계획 데이터 */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4">
                {division.plannedSales.toLocaleString()}
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.plannedOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.plannedOpProfit >= 0 ? '+' : ''}{division.plannedOpProfit}
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.plannedOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.plannedOpMargin >= 0 ? '+' : ''}{division.plannedOpMargin}%
              </TableCell>
              {/* 실적 데이터 */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4">
                {division.actualSales.toLocaleString()}
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.actualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.actualOpProfit >= 0 ? '+' : ''}{division.actualOpProfit}
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.actualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.actualOpMargin >= 0 ? '+' : ''}{division.actualOpMargin}%
              </TableCell>
              {/* 달성율 데이터 */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4">
                {division.salesAchievement}%
              </TableCell>
              <TableCell className="text-white text-xl text-center py-4">
                {division.opProfitAchievement}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 