'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { DIVISION_HEADERS, generateMonthHeaders, DivisionMonthlyDetailData } from '../types';

interface DivisionTableProps {
  data?: DivisionMonthlyDetailData[];
  monthLabels?: string[];   // 월 라벨 배열
  loading?: boolean;
  selectedYear?: number;
  selectedMonth?: number;
}

export function DivisionTable({ data, loading, selectedYear, selectedMonth }: DivisionTableProps) {
  
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

  // 동적 헤더 생성 (1~12월 고정)
  const dynamicHeaders = generateMonthHeaders();
  
  // 월 라벨 생성 (1~12월 고정)
  const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

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
      yellow: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-200',
        border: 'border-yellow-400/30'
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
      yellow: {
        bg: 'bg-yellow-500/30',
        text: 'text-yellow-200'
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

  // 누계 계산 함수
  const calculateTotal = (values: number[]) => {
    return values.reduce((sum, value) => sum + value, 0);
  };

  const formatNumber = (value: number) => {
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };


  // PARENT_DIVISION_TYPE별로 데이터 그룹화
  const divisionGroups: { [key: string]: { revenue?: any; profit?: any } } = {};
  
  data.forEach((item: any) => {
    const parentDivision = item.PARENT_DIVISION_TYPE || '기타';
    if (!divisionGroups[parentDivision]) {
      divisionGroups[parentDivision] = {};
    }
    
    if (item.DIVISION_TYPE === '매출') {
      divisionGroups[parentDivision].revenue = item;
    } else if (item.DIVISION_TYPE === '영업이익') {
      divisionGroups[parentDivision].profit = item;
    }
  });
  
  // 부문별 색상 매핑
  const divisionColors: { [key: string]: string } = {
    '합계': 'blue',
    '기타': 'cyan',
    '도급': 'pink',
    '운송': 'yellow',
    '창고': 'orange',
    '항공': 'blue',
    '해상': 'emerald'
  };
  
  // 부문 순서: monthlyDetails(백엔드 순서)에서 처음 등장한 PARENT_DIVISION_TYPE 순서
  const divisionOrder = data.reduce((acc: string[], item: any) => {
    const p = item.PARENT_DIVISION_TYPE || '기타';
    if (!acc.includes(p)) acc.push(p);
    return acc;
  }, []);

  // 변환된 데이터 생성
  const convertedData = divisionOrder
    .filter(divisionName => divisionGroups[divisionName])
    .map(divisionName => {
      const group = divisionGroups[divisionName];
      const revenueItem = group.revenue;
      const profitItem = group.profit;
      
      const revenueData = revenueItem
        ? [
            revenueItem.COLUMN1 || 0,
            revenueItem.COLUMN2 || 0,
            revenueItem.COLUMN3 || 0,
            revenueItem.COLUMN4 || 0,
            revenueItem.COLUMN5 || 0,
            revenueItem.COLUMN6 || 0,
            revenueItem.COLUMN7 || 0,
            revenueItem.COLUMN8 || 0,
            revenueItem.COLUMN9 || 0,
            revenueItem.COLUMN10 || 0,
            revenueItem.COLUMN11 || 0,
            revenueItem.COLUMN12 || 0
          ]
        : Array(12).fill(0);
      
      const profitData = profitItem
        ? [
            profitItem.COLUMN1 || 0,
            profitItem.COLUMN2 || 0,
            profitItem.COLUMN3 || 0,
            profitItem.COLUMN4 || 0,
            profitItem.COLUMN5 || 0,
            profitItem.COLUMN6 || 0,
            profitItem.COLUMN7 || 0,
            profitItem.COLUMN8 || 0,
            profitItem.COLUMN9 || 0,
            profitItem.COLUMN10 || 0,
            profitItem.COLUMN11 || 0,
            profitItem.COLUMN12 || 0
          ]
        : Array(12).fill(0);
      
      return {
        name: divisionName,
        color: divisionColors[divisionName] || 'blue',
        revenue: revenueData,
        profit: profitData
      };
    });

  // 실제 데이터가 있는 부문만 표시
  const sortedDivisions = convertedData;

  return (
    <div className="overflow-x-auto h-full overflow-y-auto">
      <Table className="border border-white/30">
        <TableHeader>
          {/* 헤더 행 */}
          <TableRow className="text-lg border-b border-white/30">
            {dynamicHeaders.map((header, index) => (
              <TableHead 
                key={header.key}
                className={`py-2 px-2 text-center font-bold text-white border-r border-white/30 ${
                  index === 0 || index === 1
                    ? 'bg-white/20' 
                    : index === dynamicHeaders.length - 1
                    ? 'bg-white/15'
                    : 'bg-white/10'
                }`}
                colSpan={header.colSpan}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-lg">
          {sortedDivisions.map((division, divisionIndex) => {
            // "합계"는 특별한 스타일 적용
            const isSpecialRow = division.name === '합계';
            const bgClass = isSpecialRow ? 'bg-white/20' : getColorClasses(division.color, 'bg');
            const borderClass = isSpecialRow ? 'border-t-2 border-white/50' : '';
            
            return (
              <>
                {/* 매출 행 */}
                <TableRow 
                  key={`${division.name}-revenue`}
                  className={`hover:bg-white/10 transition-all duration-300 border-b border-white/30 ${borderClass}`}
                >
                  {/* 부문명 */}
                  <TableCell 
                    className={`py-2 px-2 text-center font-bold text-white border-r border-white/30 ${bgClass}`}
                    rowSpan={2}
                  >
                    {division.name}
                  </TableCell>
                  
                  {/* 구분 */}
                  <TableCell className={`py-2 px-2 text-center font-semibold text-white border-r border-white/30 ${bgClass}`}>
                    매출
                  </TableCell>
                  
                  {/* 월별 매출 데이터 */}
                  {division.revenue.map((value, monthIndex) => (
                    <TableCell 
                      key={`revenue-${monthIndex}`}
                      className={`py-2 px-2 text-center text-white border-r border-white/30 ${bgClass}`}
                    >
                      <span className="text-white">
                        {formatNumber(value)}
                      </span>
                    </TableCell>
                  ))}
                  
                  {/* 누계 매출 */}
                  <TableCell className={`py-2 px-2 text-center font-bold text-white border-r border-white/30 ${bgClass}`}>
                      <span className="text-white">
                        {formatNumber(calculateTotal(division.revenue))}
                      </span>
                  </TableCell>
                </TableRow>
                
                {/* 영업이익 행 */}
                <TableRow 
                  key={`${division.name}-profit`}
                  className={`hover:bg-white/10 transition-all duration-300 border-b border-white/30 ${borderClass}`}
                >
                  {/* 구분 */}
                  <TableCell className={`py-2 px-2 text-center font-semibold border-r border-white/30 ${bgClass} ${
                    division.profit.some(p => p >= 0) ? 'text-white' : 'text-red-300'
                  }`}>
                    영업이익
                  </TableCell>
                  
                  {/* 월별 영업이익 데이터 */}
                  {division.profit.map((value, monthIndex) => (
                    <TableCell 
                      key={`profit-${monthIndex}`}
                      className={`py-2 px-2 text-center border-r border-white/30 ${bgClass} ${
                        value >= 0 ? 'text-white' : 'text-red-300'
                      }`}
                    >
                      <span className={value >= 0 ? 'text-white' : 'text-red-300'}>
                        {formatNumber(value)}
                      </span>
                    </TableCell>
                  ))}
                  
                  {/* 누계 영업이익 */}
                  <TableCell className={`py-2 px-2 text-center font-bold border-r border-white/30 ${bgClass} ${
                    calculateTotal(division.profit) >= 0 ? 'text-white' : 'text-red-300'
                  }`}>
                    <span className={calculateTotal(division.profit) >= 0 ? 'text-white' : 'text-red-300'}>
                      {formatNumber(calculateTotal(division.profit))}
                    </span>
                  </TableCell>
                </TableRow>
              </>
            );
          })}
          
        </TableBody>
      </Table>
    </div>
  );
}
