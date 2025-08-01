'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";

interface PerformanceData {
  구분: string;
  계획_매출액: number;
  계획_영업이익: number;
  계획_영업이익율: string;
  실적_매출액: number;
  실적_영업이익: number;
  실적_영업이익율: string;
  달성율_매출액: string;
  달성율_영업이익: string;
}

const data: PerformanceData[] = [
  {
    구분: '본사',
    계획_매출액: 1095,
    계획_영업이익: 37,
    계획_영업이익율: '3.4%',
    실적_매출액: 934,
    실적_영업이익: -9,
    실적_영업이익율: '-0.9%',
    달성율_매출액: '85%',
    달성율_영업이익: '적자'
  },
  {
    구분: '국내자회사',
    계획_매출액: 360,
    계획_영업이익: 11,
    계획_영업이익율: '3.1%',
    실적_매출액: 294,
    실적_영업이익: 3,
    실적_영업이익율: '0.9%',
    달성율_매출액: '82%',
    달성율_영업이익: '24%'
  },
  {
    구분: '해외자회사',
    계획_매출액: 2131,
    계획_영업이익: 46,
    계획_영업이익율: '2.1%',
    실적_매출액: 1392,
    실적_영업이익: 32,
    실적_영업이익율: '2.3%',
    달성율_매출액: '65%',
    달성율_영업이익: '70%'
  },
  {
    구분: '합계',
    계획_매출액: 3586,
    계획_영업이익: 94,
    계획_영업이익율: '2.6%',
    실적_매출액: 2619,
    실적_영업이익: 26,
    실적_영업이익율: '1.0%',
    달성율_매출액: '73%',
    달성율_영업이익: '28%'
  }
];

export function PerformanceTable() {
  useEffect(() => {
    console.log('PerformanceTable mounted');
  }, []);

  return (
    <div className="overflow-x-auto flex-1">
      <Table>
        <TableHeader>
          {/* 상위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead 
              className="text-white font-bold text-xl text-center align-middle border-r border-white/20"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
            >
              구분
            </TableHead>
            <TableHead 
              colSpan={3} 
              className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20"
            >
              계획
            </TableHead>
            <TableHead 
              colSpan={3} 
              className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20"
            >
              실적
            </TableHead>
            <TableHead 
              colSpan={2} 
              className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md"
            >
              달성율
            </TableHead>
          </TableRow>
          
          {/* 하위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/25">
            <TableHead 
              className="text-white font-bold text-xl text-center border-r border-white/20"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
            >
              구분
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              영업이익
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              영업이익율
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              영업이익
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              영업이익율
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md border-r border-white/20">
              매출액
            </TableHead>
            <TableHead className="text-white font-bold text-xl text-center bg-white/5 backdrop-blur-md">
              영업이익
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const colors = [
              'bg-blue-50/80 border-blue-200 text-blue-900 border-l-blue-500',
              'bg-slate-50/80 border-slate-200 text-slate-700 border-l-slate-500',
              'bg-amber-50/80 border-amber-200 text-amber-800 border-l-amber-500',
              'bg-green-50/80 border-green-200 text-green-800 border-l-green-500',
            ];
            const color = colors[index % colors.length];
            return (
              <TableRow 
                key={row.구분}
                className={`overflow-hidden backdrop-blur-sm border-l-4 ${color} transition-all duration-200`}
              >
                <TableCell className="py-4 border-r border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-400">#{index + 1}</span>
                    <span className={`text-base font-semibold ${color.split(' ')[2]}`}>{row.구분}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-200">
                  <span className={`text-2xl font-bold ${color.split(' ')[2]}`}>{row.계획_매출액.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-1">억원</span>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-200">
                  <span className={`text-lg font-semibold text-blue-700`}>{row.계획_영업이익.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-1">억원</span>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-300">
                  <span className="text-base font-bold text-blue-600">{row.계획_영업이익율}</span>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-200">
                  <span className={`text-2xl font-bold ${color.split(' ')[2]}`}>{row.실적_매출액.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-1">억원</span>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-200">
                  <span className={`text-lg font-semibold ${row.실적_영업이익 < 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {row.실적_영업이익.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">억원</span>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-300">
                  <span className={`text-base font-bold ${row.실적_영업이익율.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                    {row.실적_영업이익율}
                  </span>
                </TableCell>
                <TableCell className="text-center py-4 border-r border-slate-200">
                  <span className="text-base font-bold text-blue-700">{row.달성율_매출액}</span>
                </TableCell>
                <TableCell className="text-center py-4">
                  <span className="text-base font-bold text-purple-700">{row.달성율_영업이익}</span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 