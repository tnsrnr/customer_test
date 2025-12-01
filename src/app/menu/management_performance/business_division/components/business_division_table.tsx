'use client';

import { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, computeRowSpans } from "@/common/components/ui/table";
import CountUp from 'react-countup';
import { Triangle } from 'lucide-react';

interface DivisionData {
  team_name: string;             // 팀명
  account_name: string;          // 계정명
  year2025: number;              // 2025년 값
  year2024: number;              // 2024년 값
  yoyAmount: number;             // 전년비 금액
  yoyPercent: number;            // 전년비%
  groupCategory: string;         // 구분 컬럼에 표시할 그룹
}

interface BusinessDivisionTableProps {
  data?: DivisionData[];
  loading?: boolean;
  currentYear?: number;
  currentMonth?: number;
}

export function BusinessDivisionTable({ data, loading, currentYear, currentMonth }: BusinessDivisionTableProps) {

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

  // 팀별로 그룹화하여 rowSpan 계산
  const rowSpans = computeRowSpans<DivisionData>(data, (row) => row.team_name);

  // 숫자 포맷팅 함수 (원 단위)
  const formatNumber = (value: number) => {
    if (value === 0) return '0';
    return value.toLocaleString('ko-KR');
  };

  // 음수 표시 함수 (- 기호와 빨간색)
  const formatValue = (value: number, isPercent: boolean = false) => {
    if (value < 0) {
      return `-${formatNumber(Math.abs(value))}${isPercent ? '%' : ''}`;
    }
    return `${formatNumber(value)}${isPercent ? '%' : ''}`;
  };

  return (
    <div className="flex flex-col flex-1 max-h-[calc(100vh-100px)] overflow-auto">
      <div className="relative w-full">
        <table className="w-full caption-bottom text-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead className="sticky top-0 z-50 bg-slate-900">
            <tr className="bg-white/5 backdrop-blur-md border-b-2 border-white/30">
              <th className="text-white font-bold text-base text-center border-r border-white/20 px-2 py-1 bg-white/5 backdrop-blur-md">
                구분
              </th>
              <th className="text-white font-bold text-base text-center border-r border-white/20 px-2 py-1 bg-white/5 backdrop-blur-md">
                팀
              </th>
              <th className="text-white font-bold text-base text-center border-r border-white/20 px-2 py-1 bg-white/5 backdrop-blur-md">
                계정명
              </th>
              <th className="text-white font-bold text-base text-center border-r border-white/20 px-2 py-1 bg-white/5 backdrop-blur-md">
                2025
              </th>
              <th className="text-white font-bold text-base text-center border-r border-white/20 px-2 py-1 bg-white/5 backdrop-blur-md">
                2024
              </th>
              <th className="text-white font-bold text-base text-center border-r border-white/20 px-2 py-1 bg-white/5 backdrop-blur-md">
                전년비 금액
              </th>
              <th className="text-white font-bold text-base text-center px-2 py-1 bg-white/5 backdrop-blur-md">
                전년비%
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
          {data.map((division, index) => {
            const isNegative2025 = division.year2025 < 0;
            const isNegative2024 = division.year2024 < 0;
            const isNegativeYoyAmount = division.yoyAmount < 0;
            const isNegativeYoyPercent = division.yoyPercent < 0;
            const isTotal = division.team_name === '총합계';
            
            // 다음 행의 팀명이 다르면 구분선 추가 (총합계 제외)
            const isLastRowOfTeam = index < data.length - 1 && 
              data[index + 1].team_name !== division.team_name && 
              division.team_name !== '총합계';
            
            return (
              <>
                <tr 
                  key={`${division.team_name}-${division.account_name}-${index}`}
                  className={`hover:bg-white/5 transition-colors duration-200 border-b border-white/20 ${
                    isTotal ? 'bg-gradient-to-r from-blue-700/40 to-purple-700/40 font-bold border-t-2 border-b-2 border-blue-300/60 shadow-lg' : ''
                  }`}
                >
                {/* 구분: 같은 팀명 연속 시 첫 행만 출력 + rowSpan 적용 + 아이콘 표시 */}
                {rowSpans[index] > 0 && (
                  <td 
                    className="text-white font-semibold text-base text-center border-r border-white/20 px-2 py-1"
                    rowSpan={rowSpans[index]}
                    style={{ verticalAlign: 'middle' }}
                  >
                    <div className="flex items-center justify-center">
                      {division.yoyAmount > 0 ? (
                        <Triangle className="w-5 h-5 text-red-500 fill-red-500" />
                      ) : division.yoyAmount < 0 ? (
                        <Triangle className="w-5 h-5 text-blue-500 fill-blue-500 rotate-180" />
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                  </td>
                )}

                {/* 팀명: 같은 팀명 연속 시 첫 행만 출력 + rowSpan 적용 */}
                {rowSpans[index] > 0 && (
                  <td 
                    className={`font-semibold text-center border-r border-white/20 px-2 py-1 ${
                      isTotal ? 'text-blue-200 text-lg font-bold' : 'text-white text-base'
                    }`}
                    rowSpan={rowSpans[index]}
                    style={{ verticalAlign: 'middle' }}
                  >
                    {division.team_name}
                  </td>
                )}
                
                {/* 계정명 */}
                <td className={`text-center border-r border-white/20 px-2 py-1 ${
                  isTotal ? 'text-blue-200 text-base font-bold bg-blue-900/20' : 'text-white text-base'
                }`}>
                  {division.account_name}
                </td>
                
                {/* 2025년 */}
                <td className={`text-right border-r border-white/20 px-2 py-1 ${
                  isTotal ? 'text-blue-200 text-base font-bold bg-blue-900/20' : isNegative2025 ? 'text-red-400' : 'text-white'
                }`}>
                  <CountUp
                    end={Math.abs(division.year2025)}
                    duration={1.5}
                    separator=","
                    decimal="."
                    prefix={division.year2025 < 0 ? '-' : ''}
                    className={isTotal ? 'text-blue-200' : isNegative2025 ? 'text-red-400' : 'text-white'}
                  />
                </td>
                
                {/* 2024년 */}
                <td className={`text-right border-r border-white/20 px-2 py-1 ${
                  isTotal ? 'text-blue-200 text-base font-bold bg-blue-900/20' : isNegative2024 ? 'text-red-400' : 'text-white'
                }`}>
                  <CountUp
                    end={Math.abs(division.year2024)}
                    duration={1.5}
                    separator=","
                    decimal="."
                    prefix={division.year2024 < 0 ? '-' : ''}
                    className={isTotal ? 'text-blue-200' : isNegative2024 ? 'text-red-400' : 'text-white'}
                  />
                </td>
                
                {/* 전년비 금액 */}
                <td className={`text-right border-r border-white/20 px-2 py-1 ${
                  isTotal ? 'text-blue-200 text-base font-bold bg-blue-900/20' : isNegativeYoyAmount ? 'text-red-400' : 'text-white'
                }`}>
                  <CountUp
                    end={Math.abs(division.yoyAmount)}
                    duration={1.5}
                    separator=","
                    decimal="."
                    prefix={division.yoyAmount < 0 ? '-' : ''}
                    className={isTotal ? 'text-blue-200' : isNegativeYoyAmount ? 'text-red-400' : 'text-white'}
                  />
                </td>
                
                {/* 전년비% */}
                <td className={`text-right px-2 py-1 ${
                  isTotal ? 'text-blue-200 text-base font-bold bg-blue-900/20' : isNegativeYoyPercent ? 'text-red-400' : 'text-white'
                }`}>
                  <CountUp
                    end={Math.abs(division.yoyPercent)}
                    duration={1.5}
                    separator=","
                    decimal="."
                    decimals={1}
                    prefix={division.yoyPercent < 0 ? '-' : ''}
                    suffix="%"
                    className={isTotal ? 'text-blue-200' : isNegativeYoyPercent ? 'text-red-400' : 'text-white'}
                  />
                </td>
              </tr>
              {isLastRowOfTeam && (
                <tr key={`divider-${index}`}>
                  <td colSpan={7} className="h-1 p-0 bg-white/5 border-b border-white/20"></td>
                </tr>
              )}
              </>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

