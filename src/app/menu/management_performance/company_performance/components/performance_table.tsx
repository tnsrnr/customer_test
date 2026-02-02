'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import CountUp from 'react-countup';

interface DivisionData {
  name: string;                         // DIVISION
  prevActualSales: number;              // PREV_ACTUAL_SALES (억원)
  prevActualOpProfit: number;          // PREV_ACTUAL_OP_PROFIT (억원)
  prevActualOpMargin: number;          // PREV_ACTUAL_OP_MARGIN (%)
  actualSales: number;                  // ACTUAL_SALES (억원)
  actualOpProfit: number;              // ACTUAL_OP_PROFIT (억원)
  actualOpMargin: number;              // ACTUAL_OP_MARGIN (%)
  yoySalesIncrease: number;            // YOY_SALES_INCREASE (억원)
  yoyOperatingProfitIncrease: number;  // YOY_OPERATING_PROFIT_INCREASE (억원)
}

interface PerformanceTableProps {
  data?: DivisionData[];
  loading?: boolean;
  yearType?: 'planned' | 'previous';
  currentYear?: number;
  currentMonth?: number;
  kpiMetrics?: {
    ACTUAL_SALES: number;
    ACTUAL_OP_PROFIT: number;
    ACTUAL_SALES_CHANGE: number;
    ACTUAL_OP_PROFIT_CHANGE: number;
  };
}

export function PerformanceTable({ data, loading, yearType = 'planned', currentYear, currentMonth, kpiMetrics }: PerformanceTableProps) {
  useEffect(() => {
    // PerformanceTable mounted
  }, []);

  useEffect(() => {
    // PerformanceTable data and loading state
  }, [data, loading]);

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
              className="text-white font-bold text-2xl text-center align-middle border-r-2 border-white/40 py-4"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
            >
              구분
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center backdrop-blur-md border-r-4 border-blue-400/50 py-4"
              colSpan={3}
              style={{ 
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                backdropFilter: 'blur(12px)'
              }}
            >
              직전년도({(currentYear || new Date().getFullYear()) - 1}년 1~{currentMonth || 1}월 누적)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center backdrop-blur-md border-r-4 border-emerald-400/50 py-4"
              colSpan={3}
              style={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(12px)'
              }}
            >
              실적 ({currentYear || new Date().getFullYear()}년 1~{currentMonth || 1}월 누적)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center backdrop-blur-md py-4"
              colSpan={2}
              style={{ 
                backgroundColor: 'rgba(251, 146, 60, 0.15)',
                backdropFilter: 'blur(12px)'
              }}
            >
              전년대비
            </TableHead>
          </TableRow>
          {/* 하위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead className="text-white font-bold text-xl text-center border-r-2 border-white/40 py-4">
              구분
            </TableHead>
            {/* 직전년도: PREV_ACTUAL_SALES, PREV_ACTUAL_OP_PROFIT, PREV_ACTUAL_OP_MARGIN */}
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4 bg-blue-500/10">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4 bg-blue-500/10">
              영업이익
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r-4 border-blue-400/50 py-4 bg-blue-500/10">
              영업이익율
            </TableHead>
            {/* 실적: ACTUAL_SALES, ACTUAL_OP_PROFIT, ACTUAL_OP_MARGIN */}
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4 bg-emerald-500/10">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4 bg-emerald-500/10">
              영업이익
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center border-r-4 border-emerald-400/50 py-4 bg-emerald-500/10">
              영업이익율
            </TableHead>
            {/* 전년대비: YOY_SALES_INCREASE, YOY_OPERATING_PROFIT_INCREASE */}
            <TableHead className="text-white font-bold text-xl text-center border-r border-white/20 py-4 bg-orange-500/10">
              매출
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center py-4 bg-orange-500/10">
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
              <TableCell className="text-white font-semibold text-xl text-center border-r-2 border-white/40 py-4">
                {division.name}
              </TableCell>
              {/* 직전년도: PREV_ACTUAL_SALES, PREV_ACTUAL_OP_PROFIT, PREV_ACTUAL_OP_MARGIN */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4 bg-blue-500/5">
                <CountUp end={division.prevActualSales} duration={1.5} separator="," decimal="." className="text-white" />
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 bg-blue-500/5 ${division.prevActualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <CountUp end={division.prevActualOpProfit} duration={1.5} separator="," decimal="." prefix={division.prevActualOpProfit >= 0 ? '+' : ''} className={division.prevActualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </TableCell>
              <TableCell className={`text-xl text-center border-r-4 border-blue-400/50 py-4 bg-blue-500/5 ${division.prevActualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <CountUp end={division.prevActualOpMargin} duration={1.5} separator="," decimals={1} decimal="." prefix={division.prevActualOpMargin >= 0 ? '+' : ''} suffix="%" className={division.prevActualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </TableCell>
              {/* 실적: ACTUAL_SALES, ACTUAL_OP_PROFIT, ACTUAL_OP_MARGIN */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4 bg-emerald-500/5">
                <CountUp end={division.actualSales} duration={1.5} separator="," decimal="." className="text-white" />
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 bg-emerald-500/5 ${division.actualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <CountUp end={division.actualOpProfit} duration={1.5} separator="," decimal="." prefix={division.actualOpProfit >= 0 ? '+' : ''} className={division.actualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </TableCell>
              <TableCell className={`text-xl text-center border-r-4 border-emerald-400/50 py-4 bg-emerald-500/5 ${division.actualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <CountUp end={division.actualOpMargin} duration={1.5} separator="," decimals={1} decimal="." prefix={division.actualOpMargin >= 0 ? '+' : ''} suffix="%" className={division.actualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </TableCell>
              {/* 전년대비: YOY_SALES_INCREASE, YOY_OPERATING_PROFIT_INCREASE */}
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 bg-orange-500/5 ${division.yoySalesIncrease >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <CountUp end={division.yoySalesIncrease} duration={1.5} separator="," decimal="." prefix={division.yoySalesIncrease >= 0 ? '+' : ''} className={division.yoySalesIncrease >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </TableCell>
              <TableCell className={`text-xl text-center py-4 bg-orange-500/5 ${division.yoyOperatingProfitIncrease >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <CountUp end={division.yoyOperatingProfitIncrease} duration={1.5} separator="," decimal="." prefix={division.yoyOperatingProfitIncrease >= 0 ? '+' : ''} className={division.yoyOperatingProfitIncrease >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 