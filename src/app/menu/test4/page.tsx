'use client';

import { Card } from "@/components/card";

interface MetricCardProps {
  title: string;
  value: string;
  bgColorClass: string;
  textColorClass?: string;
}

function MetricCard({ title, value, bgColorClass, textColorClass = "text-blue-50" }: MetricCardProps) {
  return (
    <Card className={`${bgColorClass} text-white p-2 md:p-3 lg:p-4 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className={`text-xs md:text-sm lg:text-base ${textColorClass} mb-1 font-medium tracking-wide`}>{title}</div>
      <div className="text-base md:text-lg lg:text-2xl font-bold tracking-tight">{value}</div>
    </Card>
  );
}

interface BusinessCardProps {
  title: string;
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
}

function BusinessCard({ title, monthlyData, achievement, totalData }: BusinessCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="text-center font-semibold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-3 md:py-4">
        <h3 className="text-base md:text-lg lg:text-xl tracking-wide">{title}</h3>
      </div>
      
      <div className="p-4 md:p-5 lg:p-6 flex flex-col gap-5 md:gap-6">
        {/* 당월실적 */}
        <div>
          <h4 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-3 text-center tracking-tight">당월실적</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">매출액</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900 text-center tracking-tight">{monthlyData.sales}</div>
            </div>
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-cyan-700 text-center tracking-tight">{monthlyData.profit}</div>
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
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900">{achievement.sales}%</span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-900 to-blue-700 transition-all duration-500"
                  style={{ width: `${achievement.sales}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-slate-600">영업이익</span>
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-cyan-700">{achievement.profit}%</span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-700 to-cyan-500 transition-all duration-500"
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
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900 text-center tracking-tight">{totalData.sales}</div>
            </div>
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-cyan-700 text-center tracking-tight">{totalData.profit}</div>
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
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white text-center relative z-10 tracking-tight">사업부별 실적 현황</h2>
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

      {/* 사업부 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BusinessCard
          title="글로벌영업 1 사업부"
          monthlyData={{ sales: "5,622", profit: "501" }}
          achievement={{ sales: 48, profit: 43 }}
          totalData={{ sales: "12,622", profit: "1,302" }}
        />
        <BusinessCard
          title="글로벌영업 2 사업부"
          monthlyData={{ sales: "8,245", profit: "892" }}
          achievement={{ sales: 52, profit: 47 }}
          totalData={{ sales: "15,876", profit: "1,654" }}
        />
        <BusinessCard
          title="글로벌영업 3 사업부"
          monthlyData={{ sales: "6,932", profit: "743" }}
          achievement={{ sales: 45, profit: 41 }}
          totalData={{ sales: "13,445", profit: "1,523" }}
        />
        <BusinessCard
          title="글로벌영업 4 사업부"
          monthlyData={{ sales: "7,123", profit: "812" }}
          achievement={{ sales: 49, profit: 44 }}
          totalData={{ sales: "14,234", profit: "1,432" }}
        />
      </div>
    </div>
  );
}
