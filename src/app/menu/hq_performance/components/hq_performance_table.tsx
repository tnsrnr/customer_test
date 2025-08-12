'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import CountUp from 'react-countup';

interface MonthlyDetailData {
  category: string;          // 항목명
  jan: number;              // 1월
  feb: number;              // 2월
  mar: number;              // 3월
  apr: number;              // 4월
  may: number;              // 5월
  total: number;            // 합계
  growth: string;           // 성장률
}

interface HQPerformanceTableProps {
  data?: MonthlyDetailData[];
  loading?: boolean;
  currentYear?: number;
  currentMonth?: number;
}

export function HQPerformanceTable({ data, loading, currentYear, currentMonth }: HQPerformanceTableProps) {

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
              className="text-white font-bold text-lg text-center align-middle border border-white/20 py-3"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
              colSpan={1}
            >
              항목
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md border border-white/20 py-3"
              colSpan={5}
            >
              {currentYear}년 월별
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md border border-white/20 py-3"
              colSpan={1}
            >
              합계
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md border border-white/20 py-3"
            >
              성장률
            </TableHead>
          </TableRow>
          {/* 하위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              구분
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              1월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              2월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              3월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              4월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              5월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              합계
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border border-white/20 py-3">
              성장률
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={item.category}
              className="hover:bg-white/5 transition-colors duration-200 border-b border-white/20"
              style={{ borderBottom: index === data.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <TableCell className="font-semibold text-center border border-white/20 py-3 text-white text-base">
                {item.category}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-white text-base">
                <CountUp 
                  end={item.jan} 
                  duration={1.5}
                  separator=","
                  decimals={item.category === '영업이익율' ? 2 : 0}
                  className="text-white"
                />
                {item.category === '영업이익율' && '%'}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-white text-base">
                <CountUp 
                  end={item.feb} 
                  duration={1.5}
                  separator=","
                  decimals={item.category === '영업이익율' ? 2 : 0}
                  className="text-white"
                />
                {item.category === '영업이익율' && '%'}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-white text-base">
                <CountUp 
                  end={item.mar} 
                  duration={1.5}
                  separator=","
                  decimals={item.category === '영업이익율' ? 2 : 0}
                  className="text-white"
                />
                {item.category === '영업이익율' && '%'}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-white text-base">
                <CountUp 
                  end={item.apr} 
                  duration={1.5}
                  separator=","
                  decimals={item.category === '영업이익율' ? 2 : 0}
                  className="text-white"
                />
                {item.category === '영업이익율' && '%'}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-white text-base">
                <CountUp 
                  end={item.may} 
                  duration={1.5}
                  separator=","
                  decimals={item.category === '영업이익율' ? 2 : 0}
                  className="text-white"
                />
                {item.category === '영업이익율' && '%'}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-white text-base">
                <CountUp 
                  end={item.total} 
                  duration={1.5}
                  separator=","
                  decimals={item.category === '영업이익율' ? 2 : 0}
                  className="text-white font-semibold"
                />
                {item.category === '영업이익율' && '%'}
              </TableCell>
              <TableCell className="text-center border border-white/20 py-3 text-base">
                <span className={`px-2 py-1 rounded-full font-medium text-xs ${
                  item.growth.includes('▲') 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : item.growth.includes('▼') 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {item.growth}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
