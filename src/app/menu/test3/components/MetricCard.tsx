'use client';

import { Card } from "@/components/card";

interface MetricCardProps {
  title: string;
  value: string;
  bgColorClass: string;
  textColorClass?: string;
}

export function MetricCard({ 
  title, 
  value, 
  bgColorClass, 
  textColorClass = "text-blue-50"
}: MetricCardProps) {
  return (
    <Card className={`${bgColorClass} text-white p-2 md:p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}>
      <div className={`text-xs md:text-sm lg:text-base ${textColorClass} mb-1 font-medium tracking-wide`}>{title}</div>
      <div className="text-base md:text-lg lg:text-2xl font-bold tracking-tight tabular-nums">
        {value}
      </div>
    </Card>
  );
}