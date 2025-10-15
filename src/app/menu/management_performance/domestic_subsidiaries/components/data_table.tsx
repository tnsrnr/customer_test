'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { DomesticSubsidiariesData } from '../types';
import { MonthlyDetailData, generateGridColumns, generateGridHeaders } from '../types';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown, Minus, DollarSign, ShoppingCart, BarChart3, PieChart, Percent } from 'lucide-react';

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

// Data Table 메인 컴포넌트
interface DataTableProps {
  data: DomesticSubsidiariesData | null;
  loading: boolean;
  error: string | null;
}

const DataTable: React.FC<DataTableProps> = ({ data, loading, error }) => {

  // 로딩 상태
  if (loading) {
    return (
      <div className="w-[98%] mx-auto">
        <div className="flex items-center justify-center h-32">
          <div className="text-white text-lg">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-[98%] mx-auto">
        <div className="flex items-center justify-center h-32">
          <div className="text-red-400 text-lg">오류: {error}</div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data?.gridData?.monthlyDetails) {
    return (
      <div className="w-[98%] mx-auto">
        <div className="flex items-center justify-center h-32">
          <div className="text-white text-lg">데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  const { monthlyDetails, monthLabels } = data.gridData;

  // 데이터가 없거나 빈 배열인 경우 기본값 반환
  if (!monthlyDetails || monthlyDetails.length === 0) {
    return (
      <div className="w-[98%] mx-auto">
        <div className="flex items-center justify-center h-32">
          <div className="text-white text-lg">표시할 데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  // 동적 컬럼과 헤더 생성
  const gridColumns = generateGridColumns(monthLabels || []);
  const gridHeaders = generateGridHeaders(monthLabels || []);

  // 고정 컬럼명 배열 (column0~column8)
  const fixedColumns = ['column0', 'column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8'];

  return (
    <div className="w-[98%] mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mb-4"
      >
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
            {monthlyDetails.reduce((acc: React.ReactElement[], item: MonthlyDetailData, index: number, array: MonthlyDetailData[]) => {
              const isFirstInGroup = index === 0 || array[index - 1].column0 !== item.column0;
              const rowSpan = array.filter((r, i) => i >= index && r.column0 === item.column0).length;
              const isLastInGroup = index + 1 === array.length || array[index + 1].column0 !== item.column0;
              
              const categoryStyle = getCategoryStyle(item.column1);
              const IconComponent = categoryStyle.icon;
              
              acc.push(
                 <TableRow 
                   key={index} 
                  className="hover:bg-white/5 transition-all duration-300 border-b border-white/20"
                  style={{ 
                    borderBottom: isLastInGroup ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* 고정 컬럼명 기반 월별 데이터 셀 */}
                  {fixedColumns.map((columnKey, colIndex) => {
                    const isCompanyColumn = columnKey === 'column0';
                    const isCategoryColumn = columnKey === 'column1';
                    const isGrowthColumn = columnKey === 'column8';
                    
                    // 법인명 컬럼이고 첫 번째 행이 아닌 경우 셀을 렌더링하지 않음
                    if (isCompanyColumn && !isFirstInGroup) {
                      return null;
                    }
                    
                    return (
                      <TableCell 
                        key={columnKey} 
                        className={`text-center border border-white/30 py-4 text-white text-base transition-all duration-200 ${
                          isCompanyColumn || isCategoryColumn ? 'font-semibold' : ''
                        }`}
                        {...(isCompanyColumn && isFirstInGroup ? { rowSpan } : {})}
                      >
                        {isCompanyColumn ? (
                          // 법인명 컬럼 - 첫 번째 행에서만 렌더링
                          <span className="text-white font-semibold">
                            {item[columnKey as keyof MonthlyDetailData] as string}
                          </span>
                        ) : isCategoryColumn ? (
                          // 구분 컬럼 - 아이콘과 함께 표시
                          <div className="flex items-center justify-center space-x-2">
                            <IconComponent className={`w-4 h-4 ${categoryStyle.color}`} />
                            <span className={categoryStyle.color}>
                              {item[columnKey as keyof MonthlyDetailData] as string}
                            </span>
                          </div>
                        ) : isGrowthColumn ? (
                          // 성장률 컬럼 - 색상과 아이콘으로 표시
                          (() => {
                            const growthValue = item[columnKey as keyof MonthlyDetailData] as string;
                            const growthStyle = getGrowthStyle(growthValue);
                            const GrowthIcon = growthStyle.icon;
                            
                            return (
                              <div className="flex items-center justify-center space-x-1">
                                <GrowthIcon className={`w-4 h-4 ${growthStyle.color}`} />
                                <span className={`font-semibold ${growthStyle.color}`}>
                                  {growthValue}
                                </span>
                              </div>
                            );
                          })()
                        ) : (
                          // 월별 데이터 컬럼 - CountUp으로 표시
                          <span className="text-white">
                            <CountUp 
                              end={Math.round(item[columnKey as keyof MonthlyDetailData] as number || 0)} 
                              duration={1.5} 
                              separator=","
                              className="text-white"
                            />
                          </span>
                        )}
                      </TableCell>
                    );
                  }).filter(Boolean)}
                </TableRow>
              );
              return acc;
            }, [])}
          </TableBody>
        </Table>
      </div>
      </motion.div>
    </div>
  );
};

export default DataTable;
