'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import CountUp from 'react-countup';

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
  periodType?: 'monthly' | 'cumulative';
  currentYear?: number;
  currentMonth?: number;
}

export function PerformanceTable({ data, loading, periodType, currentYear, currentMonth }: PerformanceTableProps) {
  useEffect(() => {
    console.log('PerformanceTable mounted');
  }, []);

  useEffect(() => {
    console.log('🔍 PerformanceTable 데이터:', data);
    console.log('🔍 PerformanceTable 로딩 상태:', loading);
    if (data) {
      console.log('🔍 PerformanceTable 데이터 개수:', data.length);
      console.log('🔍 PerformanceTable 첫 번째 항목:', data[0]);
    }
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
              계획 ('{currentYear}년 {periodType === 'cumulative' ? `1~${currentMonth}월 누적` : `${currentMonth}월`})
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
              colSpan={3}
            >
              실적 ('{currentYear}년 {periodType === 'cumulative' ? `1~${currentMonth}월 누적` : `${currentMonth}월`})
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
                <CountUp 
                  end={division.plannedSales} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  className="text-white"
                />
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.plannedOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <CountUp 
                  end={division.plannedOpProfit} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  prefix={division.plannedOpProfit >= 0 ? '+' : ''}
                  className={division.plannedOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}
                />
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.plannedOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <CountUp 
                  end={division.plannedOpMargin} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  prefix={division.plannedOpMargin >= 0 ? '+' : ''}
                  suffix="%"
                  className={division.plannedOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}
                />
              </TableCell>
              {/* 실적 데이터 */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4">
                <CountUp 
                  end={division.actualSales} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  className="text-white"
                />
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.actualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <CountUp 
                  end={division.actualOpProfit} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  prefix={division.actualOpProfit >= 0 ? '+' : ''}
                  className={division.actualOpProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}
                />
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.actualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                <CountUp 
                  end={division.actualOpMargin} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  prefix={division.actualOpMargin >= 0 ? '+' : ''}
                  suffix="%"
                  className={division.actualOpMargin >= 0 ? 'text-emerald-400' : 'text-red-400'}
                />
              </TableCell>
              {/* 달성율 데이터 */}
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4">
                <CountUp 
                  end={division.salesAchievement} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  suffix="%"
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-xl text-center py-4">
                <CountUp 
                  end={division.opProfitAchievement} 
                  duration={1.5}
                  separator=","
                  decimal="."
                  suffix="%"
                  className="text-white"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 