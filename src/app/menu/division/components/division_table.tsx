'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DIVISION_HEADERS } from '../types';
import CountUp from 'react-countup';

interface DivisionTableProps {
  data?: {
    months: string[];
    divisions: Array<{
      name: string;
      color: string;
      revenue: number[];
      profit: number[];
    }>;
  };
  loading?: boolean;
}

export function DivisionTable({ data, loading }: DivisionTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white">테이블 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (!data || data.divisions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <span className="text-white">데이터가 없습니다.</span>
      </div>
    );
  }

  // 색상 매핑 함수
  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-200',
        border: 'border-blue-400/30'
      },
      emerald: {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-200',
        border: 'border-emerald-400/30'
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-200',
        border: 'border-purple-400/30'
      },
      orange: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-200',
        border: 'border-orange-400/30'
      },
      pink: {
        bg: 'bg-pink-500/20',
        text: 'text-pink-200',
        border: 'border-pink-400/30'
      },
      cyan: {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-200',
        border: 'border-cyan-400/30'
      }
    };
    return colorMap[color]?.[type] || '';
  };

  // 헤더 색상 매핑 함수
  const getHeaderColorClasses = (color: string, type: 'bg' | 'text') => {
    const colorMap: { [key: string]: { [key: string]: string } } = {
      blue: {
        bg: 'bg-blue-500/30',
        text: 'text-blue-200'
      },
      emerald: {
        bg: 'bg-emerald-500/30',
        text: 'text-emerald-200'
      },
      purple: {
        bg: 'bg-purple-500/30',
        text: 'text-purple-200'
      },
      orange: {
        bg: 'bg-orange-500/30',
        text: 'text-orange-200'
      },
      pink: {
        bg: 'bg-pink-500/30',
        text: 'text-pink-200'
      },
      cyan: {
        bg: 'bg-cyan-500/30',
        text: 'text-cyan-200'
      }
    };
    return colorMap[color]?.[type] || '';
  };

  return (
    <div className="overflow-x-auto flex-1 overflow-y-auto">
      <Table className="border border-white/30">
        <TableHeader>
          {/* 첫 번째 헤더 행 - 부문별 헤더 */}
          <TableRow className="text-lg border-b border-white/30">
            {DIVISION_HEADERS.topRow.map((header, index) => (
              <TableHead 
                key={header.key}
                className={`py-3 px-2 text-center font-bold text-white border-r border-white/30 ${
                  index === 0 
                    ? 'bg-white/20' 
                    : header.color 
                      ? `${getHeaderColorClasses(header.color, 'bg')} ${getHeaderColorClasses(header.color, 'text')}`
                      : 'bg-white/20'
                }`}
                colSpan={header.colSpan}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
          {/* 두 번째 헤더 행 - 매출/영업이익 구분 */}
          <TableRow className="text-base border-b border-white/30">
            {DIVISION_HEADERS.bottomRow.map((header, index) => (
              <TableHead 
                key={header.key}
                className={`py-2 px-2 text-center font-semibold border-r border-white/30 ${
                  index === 0 
                    ? 'text-white bg-white/20' 
                    : header.color 
                      ? `${getColorClasses(header.color, 'bg')} ${getColorClasses(header.color, 'text')}`
                      : 'text-white bg-white/20'
                }`}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-lg">
          {data.months.map((month, monthIndex) => (
            <TableRow 
              key={month}
              className="hover:bg-white/10 transition-all duration-300 border-b border-white/30"
            >
              {/* 월별 헤더 */}
                              <TableCell className="py-3 px-2 text-center font-bold text-white border-r border-white/30 bg-white/10">
                {month}
              </TableCell>
              
              {/* 항공 매출 */}
                                <TableCell className={`py-3 px-2 text-center ${getColorClasses('blue', 'bg')} text-white border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[0].revenue[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={0}
                  className="text-white"
                />
              </TableCell>
              {/* 항공 영업이익 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('blue', 'bg')} ${
                data.divisions[0].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'
              } border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[0].profit[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={1}
                  className={data.divisions[0].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'}
                />
              </TableCell>
              
              {/* 해상 매출 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('emerald', 'bg')} text-white border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[1].revenue[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={0}
                  className="text-white"
                />
              </TableCell>
              {/* 해상 영업이익 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('emerald', 'bg')} ${
                data.divisions[1].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'
              } border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[1].profit[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={1}
                  className={data.divisions[1].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'}
                />
              </TableCell>
              
              {/* 운송 매출 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('purple', 'bg')} text-white border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[2].revenue[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={0}
                  className="text-white"
                />
              </TableCell>
              {/* 운송 영업이익 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('purple', 'bg')} ${
                data.divisions[2].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'
              } border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[2].profit[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={1}
                  className={data.divisions[2].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'}
                />
              </TableCell>
              
              {/* 창고 매출 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('orange', 'bg')} text-white border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[3].revenue[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={0}
                  className="text-white"
                />
              </TableCell>
              {/* 창고 영업이익 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('orange', 'bg')} ${
                data.divisions[3].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'
              } border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[3].profit[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={1}
                  className={data.divisions[3].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'}
                />
              </TableCell>
              
              {/* 도급 매출 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('pink', 'bg')} text-white border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[4].revenue[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={0}
                  className="text-white"
                />
              </TableCell>
              {/* 도급 영업이익 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('pink', 'bg')} ${
                data.divisions[4].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'
              } border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[4].profit[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={1}
                  className={data.divisions[4].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'}
                />
              </TableCell>
              
              {/* 기타 매출 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('cyan', 'bg')} text-white border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[5].revenue[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={0}
                  className="text-white"
                />
              </TableCell>
              {/* 기타 영업이익 */}
              <TableCell className={`py-3 px-2 text-center ${getColorClasses('cyan', 'bg')} ${
                data.divisions[5].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'
              } border-r border-white/30`}>
                <CountUp 
                  end={data.divisions[5].profit[monthIndex]} 
                  duration={1.5}
                  separator=","
                  decimals={1}
                  className={data.divisions[5].profit[monthIndex] >= 0 ? 'text-white' : 'text-red-300'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
