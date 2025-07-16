'use client';

import React from 'react';

interface AchievementChartProps {
  percentage: number;
  label: string;
  color?: string;
}

export const AchievementChart = ({
  percentage,
  label,
  color = '#0066cc'
}: AchievementChartProps) => {
  const radius = 40;
  const circumference = radius * Math.PI;
  const strokeDashoffset = ((100 - percentage) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative">
        <svg width="100" height="50" className="transform rotate-180">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset: circumference,
            }}
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center transform rotate-180">
          <span className="text-2xl font-bold">{percentage}%</span>
          <span className="text-sm text-gray-500">{label}</span>
        </div>
      </div>
    </div>
  );
}; 