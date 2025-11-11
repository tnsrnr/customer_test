'use client';

import React from 'react';
import { TreemapNode } from '../types';

interface HierarchicalTreemapProps {
  data: TreemapNode[];
  onNodeClick?: (node: TreemapNode) => void;
}

const HierarchicalTreemap: React.FC<HierarchicalTreemapProps> = ({ data, onNodeClick }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  // 상위 계층 레이블 영역 높이 (고정)
  const HEADER_HEIGHT = 40;

  return (
    <div className="w-full h-full p-2">
      <div className="w-full h-full flex">
        {data.map((topLevelNode, index) => {
          // 전체 값 대비 비율 계산
          const totalValue = data.reduce((sum, node) => sum + node.value, 0);
          const widthRatio = (topLevelNode.value / totalValue) * 100;
          
          return (
            <div
              key={topLevelNode.name}
              className="relative border-2 border-gray-300 bg-blue-50"
              style={{ 
                width: `${widthRatio}%`,
                height: '100%'
              }}
            >
              {/* 상위 계층 레이블 - 상단 고정 영역 */}
              <div 
                className="absolute top-0 left-0 right-0 bg-white border-b-2 border-gray-400 flex items-center justify-center z-10"
                style={{ height: `${HEADER_HEIGHT}px` }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{topLevelNode.name}</div>
                  <div className="text-sm text-gray-600">
                    {(topLevelNode.value / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              {/* 하위 계층 데이터 영역 - 상위 레이블 아래에 배치 */}
              <div 
                className="w-full h-full pt-2"
                style={{ paddingTop: `${HEADER_HEIGHT + 8}px` }}
              >
                {topLevelNode.children && topLevelNode.children.length > 0 ? (
                  <div className="w-full h-full grid grid-cols-1 gap-1">
                    {topLevelNode.children.map((childNode, childIndex) => {
                      const childTotal = topLevelNode.children?.reduce((sum, child) => sum + child.value, 0) || 0;
                      const heightRatio = (childNode.value / childTotal) * 100;
                      
                      return (
                        <div
                          key={childNode.name}
                          className="bg-blue-500 text-white border border-blue-600 cursor-pointer hover:bg-blue-600 transition-colors flex flex-col justify-center"
                          style={{ height: `${Math.max(heightRatio, 15)}%` }}
                          onClick={() => onNodeClick?.(childNode)}
                        >
                          <div className="text-center p-1">
                            <div className="text-sm font-bold">{childNode.name}</div>
                            <div className="text-xs opacity-90">
                              {(childNode.value / 1000).toFixed(0)}K
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    하위 데이터 없음
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HierarchicalTreemap;
