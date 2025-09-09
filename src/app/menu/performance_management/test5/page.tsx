'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/common/components/ui/card";

interface CountUpAnimationProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
}

function CountUpAnimation({ end, duration = 2000, delay = 0, suffix = "", prefix = "" }: CountUpAnimationProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = end / (duration / 16);
      const animate = () => {
        start += step;
        if (start < end) {
          setCount(Math.floor(start));
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return <>{prefix}{formatNumber(count)}{suffix}</>;
}

interface MetricCardProps {
  title: string;
  value: string;
  bgColorClass: string;
  textColorClass?: string;
}

function MetricCard({ title, value, bgColorClass, textColorClass = "text-blue-50" }: MetricCardProps) {
  const parseValue = (value: string) => {
    const numStr = value.replace(/[^0-9.]/g, '');
    return parseFloat(numStr);
  };

  const getValueParts = (value: string) => {
    const num = parseValue(value);
    const suffix = value.replace(/[0-9.,]/g, '').trim();
    return { num, suffix };
  };

  const { num, suffix } = getValueParts(value);

  return (
    <Card className={`${bgColorClass} text-white p-2 md:p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className={`text-xs md:text-sm lg:text-base ${textColorClass} mb-1 font-medium tracking-wide`}>{title}</div>
      <div className="text-base md:text-lg lg:text-2xl font-bold tracking-tight">
        <CountUpAnimation end={num} suffix={suffix} />
      </div>
    </Card>
  );
}

interface RegionCardProps {
  title: string;
  icon: string;
  monthlyData: {
    sales: string;
    profit: string;
  };
  achievement: {
    sales: number;
    profit: number;
  };
  totalData: {
    sales: string;
    profit: string;
  };
  variant: 'china' | 'asia' | 'europe' | 'usa';
}

function RegionCard({ title, icon, monthlyData, achievement, totalData, variant }: RegionCardProps) {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'china':
        return {
          header: 'bg-gradient-to-r from-red-800 via-red-700 to-red-600',
          text: 'text-red-700',
          bar: 'bg-gradient-to-r from-red-800 to-red-600'
        };
      case 'asia':
        return {
          header: 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600',
          text: 'text-emerald-700',
          bar: 'bg-gradient-to-r from-emerald-800 to-emerald-600'
        };
      case 'europe':
        return {
          header: 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600',
          text: 'text-blue-700',
          bar: 'bg-gradient-to-r from-blue-800 to-blue-600'
        };
      case 'usa':
        return {
          header: 'bg-gradient-to-r from-indigo-800 via-indigo-700 to-indigo-600',
          text: 'text-indigo-700',
          bar: 'bg-gradient-to-r from-indigo-800 to-indigo-600'
        };
      default:
        return {
          header: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600',
          text: 'text-slate-700',
          bar: 'bg-gradient-to-r from-slate-800 to-slate-600'
        };
    }
  };

  const classes = getVariantClasses(variant);

  const parseValue = (value: string) => {
    return parseFloat(value.replace(/[^0-9.]/g, ''));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`text-center font-semibold ${classes.header} text-white py-3 md:py-4`}>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-base md:text-lg lg:text-xl tracking-wide">{title}</h3>
        </div>
      </div>
      
      <div className="p-4 md:p-5 lg:p-6 flex flex-col gap-5 md:gap-6">
        {/* 당월실적 */}
        <div>
          <h4 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-3 text-center tracking-tight">당월실적</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">매출액</div>
              <div className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text} text-center tracking-tight`}>
                <CountUpAnimation end={parseValue(monthlyData.sales)} />
              </div>
            </div>
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text} text-center tracking-tight`}>
                <CountUpAnimation end={parseValue(monthlyData.profit)} />
              </div>
            </div>
          </div>
        </div>

        {/* 달성율 */}
        <div>
          <h4 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-3 text-center tracking-tight">달성율 (계획 比)</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-slate-600">매출액</span>
                <span className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text}`}>
                  <CountUpAnimation end={achievement.sales} suffix="%" />
                </span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${classes.bar} transition-all duration-500`}
                  style={{ width: `${achievement.sales}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-slate-600">영업이익</span>
                <span className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text}`}>
                  <CountUpAnimation end={achievement.profit} suffix="%" />
                </span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${classes.bar} transition-all duration-500`}
                  style={{ width: `${achievement.profit}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 누계실적 */}
        <div>
          <h4 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-3 text-center tracking-tight">누계실적</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">매출액</div>
              <div className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text} text-center tracking-tight`}>
                <CountUpAnimation end={parseValue(totalData.sales)} />
              </div>
            </div>
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text} text-center tracking-tight`}>
                <CountUpAnimation end={parseValue(totalData.profit)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Test5Page() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4 lg:space-y-5">
      {/* 상단 지표 영역 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-3 md:p-4 lg:p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMTItMjRjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white text-center relative z-10 tracking-tight">해외권역별실적</h2>
        </div>
        <div className="p-3 md:p-4 lg:p-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              title="매출액"
              value="34,024,000,000 원"
              bgColorClass="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
            />
            <MetricCard
              title="매출이익"
              value="3,028,136,000 원"
              bgColorClass="bg-gradient-to-br from-cyan-700 via-cyan-600 to-cyan-500"
              textColorClass="text-cyan-50"
            />
            <MetricCard
              title="영업이익"
              value="20,000,000 원"
              bgColorClass="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600"
            />
            <MetricCard
              title="영업이익률"
              value="0.1%"
              bgColorClass="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
              textColorClass="text-slate-50"
            />
          </div>
        </div>
      </div>

      {/* 권역별 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RegionCard
          title="중국권역"
          icon="🇨🇳"
          monthlyData={{ sales: "4,567", profit: "478" }}
          achievement={{ sales: 95, profit: 92 }}
          totalData={{ sales: "16,234", profit: "1,845" }}
          variant="china"
        />
        <RegionCard
          title="아시아권역"
          icon="🌏"
          monthlyData={{ sales: "3,890", profit: "412" }}
          achievement={{ sales: 88, profit: 85 }}
          totalData={{ sales: "14,567", profit: "1,634" }}
          variant="asia"
        />
        <RegionCard
          title="유럽권역"
          icon="🇪🇺"
          monthlyData={{ sales: "3,234", profit: "345" }}
          achievement={{ sales: 82, profit: 80 }}
          totalData={{ sales: "12,890", profit: "1,432" }}
          variant="europe"
        />
        <RegionCard
          title="미국권역"
          icon="🇺🇸"
          monthlyData={{ sales: "4,123", profit: "456" }}
          achievement={{ sales: 91, profit: 89 }}
          totalData={{ sales: "15,678", profit: "1,723" }}
          variant="usa"
        />
      </div>
    </div>
  );
}
