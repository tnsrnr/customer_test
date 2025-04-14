'use client';

import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

// 타입 정의
export interface DataType {
  [key: string]: any;
}

export interface RowComponent {
  getData(): any;
  getElement(): HTMLElement;
  getCells(): CellComponent[];
  getCell(column: string): CellComponent;
  select(): void;
  deselect(): void;
  toggleSelect(): void;
  isSelected(): boolean;
}

export interface CellComponent {
  getValue(): any;
  getElement(): HTMLElement;
  getRow(): RowComponent;
  getField(): string;
}

export interface ColumnDefinitionType {
  title: string;
  field?: string;
  formatter?: string | Function;
  formatterParams?: any;
  headerSort?: boolean;
  sorter?: string | Function;
  width?: number | string;
  hozAlign?: string;
  vertAlign?: string;
  frozen?: boolean;
  headerHozAlign?: string;
  cssClass?: string;
  headerFilter?: boolean;
  titleFormatter?: string | Function;
  resizable?: boolean;
  [key: string]: any;
}

export interface TabulatorGridProps {
  data: DataType[];
  columns: ColumnDefinitionType[];
  height?: string;
  layout?: string;
  pagination?: boolean;
  paginationSize?: number;
  paginationSizeSelector?: number[];
  movableColumns?: boolean;
  selectable?: boolean;
  selectableRollingSelection?: boolean;
  enableCellSelection?: boolean; // 셀 선택 활성화
  enableClipboard?: boolean; // 클립보드 기능 활성화
  showSelectionControls?: boolean; // 선택 컨트롤 표시 여부
  enableCellSelectionOnRowSelect?: boolean; // 행 선택 시 셀 선택 초기화 여부
  onRowSelected?: (row: RowComponent) => void;
  onRowDeselected?: (row: RowComponent) => void;
  onSelectionChanged?: (message: string) => void;
  onCopySuccess?: (message: string) => void;
  className?: string;
  additionalOptions?: Record<string, any>;
}

// Ref를 통해 외부에서 접근 가능한 메서드 정의
export interface TabulatorGridRef {
  getTable: () => Tabulator | null;
  clearSelection: () => void;
  copySelection: () => void;
}

// 컴포넌트 구현
const TabulatorGrid = forwardRef<TabulatorGridRef, TabulatorGridProps>((props, ref) => {
  const {
    data,
    columns,
    height = "auto",
    layout = "fitColumns",
    pagination = true,
    paginationSize = 20,
    paginationSizeSelector = [5, 10, 20, 50, 100],
    movableColumns = true,
    selectable = true,
    selectableRollingSelection = false,
    enableCellSelection = true,
    enableClipboard = true,
    showSelectionControls = false,
    enableCellSelectionOnRowSelect = true,
    onRowSelected,
    onRowDeselected,
    onSelectionChanged,
    onCopySuccess,
    className = "",
    additionalOptions = {
      responsiveLayout: "hide",
      autoResize: true,
      layoutColumnsOnNewData: true,
      maxHeight: "500px"
    }
  } = props;

  // Refs
  const tableRef = useRef<HTMLDivElement>(null);
  const tabulatorRef = useRef<Tabulator | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // State - 최소한의 상태만 유지
  const [copyStatus, setCopyStatus] = useState<string>("");
  
  // 선택 관련 state
  const selectedCells = useRef<HTMLElement[]>([]);
  const selectedRows = useRef<Set<string>>(new Set());
  
  // 드래그 및 선택 관련 변수
  const isDragging = useRef<boolean>(false);
  const startCell = useRef<HTMLElement | null>(null);
  const lastSelectedCell = useRef<HTMLElement | null>(null);
  const shiftStartCell = useRef<HTMLElement | null>(null);

  // 외부에서 접근 가능한 메서드 설정
  useImperativeHandle(ref, () => ({
    getTable: () => tabulatorRef.current,
    clearSelection: handleClearSelection,
    copySelection: handleCopySelection
  }));

  // 셀 선택 추가
  const addCellSelection = (cell: HTMLElement) => {
    if (!cell.classList.contains('selected-cell')) {
      cell.classList.add('selected-cell');
      if (!selectedCells.current.includes(cell)) {
        selectedCells.current.push(cell);
        onSelectionChanged?.(
          `${selectedCells.current.length}개 셀 선택됨`
        );
      }
    }
  };
  
  // 셀 선택 토글
  const toggleCellSelection = (cell: HTMLElement) => {
    if (cell.classList.contains('selected-cell')) {
      cell.classList.remove('selected-cell');
      selectedCells.current = selectedCells.current.filter(c => c !== cell);
    } else {
      cell.classList.add('selected-cell');
      selectedCells.current.push(cell);
    }
    onSelectionChanged?.(
      `${selectedCells.current.length}개 셀 선택됨`
    );
  };
  
  // 셀 선택 해제
  const clearCellSelection = () => {
    document.querySelectorAll('.selected-cell').forEach(cell => {
      cell.classList.remove('selected-cell');
      cell.classList.remove('drag-selected');
    });
    selectedCells.current = [];
    onSelectionChanged?.("셀 선택 해제됨");
  };

  // 셀 영역 선택
  const selectCellRange = (start: HTMLElement, end: HTMLElement) => {
    // 체크박스 열 제외한 모든 셀 가져오기
    const allCells = Array.from(document.querySelectorAll('.tabulator-cell:not([tabulator-field="selected"])'));
    if (!allCells.length) return;
    
    // 시작 셀과 끝 셀의 위치 확인
    const startIndex = allCells.indexOf(start);
    const endIndex = allCells.indexOf(end);
    if (startIndex === -1 || endIndex === -1) return;
    
    // 테이블의 컬럼 수 계산 (체크박스 열 제외)
    const columnCount = document.querySelectorAll('.tabulator-col:not(.tabulator-col-group)').length - 
                       (columns.some(col => col.field === 'selected') ? 1 : 0);
    if (columnCount <= 0) return;
    
    // 시작 셀과 끝 셀의 행/열 인덱스 계산
    const startRowIndex = Math.floor(startIndex / columnCount);
    const startColIndex = startIndex % columnCount;
    const endRowIndex = Math.floor(endIndex / columnCount);
    const endColIndex = endIndex % columnCount;
    
    // 선택 범위 계산
    const minRowIndex = Math.min(startRowIndex, endRowIndex);
    const maxRowIndex = Math.max(startRowIndex, endRowIndex);
    const minColIndex = Math.min(startColIndex, endColIndex);
    const maxColIndex = Math.max(startColIndex, endColIndex);
    
    // 범위 내 모든 셀 선택
    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        const cellIndex = rowIndex * columnCount + colIndex;
        if (cellIndex >= 0 && cellIndex < allCells.length) {
          const cell = allCells[cellIndex] as HTMLElement;
          if (cell) {
            cell.classList.add('selected-cell');
            cell.classList.add('drag-selected');
          }
        }
      }
    }
    
    onSelectionChanged?.(
      `${(maxRowIndex - minRowIndex + 1) * (maxColIndex - minColIndex + 1)}개 셀 선택됨`
    );
  };

  // 셀 클릭 이벤트 처리
  const handleCellClick = (e: MouseEvent) => {
    if (!enableCellSelection) return;
    
    const target = e.target as HTMLElement;
    
    // 체크박스 열은 무시
    if (target.closest('.tabulator-cell[tabulator-field="selected"]')) {
      if (enableCellSelectionOnRowSelect) {
        clearCellSelection();
      }
      return;
    }
    
    // 일반 셀 클릭
    const cell = target.closest('.tabulator-cell') as HTMLElement | null;
    if (!cell) return;
    
    // 헤더 클릭 무시
    if (cell.closest('.tabulator-header')) return;
    
    // Shift 키: 범위 선택
    if (e.shiftKey && shiftStartCell.current) {
      selectCellRange(shiftStartCell.current, cell);
    }
    // Ctrl 키: 개별 셀 토글
    else if (e.ctrlKey || e.metaKey) {
      toggleCellSelection(cell);
      shiftStartCell.current = cell;
    }
    // 일반 클릭: 새 선택
    else {
      clearCellSelection();
      addCellSelection(cell);
      shiftStartCell.current = cell;
    }
  };
  
  // 마우스 다운 이벤트
  const handleMouseDown = (e: MouseEvent) => {
    if (!enableCellSelection || e.shiftKey) return;
    
    const target = e.target as HTMLElement;
    const cell = target.closest('.tabulator-cell') as HTMLElement;
    
    // 체크박스 컬럼이나 헤더는 무시
    if (!cell || 
        cell.getAttribute('tabulator-field') === 'selected' || 
        cell.closest('.tabulator-header')) return;
    
    // 좌클릭만 처리
    if (e.button !== 0) return;
    
    // 드래그 시작
    isDragging.current = true;
    startCell.current = cell;
    lastSelectedCell.current = cell;
    
    // Ctrl 키 없으면 선택 초기화
    if (!e.ctrlKey && !e.metaKey) {
      clearCellSelection();
    }
    
    // 첫 셀 선택
    addCellSelection(cell);
    
    e.preventDefault();
  };
  
  // 마우스 이동 핸들러 (드래그)
  const handleMouseMove = (e: MouseEvent) => {
    if (!enableCellSelection || !isDragging.current || !startCell.current) return;
    
    // 텍스트 선택 방지
    e.preventDefault();
    
    // 현재 셀 확인
    const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementUnderMouse) return;
    
    const currentCell = elementUnderMouse.closest('.tabulator-cell') as HTMLElement;
    if (!currentCell || 
        currentCell.closest('.tabulator-header') || 
        currentCell.getAttribute('tabulator-field') === 'selected') return;
    
    // 마지막으로 처리한 셀과 같으면 중복 처리 방지
    if (lastSelectedCell.current === currentCell) return;
    lastSelectedCell.current = currentCell;
    
    // 임시 선택된 셀 초기화
    document.querySelectorAll('.drag-selected').forEach(cell => {
      cell.classList.remove('drag-selected');
      if (!selectedCells.current.includes(cell as HTMLElement)) {
        cell.classList.remove('selected-cell');
      }
    });
    
    // 범위 선택
    if (startCell.current) {
      selectCellRange(startCell.current, currentCell);
    }
  };
  
  // 마우스 업 핸들러
  const handleMouseUp = (e: MouseEvent) => {
    if (!enableCellSelection || !isDragging.current) return;
    
    // 드래그 선택된 셀 처리
    const dragSelectedCells = document.querySelectorAll('.drag-selected');
    
    // Ctrl 키 없으면 기존 선택 초기화
    if (!e.ctrlKey && !e.metaKey) {
      selectedCells.current.forEach(cell => {
        if (!cell.classList.contains('drag-selected')) {
          cell.classList.remove('selected-cell');
        }
      });
      selectedCells.current = [];
    }
    
    // 선택 목록에 추가
    dragSelectedCells.forEach(cell => {
      const cellElement = cell as HTMLElement;
      if (!selectedCells.current.includes(cellElement)) {
        selectedCells.current.push(cellElement);
      }
    });
    
    isDragging.current = false;
    onSelectionChanged?.(
      `${selectedCells.current.length}개 셀 선택됨`
    );
  };
  
  // 키보드 이벤트
  const handleKeyDown = (e: KeyboardEvent) => {
    // ESC: 선택 해제
    if (e.key === 'Escape') {
      clearCellSelection();
      if (tabulatorRef.current) {
        tabulatorRef.current.deselectRow();
      }
      selectedRows.current.clear();
      shiftStartCell.current = null;
      onSelectionChanged?.("모든 선택 해제됨");
    }
    // Ctrl+C: 복사
    else if (enableClipboard && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      handleCopySelection();
    }
  };

  // 커스텀 이벤트 핸들러 설정
  const setupCustomHandlers = () => {
    if (!tableRef.current || !enableCellSelection) return;
    
    // 테이블 요소
    const tableElement = tableRef.current;
    
    // 일반 셀 선택 이벤트
    tableElement.addEventListener('click', handleCellClick);
    tableElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
  };

  // 복사 기능 구현
  const handleCopySelection = () => {
    if (!tabulatorRef.current) return;
    
    // 복사할 데이터
    let copyData: string[][] = [];
    
    try {
      // DOM에서 선택된 행 확인 (체크박스로 선택된 행)
      const selectedRowElements = document.querySelectorAll('.tabulator-row.tabulator-selected');
      
      // 체크박스로 선택된 행이 있는 경우
      if (selectedRowElements.length > 0) {
        // 컬럼 정의에서 체크박스 열 제외
        const visibleColumns = columns.filter(col => col.field !== 'selected');
        
        // 선택된 각 행에서 데이터 수집
        let rows: DataType[] = [];
        
        // DOM에서 직접 행 ID 추출
        selectedRowElements.forEach(rowEl => {
          // data-id 속성 확인
          const rowId = rowEl.getAttribute('data-id');
          
          if (rowId) {
            // 데이터에서 행 찾기
            const rowData = data.find(r => r.id?.toString() === rowId);
            
            if (rowData) {
              rows.push(rowData);
            } else {
              // 추가 시도: Tabulator 인스턴스에서 행 데이터 직접 가져오기
              try {
                // @ts-ignore - Tabulator API에는 getRow가 있지만 타입이 정의되지 않음
                const rowComponent = tabulatorRef.current?.getRow(rowId);
                if (rowComponent) {
                  const directRowData = rowComponent.getData() as DataType;
                  if (directRowData) {
                    rows.push(directRowData);
                  }
                }
              } catch (rowErr) {
                // 오류 발생 시 조용히 실패
              }
            }
          } else {
            // 대체 방법: 행 인덱스로 데이터 찾기 시도
            try {
              const rowIndex = Array.from(document.querySelectorAll('.tabulator-row')).indexOf(rowEl);
              if (rowIndex >= 0 && rowIndex < data.length) {
                rows.push(data[rowIndex]);
              }
            } catch (indexErr) {
              // 오류 발생 시 조용히 실패
            }
          }
        });
        
        // 복사 데이터 생성
        if (rows.length > 0) {
          rows.forEach(rowData => {
            const rowValues = visibleColumns.map(col => {
              const field = col.field;
              if (!field) return '';
              
              const value = rowData[field];
              
              if (field === 'salary' && typeof value === 'number') {
                return `₩${value.toLocaleString()}`;
              }
              
              return value !== null && value !== undefined ? String(value) : '';
            });
            
            copyData.push(rowValues);
          });
        }
      }
      // 선택된 셀이 있는 경우
      else if (selectedCells.current.length > 0) {
        // 행별로 셀 그룹화
        const rowGroups = new Map<HTMLElement, HTMLElement[]>();
        
        selectedCells.current.forEach(cell => {
          const row = cell.closest('.tabulator-row') as HTMLElement;
          if (!row) return;
          
          if (!rowGroups.has(row)) {
            rowGroups.set(row, []);
          }
          rowGroups.get(row)?.push(cell);
        });
        
        // 행 순서대로 정렬
        const allRows = Array.from(document.querySelectorAll('.tabulator-row')) as HTMLElement[];
        const sortedRows = Array.from(rowGroups.keys()).sort((a, b) => {
          return allRows.indexOf(a) - allRows.indexOf(b);
        });
        
        // 각 행 처리
        sortedRows.forEach(row => {
          const cells = rowGroups.get(row) || [];
          const allCellsInRow = Array.from(row.querySelectorAll('.tabulator-cell:not([tabulator-field="selected"])')) as HTMLElement[];
          
          // 정렬
          const sortedCells = cells.sort((a, b) => {
            return allCellsInRow.indexOf(a) - allCellsInRow.indexOf(b);
          });
          
          // 범위 계산
          const cellIndices = sortedCells.map(cell => allCellsInRow.indexOf(cell));
          const minIndex = Math.min(...cellIndices);
          const maxIndex = Math.max(...cellIndices);
          
          // 데이터 추출
          const rowData: string[] = [];
          for (let i = minIndex; i <= maxIndex; i++) {
            const cell = allCellsInRow[i];
            rowData.push(cell?.textContent?.trim() || '');
          }
          
          if (rowData.some(text => text !== '')) {
            copyData.push(rowData);
          }
        });
      }
      
      // 복사할 내용 없으면 종료
      if (copyData.length === 0) {
        onCopySuccess?.("복사할 내용이 없습니다.");
        setCopyStatus("복사할 내용이 없습니다.");
        setTimeout(() => setCopyStatus(""), 2000);
        return;
      }
      
      // 텍스트 생성 (Windows 스타일 줄바꿈)
      const copyText = copyData.map(row => row.join('\t')).join('\r\n');
      
      // 클립보드에 복사
      if (textareaRef.current) {
        textareaRef.current.value = copyText;
        textareaRef.current.style.display = 'block';
        textareaRef.current.focus();
        textareaRef.current.select();
        
        // 복사 시도
        const success = document.execCommand('copy');
        
        if (success) {
          onCopySuccess?.(`${copyData.length}개 행이 복사되었습니다.`);
          setCopyStatus(`${copyData.length}개 행이 복사되었습니다.`);
        } else {
          // 모던 API 시도
          navigator.clipboard.writeText(copyText)
            .then(() => {
              onCopySuccess?.(`${copyData.length}개 행이 복사되었습니다.`);
              setCopyStatus(`${copyData.length}개 행이 복사되었습니다.`);
            })
            .catch(() => {
              setCopyStatus("복사 실패");
            });
        }
        
        textareaRef.current.style.display = 'none';
      }
    } catch (err) {
      setCopyStatus("복사 중 오류 발생");
      setTimeout(() => setCopyStatus(""), 2000);
    }
    
    setTimeout(() => setCopyStatus(""), 2000);
  };
  
  // 선택 초기화
  const handleClearSelection = () => {
    // 셀 선택 초기화
    clearCellSelection();
    
    // 체크박스 선택 초기화
    if (tabulatorRef.current) {
      tabulatorRef.current.deselectRow();
    }
    selectedRows.current.clear();
    
    onSelectionChanged?.("모든 선택이 해제되었습니다.");
    setCopyStatus("모든 선택이 해제되었습니다.");
    setTimeout(() => setCopyStatus(""), 2000);
  };

  // 셀 선택 완전 초기화 (강제 리셋)
  const forceResetAllCellSelection = () => {
    // 모든 셀 선택 표시 제거
    document.querySelectorAll('.selected-cell, .drag-selected').forEach(cell => {
      cell.classList.remove('selected-cell');
      cell.classList.remove('drag-selected');
    });
    
    // 배열 완전 초기화
    selectedCells.current = [];
    
    // 드래그 관련 상태 초기화
    isDragging.current = false;
    startCell.current = null;
    lastSelectedCell.current = null;
    shiftStartCell.current = null;
  };

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      // Tabulator 기본 옵션
      const options = {
        data: data,
        columns: columns,
        height: height,
        layout: layout,
        pagination: pagination,
        paginationSize: paginationSize,
        paginationSizeSelector: paginationSizeSelector,
        movableColumns: movableColumns,
        selectable: selectable,
        selectableRollingSelection: selectableRollingSelection,
        
        // 행 선택 이벤트
        rowSelected: function(row: any) {
          // 행이 선택될 때마다 ID를 selectedRows에 추가
          const rowData = row.getData();
          if (rowData && rowData.id) {
            selectedRows.current.add(rowData.id.toString());
          }
          
          console.log('행 선택 이벤트 - 모든 셀 선택 초기화');
          // 행 선택 시 모든 셀 선택 강제 초기화
          forceResetAllCellSelection();
          
          // 외부 콜백 호출
          if (onRowSelected) {
            onRowSelected(row);
          }
        },
        
        rowDeselected: function(row: any) {
          // 행이 선택 해제될 때마다 ID를 selectedRows에서 제거
          const rowData = row.getData();
          if (rowData && rowData.id) {
            selectedRows.current.delete(rowData.id.toString());
          }
          
          // 행 선택 해제 시에도 모든 셀 선택 강제 초기화
          forceResetAllCellSelection();
          
          // 외부 콜백 호출
          if (onRowDeselected) {
            onRowDeselected(row);
          }
        },
        ...additionalOptions
      };

      // Tabulator 인스턴스 생성
      tabulatorRef.current = new Tabulator(tableRef.current, options);

      // 테이블 렌더링이 완료되면 이벤트 핸들러 추가
      tabulatorRef.current.on("tableBuilt", () => {
        setupCustomHandlers();
        
        // 페이지에서 모든 체크박스 클릭 이벤트를 감시
        const handleGlobalClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement;
          
          // 체크박스 셀 또는 그 내부 요소인지 확인
          if (target.closest('.tabulator-cell[tabulator-field="selected"]')) {
            console.log('전역 이벤트로 체크박스 클릭 감지');
            
            // 모든 셀 선택 강제 초기화
            setTimeout(() => {
              forceResetAllCellSelection();
            }, 0);
          }
        };
        
        // 문서 레벨에서 클릭 이벤트 감시
        document.addEventListener('click', handleGlobalClick, true);
        
        // 클린업 시 이벤트 제거를 위해 저장
        (window as any)._handleGlobalClick = handleGlobalClick;
      });

      // 스타일 추가
      const styleId = 'tabulator-grid-styles';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .selected-cell {
            background-color: rgba(33, 150, 243, 0.2) !important;
            box-shadow: inset 0 0 0 1px rgba(33, 150, 243, 0.5);
          }
          
          /* 텍스트 선택 비활성화 */
          .tabulator {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color: white !important;
            width: 100% !important;
          }

          /* 테이블 배경색 설정 */
          .tabulator-tableHolder {
            background-color: white !important;
          }

          /* 셀 배경색 설정 */
          .tabulator-cell {
            background-color: white !important;
          }
          
          /* 행 스타일링 */
          .tabulator-row {
            background-color: white !important;
          }

          .tabulator-row:nth-child(even) {
            background-color: #f9f9f9 !important;
          }

          /* 빈 공간 스타일링 */
          .tabulator-tableholder {
            background-color: white !important;
          }

          /* 테이블 영역 */
          .tabulator-table {
            background-color: white !important;
          }

          /* 헤더 스타일링 */
          .tabulator-header {
            background-color: #f5f5f5 !important;
          }

          .tabulator .tabulator-header .tabulator-col {
            background-color: #f5f5f5 !important;
            border-right: 1px solid rgba(0, 0, 0, 0.05);
          }
        `;
        document.head.appendChild(style);
      }
      
      // 클린업 함수
      return () => {
        // 테이블 이벤트 리스너 제거
        if (tableRef.current) {
          tableRef.current.removeEventListener('click', handleCellClick);
          tableRef.current.removeEventListener('mousedown', handleMouseDown);
        }
        
        // 문서 이벤트 리스너 제거
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('keydown', handleKeyDown);
        
        // 전역 체크박스 클릭 이벤트 리스너 제거
        if ((window as any)._handleGlobalClick) {
          document.removeEventListener('click', (window as any)._handleGlobalClick, true);
          delete (window as any)._handleGlobalClick;
        }
        
        // Tabulator 인스턴스 제거
        if (tabulatorRef.current) {
          tabulatorRef.current.destroy();
        }
      };
    }
  }, [data, columns]); // 데이터나 컬럼이 변경될 때만 다시 렌더링

  return (
    <div className={`tabulator-grid-wrapper ${className}`} style={{ backgroundColor: 'white', width: '100%' }}>
      <div className="border rounded" style={{ backgroundColor: 'white', overflow: 'hidden' }}>
        <div ref={tableRef} className="w-full" style={{ backgroundColor: 'white' }}></div>
      </div>
      
      {/* 복사를 위한 숨겨진 텍스트 영역 */}
      <textarea
        ref={textareaRef}
        style={{ position: 'absolute', left: '-9999px', top: 0 }}
        aria-hidden="true"
      />
    </div>
  );
});

TabulatorGrid.displayName = 'TabulatorGrid';

export default TabulatorGrid; 