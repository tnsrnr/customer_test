'use client';

import React, { useEffect } from 'react';
import KpiCards from './components/kpi_cards';
import PerformanceCharts from './components/performance_charts';
import DataTable from './components/data_table';
import { useDomesticSubsidiariesStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';

export default function DomesticSubsidiariesPage() {
  const { data, loading, error, fetchAllData } = useDomesticSubsidiariesStore();
  const { isRefreshing } = useGlobalStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 전역 조회 버튼 클릭 시 데이터 새로고침
  useEffect(() => {
    if (isRefreshing) {
      fetchAllData();
    }
  }, [isRefreshing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 p-4 space-y-4">
        {/* KPI 카드 섹션 */}
        <KpiCards data={data} loading={loading} error={error} />
        
        {/* 차트 섹션 */}
        <PerformanceCharts data={data} loading={loading} error={error} />
        
        {/* 데이터 테이블 섹션 */}
        <DataTable data={data} loading={loading} error={error} />
      </div>
    </div>
  );
}
