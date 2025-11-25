'use client';

import React, { useMemo } from 'react';
import { useTest4Store } from './store';
import { Card } from '@/common/components/ui/card';
import { HeatmapView } from './components/HeatmapView';

export default function Test4Page() {
  const { data } = useTest4Store();

  // 히트맵 데이터 생성 함수
  const createHeatmapData = (filterType: '전체' | '수출' | '수입') => {
    const dateMap = new Map<string, Map<number, number>>();
    const dataToUse = filterType === '전체' 
      ? data 
      : data.filter(d => d.type === filterType);
    
    dataToUse.forEach(item => {
      if (!dateMap.has(item.date)) {
        dateMap.set(item.date, new Map());
      }
      const hourMap = dateMap.get(item.date)!;
      hourMap.set(item.hour, (hourMap.get(item.hour) || 0) + item.cw);
    });

    return dateMap;
  };

  // 3개의 히트맵 데이터
  const heatmapDataAll = useMemo(() => createHeatmapData('전체'), [data]);
  const heatmapDataExport = useMemo(() => createHeatmapData('수출'), [data]);
  const heatmapDataImport = useMemo(() => createHeatmapData('수입'), [data]);

  // 각 히트맵의 최대값
  const getMaxCW = (heatmapData: Map<string, Map<number, number>>) => {
    let max = 0;
    heatmapData.forEach(hourMap => {
      hourMap.forEach(cw => {
        if (cw > max) max = cw;
      });
    });
    return max;
  };

  const maxCWAll = useMemo(() => getMaxCW(heatmapDataAll), [heatmapDataAll]);
  const maxCWExport = useMemo(() => getMaxCW(heatmapDataExport), [heatmapDataExport]);
  const maxCWImport = useMemo(() => getMaxCW(heatmapDataImport), [heatmapDataImport]);

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-slate-100 p-3 flex flex-col gap-2 overflow-hidden">
      {/* 히트맵 */}
      <Card className="p-4 flex-1 flex flex-col overflow-auto">
        <div className="space-y-6">
          <HeatmapView 
            heatmapData={heatmapDataAll} 
            maxCW={maxCWAll} 
            title="전체"
            type="전체"
          />
          <HeatmapView 
            heatmapData={heatmapDataExport} 
            maxCW={maxCWExport} 
            title="수출"
            type="수출"
          />
          <HeatmapView 
            heatmapData={heatmapDataImport} 
            maxCW={maxCWImport} 
            title="수입"
            type="수입"
          />
        </div>
      </Card>
    </div>
  );
}
