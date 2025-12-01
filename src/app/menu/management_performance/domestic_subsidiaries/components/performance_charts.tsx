'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { DomesticSubsidiariesData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 차트 컴포넌트
interface ChartCardProps {
  title: string;
  salesData: number[];
  profitData: number[];
  monthLabels: string[];
  delay: number;
  yAxisMax: number;
  yAxisMin: number;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  salesData, 
  profitData, 
  monthLabels,
  delay,
  yAxisMax,
  yAxisMin
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10"
  >
    {title && <h3 className="text-lg font-bold text-white mb-2 text-center">{title}</h3>}
    <div className="h-48">
      <Chart 
        type='bar' 
        data={{
          labels: monthLabels,
          datasets: [
            {
              label: '매출',
              data: salesData,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            },
            {
              label: '영업이익',
              data: profitData,
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 1
            }
          ]
        }} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: 'white',
                font: {
                  size: 12
                },
                padding: 20
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'white',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            y: {
              ticks: {
                color: 'white',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              min: yAxisMin,
              max: yAxisMax
            }
          },
          layout: {
            padding: {
              top: 1,
              bottom: 1,
              left: 1,
              right: 1
            }
          }
        }} 
      />
    </div>
  </motion.div>
);

// Performance Charts 메인 컴포넌트
interface PerformanceChartsProps {
  data: DomesticSubsidiariesData | null;
  loading: boolean;
  error: string | null;
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data, loading, error }) => {

  // 로딩 상태
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[98%] mx-auto mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error || !data?.gridData?.monthlyDetails) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[98%] mx-auto mb-6">
        <div className="col-span-full flex items-center justify-center h-48">
          <div className="text-red-400 text-lg">차트 데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const { monthlyDetails, monthLabels } = data.gridData;

  // 데이터가 없거나 빈 배열인 경우 기본값 반환
  if (!monthlyDetails || monthlyDetails.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[98%] mx-auto mb-6">
        <div className="col-span-full flex items-center justify-center h-48">
          <div className="text-white/60 text-center">
            <div className="text-lg font-semibold mb-2">데이터 없음</div>
            <div className="text-sm">표시할 차트 데이터가 없습니다</div>
          </div>
        </div>
      </div>
    );
  }

  // 그리드 데이터에서 법인별 매출/영업이익 데이터 추출
  const extractCompanyData = (companyName: string) => {
    const companyRows = monthlyDetails.filter(item => item.column0 === companyName);
    
    const salesRow = companyRows.find(row => row.column1 === '매출');
    const profitRow = companyRows.find(row => row.column1 === '영업이익');
    
    return {
      sales: salesRow ? [salesRow.column2, salesRow.column3, salesRow.column4, salesRow.column5, salesRow.column6].map(val => Math.round(val || 0)) : [],
      profit: profitRow ? [profitRow.column2, profitRow.column3, profitRow.column4, profitRow.column5, profitRow.column6].map(val => Math.round(val || 0)) : []
    };
  };

  // 고유한 법인명 추출 (총합 제외)
  const uniqueCompanies = Array.from(new Set(monthlyDetails.map(item => item.column0).filter(name => name !== '총합')));
  
  // 첫 번째와 두 번째 법인의 데이터 추출
  const firstCompany = uniqueCompanies[0] || '';
  const secondCompany = uniqueCompanies[1] || '';

  const firstCompanyData = extractCompanyData(firstCompany);
  const secondCompanyData = extractCompanyData(secondCompany);

  // 차트 Y축 범위 계산
  const calculateYAxisRange = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const padding = Math.max(Math.abs(max), Math.abs(min)) * 0.1;
    return {
      max: max + padding,
      min: min - padding
    };
  };

  const firstCompanyRange = calculateYAxisRange([...firstCompanyData.sales, ...firstCompanyData.profit]);
  const secondCompanyRange = calculateYAxisRange([...secondCompanyData.sales, ...secondCompanyData.profit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[98%] mx-auto mb-6">
      {/* 첫 번째 법인 차트 */}
      {firstCompany && (
        <ChartCard
          title={firstCompany}
          salesData={firstCompanyData.sales}
          profitData={firstCompanyData.profit}
          monthLabels={monthLabels}
          delay={0.5}
          yAxisMax={firstCompanyRange.max}
          yAxisMin={firstCompanyRange.min}
        />
      )}
      
      {/* 두 번째 법인 차트 */}
      {secondCompany && (
        <ChartCard
          title={secondCompany}
          salesData={secondCompanyData.sales}
          profitData={secondCompanyData.profit}
          monthLabels={monthLabels}
          delay={0.6}
          yAxisMax={secondCompanyRange.max}
          yAxisMin={secondCompanyRange.min}
        />
      )}
      
      {/* 법인이 하나만 있는 경우 */}
      {!secondCompany && firstCompany && (
        <div className="flex items-center justify-center h-48 bg-white/5 rounded-xl">
          <div className="text-white/60 text-center">
            <div className="text-lg font-semibold mb-2">추가 법인 데이터</div>
            <div className="text-sm">현재 {firstCompany}만 표시됩니다</div>
          </div>
        </div>
      )}
      
      {/* 데이터가 없는 경우 */}
      {!firstCompany && !secondCompany && (
        <div className="col-span-full flex items-center justify-center h-48">
          <div className="text-white/60 text-center">
            <div className="text-lg font-semibold mb-2">법인 데이터 없음</div>
            <div className="text-sm">표시할 법인 데이터가 없습니다</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCharts;
