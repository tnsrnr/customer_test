'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, computeRowSpans } from "@/components/table";
import CountUp from 'react-countup';

interface DivisionData {
  name: string;                    // 회사명/지역명
  q1: number;                     // 1분기
  q2: number;                     // 2분기
  q3: number;                     // 3분기
  q4: number;                     // 4분기
  currentLocal: number;            // 현재월 현지인
  currentKorean: number;           // 현재월 한국인
  previousMonth: number;           // 소계 전월
  currentMonth: number;            // 소계 현재월
  change: number;                  // 전월대비 변화
  groupCategory: string;           // 구분 컬럼에 표시할 그룹 (국내/해외)
}

interface PersonnelTableProps {
  data?: DivisionData[];
  loading?: boolean;
  currentYear?: number;
  currentMonth?: number;
}

export function PersonnelTable({ data, loading, currentYear, currentMonth }: PersonnelTableProps) {
  useEffect(() => {
    console.log('PersonnelTable mounted');
  }, []);

  useEffect(() => {
    console.log('🔍 PersonnelTable 데이터:', data);
    console.log('🔍 PersonnelTable 로딩 상태:', loading);
    if (data) {
      console.log('🔍 PersonnelTable 데이터 개수:', data.length);
      console.log('🔍 PersonnelTable 첫 번째 항목:', data[0]);
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

  const rowSpans = computeRowSpans<DivisionData>(data, (row) => row.groupCategory);

  return (
    <div className="overflow-x-auto flex-1">
      <Table>
        <TableHeader>
          {/* 상위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead 
              className="text-white font-bold text-lg text-center align-middle border-r border-white/20 py-3"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
              colSpan={2}
            >
              구분
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-3"
              colSpan={4}
            >
              {currentYear}년
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-3"
              colSpan={2}
            >
              현재월
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md border-r border-white/20 py-3"
              colSpan={2}
            >
              소계
            </TableHead>
            <TableHead 
              className="text-white font-bold text-lg text-center bg-white/5 backdrop-blur-md py-3"
            >
              전월대비
            </TableHead>
          </TableRow>
          {/* 하위 헤더 행 */}
          <TableRow className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              국외구분 
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              법인
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              1분기
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              2분기
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              3분기
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              4분기
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              현지인
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              한국인
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              전월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center border-r border-white/20 py-3">
              현재월
            </TableHead>
            <TableHead className="text-white font-bold text-base text-center py-3">
              변화
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((division, index) => (
            <TableRow 
              key={division.name}
              className={`hover:bg-white/5 transition-colors duration-200 border-b border-white/20 ${
                division.name === '소계' || division.name === '총계' ? 'bg-white/10 font-bold' : ''
              }`}
            >
              {/* 국외구분: 같은 값 연속 시 첫 행만 출력 + rowSpan 적용. 다른 컬럼에는 영향 없음 */}
              {rowSpans[index] > 0 && (
                <TableCell 
                  className="text-white font-semibold text-base text-center border-r border-white/20 py-3"
                  rowSpan={rowSpans[index]}
                  style={{ verticalAlign: 'middle' }}
                >
                  {division.groupCategory}
                </TableCell>
              )}

              <TableCell className="text-white font-semibold text-base text-center border-r border-white/20 py-3">
                {division.name}
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.q1} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.q2} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.q3} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.q4} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.currentLocal} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.currentKorean} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.previousMonth} 
                  duration={1.5}
                  separator=","
                  className="text-white"
                />
              </TableCell>
              <TableCell className="text-white text-base text-center border-r border-white/20 py-3">
                <CountUp 
                  end={division.currentMonth} 
                  duration={1.5}
                  separator=","
                  className="text-white font-semibold"
                />
              </TableCell>
              <TableCell className="text-base text-center py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  division.change > 0 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : division.change < 0 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {division.change > 0 ? '▲' : division.change < 0 ? '▼' : ''} {Math.abs(division.change)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 