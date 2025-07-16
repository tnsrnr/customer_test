'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { MetricRow } from './MetricRow';

interface TopMetricsProps {
  전사실적: {
    당월: {
      매출액: number;
      영업이익: number;
      달성률: {
        매출액: number;
        영업이익: number;
      };
    };
    누계: {
      매출액: number;
      영업이익: number;
      달성률: {
        매출액: number;
        영업이익: number;
      };
    };
  };
}

export const TopMetrics = ({ 전사실적 }: TopMetricsProps) => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">전사 실적 현황</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">당월 실적</h3>
          <div className="space-y-2">
            <MetricRow label="매출액" value={전사실적.당월.매출액} />
            <MetricRow label="영업이익" value={전사실적.당월.영업이익} />
            <div className="pt-2 border-t">
              <MetricRow 
                label="매출액 달성률" 
                value={전사실적.당월.달성률.매출액} 
                unit="%" 
              />
              <MetricRow 
                label="영업이익 달성률" 
                value={전사실적.당월.달성률.영업이익} 
                unit="%" 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">누계 실적</h3>
          <div className="space-y-2">
            <MetricRow label="매출액" value={전사실적.누계.매출액} />
            <MetricRow label="영업이익" value={전사실적.누계.영업이익} />
            <div className="pt-2 border-t">
              <MetricRow 
                label="매출액 달성률" 
                value={전사실적.누계.달성률.매출액} 
                unit="%" 
              />
              <MetricRow 
                label="영업이익 달성률" 
                value={전사실적.누계.달성률.영업이익} 
                unit="%" 
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 