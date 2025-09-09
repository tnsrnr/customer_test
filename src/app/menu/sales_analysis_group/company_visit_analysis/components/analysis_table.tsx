'use client';

import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/common/components/ui/table';
import { TableRow as TableRowType, AnalysisStats, MonthlyStats } from '../types';

interface AnalysisTableProps {
  tableData: TableRowType[];
  stats: AnalysisStats;
  monthlyStats: MonthlyStats[];
  loading: boolean;
}

const AnalysisTable: React.FC<AnalysisTableProps> = ({
  tableData,
  stats,
  monthlyStats,
  loading
}) => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // 그룹화된 데이터 생성 (사업부별, 팀별)
  const groupedData = useMemo(() => {
    const groups: { [key: string]: TableRowType[] } = {};
    
    tableData.forEach(row => {
      if (!row.isTotalRow) {
        const businessUnit = row.businessUnit;
        if (!groups[businessUnit]) {
          groups[businessUnit] = [];
        }
        groups[businessUnit].push(row);
      }
    });

    return groups;
  }, [tableData]);

  // 소계 계산
  const calculateSubtotals = (rows: TableRowType[]) => {
    const subtotals = {
      monthly: new Array(12).fill(0),
      total: 0,
      categories: {} as { [key: string]: { monthly: number[], total: number } }
    };

    rows.forEach(row => {
      row.monthlyData.forEach((value, index) => {
        subtotals.monthly[index] += value;
      });
      subtotals.total += row.total;

      if (!subtotals.categories[row.category]) {
        subtotals.categories[row.category] = { monthly: new Array(12).fill(0), total: 0 };
      }
      row.monthlyData.forEach((value, index) => {
        subtotals.categories[row.category].monthly[index] += value;
      });
      subtotals.categories[row.category].total += row.total;
    });

    return subtotals;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 그리드만 표시 - 최대한 효율적으로 */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10 shadow-lg">
              <TableRow className="border-b-2 border-gray-300">
                <TableHead className="w-[120px] text-sm font-bold bg-gray-800 text-white border-r border-gray-600 py-3">사업부</TableHead>
                <TableHead className="w-[120px] text-sm font-bold bg-gray-800 text-white border-r border-gray-600 py-3">팀</TableHead>
                <TableHead className="w-[80px] text-sm font-bold bg-gray-800 text-white border-r border-gray-600 py-3">담당자</TableHead>
                <TableHead className="w-[80px] text-sm font-bold bg-gray-800 text-white border-r border-gray-600 py-3">분류</TableHead>
                {months.map((month) => (
                  <TableHead key={month} className="w-[50px] text-center text-sm font-bold bg-gray-800 text-white border-r border-gray-600 py-3">
                    {month}
                  </TableHead>
                ))}
                <TableHead className="w-[70px] text-center text-sm font-bold bg-gray-800 text-white py-3">합계</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedData).map(([businessUnit, rows]) => {
                return (
                  <React.Fragment key={businessUnit}>
                    {rows.map((row, index) => {
                      const isFirstInTeam = index === 0 || rows[index - 1].team !== row.team;
                      const isFirstInSalesPerson = index === 0 || rows[index - 1].salesPerson !== row.salesPerson;
                      const teamRowSpan = rows.filter(r => r.team === row.team).length;
                      const salesPersonRowSpan = rows.filter(r => r.salesPerson === row.salesPerson).length;
                      const isLastInBusinessUnit = index === rows.length - 1;
                      const isLastInSalesPerson = index === rows.length - 1 || rows[index + 1].salesPerson !== row.salesPerson;
                      
                      return (
                        <TableRow 
                          key={`${businessUnit}-${index}`}
                          className={`hover:bg-gray-50 ${isLastInBusinessUnit ? 'border-b-2 border-gray-400' : ''} ${isLastInSalesPerson ? 'border-b border-gray-300' : ''}`}
                        >
                          {/* 사업부명 - 첫 번째 행에만 표시 */}
                          {index === 0 && (
                            <TableCell 
                              rowSpan={rows.length}
                              className="font-medium text-sm bg-blue-50 border-r border-b-2 border-gray-400"
                            >
                              {businessUnit}
                            </TableCell>
                          )}
                          
                          {/* 팀명 - 팀의 첫 번째 행에만 표시 */}
                          {isFirstInTeam && (
                            <TableCell 
                              rowSpan={teamRowSpan}
                              className="font-medium text-sm bg-green-50 border-r"
                            >
                              {row.team}
                            </TableCell>
                          )}
                          
                          {/* 담당자명 - 담당자의 첫 번째 행에만 표시 */}
                          {isFirstInSalesPerson && (
                            <TableCell 
                              rowSpan={salesPersonRowSpan}
                              className="font-medium text-sm bg-yellow-50 border-r border-b border-gray-300"
                            >
                              {row.salesPerson}
                            </TableCell>
                          )}
                          
                          <TableCell className="py-1 border-r">
                            <span className="text-xs text-gray-700">
                              {row.category}
                            </span>
                          </TableCell>
                          {row.monthlyData.map((value, monthIndex) => (
                            <TableCell key={monthIndex} className="text-center text-xs py-1 border-r">
                              {value > 0 ? value.toLocaleString() : '-'}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-semibold text-xs py-1">
                            {row.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTable;