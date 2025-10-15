'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, SquareStack, BoxSelect, PieChart } from 'lucide-react';
import { DomesticSubsidiariesData } from '../types';
import CountUp from 'react-countup';

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const CountUpAnimation: React.FC<CountUpAnimationProps> = ({ end, duration = 1.5, delay = 0, suffix = '', prefix = '', decimals = 0 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCount(end);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [end, delay]);

  return (
    <CountUp 
      start={0} 
      end={count} 
      duration={duration} 
      separator="," 
      decimals={decimals} 
      suffix={suffix} 
      prefix={prefix} 
    />
  );
};

// KPI Cards 메인 컴포넌트
interface KpiCardsProps {
  data: DomesticSubsidiariesData | null;
  loading: boolean;
  error: string | null;
}

const KpiCards: React.FC<KpiCardsProps> = ({ data, loading, error }) => {

  // 로딩 상태
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error || !data?.gridData?.monthlyDetails) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full mx-auto">
        <div className="col-span-full flex items-center justify-center h-32">
          <div className="text-red-400 text-lg">KPI 데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const { monthlyDetails } = data.gridData;

  // 그리드 데이터에서 현재 월 기준 KPI 계산
  const calculateCurrentMonthKPIs = () => {
    // 데이터가 없거나 빈 배열인 경우 기본값 반환
    if (!monthlyDetails || monthlyDetails.length === 0) {
      return {
        currentSales: 0,
        currentOpProfit: 0,
        currentOpMargin: 0,
        salesChange: 0,
        opProfitChange: 0,
        opMarginChange: 0,
        companyCount: 0
      };
    }

    // 총합 행에서 매출과 영업이익 데이터 추출
    const totalSalesRow = monthlyDetails.find(item => item.column0 === '총합' && item.column1 === '매출');
    const totalProfitRow = monthlyDetails.find(item => item.column0 === '총합' && item.column1 === '영업이익');
    
    if (!totalSalesRow || !totalProfitRow) {
      return {
        currentSales: 0,
        currentOpProfit: 0,
        currentOpMargin: 0,
        salesChange: 0,
        opProfitChange: 0,
        opMarginChange: 0,
        companyCount: 0
      };
    }

    // 현재 월 데이터 (column6)
    const currentSales = totalSalesRow.column6;
    const currentOpProfit = totalProfitRow.column6;
    
    // 전월 데이터 (column5)
    const prevSales = totalSalesRow.column5;
    const prevOpProfit = totalProfitRow.column5;
    
    // 증감 계산
    const salesChange = currentSales - prevSales;
    const opProfitChange = currentOpProfit - prevOpProfit;
    
    // 영업이익률 계산 (소수점 반올림)
    const currentOpMargin = currentSales > 0 ? Math.round((currentOpProfit / currentSales) * 100) : 0;
    const prevOpMargin = prevSales > 0 ? Math.round((prevOpProfit / prevSales) * 100) : 0;
    const opMarginChange = currentOpMargin - prevOpMargin;
    
    // 법인 수 계산 (총합 제외)
    const companyCount = Array.from(new Set(monthlyDetails.map(item => item.column0).filter(name => name !== '총합'))).length;
    
    return {
      currentSales: Math.round(currentSales),
      currentOpProfit: Math.round(currentOpProfit),
      currentOpMargin,
      salesChange: Math.round(salesChange),
      opProfitChange: Math.round(opProfitChange),
      opMarginChange,
      companyCount
    };
  };

  const kpiMetrics = calculateCurrentMonthKPIs();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full mx-auto">
      {/* 국내 법인 현황 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-4 bg-gradient-to-br from-emerald-500/20 via-emerald-600/15 to-emerald-700/10 backdrop-blur-md rounded-xl shadow-xl border border-emerald-400/30 hover:border-emerald-300/50 transition-all duration-300 overflow-hidden group"
      >
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* 아이콘 */}
        <div className="relative flex items-center h-full">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-emerald-400/25 transition-all duration-300">
            <Building2 className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1 flex items-center justify-center ml-4">
            <div className="text-center">
              <span className="text-sm font-medium text-emerald-200 mb-1 block">국내 법인 현황</span>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-white drop-shadow-sm">{kpiMetrics.companyCount}</span>
                <span className="text-lg font-medium text-emerald-200 ml-1">개 법인</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm text-emerald-300 bg-emerald-600/30 border-emerald-400/30">
            본사제외
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-60"></div>
      </motion.div>

      {/* 총 매출액 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-4 bg-gradient-to-br from-blue-500/20 via-blue-600/15 to-blue-700/10 backdrop-blur-md rounded-xl shadow-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-300 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center h-full">
          <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:shadow-blue-400/25 transition-all duration-300">
            <SquareStack className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1 flex items-center justify-center ml-4">
            <div className="text-center">
              <span className="text-sm font-medium text-blue-200 mb-1 block">총 매출액</span>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-white drop-shadow-sm">
                  <CountUpAnimation end={kpiMetrics.currentSales} />
                </span>
                <span className="text-lg font-medium text-blue-200 ml-1">억원</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
            kpiMetrics.salesChange >= 0 
              ? "text-green-300 bg-green-600/30 border-green-400/30" 
              : "text-red-300 bg-red-600/30 border-red-400/30"
          }`}>
            {kpiMetrics.salesChange >= 0 ? "▲" : "▼"} {Math.abs(kpiMetrics.salesChange)}억원
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"></div>
      </motion.div>

      {/* 영업이익 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-4 bg-gradient-to-br from-orange-500/20 via-orange-600/15 to-orange-700/10 backdrop-blur-md rounded-xl shadow-xl border border-orange-400/30 hover:border-orange-300/50 transition-all duration-300 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center h-full">
          <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg group-hover:shadow-orange-400/25 transition-all duration-300">
            <BoxSelect className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1 flex items-center justify-center ml-4">
            <div className="text-center">
              <span className="text-sm font-medium text-orange-200 mb-1 block">영업이익</span>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-white drop-shadow-sm">
                  <CountUpAnimation end={kpiMetrics.currentOpProfit} />
                </span>
                <span className="text-lg font-medium text-orange-200 ml-1">억원</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
            kpiMetrics.opProfitChange >= 0 
              ? "text-green-300 bg-green-600/30 border-green-400/30" 
              : "text-red-300 bg-red-600/30 border-red-400/30"
          }`}>
            {kpiMetrics.opProfitChange >= 0 ? "▲" : "▼"} {Math.abs(kpiMetrics.opProfitChange)}억원
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 opacity-60"></div>
      </motion.div>

      {/* 영업이익률 */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="relative p-4 bg-gradient-to-br from-purple-500/20 via-purple-600/15 to-purple-700/10 backdrop-blur-md rounded-xl shadow-xl border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center h-full">
          <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:shadow-purple-400/25 transition-all duration-300">
            <PieChart className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1 flex items-center justify-center ml-4">
            <div className="text-center">
              <span className="text-sm font-medium text-purple-200 mb-1 block">영업이익률</span>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-white drop-shadow-sm">
                  <CountUpAnimation end={kpiMetrics.currentOpMargin} />
                </span>
                <span className="text-lg font-medium text-purple-200 ml-1">%</span>
              </div>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full border backdrop-blur-sm ${
            kpiMetrics.opMarginChange >= 0 
              ? "text-green-300 bg-green-600/30 border-green-400/30" 
              : "text-red-300 bg-red-600/30 border-red-400/30"
          }`}>
            {kpiMetrics.opMarginChange >= 0 ? "▲" : "▼"} {Math.abs(kpiMetrics.opMarginChange)}%p
          </span>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 opacity-60"></div>
      </motion.div>
    </div>
  );
};

export default KpiCards;