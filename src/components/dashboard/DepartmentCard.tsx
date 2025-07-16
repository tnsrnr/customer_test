'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Department } from '@/types/dashboard';
import { AchievementSection } from './AchievementSection';

interface DepartmentCardProps {
  department: Department;
}

export const DepartmentCard = ({ department }: DepartmentCardProps) => {
  if (!department) {
    return null;
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{department.name}</h2>
      </div>
      
      <div className="space-y-6">
        <AchievementSection
          title="당월 실적"
          매출액={department.monthlyData.매출액}
          영업이익={department.monthlyData.영업이익}
          달성률={department.달성률}
        />
        
        <AchievementSection
          title="누계 실적"
          매출액={department.yearlyData.매출액}
          영업이익={department.yearlyData.영업이익}
          달성률={department.달성률}
        />
      </div>
    </Card>
  );
}; 