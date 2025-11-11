'use client';

import React, { useEffect } from 'react';
import { useTreemapStore } from './store';
import { Card } from '@/common/components/ui/card';
import { Button } from '@/common/components/ui/button';
import D3Treemap from './components/d3-treemap';
import { DraggableTreeLabels } from './components/draggable-tree-labels';

const PerformanceAnalysisTreemapPage = () => {
  const {
    data,
    loading,
    error,
    filters,
    setFilters,
    fetchPerformanceData,
    toggleField,
    toggleTreeLabel,
    setValueField,
    reorderTreeLabels,
  } = useTreemapStore();

  // 초기 데이터 로드
  useEffect(() => {
    fetchPerformanceData('2025');
  }, [fetchPerformanceData]);

  // 데이터 변경 감지
  useEffect(() => {
    console.log('Page useEffect - data changed:', data);
    console.log('Page useEffect - data length:', data?.length);
  }, [data]);

  const handleNodeClick = (node: any) => {
    console.log('Clicked node:', node);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="p-6 max-w-md">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">데이터 로드 오류</h2>
          <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchPerformanceData(filters.period)}>
            다시 시도
            </Button>
        </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 p-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 2rem)' }}>
        {/* Header Bar - Blue */}
        <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">경영실적 트리맵 및 피벗 매트릭스 통합</h1>
          <div className="flex items-center gap-4">
            <select className="bg-white text-gray-800 px-3 py-1 rounded text-sm">
              <option>도킹</option>
              <option>분리</option>
            </select>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-4 flex-wrap">

            {/* View Mode Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">표시 값:</label>
              <div className="flex gap-1">
                {[
                  { value: 'revenue', label: '매출액', fieldName: '매출액' },
                  { value: 'profit', label: '영업이익', fieldName: '영업이익' },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    className={`px-3 py-1 text-sm rounded border ${
                      filters.viewMode === mode.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setFilters({ viewMode: mode.value as any });
                      setValueField(mode.fieldName);
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">카테고리:</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ category: e.target.value as any })}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="domestic">국내</option>
                <option value="overseas">해외</option>
                <option value="division">사업부별</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">정렬:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="value">값 기준</option>
                <option value="growth">성장률 기준</option>
                <option value="name">이름 기준</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Main Content Area - Fixed Height */}
        <div className="flex" style={{ height: '600px' }}>
          {/* Left Side - Treemap Area */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Treemap Content Area - Fixed Height */}
            {loading && (
              <div className="bg-white flex items-center justify-center h-full">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600 text-sm">데이터를 불러오는 중...</p>
                </div>
              </div>
            )}

            {!loading && data && data.length > 0 && (
              <div className="bg-white h-full">
                <D3Treemap data={data} onNodeClick={handleNodeClick} />
              </div>
            )}

            {!loading && (!data || data.length === 0) && (
              <div className="bg-white flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 text-4xl mb-3">📊</div>
                  <h3 className="text-lg font-bold text-gray-700 mb-1">데이터가 없습니다</h3>
                  <p className="text-gray-600 text-sm">조회 조건을 변경해보세요</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Tree Labels Only */}
          <div className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col" style={{ height: '600px' }}>
            {/* Tree Labels Section */}
            <div className="bg-blue-600 text-white px-4 py-2">
              <span className="font-medium">트리 레이블 (계층 구조)</span>
            </div>
            
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-3">
                드래그하여 순서를 변경하세요
              </p>
              <DraggableTreeLabels
                labels={filters.treeLabels}
                onReorder={reorderTreeLabels}
                onToggle={toggleTreeLabel}
              />
            </div>

            {/* Current Value Display */}
            <div className="mt-auto border-t border-gray-200 p-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="text-xs text-gray-600 mb-1">현재 표시 값</div>
                <div className="text-sm text-blue-800 font-medium">
                  {filters.selectedValueField}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default PerformanceAnalysisTreemapPage;