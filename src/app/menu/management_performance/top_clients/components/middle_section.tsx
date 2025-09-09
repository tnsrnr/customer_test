'use client';

import { useTopClientsStore } from '../store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Minus, BarChart3, Users } from 'lucide-react';

function GrowthIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <div className="flex items-center text-emerald-400">
        <ArrowUpRight className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">+{value.toFixed(1)}%</span>
      </div>
    );
  } else if (value < 0) {
    return (
      <div className="flex items-center text-red-400">
        <ArrowDownRight className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">{value.toFixed(1)}%</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center text-slate-400">
        <Minus className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">0.0%</span>
      </div>
    );
  }
}

function calculateGrowth(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

export function MiddleSection() {
  const { selectedTab, selectedClient, setSelectedClient, transportData } = useTopClientsStore();

  const currentData = transportData[selectedTab];

  return (
    <div className="col-span-2">
      <div className="overflow-x-auto flex-1">
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-sm border-b-2 border-slate-600/50 shadow-lg">
              <TableHead className="text-center py-6 px-4">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-6 h-6 text-slate-300" />
                  <span className="text-xl font-bold text-white">거래처명</span>
                </div>
              </TableHead>
              <TableHead className="text-center py-6 px-4">
                <span className="text-xl font-bold text-white">매출 (백만)</span>
              </TableHead>
              <TableHead className="text-center py-6 px-4">
                <span className="text-xl font-bold text-white">영업이익 (백만)</span>
              </TableHead>
              <TableHead className="text-center py-6 px-4">
                <span className="text-xl font-bold text-white">진행건수 (건)</span>
              </TableHead>
              <TableHead className="text-center py-6 px-4">
                <span className="text-xl font-bold text-white">영업담당자</span>
              </TableHead>
              <TableHead className="text-center py-6 px-4">
                <span className="text-xl font-bold text-white">트렌드</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.data.map((client, index) => {
              // 배경색만 다르게 하고 글자색은 흰색으로 통일
              const colorMap = [
                { bg: 'bg-gradient-to-r from-blue-600/30 to-blue-700/30', border: 'border-blue-500/50' },
                { bg: 'bg-gradient-to-r from-emerald-600/30 to-emerald-700/30', border: 'border-emerald-500/50' },
                { bg: 'bg-gradient-to-r from-amber-600/30 to-amber-700/30', border: 'border-amber-500/50' },
                { bg: 'bg-gradient-to-r from-rose-600/30 to-rose-700/30', border: 'border-rose-500/50' },
                { bg: 'bg-gradient-to-r from-indigo-600/30 to-indigo-700/30', border: 'border-indigo-500/50' }
              ];
              const color = colorMap[index % colorMap.length];
              
              return (
                <TableRow
                  key={client.name}
                  className={`${color.bg} ${color.border} border-l-4 overflow-hidden backdrop-blur-sm transition-all duration-300 ${
                    selectedClient === client.name ? 'ring-2 ring-blue-400 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedClient(client.name)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* 거래처명 + 순위 */}
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
                        <span className="text-sm font-bold text-white">#{index + 1}</span>
                      </div>
                      <span className="text-lg font-semibold text-white">{client.name}</span>
                    </div>
                  </TableCell>
                  {/* 매출 */}
                  <TableCell className="text-center py-6 px-4">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {client.sales}
                      </span>
                      <span className="text-xl text-slate-300 ml-1">백만</span>
                    </div>
                  </TableCell>
                  {/* 수익 */}
                  <TableCell className="text-center py-6 px-4">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {client.profit}
                      </span>
                      <span className="text-xl text-slate-300 ml-1">백만</span>
                    </div>
                  </TableCell>
                  {/* 진행건수 */}
                  <TableCell className="text-center py-6">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-semibold text-white">
                        {client.progressCount.toLocaleString()}<span className="text-xl text-slate-300 ml-1">건</span>
                      </span>
                    </div>
                  </TableCell>
                  {/* 영업담당자 */}
                  <TableCell className="text-center py-6">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold text-white">{client.salesManager}</span>
                    </div>
                  </TableCell>
                  {/* 트렌드 */}
                  <TableCell className="text-center py-6 px-4">
                    <GrowthIndicator value={calculateGrowth(client.sales, client.comparison.prevMonth.sales)} />
                  </TableCell>
                </TableRow>
              );
            })}
            {/* 강화된 합계 Row */}
            <TableRow 
              className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 text-white border-l-4 border-l-cyan-400 backdrop-blur-sm shadow-xl border-t-2 border-t-cyan-500/30 cursor-pointer transition-all duration-300"
              onClick={() => setSelectedClient('TOTAL')}
            >
              <TableCell className="py-6 font-bold">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg">
                    <span className="text-lg font-bold text-white">Σ</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white">합 계</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center py-6 px-4">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-cyan-100">
                    {currentData.data.reduce((sum, c) => sum + c.sales, 0)}
                  </span>
                  <span className="text-2xl text-cyan-300 ml-1">백만</span>
                </div>
              </TableCell>
              <TableCell className="text-center py-6 px-4">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-cyan-100">
                    {currentData.data.reduce((sum, c) => sum + c.profit, 0)}
                  </span>
                  <span className="text-2xl text-cyan-300 ml-1">백만</span>
                </div>
              </TableCell>
              <TableCell className="text-center py-6">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-white">
                    {currentData.data.reduce((sum, c) => sum + c.progressCount, 0).toLocaleString()}<span className="text-2xl text-cyan-300 ml-1">건</span>
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center py-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-cyan-300 font-medium mt-2">담당자</span>
                </div>
              </TableCell>
              <TableCell className="text-center py-6 px-4">
                <div className="flex items-center justify-center">
                  <span className="text-lg text-cyan-300">-</span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
