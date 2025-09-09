'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/common/components/ui/card";
import { AuthGuard } from "@/app/auth/auth-guard";
import { Bar, Line, Chart } from 'react-chartjs-2';
import { useFinanceStore } from './store';
import { useGlobalStore } from '@/global/store/slices/global';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Calendar, Target, PieChart } from 'lucide-react';
import { motion } from "framer-motion";
import { OverviewTab } from './components/overview-tab';
import { CapitalTab } from './components/capital-tab';
import { LoansTab } from './components/loans-tab';
import { TrendsTab } from './components/trends-tab';

// Chart.js 설정 import
import '@/global/lib/chart';

function FinancePageContent() {
  const { data, loading, fetchAllData } = useFinanceStore();
  const { isRefreshing } = useGlobalStore();
  const [activeTab, setActiveTab] = useState('overview');

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

  const tabs = [
    { id: 'overview', name: '개요', icon: BarChart3 },
    { id: 'capital', name: '자본/부채/자산', icon: DollarSign },
    { id: 'loans', name: '차입금 현황', icon: Activity },
    { id: 'trends', name: '10년 트렌드', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={data} />;
      case 'capital':
        return <CapitalTab data={data} />;
      case 'loans':
        return <LoansTab data={data} />;
      case 'trends':
        return <TrendsTab data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 px-2 py-3">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 text-cyan-200 hover:bg-white/15 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </motion.div>

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
