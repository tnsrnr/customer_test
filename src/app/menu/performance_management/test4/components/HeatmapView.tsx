import React from 'react';

interface HeatmapViewProps {
  heatmapData: Map<string, Map<number, number>>;
  maxCW: number;
  title: string;
  type: '전체' | '수출' | '수입';
}

export function HeatmapView({ heatmapData, maxCW, title, type }: HeatmapViewProps) {
  // 타입별 색상 설정
  const getColor = (intensity: number) => {
    if (type === '수출') {
      return `rgba(16, 185, 129, ${0.1 + (intensity / 100) * 0.9})`; // 녹색
    } else if (type === '수입') {
      return `rgba(245, 158, 11, ${0.1 + (intensity / 100) * 0.9})`; // 오렌지
    } else {
      return `rgba(59, 130, 246, ${0.1 + (intensity / 100) * 0.9})`; // 파란색
    }
  };

  // 시간대별 합계 계산
  const hourlyTotals = new Map<number, number>();
  for (let i = 0; i <= 24; i++) {
    hourlyTotals.set(i, 0);
  }
  
  heatmapData.forEach(hourMap => {
    hourMap.forEach((cw, hour) => {
      hourlyTotals.set(hour, (hourlyTotals.get(hour) || 0) + cw);
    });
  });

  return (
    <div className="mb-4">
      <div className="mb-2">
        <h3 className="text-base font-bold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 bg-slate-100 border border-slate-300 p-1 text-[10px] font-semibold w-16">날짜</th>
              {Array.from({ length: 25 }, (_, i) => {
                const isPeakHour = i >= 16 && i <= 19;
                return (
                  <th 
                    key={i} 
                    className={`sticky top-0 z-10 bg-slate-100 border border-slate-300 p-1 text-[9px] min-w-[50px] ${
                      isPeakHour ? 'text-red-600 font-bold' : 'font-semibold'
                    }`}
                  >
                    {i}시
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {Array.from(heatmapData.entries()).map(([date, hourMap]) => (
              <tr key={date}>
                <td className="sticky left-0 z-10 bg-slate-50 border border-slate-300 p-1 text-[10px] font-semibold text-center">
                  {date.slice(4,6)}/{date.slice(6,8)}
                </td>
                {Array.from({ length: 25 }, (_, hour) => {
                  const cw = hourMap.get(hour) || 0;
                  const intensity = cw > 0 ? Math.min(100, (cw / maxCW) * 100) : 0;
                  const bgColor = cw > 0 ? getColor(intensity) : '#f9fafb';
                  
                  return (
                    <td
                      key={`${date}-${hour}`}
                      className="border border-slate-300 p-1 text-[9px] text-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                      style={{ backgroundColor: bgColor }}
                      title={`${date} ${hour}시: ${cw.toLocaleString()} CW`}
                    >
                      <div className="truncate">{cw > 0 ? cw.toLocaleString() : ''}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* 합계 행 */}
            <tr className="bg-slate-200 font-bold">
              <td className="sticky left-0 z-10 bg-slate-200 border border-slate-300 p-1 text-[10px] font-bold text-center">
                합계
              </td>
              {Array.from({ length: 25 }, (_, hour) => {
                const totalCW = hourlyTotals.get(hour) || 0;
                const intensity = totalCW > 0 ? Math.min(100, (totalCW / maxCW) * 100) : 0;
                const bgColor = totalCW > 0 ? getColor(intensity) : '#e2e8f0';
                
                return (
                  <td
                    key={`total-${hour}`}
                    className="border border-slate-300 p-1 text-[9px] text-center font-bold overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                    title={`${hour}시 합계: ${totalCW.toLocaleString()} CW`}
                  >
                    <div className="truncate">{totalCW > 0 ? totalCW.toLocaleString() : ''}</div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

