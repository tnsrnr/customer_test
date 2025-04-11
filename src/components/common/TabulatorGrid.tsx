'use client';

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import "tabulator-tables/dist/css/tabulator.min.css";

interface TabulatorGridProps {
  // 필수 속성
  data: any[];
  columns: any[];
  
  // 옵션 속성
  height?: string;
  layout?: string;
  pagination?: boolean;
  paginationSize?: number;
  paginationSizeSelector?: number[];
  selectable?: boolean;
  selectableRange?: boolean;
  selectableRangeColumns?: boolean;
  selectableRangeRows?: boolean;
  selectableRangeClearCells?: boolean;
  
  // 클립보드 관련
  enableClipboard?: boolean;
  clipboardCopyStyled?: boolean;
  
  // 이벤트 콜백
  onCellSelectionChanged?: (message: string) => void;
  onClipboardCopied?: (message: string) => void;
  
  // 편집 기능
  editable?: boolean;
  
  // 추가 옵션 (타블레이터에 직접 전달할 옵션)
  additionalOptions?: Record<string, any>;
  
  // 커스텀 UI
  showCopyButton?: boolean;
  showSelectionButtons?: boolean;
}

export interface TabulatorGridRef {
  getTable: () => Tabulator | null;
  clearSelection: () => void;
  copySelection: () => void;
}

const TabulatorGrid = forwardRef<TabulatorGridRef, TabulatorGridProps>((props, ref) => {
  const {
    data,
    columns,
    height = "500px",
    layout = "fitColumns",
    pagination = false,
    paginationSize = 10,
    paginationSizeSelector = [5, 10, 20, 50, 100],
    selectable = false,
    selectableRange = false,
    selectableRangeColumns = false,
    selectableRangeRows = false,
    selectableRangeClearCells = true,
    enableClipboard = false,
    clipboardCopyStyled = false,
    onCellSelectionChanged,
    onClipboardCopied,
    editable = false,
    additionalOptions = {},
    showCopyButton = false,
    showSelectionButtons = false,
  } = props;
  
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  
  // 선택한 영역 복사 함수
  const copySelectedRange = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("range");
        setSelectedMessage("선택한 영역이 클립보드에 복사되었습니다.");
        
        if (onClipboardCopied) {
          onClipboardCopied("선택한 영역이 클립보드에 복사되었습니다.");
        }
        
        // 3초 후 메시지 제거
        setTimeout(() => {
          setSelectedMessage("");
        }, 3000);
      } catch (err) {
        console.error("복사 실패:", err);
      }
    }
  };
  
  // 선택한 셀 영역 초기화 함수 (DOM 직접 조작 방식)
  const clearSelection = () => {
    try {
      // 1. 선택된 셀 클래스 제거 (DOM 전용 방식)
      const selectedCells = document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected, .tabulator-range-selected');
      selectedCells.forEach(el => {
        el.classList.remove('tabulator-selected');
        el.classList.remove('tabulator-range-selected');
      });
      
      // 2. 오버레이 요소 제거
      const overlays = document.querySelectorAll('.tabulator-range-overlay, .tabulator-cell-selecting, .tabulator-selected-ranges');
      overlays.forEach(el => {
        el.remove();
      });
      
      // 3. 전역 선택 객체 초기화
      if (document.getSelection) {
        document.getSelection()?.removeAllRanges();
      }
      
      // 4. 활성 요소에서 포커스 제거
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      // 5. CSS 스타일로 강제 초기화
      const style = document.createElement('style');
      style.setAttribute('id', 'tabulator-reset-style');
      style.textContent = `
        .tabulator-selected, 
        .tabulator-cell.tabulator-selected, 
        .tabulator-row.tabulator-selected,
        .tabulator-range-selected { 
          background-color: transparent !important; 
          border: none !important;
          outline: none !important;
        }
        .tabulator-range-overlay, 
        .tabulator-cell-selecting,
        .tabulator-selected-ranges { 
          display: none !important;
          opacity: 0 !important; 
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);
      
      // 6. Tabulator API 호출 시도 (마지막에 시도)
      if (tabulator) {
        try {
          // @ts-ignore
          tabulator.deselectRow(); // 행 선택 해제
          
          // @ts-ignore
          if (tabulator.modules && tabulator.modules.selectRange) {
            // @ts-ignore
            tabulator.modules.selectRange.clearRange();
          }
          
          // @ts-ignore
          tabulator.element.dispatchEvent(new Event('rangeClear')); // 이벤트 발생
        } catch (apiErr) {
          console.log('Tabulator API 호출 실패:', apiErr);
        }
      }
      
      // 상태 메시지 초기화
      setSelectedMessage("");
      
      // 일정 시간 후 스타일 제거
      setTimeout(() => {
        const tempStyle = document.getElementById('tabulator-reset-style');
        if (tempStyle) {
          tempStyle.remove();
        }
        
        // 성공 여부 확인
        const remainingSelected = document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected');
        const remainingOverlays = document.querySelectorAll('.tabulator-range-overlay');
        
        // 강제로 다시 시도
        if (remainingSelected.length > 0 || remainingOverlays.length > 0) {
          remainingSelected.forEach(el => el.classList.remove('tabulator-selected'));
          remainingOverlays.forEach(el => el.remove());
        }
        
        // 테이블 리드로우 시도 (마지막 수단)
        if (tabulator) {
          try {
            // @ts-ignore
            tabulator.redraw(false);
          } catch (e) {
            // 조용히 오류 무시
          }
        }
      }, 100);
    } catch (err) {
      console.error('선택 해제 중 오류:', err);
      
      // 오류 발생 시 가장 기본적인 방법으로 선택 해제 재시도
      try {
        document.querySelectorAll('.tabulator-selected').forEach(el => {
          el.classList.remove('tabulator-selected');
        });
      } catch (e) {
        // 마지막 시도마저 실패하면 조용히 무시
      }
    }
  };
  
  // ref를 통해 외부에서 메서드 접근 가능하도록 설정
  useImperativeHandle(ref, () => ({
    getTable: () => tabulator,
    clearSelection,
    copySelection: copySelectedRange
  }));
  
  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current && data && columns) {
      // 기본 옵션 설정
      const options: any = {
        data: data,
        columns: columns,
        layout: layout,
        height: height,
        
        // 셀 선택 범위 설정
        selectable: selectable,
        selectableRange: selectableRange,
        selectableRangeColumns: selectableRangeColumns,
        selectableRangeRows: selectableRangeRows,
        selectableRangeClearCells: selectableRangeClearCells,
        
        // 편집 모드 트리거 설정
        editTriggerEvent: editable ? "dblclick" : false,
        
        // 클립보드 설정
        clipboard: enableClipboard,
        clipboardCopyStyled: clipboardCopyStyled,
        clipboardCopyConfig: {
          rowHeaders: false,
          columnHeaders: false,
        },
        clipboardCopyRowRange: "range", // 선택한 범위만 행 복사
        clipboardCopySelector: "range", // 선택한 범위만 복사
        
        // 페이징 설정
        pagination: pagination,
        paginationSize: paginationSize,
        paginationSizeSelector: paginationSizeSelector,
        paginationCounter: "rows",
        
        // 이벤트 핸들러
        clipboardCopied: function(clipboard: string) {
          setSelectedMessage("선택한 영역이 클립보드에 복사되었습니다.");
          
          if (onClipboardCopied) {
            onClipboardCopied("선택한 영역이 클립보드에 복사되었습니다.");
          }
          
          // 3초 후 메시지 제거
          setTimeout(() => {
            setSelectedMessage("");
          }, 3000);
        },
        
        cellSelectionChanged: function() {
          const message = "셀 범위가 선택되었습니다. Ctrl+C 또는 복사 버튼을 클릭하세요.";
          setSelectedMessage(message);
          
          if (onCellSelectionChanged) {
            onCellSelectionChanged(message);
          }
        },
        
        // 추가 옵션 적용
        ...additionalOptions
      };
      
      // 테이블 생성
      const table = new Tabulator(tableRef.current, options);
      setTabulator(table);
      
      // 문서 클릭 이벤트 리스너 - 테이블 외부 클릭 시 선택 초기화
      const handleDocumentClick = (e: MouseEvent) => {
        const tableElement = tableRef.current;
        if (tableElement && !tableElement.contains(e.target as Node)) {
          clearSelection();
        }
      };
      
      // 키보드 이벤트 리스너 - ESC 키 누를 때 선택 초기화
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          clearSelection();
        }
      };
      
      // 이벤트 리스너 등록
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleKeyDown);
      
      // 클린업 함수
      return () => {
        if (table) {
          table.destroy();
        }
        document.removeEventListener('click', handleDocumentClick);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [data, columns]); // 의존성 배열에 주요 속성만 포함

  return (
    <div className="w-full">
      {selectedMessage && (
        <div className="text-sm text-muted-foreground mb-2">
          {selectedMessage}
        </div>
      )}
      
      {showCopyButton && (
        <div className="flex justify-end mb-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center" 
            onClick={copySelectedRange}
          >
            <Copy className="h-4 w-4 mr-2" />
            선택 영역 복사
          </Button>
        </div>
      )}
      
      <div 
        ref={tableRef} 
        className="w-full" 
        tabIndex={0}
      ></div>
    </div>
  );
});

TabulatorGrid.displayName = "TabulatorGrid";

export default TabulatorGrid; 