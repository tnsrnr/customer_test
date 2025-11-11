'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TreeLabelConfig } from '../types';

interface DraggableTreeLabelsProps {
  labels: TreeLabelConfig[];
  onReorder: (newOrder: TreeLabelConfig[]) => void;
  onToggle: (labelName: string) => void;
}

interface SortableItemProps {
  label: TreeLabelConfig;
  onToggle: (labelName: string) => void;
}

function SortableItem({ label, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: label.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded border border-gray-200 bg-white"
    >
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center gap-1 text-gray-400 cursor-grab active:cursor-grabbing"
      >
        <span>⋮⋮</span>
      </div>
      <div 
        className="flex items-center gap-2 flex-1 cursor-pointer hover:bg-gray-50 rounded p-1"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(label.name);
        }}
      >
        <span className="text-blue-600 text-lg">{label.selected ? '☑' : '☐'}</span>
        <span className="text-blue-600">{label.direction}</span>
        <span className={`text-sm ${label.selected ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
          {label.name}
        </span>
      </div>
    </div>
  );
}

export function DraggableTreeLabels({ labels, onReorder, onToggle }: DraggableTreeLabelsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = labels.findIndex((label) => label.name === active.id);
      const newIndex = labels.findIndex((label) => label.name === over?.id);

      const newLabels = arrayMove(labels, oldIndex, newIndex);
      
      // order 업데이트
      const updatedLabels = newLabels.map((label, index) => ({
        ...label,
        order: index + 1
      }));

      onReorder(updatedLabels);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={labels.map(label => label.name)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {labels.map((label) => (
            <SortableItem
              key={label.name}
              label={label}
              onToggle={onToggle}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
