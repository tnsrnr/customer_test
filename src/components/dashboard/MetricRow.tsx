'use client';

import React from 'react';

interface MetricRowProps {
  label: string;
  value: number;
  unit?: string;
}

export const MetricRow = ({
  label,
  value,
  unit = '억원'
}: MetricRowProps) => {
  const formattedValue = new Intl.NumberFormat('ko-KR').format(value);

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold">{formattedValue}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
}; 