'use client';

import { TopSection } from './components/top_section';
import { MiddleSection } from './components/middle_section';
import { RightSection } from './components/right_section';
import { useEffect } from 'react';
import { useTopClientsStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';

export default function TopClientsPage() {
  const { fetchTopClientsData, loading, error } = useTopClientsStore();
  const { selectedYear, selectedMonth, isRefreshing } = useGlobalStore();

  // 초기 로드 시 데이터 조회
  useEffect(() => {
    fetchTopClientsData();
  }, []);

  // 전역 새로고침 시 데이터 조회
  useEffect(() => {
    if (isRefreshing) {
      fetchTopClientsData();
    }
  }, [isRefreshing, fetchTopClientsData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="relative z-10 p-6">
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-600/50 shadow-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-blue-100 text-lg font-medium text-center">상위거래처 데이터를 불러오는 중...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300">오류: {error}</p>
          </div>
        )}
        
        <TopSection />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MiddleSection />
          <RightSection />
        </div>
      </div>
    </div>
  );
} 