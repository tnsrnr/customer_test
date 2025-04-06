'use client';

import React, { useEffect, useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// 모든 Handsontable 모듈 등록
registerAllModules();

interface HandsontableWrapperProps {
  data: any[][];
  colHeaders?: boolean | string[];
  rowHeaders?: boolean | string[];
  width?: string;
  height?: string;
  licenseKey?: string;
  settings?: any;
}

export default function HandsontableWrapper({
  data,
  colHeaders = true,
  rowHeaders = true,
  width = '100%',
  height = '100%',
  licenseKey = 'non-commercial-and-evaluation',
  settings = {}
}: HandsontableWrapperProps) {
  const hotTableRef = useRef<HotTable>(null);

  useEffect(() => {
    // 컴포넌트가 마운트되었을 때 필요한 추가 설정
    return () => {
      // 컴포넌트가 언마운트될 때 정리 작업
      const hotInstance = hotTableRef.current?.hotInstance;
      if (hotInstance) {
        hotInstance.destroy();
      }
    };
  }, []);

  return (
    <HotTable
      ref={hotTableRef}
      data={data}
      colHeaders={colHeaders}
      rowHeaders={rowHeaders}
      width={width}
      height={height}
      licenseKey={licenseKey}
      {...settings}
    />
  );
} 