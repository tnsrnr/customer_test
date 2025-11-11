'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TreemapNode } from '../types';

interface D3TreemapProps {
  data: TreemapNode[];
  onNodeClick?: (node: TreemapNode) => void;
}

const D3Treemap: React.FC<D3TreemapProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) {
      return;
    }

    // 기존 SVG 내용 제거
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const container = svg.node()?.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // SVG 크기 설정
    svg.attr('width', width).attr('height', height);

    // 트리맵 레이아웃 생성
    const treemap = d3.treemap<TreemapNode>()
      .size([width, height])
      .paddingOuter(2)
      .paddingTop(15)
      .paddingInner(1)
      .round(true);

    // 데이터를 D3 계층 구조로 변환 (sum 함수 사용하지 않음)
    const root = d3.hierarchy({ children: data })
      .sort((a, b) => (b.value || 0) - (a.value || 0));
    
    // 수동으로 값 설정 (D3가 자동으로 계산하지 않도록)
    root.eachBefore(function(d) {
      if (d.children) {
        // 부모 노드의 값을 자식들의 합계로 설정하지 않고 원래 값 유지
        d.value = d.data.value || 0;
      } else {
        // 리프 노드는 원래 값 사용
        d.value = d.data.value || 0;
      }
    });

    treemap(root);

    // 색상 스케일
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 노드 렌더링
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('cursor', 'pointer');

    // 사각형 그리기
    nodes.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        if (d.depth === 0) return '#f0f0f0';
        if (d.depth === 1) return colorScale(d.data.name);
        return d3.color(colorScale(d.parent?.data.name || ''))?.brighter(0.5) || '#ccc';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke', '#000')
          .attr('stroke-width', 2);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);
      })
      .on('click', function(event, d) {
        if (onNodeClick) {
          onNodeClick(d.data);
        }
      });

    // 텍스트 표시 - 개선된 로직
    nodes.each(function(d) {
      const node = d3.select(this);
      const width = d.x1 - d.x0;
      const height = d.y1 - d.y0;
      const minSize = Math.min(width, height);
      
      // 충분한 공간이 있을 때만 텍스트 표시
      if (width >= 40 && height >= 25) {
        // 회사명 표시
        const nameText = node.append('text')
          .attr('x', width / 2)
          .attr('y', height / 2 - 6)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', Math.max(10, Math.min(14, minSize / 6)) + 'px')
          .attr('fill', d.depth === 0 ? '#000' : '#fff')
          .attr('font-weight', d.depth === 0 ? 'bold' : 'normal')
          .text(d.data.name);

        // 값 표시 (충분한 공간이 있을 때만)
        if (width >= 60 && height >= 35) {
          node.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2 + 8)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', Math.max(8, Math.min(12, minSize / 8)) + 'px')
            .attr('fill', d.depth === 0 ? '#000' : '#fff')
            .text(d.depth > 0 ? `$${(d.value / 1000).toFixed(0)}K` : '');
        }
      }
    });

  }, [data, onNodeClick]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default D3Treemap;
