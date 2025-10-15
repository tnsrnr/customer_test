'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/common/components/ui/card";
import { AuthGuard } from "@/app/auth/auth-guard";
import { Bar, Line, Chart } from 'react-chartjs-2';
import { useFinanceStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';
// 아이콘 import 제거 - 탭 버튼이 없으므로 불필요
import { motion } from "framer-motion";
import { OverviewTab } from './components/overview-tab';

// Chart.js 설정 import
import '@/global/lib/chart';

function FinancePageContent() {
  const { data, loading, fetchAllData } = useFinanceStore();
  const { isRefreshing } = useGlobalStore();
  const activeTab = 'overview'; // 개요 탭만 있으므로 고정

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (isRefreshing) {
      fetchAllData();
    }
  }, [isRefreshing, fetchAllData]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
          <p className="text-blue-100 text-lg font-medium">재무 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // tabs 배열 제거 - 개요 탭만 있으므로 불필요

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={data} />;
      default:
        return <OverviewTab data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 px-2 py-3">
        {/* 탭 버튼 숨김 - 개요 탭만 있으므로 불필요 */}

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  return (
    <AuthGuard>
      <FinancePageContent />
    </AuthGuard>
  );
}
