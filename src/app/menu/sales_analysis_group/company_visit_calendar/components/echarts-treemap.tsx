'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { TreemapNode } from '../types';

interface EChartsTreemapProps {
  data: TreemapNode[];
  onNodeClick?: (node: TreemapNode) => void;
}

const EChartsTreemap: React.FC<EChartsTreemapProps> = ({ data, onNodeClick }) => {
  // ECharts 트리맵 옵션 생성
  const option = useMemo(() => {
    if (!data || data.length === 0) return {};

    return {
      tooltip: {
        trigger: 'item',
        formatter: function (params: any) {
          const data = params.data;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
              <div style="color: #666;">값: ${(data.value / 1000).toFixed(0)}K</div>
              ${data.revenue ? `<div style="color: #666;">매출: ${(data.revenue / 1000).toFixed(0)}K</div>` : ''}
            </div>
          `;
        }
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: Math.max(...data.map(d => d.value)),
        inRange: {
          color: ['#e8f4f8', '#3b82f6']
        },
        show: false
      },
      series: [
        {
          type: 'treemap',
          data: data,
          roam: false,
          nodeClick: 'link',
          breadcrumb: {
            show: false
          },
          label: {
            show: true,
            formatter: function (params: any) {
              const data = params.data;
              // 상위 레벨 (연도)인 경우
              if (data.children && data.children.length > 0) {
                return `{title|${data.name}년}\n{value|${(data.value / 1000).toFixed(0)}K}`;
              }
              // 하위 레벨 (회사)인 경우
              return `{company|${data.name}}\n{value|${(data.value / 1000).toFixed(0)}K}`;
            },
            rich: {
              title: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000',
                backgroundColor: '#fff',
                padding: [4, 8],
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#000'
              },
              company: {
                fontSize: 12,
                fontWeight: 'bold',
                color: '#fff'
              },
              value: {
                fontSize: 10,
                color: '#fff',
                opacity: 0.9
              }
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            gapWidth: 2
          },
          emphasis: {
            itemStyle: {
              borderColor: '#000',
              borderWidth: 3
            }
          },
          levels: [
            {
              // 상위 레벨 (연도) 스타일
              itemStyle: {
                borderColor: '#000',
                borderWidth: 4,
                gapWidth: 8,
                color: '#f0f8ff' // 연도별 구역 배경색
              },
              label: {
                show: true,
                position: 'inside',
                formatter: function (params: any) {
                  const data = params.data;
                  return `{title|${data.name}년}\n{value|${(data.value / 1000).toFixed(0)}K}`;
                },
                rich: {
                  title: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#000',
                    backgroundColor: '#fff',
                    padding: [8, 16],
                    borderRadius: 8,
                    borderWidth: 3,
                    borderColor: '#000'
                  },
                  value: {
                    fontSize: 14,
                    color: '#000',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            {
              // 하위 레벨 (회사) 스타일
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
                gapWidth: 1,
                color: '#3b82f6'
              },
              label: {
                show: true,
                position: 'inside',
                formatter: function (params: any) {
                  const data = params.data;
                  return `{company|${data.name}}\n{value|${(data.value / 1000).toFixed(0)}K}`;
                },
                rich: {
                  company: {
                    fontSize: 11,
                    fontWeight: 'bold',
                    color: '#fff'
                  },
                  value: {
                    fontSize: 9,
                    color: '#fff',
                    opacity: 0.9
                  }
                }
              }
            }
          ]
        }
      ]
    };
  }, [data]);

  // 노드 클릭 핸들러
  const handleNodeClick = (params: any) => {
    if (onNodeClick && params.data) {
      onNodeClick(params.data);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactECharts
        option={option}
        style={{ width: '100%', height: '100%' }}
        onEvents={{
          click: handleNodeClick
        }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default EChartsTreemap;
