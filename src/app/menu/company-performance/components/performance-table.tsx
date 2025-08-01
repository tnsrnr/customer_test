'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";

interface DivisionData {
  name: string;
  revenue: number;
  profit: number;
  margin: number;
  growth: number;
  change: number;
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
              부문
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
            >
              매출 (억원)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
            >
              영업이익 (억원)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
            >
              이익률 (%)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-4"
            >
              성장률 (%)
            </TableHead>
            <TableHead 
              className="text-white font-bold text-2xl text-center bg-white/5 backdrop-blur-md py-4"
            >
              변화율 (%)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((division, index) => (
            <TableRow 
              key={division.name}
              className="hover:bg-white/5 transition-colors duration-200 border-b border-white/20"
            >
              <TableCell className="text-white font-semibold text-xl text-center border-r border-white/20 py-4">
                {division.name}
              </TableCell>
              <TableCell className="text-white text-xl text-center border-r border-white/20 py-4">
                {division.revenue.toLocaleString()}
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.profit >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.profit >= 0 ? '+' : ''}{division.profit}
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.margin >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.margin >= 0 ? '+' : ''}{division.margin}%
              </TableCell>
              <TableCell className={`text-xl text-center border-r border-white/20 py-4 ${
                division.growth >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.growth >= 0 ? '+' : ''}{division.growth}%
              </TableCell>
              <TableCell className={`text-xl text-center py-4 ${
                division.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {division.change >= 0 ? '+' : ''}{division.change}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 