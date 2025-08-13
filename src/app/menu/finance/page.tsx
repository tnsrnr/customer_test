'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { AuthGuard } from "@/components/auth_guard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Chart } from 'react-chartjs-2';
import { useFinanceStore } from './store';
import { useGlobalStore } from '@/store/slices/global';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Calendar, Target, PieChart } from 'lucide-react';
import { motion } from "framer-motion";
import { OverviewTab } from './components/overview-tab';
import { CapitalTab } from './components/capital-tab';
import { LoansTab } from './components/loans-tab';
import { TrendsTab } from './components/trends-tab';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function FinancePageContent() {
  const { data, loading, error, fetchFinanceData } = useFinanceStore();
  const { isRefreshing } = useGlobalStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  useEffect(() => {
    if (isRefreshing) {
      fetchFinanceData();
    }
  }, [isRefreshing, fetchFinanceData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-6"></div>
          <p className="text-blue-100 text-lg font-medium">재무 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md p-8 shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <div className="text-red-300 text-xl font-bold mb-2">오류가 발생했습니다</div>
            <p className="text-blue-300 mb-6">{error}</p>
            <button 
              onClick={fetchFinanceData}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-slate-500 text-white rounded-lg font-bold shadow-md hover:from-blue-700 hover:to-slate-600 transition-all duration-200"
            >
              다시 시도
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 flex items-center justify-center">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-md p-8 shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          <div className="text-center">
            <div className="text-blue-300 text-4xl mb-4">📊</div>
            <p className="text-blue-300 text-lg">데이터가 없습니다.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // 현재년과 과거1년 데이터 계산
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;
  
  const currentCapital = data.topLeftChart.capital[data.topLeftChart.capital.length - 1] || 1380;
  const currentDebt = data.topLeftChart.debt[data.topLeftChart.debt.length - 1] || 980;
  const currentAssets = data.topLeftChart.assets[data.topLeftChart.assets.length - 1] || 2360;
  
  const lastCapital = data.topLeftChart.capital[data.topLeftChart.capital.length - 2] || 1350;
  const lastDebt = data.topLeftChart.debt[data.topLeftChart.debt.length - 2] || 950;
  const lastAssets = data.topLeftChart.assets[data.topLeftChart.assets.length - 2] || 2300;

  const capitalChange = ((currentCapital - lastCapital) / lastCapital * 100).toFixed(1);
  const debtChange = ((currentDebt - lastDebt) / lastDebt * 100).toFixed(1);
  const assetsChange = ((currentAssets - lastAssets) / lastAssets * 100).toFixed(1);

  // 차트 데이터
  const topLeftChartData = {
    labels: data.topLeftChart.labels,
    datasets: [
      {
        label: '자본',
        data: data.topLeftChart.capital,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '부채',
        data: data.topLeftChart.debt,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '자산',
        data: data.topLeftChart.assets,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const topRightChartData = {
    labels: data.topRightChart.labels,
    datasets: [
      {
        label: '단기차입금',
        data: data.topRightChart.shortTermLoan,
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: 'rgba(168, 85, 247, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: '장기차입금',
        data: data.topRightChart.longTermLoan,
        backgroundColor: 'rgba(236, 72, 153, 0.2)',
        borderColor: 'rgba(236, 72, 153, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const bottomChartData = {
    labels: data.bottomChart.labels,
    datasets: [
      {
        label: '총 차입금',
        data: data.bottomChart.totalLoan,
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 0.4)',
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        label: '부채비율',
        data: data.bottomChart.debtRatio,
        borderColor: 'rgba(251, 146, 60, 0.4)',
        backgroundColor: 'rgba(251, 146, 60, 0.05)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(251, 146, 60, 0.4)',
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 1,
        yAxisID: 'y1',
        type: 'line' as const,
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: '개요', icon: BarChart3 },
    { id: 'capital', name: '자본/부채/자산', icon: DollarSign },
    { id: 'loans', name: '차입금 현황', icon: Activity },
    { id: 'trends', name: '10년 트렌드', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            data={data}
            currentCapital={currentCapital}
            currentDebt={currentDebt}
            currentAssets={currentAssets}
            capitalChange={capitalChange}
            debtChange={debtChange}
            assetsChange={assetsChange}
            topLeftChartData={topLeftChartData}
            topRightChartData={topRightChartData}
            bottomChartData={bottomChartData}
          />
        );

      case 'capital':
        return (
          <CapitalTab
            topLeftChartData={topLeftChartData}
            currentCapital={currentCapital}
            currentDebt={currentDebt}
            currentAssets={currentAssets}
            capitalChange={capitalChange}
            debtChange={debtChange}
            assetsChange={assetsChange}
          />
        );

      case 'loans':
        return (
          <LoansTab
            topRightChartData={topRightChartData}
          />
        );

      case 'trends':
        return (
          <TrendsTab
            bottomChartData={bottomChartData}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* 고급스러운 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-slate-800/10 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(15,23,42,0.2),transparent_50%)]"></div>
      
      <div className="relative z-10 px-2 py-3">
        {/* 탭 네비게이션 */}
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

        {/* 탭 콘텐츠 */}
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
