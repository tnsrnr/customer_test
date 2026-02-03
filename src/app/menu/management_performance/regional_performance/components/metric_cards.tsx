'use client';

import { Card } from "@/common/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  bgColorClass: string;
  textColorClass?: string;
  /** 카드 오른쪽에 표시할 전년대비 텍스트 (있으면 같은 카드 안 오른쪽에 배치) */
  changeText?: string;
  changePositive?: boolean;
}

export function MetricCard({ title, value, bgColorClass, textColorClass = "text-blue-50", changeText, changePositive = true }: MetricCardProps) {
  return (
    <Card className={`${bgColorClass} text-white p-2 md:p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-stretch justify-between gap-2 h-full">
        <div className="flex-1 min-w-0 text-center flex flex-col justify-center">
          <div className={`text-xs md:text-sm lg:text-base ${textColorClass} mb-1 font-medium tracking-wide`}>{title}</div>
          <div className="text-base md:text-lg lg:text-2xl font-bold tracking-tight">{value}</div>
        </div>
        {changeText != null && changeText !== '' && (
          <div className={`flex flex-col justify-center shrink-0 text-right text-xs font-medium px-2 py-1 rounded border ${changePositive ? 'text-emerald-200/90 border-white/30' : 'text-red-200/90 border-white/30'}`}>
            <span className="opacity-90">전년대비</span>
            <span className="font-semibold">{changeText}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

