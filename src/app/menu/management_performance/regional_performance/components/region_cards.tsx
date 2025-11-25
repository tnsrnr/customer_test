'use client';

interface RegionCardProps {
  title: string;
  icon: string;
  monthlyData: {
    sales: number;
    profit: number;
  };
  achievement: {
    sales: number;
    profit: number;
  };
  totalData: {
    sales: number;
    profit: number;
  };
  variant: 'china' | 'asia' | 'europe' | 'usa';
}

export function RegionCard({ title, icon, monthlyData, achievement, totalData, variant }: RegionCardProps) {
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

  // 숫자 포맷팅 함수 (억원 단위)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
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
                {formatNumber(monthlyData.sales)}억원
              </div>
            </div>
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text} text-center tracking-tight`}>
                {formatNumber(monthlyData.profit)}억원
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
                <span className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text}`}>{achievement.sales}%</span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${classes.bar} transition-all duration-500`}
                  style={{ width: `${Math.min(achievement.sales, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm md:text-base text-slate-600">영업이익</span>
                <span className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text}`}>{achievement.profit}%</span>
              </div>
              <div className="h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${classes.bar} transition-all duration-500`}
                  style={{ width: `${Math.min(achievement.profit, 100)}%` }}
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
                {formatNumber(totalData.sales)}억원
              </div>
            </div>
            <div className="bg-slate-50/80 rounded-lg p-3 md:p-4 border border-slate-100">
              <div className="text-sm md:text-base text-slate-600 text-center mb-1.5">영업이익</div>
              <div className={`text-lg md:text-xl lg:text-2xl font-bold ${classes.text} text-center tracking-tight`}>
                {formatNumber(totalData.profit)}억원
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

