'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import CountUp from 'react-countup';
import { generateGridColumns, generateGridHeaders, MonthlyDetailData } from '../types';

interface HQPerformanceTableProps {
  data?: MonthlyDetailData[];
  monthLabels?: string[];   // 월 라벨 배열
  loading?: boolean;
  currentYear?: number;
  currentMonth?: number;
}

export function HQPerformanceTable({ 
  data, 
  monthLabels = [], 
  loading, 
  currentYear, 
  currentMonth 
}: HQPerformanceTableProps) {

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

  // 동적 컬럼과 헤더 생성
  const gridColumns = generateGridColumns(monthLabels);
  const gridHeaders = generateGridHeaders(monthLabels);

  // 고정 컬럼명 배열
  const fixedColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8'];

  return (
    <div className="overflow-x-auto flex-1">
      <Table>
        <TableHeader>
          {/* 상단 헤더 행 */}
          <TableRow className="border-b border-white/20">
            {gridHeaders.topRow.map((header, index) => (
              <TableHead 
                key={index} 
                colSpan={header.colSpan}
                className="text-center border border-white/20 py-3 text-white text-base font-semibold bg-white/5"
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
          
          {/* 하단 컬럼 헤더 행 */}
          <TableRow className="border-b border-white/20">
            {gridColumns.map((column, index) => (
              <TableHead 
                key={column.key} 
                className="text-center border border-white/20 py-3 text-white text-base font-semibold bg-white/5"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={index}
              className="hover:bg-white/5 transition-colors duration-200 border-b border-white/20"
              style={{ borderBottom: index === data.length - 1 ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              {/* 고정 컬럼명 기반 월별 데이터 셀 */}
              {fixedColumns.map((columnKey) => (
                <TableCell key={columnKey} className="text-center border border-white/20 py-3 text-white text-base">
                  {columnKey === 'column1' || columnKey === 'column8' ? (
                    // column1(구분)과 column8(성장률)은 문자열로 표시
                    <span className="text-white">
                      {item[columnKey as keyof MonthlyDetailData] as string}
                    </span>
                  ) : (
                    // 나머지 컬럼은 숫자로 CountUp 표시
                    <CountUp 
                      end={item[columnKey as keyof MonthlyDetailData] as number || 0} 
                      duration={1.5} separator=","
                      decimals={item.column1 === '영업이익율' ? 2 : 0}
                      className="text-white"
                    />
                  )}
                  {item.column1 === '영업이익율' && columnKey !== 'column1' && columnKey !== 'column8' && '%'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
