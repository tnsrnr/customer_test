'use client';

import { useEffect } from 'react';
import { useRegionalPerformanceStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';
import { AnimatedCard } from './components/animated_card';
import { MetricCard } from './components/metric_cards';
import { RegionCard } from './components/region_cards';
import { SplitText } from './components/split_text';

export default function RegionalPerformancePage() {
  const { 
    data, 
    loading, 
    error, 
    fetchAllData,
    currentYear,
    currentMonth
  } = useRegionalPerformanceStore();

  const { isRefreshing } = useGlobalStore();

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 전역 조회 이벤트 감지
  useEffect(() => {
    if (isRefreshing) {
      fetchAllData();
    }
  }, [isRefreshing, fetchAllData]);

  // 숫자 포맷팅 함수 (억원 단위)
  const formatCurrency = (num: number): string => {
    return num.toLocaleString('ko-KR') + ' 억원';
  };

  // 퍼센트 포맷팅 함수
  const formatPercent = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4 lg:space-y-5">
      {/* 로딩 상태 표시 */}
      {loading && !data && (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-slate-600">데이터를 불러오는 중...</span>
        </div>
      )}

      {/* 에러 상태 표시 */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* 데이터가 로드된 경우에만 컨텐츠 표시 */}
      {data && (
        <>
      {/* 상단 지표 영역 */}
      <AnimatedCard delay={0} direction="top">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-3 md:p-4 lg:p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMTItMjRjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
            <SplitText />
          </div>
          <div className="p-3 md:p-4 lg:p-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <AnimatedCard delay={200} direction="left">
                <MetricCard
                  title="매출액(누적)"
                  value={formatCurrency(data.kpiMetrics.ACTUAL_SALES)}
                  bgColorClass="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
                  changeText={`${(data.kpiMetrics.ACTUAL_SALES_CHANGE ?? 0) >= 0 ? '+' : ''}${data.kpiMetrics.ACTUAL_SALES_CHANGE?.toLocaleString() ?? 0}억원`}
                  changePositive={(data.kpiMetrics.ACTUAL_SALES_CHANGE ?? 0) >= 0}
                />
              </AnimatedCard>
              <AnimatedCard delay={400} direction="left">
                <MetricCard
                  title="영업이익(누적)"
                  value={formatCurrency(data.kpiMetrics.ACTUAL_OP_PROFIT)}
                  bgColorClass="bg-gradient-to-br from-cyan-700 via-cyan-600 to-cyan-500"
                  textColorClass="text-cyan-50"
                  changeText={`${(data.kpiMetrics.ACTUAL_OP_PROFIT_CHANGE ?? 0) >= 0 ? '+' : ''}${data.kpiMetrics.ACTUAL_OP_PROFIT_CHANGE?.toLocaleString() ?? 0}억원`}
                  changePositive={(data.kpiMetrics.ACTUAL_OP_PROFIT_CHANGE ?? 0) >= 0}
                />
              </AnimatedCard>
              <AnimatedCard delay={600} direction="right">
                <MetricCard
                  title="영업이익률(누적)"
                  value={formatPercent(data.kpiMetrics.ACTUAL_OP_MARGIN)}
                  bgColorClass="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600"
                  changeText={`${(data.kpiMetrics.ACTUAL_OP_MARGIN_CHANGE ?? 0) >= 0 ? '+' : ''}${data.kpiMetrics.ACTUAL_OP_MARGIN_CHANGE?.toFixed(2) ?? 0}%`}
                  changePositive={(data.kpiMetrics.ACTUAL_OP_MARGIN_CHANGE ?? 0) >= 0}
                />
              </AnimatedCard>
              <AnimatedCard delay={800} direction="right">
                <MetricCard
                  title="매출 증감률(누적)"
                  value={formatPercent(data.kpiMetrics.SALES_ACHIEVEMENT)}
                  bgColorClass="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
                  textColorClass="text-slate-50"
                />
              </AnimatedCard>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* 권역별 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.regions.map((region, index) => (
              <AnimatedCard key={region.name} delay={1000 + index * 200} direction="bottom">
          <RegionCard
                  title={region.name}
                  icon={region.icon}
                  monthlyData={region.monthlyData}
                  achievement={region.achievement}
                  totalData={region.totalData}
                  variant={region.variant}
          />
        </AnimatedCard>
            ))}
      </div>
        </>
      )}
    </div>
  );
}
