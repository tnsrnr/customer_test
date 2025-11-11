'use client';

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

export function BusinessCard({ 
  title, 
  monthlyData, 
  achievement, 
  totalData
}: BusinessCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 overflow-hidden">
      <div className="text-center font-semibold bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white py-3 md:py-4">
        <h3 className="text-base md:text-lg lg:text-xl tracking-wide">{title}</h3>
      </div>
      
      <div className="p-4 md:p-5 lg:p-6 flex flex-col gap-5 md:gap-6">
        {/* 당월실적 */}
        <div>
          <h4 className="text-base md:text-lg lg:text-xl font-bold text-slate-800 mb-3 text-center tracking-tight">당월실적</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">매출액</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#1e40af] text-center tracking-tight tabular-nums">
                {monthlyData.sales}
              </div>
            </div>
            <div className="bg-slate-50/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#0d9488] text-center tracking-tight tabular-nums">
                {monthlyData.profit}
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
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-[#1e40af] tabular-nums">
                  {achievement.sales}%
                </span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] transition-all duration-500"
                  style={{ width: `${achievement.sales}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-slate-600">영업이익</span>
                <span className="text-lg md:text-xl lg:text-2xl font-bold text-[#0d9488] tabular-nums">
                  {achievement.profit}%
                </span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-[#0f766e] to-[#14b8a6] transition-all duration-500"
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
            <div className="bg-slate-50/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">매출액</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#1e40af] text-center tracking-tight tabular-nums">
                {totalData.sales}
              </div>
            </div>
            <div className="bg-slate-50/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#0d9488] text-center tracking-tight tabular-nums">
                {totalData.profit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

