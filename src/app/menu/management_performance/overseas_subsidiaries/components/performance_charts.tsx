'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { OverseasSubsidiariesData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

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
              type: 'bar' as const,
              label: '매출',
              data: salesData,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            },
            {
              type: 'line' as const,
              label: '영업이익',
              data: profitData,
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 2,
              pointBackgroundColor: 'rgb(239, 68, 68)',
              pointRadius: 3,
              fill: false,
              yAxisID: 'y1'
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
              position: 'left' as const,
              ticks: {
                color: 'white',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              min: 0,
              max: yAxisMax
            },
            y1: {
              position: 'right' as const,
              ticks: {
                color: 'white',
                font: {
                  size: 12
                }
              },
              grid: {
                drawOnChartArea: false
              },
              min: yAxisMin,
              max: Math.max(Math.abs(yAxisMin), Math.abs(yAxisMax)) * 0.3
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
  data: OverseasSubsidiariesData | null;
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

  // 그리드 데이터에서 구분별 매출/영업이익 데이터 추출
  const extractDivisionData = (divisionName: string) => {
    const divisionRows = monthlyDetails.filter(item => item.column0 === divisionName);
    
    const salesRow = divisionRows.find(row => row.column1 === '매출액');
    const profitRow = divisionRows.find(row => row.column1 === '영업이익');
    
    return {
      sales: salesRow ? [salesRow.column2, salesRow.column3, salesRow.column4, salesRow.column5, salesRow.column6].map(val => Math.round(val || 0)) : [],
      profit: profitRow ? [profitRow.column2, profitRow.column3, profitRow.column4, profitRow.column5, profitRow.column6].map(val => Math.round(val || 0)) : []
    };
  };

  // 합계 데이터 추출 (해외자회사 전체)
  const totalData = extractDivisionData('합계');
  
  // 고유한 구분 추출 (합계 제외)
  const uniqueDivisions = Array.from(new Set(monthlyDetails.map(item => item.column0).filter(name => name !== '합계')));
  
  // 본부별 당월실적 데이터 (첫 번째 구분의 데이터)
  const firstDivision = uniqueDivisions[0] || '';
  const firstDivisionData = extractDivisionData(firstDivision);

  // 차트 Y축 범위 계산
  const calculateYAxisRange = (data: number[]) => {
    const max = Math.max(...data, 0);
    const padding = max * 0.1;
    return {
      max: max + padding,
      min: 0
    };
  };

  const calculateProfitYAxisRange = (data: number[]) => {
    const max = Math.max(...data, 0);
    const min = Math.min(...data, 0);
    const padding = Math.max(Math.abs(max), Math.abs(min)) * 0.2;
    return {
      max: max + padding,
      min: min - padding
    };
  };

  const totalRange = calculateYAxisRange(totalData.sales);
  const totalProfitRange = calculateProfitYAxisRange(totalData.profit);
  const divisionRange = firstDivision ? calculateYAxisRange(firstDivisionData.sales) : { max: 100, min: 0 };
  const divisionProfitRange = firstDivision ? calculateProfitYAxisRange(firstDivisionData.profit) : { max: 10, min: -5 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-[98%] mx-auto mb-6">
      {/* 해외자회사 전체 차트 */}
      {totalData.sales.length > 0 && (
        <ChartCard
          title="해외자회사"
          salesData={totalData.sales}
          profitData={totalData.profit}
          monthLabels={monthLabels}
          delay={0.5}
          yAxisMax={totalRange.max}
          yAxisMin={totalProfitRange.min}
        />
      )}
      
      {/* 본부별 당월실적 차트 */}
      {firstDivision && firstDivisionData.sales.length > 0 && (
        <ChartCard
          title="본부별 당월실적"
          salesData={firstDivisionData.sales}
          profitData={firstDivisionData.profit}
          monthLabels={monthLabels}
          delay={0.6}
          yAxisMax={divisionRange.max}
          yAxisMin={divisionProfitRange.min}
        />
      )}
      
      {/* 데이터가 없는 경우 */}
      {totalData.sales.length === 0 && !firstDivision && (
        <div className="col-span-full flex items-center justify-center h-48">
          <div className="text-white/60 text-center">
            <div className="text-lg font-semibold mb-2">차트 데이터 없음</div>
            <div className="text-sm">표시할 차트 데이터가 없습니다</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCharts;

