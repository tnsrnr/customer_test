'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import CountUp from 'react-countup';
import { generateGridColumns, generateGridHeaders, MonthlyDetailData } from '../types';
import { TrendingUp, TrendingDown, Minus, DollarSign, ShoppingCart, BarChart3, PieChart, Percent } from 'lucide-react';

interface HQPerformanceTableProps {
  data?: MonthlyDetailData[];
  monthLabels?: string[];   // 월 라벨 배열
  loading?: boolean;
  currentYear?: number;
  currentMonth?: number;
}

// 카테고리별 아이콘과 색상 매핑
const getCategoryStyle = (category: string) => {
  switch (category) {
    case '매출':
      return { icon: DollarSign, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' };
    case '매입':
      return { icon: ShoppingCart, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' };
    case '매출이익':
      return { icon: BarChart3, color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' };
    case '판관비':
      return { icon: PieChart, color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' };
    case '영업이익':
      return { icon: TrendingUp, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' };
    case '영업이익율':
      return { icon: Percent, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20' };
    default:
      return { icon: BarChart3, color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/20' };
  }
};

// 성장률에 따른 색상과 아이콘
const getGrowthStyle = (value: string) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return { color: 'text-gray-400', icon: Minus };
  if (numValue > 0) return { color: 'text-green-400', icon: TrendingUp };
  if (numValue < 0) return { color: 'text-red-400', icon: TrendingDown };
  return { color: 'text-gray-400', icon: Minus };
};

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

  // 고정 컬럼명 배열 (9개월 확장, 성장률 제거)
  const fixedColumns = ['column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11'];

  return (
    <div className="overflow-x-auto flex-1">
      <Table className="relative">
        <TableHeader>
          {/* 상단 헤더 행 */}
          <TableRow className="border-b border-white/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            {gridHeaders.topRow.map((header, index) => (
              <TableHead 
                key={index} 
                colSpan={header.colSpan}
                className="text-center border border-white/30 py-2 text-white text-xl font-bold bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm"
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
          
          {/* 하단 컬럼 헤더 행 */}
          <TableRow className="border-b border-white/20 bg-gradient-to-r from-gray-600/20 to-gray-500/20">
            {gridColumns.map((column, index) => (
              <TableHead 
                key={column.key} 
                className="text-center border border-white/30 py-2 text-white text-lg font-bold bg-white/5 backdrop-blur-sm"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => {
            const categoryStyle = getCategoryStyle(item.column1);
            const IconComponent = categoryStyle.icon;
            
            return (
              <TableRow 
                key={index}
                className="hover:bg-white/5 transition-all duration-300 border-b border-white/20"
                style={{ 
                  borderBottom: index === data.length - 1 ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* 고정 컬럼명 기반 월별 데이터 셀 */}
                {fixedColumns.map((columnKey, colIndex) => {
                  const isFirstColumn = columnKey === 'column1';
                  const isDataColumn = !isFirstColumn; // column2~column11
                  
                  return (
                    <TableCell 
                      key={columnKey} 
                      className={`text-center border border-white/30 py-4 text-white text-base transition-all duration-200 ${
                        isFirstColumn ? 'font-semibold' : ''
                      }`}
                    >
                      {isFirstColumn ? (
                        // 구분 컬럼 - 아이콘과 함께 표시
                        <div className="flex items-center justify-center space-x-2">
                          <IconComponent className={`w-4 h-4 ${categoryStyle.color}`} />
                          <span className={categoryStyle.color}>
                            {item[columnKey as keyof MonthlyDetailData] as string}
                          </span>
                        </div>
                      ) : (
                        // 월별 데이터 컬럼 - 원래 깔끔한 스타일
                        <span className="text-white">
                          <CountUp 
                            end={item[columnKey as keyof MonthlyDetailData] as number || 0} 
                            duration={1.5} 
                            separator=","
                            decimals={item.column1 === '영업이익율' ? 2 : 0}
                            className="text-white"
                          />
                          {item.column1 === '영업이익율' && '%'}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
