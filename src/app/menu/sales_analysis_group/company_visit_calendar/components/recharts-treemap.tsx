'use client';

import React, { useState } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { TreemapNode } from '../types';
import { Card } from '@/common/components/ui/card';

interface RechartsTreemapProps {
  data: TreemapNode[];
  onNodeClick?: (node: TreemapNode) => void;
  currentDepth?: number;
}

// 계층별 색상 - 연도별로 다른 색상 사용
const getColor = (nodeName: string, depth: number = 0): string => {
  // 모든 레벨에서 회사 색상으로 통일
  return '#3b82f6'; // blue-600
};

// 커스텀 트리맵 컨텐츠
const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, value, growthRate, revenue } = props;

  if (width < 60 || height < 40) return null;

  // 현재 깊이 추정 (이름이 연도인지 확인)
  const isYear = /^\d{4}$/.test(name);
  const depth = isYear ? 0 : 1;
  const nodeColor = getColor(name, depth);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: nodeColor,
          stroke: '#ffffff',
          strokeWidth: depth === 0 ? 8 : 3, // 최상위 레벨은 더 두꺼운 경계선
          strokeOpacity: 1,
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.strokeWidth = depth === 0 ? '6' : '4';
          e.currentTarget.style.fill = depth === 0 ? '#1d4ed8' : '#60a5fa'; // 더 진한 색상으로 호버
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.strokeWidth = depth === 0 ? '4' : '2';
          e.currentTarget.style.fill = nodeColor;
        }}
      />
      {/* 연도 레벨 - 상단에 연도 레이블 표시 */}
      {depth === 0 && (
        <>
          {/* 연도 레이블 배경 - 상단 고정 영역 확보 */}
          <rect
            x={x + 5}
            y={y + 5}
            width={width - 10}
            height={35}
            fill="#ffffff"
            rx={4}
            stroke="#000000"
            strokeWidth={2}
          />
          {/* 연도 텍스트 */}
          <text
            x={x + width / 2}
            y={y + 25}
            textAnchor="middle"
            fill="#000000"
            fontSize={16}
            fontWeight="bold"
          >
            {name}년
          </text>
          {/* 총 매출액 표시 - 연도 레이블 아래에 배치 */}
          <text
            x={x + width / 2}
            y={y + height / 2 + 25}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={Math.min(width / 15, 12)}
            fontWeight="500"
          >
            {(value / 1000).toFixed(0)}K
          </text>
        </>
      )}
      
      {/* 회사 레벨 - 연도 레이블 영역을 피해서 배치 */}
      {depth === 1 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 4}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={Math.min(width / 10, 12)}
            fontWeight="600"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={Math.min(width / 15, 10)}
            fontWeight="500"
          >
            {(value / 1000).toFixed(0)}K
          </text>
        </>
      )}
    </g>
  );
};

// 커스텀 툴팁
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="p-3 shadow-lg border-2">
        <div className="space-y-1">
          <p className="font-bold text-sm">{data.name}</p>
          <p className="text-xs text-gray-700">
            값: {(data.value / 1000000).toFixed(1)}M원
          </p>
          {data.revenue !== undefined && (
            <p className="text-xs text-gray-600">
              매출: {(data.revenue / 1000000).toFixed(1)}M원
            </p>
          )}
          {data.profitRate !== undefined && (
            <p className="text-xs text-gray-600">
              수익률: {data.profitRate.toFixed(1)}%
            </p>
          )}
        </div>
      </Card>
    );
  }
  return null;
};

export const RechartsTreemap: React.FC<RechartsTreemapProps> = ({ data, onNodeClick, currentDepth = 0 }) => {
  const handleClick = (node: any) => {
    onNodeClick?.(node);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="value"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent />}
          onClick={handleClick}
          aspectRatio={1.2}
          nodePadding={25}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};


