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
    console.log('D3Treemap useEffect - data:', data);
    console.log('D3Treemap useEffect - data length:', data?.length);
    
    if (!data || data.length === 0 || !svgRef.current) {
      console.log('D3Treemap: No data or no SVG ref');
      return;
    }

    // 기존 SVG 내용 제거
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const container = svg.node()?.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log('D3Treemap - container size:', { width, height });

    // SVG 크기 설정
    svg.attr('width', width).attr('height', height);

    // 간단한 트리맵 레이아웃 생성
    const treemap = d3.treemap<TreemapNode>()
      .size([width, height])
      .paddingOuter(8)
      .paddingTop(60)
      .paddingInner(4)
      .round(true);

    // 데이터를 D3 계층 구조로 변환
    const root = d3.hierarchy({ children: data })
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    console.log('D3Treemap - root:', root);
    console.log('D3Treemap - root.children:', root.children);
    
    // 데이터 검증 로그 추가
    if (root.children) {
      root.children.forEach(yearNode => {
        console.log(`Year ${yearNode.data.name}: value=${yearNode.value}, children count=${yearNode.children?.length || 0}`);
        if (yearNode.children) {
          const childrenSum = yearNode.children.reduce((sum, child) => sum + child.value, 0);
          console.log(`  Children sum: ${childrenSum}, Parent value: ${yearNode.value}`);
          console.log(`  Difference: ${yearNode.value - childrenSum}`);
        }
      });
    }

    treemap(root);

    // 상위 레벨 (연도) 렌더링
    const yearGroups = svg.selectAll('.year-group')
      .data(root.children || [])
      .enter()
      .append('g')
      .attr('class', 'year-group');

    console.log('D3Treemap - yearGroups count:', yearGroups.size());

    // 연도별 배경 영역
    yearGroups.append('rect')
      .attr('x', d => d.x0 || 0)
      .attr('y', d => d.y0 || 0)
      .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
      .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
      .attr('fill', '#f0f8ff')
      .attr('stroke', '#000')
      .attr('stroke-width', 4)
      .attr('rx', 8)
      .attr('ry', 8);

    // 연도 레이블 (상위 레이블 명칭 표시)
    yearGroups.append('text')
      .attr('x', d => ((d.x0 || 0) + (d.x1 || 0)) / 2)
      .attr('y', (d => (d.y0 || 0) + 30))
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .attr('background', '#fff')
      .style('background-color', '#fff')
      .style('padding', '8px 16px')
      .style('border-radius', '8px')
      .style('border', '3px solid #000')
      .text(d => {
        // 연도인지 회사인지에 따라 표시 텍스트 결정
        const isYear = /^\d{4}$/.test(d.data.name);
        return isYear ? `${d.data.name}년` : d.data.name;
      });

    // 연도 총 매출액 표시
    yearGroups.append('text')
      .attr('x', d => ((d.x0 || 0) + (d.x1 || 0)) / 2)
      .attr('y', (d => (d.y0 || 0) + 50))
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .text(d => `${((d.value || 0) / 1000).toFixed(0)}K`);

    // 하위 레벨 (회사) 렌더링
    yearGroups.each(function(yearNode) {
      const yearGroup = d3.select(this);
      
      const companyNodes = yearNode.children || [];
      
      const companies = yearGroup.selectAll('.company')
        .data(companyNodes)
        .enter()
        .append('g')
        .attr('class', 'company')
        .style('cursor', 'pointer');

      // 회사별 배경 영역
      companies.append('rect')
        .attr('x', d => d.x0 || 0)
        .attr('y', d => d.y0 || 0)
        .attr('width', d => (d.x1 || 0) - (d.x0 || 0))
        .attr('height', d => (d.y1 || 0) - (d.y0 || 0))
        .attr('fill', '#3b82f6')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('rx', 4)
        .attr('ry', 4)
        .on('mouseover', function() {
          d3.select(this)
            .attr('fill', '#2563eb')
            .attr('stroke-width', 3);
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('fill', '#3b82f6')
            .attr('stroke-width', 2);
        })
        .on('click', function(event, d) {
          if (onNodeClick) {
            onNodeClick(d.data);
          }
        });

      // 회사명 표시
      companies.append('text')
        .attr('x', d => ((d.x0 || 0) + (d.x1 || 0)) / 2)
        .attr('y', d => ((d.y0 || 0) + (d.y1 || 0)) / 2 - 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', '#fff')
        .text(d => d.data.name);

      // 회사 매출액 표시
      companies.append('text')
        .attr('x', d => ((d.x0 || 0) + (d.x1 || 0)) / 2)
        .attr('y', d => ((d.y0 || 0) + (d.y1 || 0)) / 2 + 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '500')
        .attr('fill', '#fff')
        .attr('opacity', 0.9)
        .text(d => `${((d.value || 0) / 1000).toFixed(0)}K`);
    });

  }, [data, onNodeClick]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <div>데이터가 없습니다.</div>
          <div className="text-sm text-gray-400 mt-1">데이터 길이: {data?.length || 0}</div>
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
