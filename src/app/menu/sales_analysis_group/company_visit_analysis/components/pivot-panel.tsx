'use client';

import React, { useState } from 'react';
import { Settings, Play, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { TreemapNode, TreeLabel } from '../types';

interface PivotPanelProps {
  treeLabels: TreeLabel[];
  selectedValue: string;
  onReorderLabels: (labels: TreeLabel[]) => void;
  onValueChange: (value: string) => void;
  selectedNode: TreemapNode | null;
}

const PivotPanel: React.FC<PivotPanelProps> = ({
  treeLabels,
  selectedValue,
  onReorderLabels,
  onValueChange,
  selectedNode
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 사용 가능한 필드들
  const availableFields = [
    { name: 'Qty', icon: '🔢' },
    { name: 'Value', icon: '💰' },
    { name: 'Company', icon: '🏢' },
    { name: 'Country', icon: '🌍' },
    { name: 'Person', icon: '👤' },
    { name: 'Year', icon: '📅' },
    { name: 'Month', icon: '📆' }
  ];

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  // 드래그 오버
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 드롭
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newLabels = [...treeLabels];
    const draggedItem = newLabels[draggedIndex];
    newLabels.splice(draggedIndex, 1);
    newLabels.splice(dropIndex, 0, draggedItem);
    
    // 순서 업데이트
    const updatedLabels = newLabels.map((label, index) => ({
      ...label,
      order: index + 1
    }));

    onReorderLabels(updatedLabels);
    setDraggedIndex(null);
  };

  return (
    <div className="w-72 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-medium">D3 TreeMap and Pivot Matrix integration</span>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
            <Play className="h-4 w-4" />
          </Button>
          <Select defaultValue="dock">
            <SelectTrigger className="w-20 h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dock">Dock</SelectItem>
              <SelectItem value="undock">Undock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* All fields 섹션 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">All fields</span>
          <div className="flex items-center space-x-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Settings className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Play className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          {availableFields.map((field) => (
            <div key={field.name} className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-xs">{field.icon}</span>
              <span>{field.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Values 섹션 */}
      <div className="p-4 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Values</span>
        <div className="mt-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-xs">💰</span>
            <span>{selectedValue}</span>
          </div>
        </div>
      </div>

      {/* Tree labels 섹션 */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <span className="text-sm font-medium text-gray-700">Tree labels</span>
        <div className="mt-2 space-y-1">
          {treeLabels.map((label, index) => (
            <div
              key={label.name}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="flex items-center space-x-2 p-2 bg-white rounded border cursor-move hover:bg-gray-50"
            >
              <GripVertical className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium">{label.name}</span>
              <span className="text-xs text-gray-500">
                {label.direction === '↑' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 선택된 노드 정보 */}
      {selectedNode && (
        <div className="p-4 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Selected Node</span>
          <div className="mt-2 p-2 bg-white rounded border">
            <div className="text-sm">
              <div className="font-medium">{selectedNode.name}</div>
              <div className="text-gray-600">Value: ${(selectedNode.value / 1000).toFixed(0)}K</div>
              {selectedNode.qty && <div className="text-gray-600">Qty: {selectedNode.qty}</div>}
            </div>
          </div>
        </div>
      )}

      {/* 현재 표시 값 */}
      <div className="mt-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="text-xs text-gray-600 mb-1">Current Display Value</div>
          <div className="text-sm text-blue-800 font-medium">{selectedValue}</div>
        </div>
      </div>
    </div>
  );
};

export default PivotPanel;
