'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/card";
import { SplitText } from "./components/SplitText";
import { MetricCard } from "./components/MetricCard";
import { BusinessCard } from "./components/BusinessCard";

interface AnimatedCardProps {
  delay: number;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
}

function AnimatedCard({ delay, children, direction = 'left' }: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'left': return 'translate-x-[-100%]';
      case 'right': return 'translate-x-[100%]';
      case 'top': return 'translate-y-[-100%]';
      case 'bottom': return 'translate-y-[100%]';
      default: return 'translate-x-[-100%]';
    }
  };

  return (
    <div
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? 'translate-x-0 translate-y-0 opacity-100' : `${getInitialTransform()} opacity-0`
      }`}
    >
      {children}
    </div>
  );
}

export default function BusinessDivisionPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4 lg:space-y-5">
      {/* 상단 지표 영역 */}
      <AnimatedCard delay={0} direction="top">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-2 md:p-3 lg:p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMTItMjRjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
            <SplitText />
          </div>
          <div className="p-2 md:p-3 lg:p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <AnimatedCard delay={200} direction="left">
                <MetricCard
                  title="매출액"
                  value="34,024,000,000 원"
                  bgColorClass="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb]"
                />
              </AnimatedCard>
              <AnimatedCard delay={400} direction="left">
                <MetricCard
                  title="매출이익"
                  value="3,028,136,000 원"
                  bgColorClass="bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#14b8a6]"
                  textColorClass="text-cyan-50"
                />
              </AnimatedCard>
              <AnimatedCard delay={600} direction="right">
                <MetricCard
                  title="영업이익"
                  value="20,000,000 원"
                  bgColorClass="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb]"
                />
              </AnimatedCard>
              <AnimatedCard delay={800} direction="right">
                <MetricCard
                  title="영업이익률"
                  value="0.1%"
                  bgColorClass="bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500"
                  textColorClass="text-slate-50"
                />
              </AnimatedCard>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* 사업부 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedCard delay={1000} direction="bottom">
          <BusinessCard
            title="글로벌영업 1 사업부"
            monthlyData={{ sales: "5,622", profit: "501" }}
            achievement={{ sales: 48, profit: 43 }}
            totalData={{ sales: "12,622", profit: "1,302" }}
          />
        </AnimatedCard>
        <AnimatedCard delay={1200} direction="bottom">
          <BusinessCard
            title="글로벌영업 2 사업부"
            monthlyData={{ sales: "8,245", profit: "892" }}
            achievement={{ sales: 52, profit: 47 }}
            totalData={{ sales: "15,876", profit: "1,654" }}
          />
        </AnimatedCard>
        <AnimatedCard delay={1400} direction="bottom">
          <BusinessCard
            title="글로벌영업 3 사업부"
            monthlyData={{ sales: "6,932", profit: "743" }}
            achievement={{ sales: 45, profit: 41 }}
            totalData={{ sales: "13,445", profit: "1,523" }}
          />
        </AnimatedCard>
        <AnimatedCard delay={1600} direction="bottom">
          <BusinessCard
            title="글로벌영업 4 사업부"
            monthlyData={{ sales: "7,123", profit: "812" }}
            achievement={{ sales: 49, profit: 44 }}
            totalData={{ sales: "14,234", profit: "1,432" }}
          />
        </AnimatedCard>
      </div>
    </div>
  );
}

