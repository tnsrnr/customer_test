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

  // 동적 헤더 생성 (탑네비게이션 월에 따라)
  const dynamicHeaders = generateMonthHeaders(selectedYear, selectedMonth);
  
  // 월 라벨 생성 함수
  function generateMonthLabels(selectedYear?: number, selectedMonth?: number): string[] {
    const monthNames = [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    
    const months = [];
    const currentMonth = selectedMonth ? selectedMonth - 1 : new Date().getMonth(); // 0-11
    const currentYear = selectedYear || new Date().getFullYear();
    
    // 선택된 월부터 12개월 전까지 역순으로 생성
    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const month = targetDate.getMonth();
      months.push(monthNames[month]);
    }
    
    return months;
  }
  
  // 월 라벨 생성
  const monthLabels = generateMonthLabels(selectedYear, selectedMonth);

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

  // 부문별 색상 매핑
  const getDivisionColor = (parentDivisionType: string) => {
    const colorMap: { [key: string]: string } = {
      '항공': 'blue',
      '해상': 'emerald',
      '운송': 'yellow',
      '창고': 'orange',
      '도급': 'pink',
      '기타': 'cyan'
    };
    return colorMap[parentDivisionType] || 'blue';
  };

  // 백엔드 데이터를 기존 구조로 변환 (매출과 영업이익 데이터 모두 사용)
  const convertedData = data
    .filter(item => item.DIVISION_TYPE === '매출') // 매출 데이터만 사용
    .map(item => {
      const color = getDivisionColor(item.PARENT_DIVISION_TYPE);
      const revenueData = [
        item.COLUMN1, item.COLUMN2, item.COLUMN3, item.COLUMN4, item.COLUMN5, item.COLUMN6,
        item.COLUMN7, item.COLUMN8, item.COLUMN9, item.COLUMN10, item.COLUMN11, item.COLUMN12
      ];
      
      // 해당 부문의 영업이익 데이터 찾기
      const profitItem = data.find(profitData => 
        profitData.PARENT_DIVISION_TYPE === item.PARENT_DIVISION_TYPE && 
        profitData.DIVISION_TYPE === '영업이익'
      );
      
      const profitData = profitItem ? [
        Math.round(profitItem.COLUMN1 || 0), Math.round(profitItem.COLUMN2 || 0), Math.round(profitItem.COLUMN3 || 0), 
        Math.round(profitItem.COLUMN4 || 0), Math.round(profitItem.COLUMN5 || 0), Math.round(profitItem.COLUMN6 || 0),
        Math.round(profitItem.COLUMN7 || 0), Math.round(profitItem.COLUMN8 || 0), Math.round(profitItem.COLUMN9 || 0), 
        Math.round(profitItem.COLUMN10 || 0), Math.round(profitItem.COLUMN11 || 0), Math.round(profitItem.COLUMN12 || 0)
      ] : Array(12).fill(0); // 영업이익 데이터가 없으면 0으로 설정
      
      return {
        name: item.PARENT_DIVISION_TYPE, // 부문명만 표시
        color: color,
        revenue: revenueData,
        profit: profitData
      };
    });

  // 부문 순서를 명시적으로 지정 (왼쪽과 동일한 순서)
  const orderedDivisions = [
    { name: '항공', color: 'blue' },
    { name: '해상', color: 'emerald' },
    { name: '운송', color: 'purple' },
    { name: '창고', color: 'orange' },
    { name: '도급', color: 'pink' },
    { name: '기타', color: 'cyan' }
  ];

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
          {sortedDivisions.map((division, divisionIndex) => (
            <>
              {/* 매출 행 */}
              <TableRow 
                key={`${division.name}-revenue`}
                className="hover:bg-white/10 transition-all duration-300 border-b border-white/30"
              >
                {/* 부문명 */}
                <TableCell 
                  className={`py-2 px-2 text-center font-bold text-white border-r border-white/30 ${getColorClasses(division.color, 'bg')}`}
                  rowSpan={2}
                >
                  {division.name}
                </TableCell>
                
                {/* 구분 */}
                <TableCell className={`py-2 px-2 text-center font-semibold text-white border-r border-white/30 ${getColorClasses(division.color, 'bg')}`}>
                  매출
                </TableCell>
                
                {/* 월별 매출 데이터 */}
                {division.revenue.map((value, monthIndex) => (
                  <TableCell 
                    key={`revenue-${monthIndex}`}
                    className={`py-2 px-2 text-center text-white border-r border-white/30 ${getColorClasses(division.color, 'bg')}`}
                  >
                    <span className="text-white">
                      {value.toLocaleString()}
                    </span>
                  </TableCell>
                ))}
                
                {/* 누계 매출 */}
                <TableCell className={`py-2 px-2 text-center font-bold text-white border-r border-white/30 ${getColorClasses(division.color, 'bg')}`}>
                  <span className="text-white">
                    {calculateTotal(division.revenue).toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
              
              {/* 영업이익 행 */}
              <TableRow 
                key={`${division.name}-profit`}
                className="hover:bg-white/10 transition-all duration-300 border-b border-white/30"
              >
                {/* 구분 */}
                <TableCell className={`py-2 px-2 text-center font-semibold border-r border-white/30 ${getColorClasses(division.color, 'bg')} ${
                  division.profit.some(p => p >= 0) ? 'text-white' : 'text-red-300'
                }`}>
                  영업이익
                </TableCell>
                
                {/* 월별 영업이익 데이터 */}
                {division.profit.map((value, monthIndex) => (
                  <TableCell 
                    key={`profit-${monthIndex}`}
                    className={`py-2 px-2 text-center border-r border-white/30 ${getColorClasses(division.color, 'bg')} ${
                      value >= 0 ? 'text-white' : 'text-red-300'
                    }`}
                  >
                    <span className={value >= 0 ? 'text-white' : 'text-red-300'}>
                      {Math.round(value)}
                    </span>
                  </TableCell>
                ))}
                
                {/* 누계 영업이익 */}
                <TableCell className={`py-2 px-2 text-center font-bold border-r border-white/30 ${getColorClasses(division.color, 'bg')} ${
                  calculateTotal(division.profit) >= 0 ? 'text-white' : 'text-red-300'
                }`}>
                  <span className={calculateTotal(division.profit) >= 0 ? 'text-white' : 'text-red-300'}>
                    {Math.round(calculateTotal(division.profit))}
                  </span>
                </TableCell>
              </TableRow>
            </>
          ))}
          
          {/* 합계 행 */}
          {(() => {
            // 월별 매출 합계 계산
            const monthlyRevenueTotals = monthLabels?.map((_, monthIndex) => 
              sortedDivisions.reduce((sum, division) => sum + division.revenue[monthIndex], 0)
            ) || [];
            
            // 월별 영업이익 합계 계산
            const monthlyProfitTotals = monthLabels?.map((_, monthIndex) => 
              sortedDivisions.reduce((sum, division) => sum + division.profit[monthIndex], 0)
            ) || [];
            
            // 전체 매출 합계
            const totalRevenue = calculateTotal(monthlyRevenueTotals);
            
            // 전체 영업이익 합계
            const totalProfit = calculateTotal(monthlyProfitTotals);
            
            return (
              <>
                {/* 합계 매출 행 */}
                <TableRow className="border-t-2 border-white/50 bg-white/10">
                  {/* 부문명 */}
                  <TableCell 
                    className="py-2 px-2 text-center font-bold text-white border-r border-white/30 bg-white/20"
                    rowSpan={2}
                  >
                    합계
                  </TableCell>
                  
                  {/* 구분 */}
                  <TableCell className="py-2 px-2 text-center font-semibold text-white border-r border-white/30 bg-white/20">
                    매출
                  </TableCell>
                  
                  {/* 월별 매출 합계 */}
                  {monthlyRevenueTotals.map((value, monthIndex) => (
                    <TableCell 
                      key={`total-revenue-${monthIndex}`}
                      className="py-2 px-2 text-center font-bold text-white border-r border-white/30 bg-white/20"
                    >
                      <span className="text-white">
                        {value.toLocaleString()}
                      </span>
                    </TableCell>
                  ))}
                  
                  {/* 전체 매출 합계 */}
                  <TableCell className="py-2 px-2 text-center font-bold text-white border-r border-white/30 bg-white/20">
                    <span className="text-white">
                      {totalRevenue.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
                
                {/* 합계 영업이익 행 */}
                <TableRow className="bg-white/10">
                  {/* 구분 */}
                  <TableCell className={`py-2 px-2 text-center font-semibold border-r border-white/30 bg-white/20 ${
                    totalProfit >= 0 ? 'text-white' : 'text-red-300'
                  }`}>
                    영업이익
                  </TableCell>
                  
                  {/* 월별 영업이익 합계 */}
                  {monthlyProfitTotals.map((value, monthIndex) => (
                    <TableCell 
                      key={`total-profit-${monthIndex}`}
                      className={`py-2 px-2 text-center font-bold border-r border-white/30 bg-white/20 ${
                        value >= 0 ? 'text-white' : 'text-red-300'
                      }`}
                    >
                      <span className={value >= 0 ? 'text-white' : 'text-red-300'}>
                        {Math.round(value)}
                      </span>
                    </TableCell>
                  ))}
                  
                  {/* 전체 영업이익 합계 */}
                  <TableCell className={`py-2 px-2 text-center font-bold border-r border-white/30 bg-white/20 ${
                    totalProfit >= 0 ? 'text-white' : 'text-red-300'
                  }`}>
                    <span className={totalProfit >= 0 ? 'text-white' : 'text-red-300'}>
                      {Math.round(totalProfit)}
                    </span>
                  </TableCell>
                </TableRow>
              </>
            );
          })()}
        </TableBody>
      </Table>
    </div>
  );
}
