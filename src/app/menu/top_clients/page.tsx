'use client';

import { TopSection } from './components/top_section';
import { MiddleSection } from './components/middle_section';
import { RightSection } from './components/right_section';
import { useEffect } from 'react';
import { useTopClientsStore } from './store';
import { useGlobalStore } from '@/store/slices/global';

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
            <div className="bg-white rounded-lg p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-700">데이터를 불러오는 중...</p>
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