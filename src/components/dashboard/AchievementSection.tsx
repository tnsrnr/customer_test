'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { AchievementChart } from './AchievementChart';
import { MetricRow } from './MetricRow';

interface AchievementSectionProps {
  title: string;
  매출액: number;
  영업이익: number;
  달성률: {
    매출액: number;
    영업이익: number;
  };
}

export const AchievementSection = ({
  title,
  매출액,
  영업이익,
  달성률
}: AchievementSectionProps) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <AchievementChart
            percentage={달성률.매출액}
            label="매출액 달성률"
            color="#0066cc"
          />
          <MetricRow label="매출액" value={매출액} />
        </div>
        <div className="space-y-2">
          <AchievementChart
            percentage={달성률.영업이익}
            label="영업이익 달성률"
            color="#00a3bf"
          />
          <MetricRow label="영업이익" value={영업이익} />
        </div>
      </div>
    </Card>
  );
}; 