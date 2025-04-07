'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Download, ClipboardCopy, FileDown, Clipboard } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { toast } from "sonner";
import "tabulator-tables/dist/css/tabulator.min.css";

// 제품 데이터 인터페이스
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  lastUpdated: string;
}

// 선택된 셀 인터페이스
interface SelectedCell {
  row: number;
  col: number;
}

// 셀 데이터 인터페이스
interface CellData extends SelectedCell {
  value: any;
}

export default function TabulatorCopyPasteEnhanced() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [selectionStart, setSelectionStart] = useState<SelectedCell | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<SelectedCell | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  // 샘플 데이터
  const products: Product[] = [
    { id: 1, name: "스마트폰 A", category: "전자제품", price: 899000, stock: 120, supplier: "테크코리아", lastUpdated: "2023-11-05" },
    { id: 2, name: "노트북 프로", category: "전자제품", price: 1450000, stock: 78, supplier: "디지털월드", lastUpdated: "2023-11-10" },
    { id: 3, name: "무선 이어폰", category: "액세서리", price: 159000, stock: 240, supplier: "테크코리아", lastUpdated: "2023-11-12" },
    { id: 4, name: "스마트워치", category: "웨어러블", price: 299000, stock: 95, supplier: "웨어테크", lastUpdated: "2023-11-15" },
    { id: 5, name: "태블릿 12인치", category: "전자제품", price: 749000, stock: 62, supplier: "디지털월드", lastUpdated: "2023-11-18" },
    { id: 6, name: "블루투스 스피커", category: "액세서리", price: 89000, stock: 185, supplier: "사운드플러스", lastUpdated: "2023-11-20" },
    { id: 7, name: "게이밍 마우스", category: "컴퓨터 주변기기", price: 78000, stock: 210, supplier: "게이머기어", lastUpdated: "2023-11-22" },
    { id: 8, name: "기계식 키보드", category: "컴퓨터 주변기기", price: 129000, stock: 135, supplier: "게이머기어", lastUpdated: "2023-11-25" },
    { id: 9, name: "모니터 27인치", category: "전자제품", price: 349000, stock: 48, supplier: "디스플레이테크", lastUpdated: "2023-11-28" },
    { id: 10, name: "외장 하드 1TB", category: "저장장치", price: 99000, stock: 320, supplier: "데이터세이브", lastUpdated: "2023-12-01" },
    { id: 11, name: "그래픽카드", category: "컴퓨터 부품", price: 689000, stock: 32, supplier: "컴퓨텍", lastUpdated: "2023-12-03" },
    { id: 12, name: "CPU 프로세서", category: "컴퓨터 부품", price: 459000, stock: 55, supplier: "컴퓨텍", lastUpdated: "2023-12-05" },
    { id: 13, name: "메모리 16GB", category: "컴퓨터 부품", price: 109000, stock: 180, supplier: "메모리월드", lastUpdated: "2023-12-08" },
    { id: 14, name: "SSD 512GB", category: "저장장치", price: 129000, stock: 225, supplier: "데이터세이브", lastUpdated: "2023-12-10" },
    { id: 15, name: "USB-C 충전기", category: "액세서리", price: 35000, stock: 340, supplier: "파워서플라이", lastUpdated: "2023-12-12" },
  ];

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      try {
        const table = new Tabulator(tableRef.current, {
          data: products,
          layout: "fitColumns",
          responsiveLayout: "hide",
          pagination: true,
          paginationSize: 10,
          selectable: true, // 행 선택 가능
          selectableRange: "cell", // 셀 범위 선택 활성화
          selectableRollingSelection: true, // 드래그 선택 활성화
          selectablePersistence: false, // 선택 내용 유지 (클릭 시 선택 해제되지 않음)
          clipboard: true, // 클립보드 기능 활성화
          clipboardPasteAction: "replace", // 복사된 데이터를 어떻게 처리할지 설정 (replace, append, update)
          clipboardCopySelector: "active", // "active": 활성 셀만, "table": 전체 테이블, "selected": 선택된 셀
          clipboardCopyStyled: false, // 스타일 정보 없이 순수 텍스트만 복사
          clipboardCopyConfig: {
            columnHeaders: true, // 열 헤더 포함
            rowGroups: false,
            columnCalcs: false,
          },
          columns: [
            { title: "ID", field: "id", sorter: "number", headerSort: true, width: 70, headerClick:function(e, column){}, cellClick:function(e, cell){} },
            { title: "제품명", field: "name", sorter: "string", editor: "input", headerSort: true, headerClick:function(e, column){}, cellClick:function(e, cell){} },
            { title: "카테고리", field: "category", sorter: "string", editor: "list", editorParams: {
              values: ["전자제품", "액세서리", "웨어러블", "컴퓨터 주변기기", "저장장치", "컴퓨터 부품"]
            }, headerSort: true, headerClick:function(e, column){}, cellClick:function(e, cell){} },
            { title: "가격", field: "price", sorter: "number", editor: "number", formatter: "money", formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }, headerSort: true, headerClick:function(e, column){}, cellClick:function(e, cell){} },
            { title: "재고", field: "stock", sorter: "number", editor: "number", headerSort: true, headerClick:function(e, column){}, cellClick:function(e, cell){} },
            { title: "공급업체", field: "supplier", sorter: "string", editor: "input", headerSort: true, headerClick:function(e, column){}, cellClick:function(e, cell){} },
            { title: "최종 업데이트", field: "lastUpdated", sorter: "date", editor: "date", headerSort: true, headerClick:function(e, column){}, cellClick:function(e, cell){} },
          ],
          // 데이터 수정 후 이벤트
          cellEdited: function(cell) {
            const field = cell.getField();
            const row = cell.getRow();
            
            // 현재 날짜로 최종 업데이트 필드 갱신
            if (field !== "lastUpdated") {
              const today = new Date();
              const dateString = today.toISOString().split('T')[0];
              row.update({ lastUpdated: dateString });
            }
          },
          cellSelectionChanged: function(data: SelectedCell[], rows: any[]) {
            // 셀 선택 상태 변경 시 처리
            setSelectedCells(data);
          }
        });

        // 셀 범위 선택을 위한 마우스 이벤트 처리
        if (tableRef.current) {
          // 범위 선택 시작 위치 추적을 위한 변수
          let startCell: any = null;
          let isSelecting = false;

          // 마우스 다운 이벤트
          tableRef.current.addEventListener('mousedown', function(e) {
            if (!tableRef.current) return;
            
            // tabulator-cell 클래스를 가진 요소 찾기
            let cellElement = (e.target as Element).closest('.tabulator-cell');
            if (cellElement) {
              // 데이터 행과 열 인덱스 가져오기
              const rowIdx = parseInt(cellElement.getAttribute('data-row') || '0', 10);
              const colIdx = parseInt(cellElement.getAttribute('data-col') || '0', 10);
              
              startCell = {
                element: cellElement,
                row: rowIdx,
                col: colIdx
              };
              isSelecting = true;
              
              // data-row, data-col 속성 설정 확인 및 설정
              if (cellElement.getAttribute('data-row') === null) {
                // 행 인덱스 계산 시도
                const rowEls = Array.from(tableRef.current.querySelectorAll('.tabulator-row'));
                const rowEl = cellElement.closest('.tabulator-row');
                if (rowEl) {
                  const rowIndex = rowEls.indexOf(rowEl);
                  if (rowIndex >= 0) {
                    cellElement.setAttribute('data-row', rowIndex.toString());
                    startCell.row = rowIndex;
                  }
                }
                
                // 열 인덱스 계산 시도
                const cellEls = Array.from(rowEl?.querySelectorAll('.tabulator-cell') || []);
                const colIndex = cellEls.indexOf(cellElement as Element);
                if (colIndex >= 0) {
                  cellElement.setAttribute('data-col', colIndex.toString());
                  startCell.col = colIndex;
                }
              }
              
              // 기존 선택 해제 (수정: 더 안정적인 방식으로 구현)
              if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                try {
                  // @ts-ignore
                  if (typeof table.deselectRow === 'function') {
                    table.deselectRow(); // 모든 행 선택 해제
                  }
                  
                  // DOM 방식으로 선택된 셀 스타일 제거
                  const selectedCellElements = tableRef.current.querySelectorAll('.tabulator-cell.tabulator-selected');
                  selectedCellElements?.forEach(cellEl => {
                    cellEl.classList.remove('tabulator-selected');
                  });
                  
                  // 시작 셀만 선택 상태로 표시
                  cellElement.classList.add('tabulator-selected');
                  
                  // React 상태 업데이트
                  const newSelectedCell: SelectedCell = {row: startCell.row, col: startCell.col};
                  setSelectedCells([newSelectedCell]);
                } catch (error) {
                  console.error("셀 선택 해제 오류:", error);
                }
              }
            }
          });

          // 마우스 무브 이벤트
          tableRef.current.addEventListener('mousemove', function(e) {
            if (!tableRef.current) return;
            
            if (isSelecting && startCell) {
              let cellElement = (e.target as Element).closest('.tabulator-cell');
              if (cellElement) {
                const currentRow = parseInt(cellElement.getAttribute('data-row') || '0', 10);
                const currentCol = parseInt(cellElement.getAttribute('data-col') || '0', 10);
                
                // 범위 선택 처리 (수정: selectRange 메서드 대신 DOM 방식으로 구현)
                if (currentRow !== undefined && currentCol !== undefined) {
                  try {
                    // 현재 선택된 범위 계산
                    const minRow = Math.min(startCell.row, currentRow);
                    const maxRow = Math.max(startCell.row, currentRow);
                    const minCol = Math.min(startCell.col, currentCol);
                    const maxCol = Math.max(startCell.col, currentCol);
                    
                    // 선택된 셀들 수집
                    const newSelectedCells: SelectedCell[] = [];
                    
                    // 테이블의 모든 셀 순회하면서 범위 내에 있는지 확인
                    const allCells = tableRef.current.querySelectorAll('.tabulator-cell');
                    allCells?.forEach(cellEl => {
                      const rowIdx = parseInt(cellEl.getAttribute('data-row') || '-1', 10);
                      const colIdx = parseInt(cellEl.getAttribute('data-col') || '-1', 10);
                      
                      // 범위 내에 있으면 선택 표시 및 배열에 추가
                      if (rowIdx >= minRow && rowIdx <= maxRow && colIdx >= minCol && colIdx <= maxCol) {
                        cellEl.classList.add('tabulator-selected');
                        newSelectedCells.push({
                          row: rowIdx,
                          col: colIdx
                        });
                      } else {
                        // 범위 밖이면 선택 해제
                        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                          cellEl.classList.remove('tabulator-selected');
                        }
                      }
                    });
                    
                    // 선택된 셀 상태 업데이트
                    if (newSelectedCells.length > 0) {
                      setSelectedCells(newSelectedCells);
                    }
                  } catch (error) {
                    console.error("셀 범위 선택 오류:", error);
                  }
                }
              }
            }
          });

          // 마우스 업 이벤트
          tableRef.current.addEventListener('mouseup', function() {
            isSelecting = false;
            startCell = null;
          });

          // 테이블에 키보드 이벤트 리스너 추가
          tableRef.current.addEventListener('keydown', (e) => {
            // Ctrl+C 또는 Cmd+C가 눌렸을 때
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
              // 이벤트 기본 동작 방지
              e.preventDefault();
              e.stopPropagation();
              
              // 직접 DOM에서 선택된 셀들 찾기
              const selectedElements = tableRef.current.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected');
              
              if (selectedElements && selectedElements.length > 0) {
                console.log(`${selectedElements.length}개의 선택된 셀을 찾았습니다.`);
                copySelectedElementsToClipboard(selectedElements, table);
              } else if (selectedCells && selectedCells.length > 0) {
                console.log(`React 상태에서 ${selectedCells.length}개의 선택된 셀을 찾았습니다.`);
                copyOnlySelectedCells(table);
              } else {
                toast.warning("복사할 셀을 먼저 선택해주세요.");
              }
            }
            
            // Ctrl+V 또는 Cmd+V가 눌렸을 때
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
              // 클립보드 데이터 가져오기
              navigator.clipboard.readText()
                .then(text => {
                  if (text && text.trim()) {
                    try {
                      // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
                      table.modules.clipboard.setPasteData(text);
                      toast.success("데이터가 성공적으로 붙여넣기 되었습니다.");
                    } catch (err) {
                      console.error("붙여넣기 오류:", err);
                      toast.error("데이터 붙여넣기 중 오류가 발생했습니다.");
                    }
                  }
                })
                .catch(err => {
                  console.error("클립보드 접근 오류:", err);
                  toast.error("클립보드 데이터를 가져올 수 없습니다.");
                });
            }
          });
        }

        // 붙여넣기 이벤트 관리
        document.addEventListener('paste', function(e) {
          if (tableRef.current && tableRef.current.contains(document.activeElement)) {
            try {
              // @ts-ignore: Tabulator 인터페이스 정의 오류 우회 및 Window.clipboardData 타입 호환성
              const clipboard = (e.clipboardData || window.clipboardData);
              const data = clipboard.getData('text');
              if (data && data.trim()) {
                try {
                  // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
                  table.modules.clipboard.setPasteData(data);
                  toast.success("데이터가 성공적으로 붙여넣기 되었습니다.");
                } catch (err) {
                  toast.error("데이터 붙여넣기 중 오류가 발생했습니다.");
                }
              }
            } catch (error) {
              console.error("클립보드 처리 중 오류:", error);
            }
          }
        });
        
        setTabulator(table);
        
        // 셀 스타일링을 위한 CSS 추가
        const style = document.createElement('style');
        style.innerHTML = `
          .tabulator-cell.tabulator-selected {
            background-color: rgba(59, 130, 246, 0.3) !important;
            border: 2px solid rgba(59, 130, 246, 0.7) !important;
          }
          .tabulator-cell:focus {
            outline: 2px solid rgba(59, 130, 246, 0.8) !important;
            z-index: 10 !important;
          }
          .tabulator-row.tabulator-selected .tabulator-cell {
            background-color: rgba(59, 130, 246, 0.1) !important;
          }
          .tabulator .tabulator-tableHolder .tabulator-table {
            user-select: none; /* 텍스트 선택 방지 */
          }
          .tabulator-row {
            cursor: default;
          }
        `;
        document.head.appendChild(style);
        
        // 모든 셀에 data-row와 data-col 속성 추가하기
        const addDataAttributesToCells = () => {
          const rows = tableRef.current?.querySelectorAll('.tabulator-row');
          if (rows) {
            rows.forEach((row, rowIndex) => {
              const cells = row.querySelectorAll('.tabulator-cell');
              cells.forEach((cell, colIndex) => {
                cell.setAttribute('data-row', rowIndex.toString());
                cell.setAttribute('data-col', colIndex.toString());
              });
            });
          }
          
          console.log("셀에 data-row와 data-col 속성을 추가했습니다.");
        };
        
        // 테이블 렌더링 완료 후 속성 추가
        setTimeout(addDataAttributesToCells, 500);

        // 테이블에 직접 셀 선택 이벤트 추가
        table.on("cellSelected", function(cell){
          // 셀이 선택될 때 실행되는 콜백
          // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
          const selectedCells = table.getSelectedCells();
          if (selectedCells && Array.isArray(selectedCells)) {
            setSelectedCells(selectedCells.map(cell => ({
              row: cell.getRow().getPosition(), 
              col: cell.getColumn().getPosition()
            })));
          }
        });

        table.on("cellDeselected", function(cell){
          // 셀 선택이 해제될 때 실행되는 콜백
          // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
          const selectedCells = table.getSelectedCells();
          if (selectedCells && Array.isArray(selectedCells)) {
            setSelectedCells(selectedCells.map(cell => ({
              row: cell.getRow().getPosition(), 
              col: cell.getColumn().getPosition()
            })));
          } else {
            setSelectedCells([]);
          }
        });

        // 테이블 클릭 시 셀 선택 상태를 유지하도록 설정
        table.on("cellClick", function(e, cell){
          e.stopPropagation(); // 이벤트 버블링 방지
          
          // 이미 선택된 셀을 다시 클릭하는 경우 선택 유지
          if(!e.shiftKey && !e.ctrlKey && !e.metaKey) {
            // 모든 행 선택 해제
            cell.getTable().deselectRow();
            
            // 셀 선택 방식 변경 - 직접 셀을 선택
            try {
              // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
              cell.select();
            } catch (error) {
              console.error("셀 선택 오류:", error);
              // 직접 DOM 요소에 선택된 클래스 추가
              try {
                const element = cell.getElement();
                if (element) {
                  element.classList.add("tabulator-selected");
                  // 선택된 셀 상태 수동 업데이트
                  setSelectedCells([{row: cell.getRow().getPosition(), col: cell.getColumn().getPosition()}]);
                }
              } catch (err) {
                console.error("DOM 선택 오류:", err);
              }
            }
          }
        });
        
      } catch (error) {
        console.error("테이블 초기화 오류:", error);
        toast.error("테이블 초기화 중 오류가 발생했습니다.");
      }
    }
    
    return () => {
      if (tabulator) {
        tabulator.destroy();
      }
      // 이벤트 리스너 제거
      document.removeEventListener('paste', () => {});
    };
  }, []);

  // 테이블 데이터를 엑셀로 내보내기
  const exportToExcel = () => {
    tabulator?.download("xlsx", "product_data.xlsx", { sheetName: "제품 목록" });
    toast.success("엑셀 파일로 내보내기가 완료되었습니다.");
  };

  // 테이블 데이터를 CSV로 내보내기
  const exportToCSV = () => {
    tabulator?.download("csv", "product_data.csv", { delimiter: "," });
    toast.success("CSV 파일로 내보내기가 완료되었습니다.");
  };

  // 현재 테이블 내용을 클립보드에 복사
  const copyToClipboard = () => {
    if (tabulator) {
      try {
        // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
        tabulator.copyToClipboard("all", true); // "all": 모든 데이터
        toast.success("테이블 데이터가 클립보드에 복사되었습니다.");
      } catch (error) {
        console.error("클립보드 복사 오류:", error);
        toast.error("클립보드 복사 중 오류가 발생했습니다.");
      }
    }
  };

  // 선택된 셀만 복사하는 데 사용할 함수 - 직접 선택 영역을 가져오고 복사
  const copyOnlySelectedCells = async (tabulatorInstance: Tabulator) => {
    try {
      // 명시적 타입 선언으로 'never' 오류 해결
      interface CellData {
        row: number;
        col: number; 
        value: any;
      }
      
      // 선택된 셀 정보 저장
      let selectedCellsData: CellData[] = [];
      
      // DOM에서 직접 선택된 셀 요소 가져오기
      const selectedElements = tableRef.current?.querySelectorAll('.tabulator-cell.tabulator-selected');
      
      if (selectedElements && selectedElements.length > 0) {
        console.log(`${selectedElements.length}개의 선택된 셀 요소를 찾았습니다.`);
        
        // 각 선택된 셀 요소에서 데이터 추출
        selectedElements.forEach((element) => {
          try {
            const rowIdx = parseInt(element.getAttribute('data-row') || '-1', 10);
            const colIdx = parseInt(element.getAttribute('data-col') || '-1', 10);
            
            if (rowIdx >= 0 && colIdx >= 0) {
              // @ts-ignore
              const rows = tabulatorInstance.getRows();
              // @ts-ignore
              const columns = tabulatorInstance.getColumns();
              
              if (rows && rows.length > rowIdx && columns && columns.length > colIdx) {
                const row = rows[rowIdx];
                const column = columns[colIdx];
                
                if (row && column) {
                  const fieldName = column.getField();
                  // @ts-ignore
                  const cellData = row.getData();
                  
                  if (cellData && fieldName) {
                    selectedCellsData.push({
                      row: rowIdx,
                      col: colIdx,
                      value: cellData[fieldName]
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.warn("셀 데이터 접근 오류:", err);
          }
        });
      } else {
        // DOM 방식으로 선택된 셀이 없으면 React 상태에서 시도
        console.log("DOM에서 선택된 셀을 찾지 못했습니다. React 상태를 사용합니다.");
        
        if (selectedCells && selectedCells.length > 0) {
          console.log(`React 상태에서 ${selectedCells.length}개의 선택된 셀을 찾았습니다.`);
          
          // 선택된 셀들에서 실제 데이터 가져오기
          for (let cell of selectedCells) {
            try {
              // @ts-ignore
              const rows = tabulatorInstance.getRows();
              if (rows && rows.length > 0) {
                // @ts-ignore
                const row = rows.find(r => r.getPosition() === cell.row) || rows[cell.row];
                if (row) {
                  // @ts-ignore
                  const cellData = row.getData();
                  // @ts-ignore
                  const columns = tabulatorInstance.getColumns();
                  if (cellData && columns && columns.length > cell.col) {
                    const fieldName = columns[cell.col].getField();
                    selectedCellsData.push({
                      row: cell.row,
                      col: cell.col,
                      value: cellData[fieldName]
                    });
                  }
                }
              }
            } catch (err) {
              console.warn("React 상태를 통한 셀 데이터 접근 오류:", err);
            }
          }
        }
      }
      
      // 선택된 셀이 없으면 리턴
      if (selectedCellsData.length === 0) {
        console.warn("복사할 선택된 셀이 없습니다.");
        toast.warning("복사할 셀을 먼저 선택해주세요.");
        return false;
      }
      
      console.log(`총 ${selectedCellsData.length}개의 선택된 셀 데이터를 처리합니다.`);
      
      // 행별로 그룹화
      const rowGroups = new Map<number, {col: number, value: any}[]>();
      selectedCellsData.forEach((cell: CellData) => {
        if (!rowGroups.has(cell.row)) {
          rowGroups.set(cell.row, []);
        }
        rowGroups.get(cell.row)?.push({
          col: cell.col,
          value: cell.value
        });
      });
      
      // 각 행의 셀을 열 순서대로 정렬
      rowGroups.forEach((cells, row) => {
        cells.sort((a, b) => a.col - b.col);
      });
      
      // 행 번호 순서대로 정렬
      const sortedRows = Array.from(rowGroups.keys()).sort((a, b) => a - b);
      
      // 탭으로 구분된 텍스트 생성
      let copyText = "";
      sortedRows.forEach(rowIndex => {
        const cells = rowGroups.get(rowIndex) || [];
        const rowText = cells.map(cell => cell.value !== null && cell.value !== undefined ? cell.value : "").join('\t');
        copyText += rowText + '\n';
      });
      
      // 디버깅용 로그
      console.log("복사할 텍스트:", copyText);
      
      // 클립보드에 복사
      await navigator.clipboard.writeText(copyText.trim());
      toast.success("선택한 셀 범위가 클립보드에 복사되었습니다.");
      return true;
    } catch (error) {
      console.error("클립보드 복사 오류:", error);
      toast.error("클립보드 복사 중 오류가 발생했습니다.");
      
      // 오류 상세 정보 로깅
      console.error("오류 상세 정보:", {
        selectedCells,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      });
      
      return false;
    }
  };

  // 선택된 셀 요소들을 직접 복사하는 함수
  const copySelectedElementsToClipboard = async (selectedElements: NodeListOf<Element>, tabulatorInstance: Tabulator) => {
    try {
      // 선택된 셀 정보 수집
      const selectedCellsInfo: CellData[] = [];
      
      // 각 선택된 셀에서 정보 추출
      selectedElements.forEach(element => {
        if (element.classList.contains('tabulator-cell')) {
          const rowIndex = parseInt(element.getAttribute('data-row') || '-1', 10);
          const colIndex = parseInt(element.getAttribute('data-col') || '-1', 10);
          
          if (rowIndex >= 0 && colIndex >= 0) {
            try {
              // @ts-ignore
              const rows = tabulatorInstance.getRows();
              // @ts-ignore
              const columns = tabulatorInstance.getColumns();
              
              if (rows && columns && rows.length > rowIndex && columns.length > colIndex) {
                const rowData = rows[rowIndex]?.getData();
                const fieldName = columns[colIndex]?.getField();
                
                if (rowData && fieldName) {
                  selectedCellsInfo.push({
                    row: rowIndex,
                    col: colIndex,
                    value: rowData[fieldName]
                  });
                }
              }
            } catch (err) {
              console.warn(`셀 데이터 추출 오류 (${rowIndex}, ${colIndex}):`, err);
            }
          }
        }
      });
      
      if (selectedCellsInfo.length === 0) {
        toast.warning("복사할 셀 데이터를 찾을 수 없습니다.");
        return false;
      }
      
      console.log(`${selectedCellsInfo.length}개의 셀 데이터를 추출했습니다.`);
      
      // 행별로 그룹화
      const rowGroups = new Map<number, CellData[]>();
      selectedCellsInfo.forEach(info => {
        if (!rowGroups.has(info.row)) {
          rowGroups.set(info.row, []);
        }
        rowGroups.get(info.row)?.push(info);
      });
      
      // 각 행의 셀을 열 순서대로 정렬
      rowGroups.forEach(cellsInRow => {
        cellsInRow.sort((a, b) => a.col - b.col);
      });
      
      // 행 번호 순서대로 정렬
      const sortedRows = Array.from(rowGroups.keys()).sort((a, b) => a - b);
      
      // 탭으로 구분된 텍스트 생성
      let copyText = "";
      sortedRows.forEach(rowIndex => {
        const cells = rowGroups.get(rowIndex) || [];
        const rowText = cells.map(cell => cell.value !== null && cell.value !== undefined ? cell.value : "").join('\t');
        copyText += rowText + '\n';
      });
      
      console.log("복사할 텍스트:", copyText);
      
      // 클립보드에 복사
      await navigator.clipboard.writeText(copyText.trim());
      toast.success(`${selectedCellsInfo.length}개의 선택된 셀이 클립보드에 복사되었습니다.`);
      return true;
    } catch (error) {
      console.error("클립보드 복사 오류:", error);
      toast.error("클립보드 복사 중 오류가 발생했습니다.");
      return false;
    }
  };

  // 선택된 내용만 클립보드에 복사
  const copySelectedToClipboard = () => {
    if (!tableRef.current) {
      toast.error("테이블이 초기화되지 않았습니다.");
      return;
    }

    const selectedElements = tableRef.current.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected');
    
    if (selectedElements && selectedElements.length > 0 && tabulator) {
      copySelectedElementsToClipboard(selectedElements, tabulator);
    } else if (tabulator && selectedCells.length > 0) {
      copyOnlySelectedCells(tabulator);
    } else {
      toast.warning("복사할 셀을 먼저 선택해주세요.");
    }
  };

  // 마우스 이벤트 핸들러 수정
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableRef.current) return;
    
    const cell = (e.target as HTMLElement).closest('.tabulator-cell');
    if (!cell) return;
    
    const rowIndex = parseInt(cell.getAttribute('data-row') || '-1', 10);
    const colIndex = parseInt(cell.getAttribute('data-col') || '-1', 10);
    
    if (rowIndex >= 0 && colIndex >= 0) {
      const newCell: SelectedCell = { row: rowIndex, col: colIndex };
      setSelectionStart(newCell);
      setSelectionEnd(newCell);
      setIsSelecting(true);
      
      // 셀 선택 상태 업데이트
      const newSelectedCells = new Set<SelectedCell>();
      newSelectedCells.add(newCell);
      setSelectedCells(Array.from(newSelectedCells));
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">향상된 복사/붙여넣기 기능</h1>
          <p className="text-gray-500 mt-1">셀 범위 선택과 단축키(Ctrl+C, Ctrl+V)를 지원하는 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>제품 목록 (범위 선택 지원)</CardTitle>
          <CardDescription>
            테이블에서 셀을 클릭하여 선택하고, 드래그하여 범위를 선택할 수 있습니다. 선택한 후 Ctrl+C(Mac에서는 Cmd+C)로 복사하거나, 
            Excel에서 복사한 데이터를 Ctrl+V(Mac에서는 Cmd+V)로 붙여넣을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              전체 복사
            </Button>
            <Button variant="outline" onClick={copySelectedToClipboard}>
              <ClipboardCopy className="h-4 w-4 mr-2" />
              선택 영역 복사
            </Button>
            <Button variant="outline" onClick={exportToExcel}>
              <FileDown className="h-4 w-4 mr-2" />
              Excel로 내보내기
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV로 내보내기
            </Button>
          </div>
          
          <div ref={tableRef} className="w-full" />
          
          <div className="mt-4 bg-blue-50 p-3 rounded-md text-sm text-blue-600">
            <p><strong>사용 방법:</strong></p>
            <ul className="list-disc pl-5 mt-1">
              <li>셀을 클릭하여 선택하거나, 드래그하여 여러 셀을 선택할 수 있습니다.</li>
              <li>선택한 셀 범위에서 Ctrl+C (또는 Cmd+C)를 눌러 복사할 수 있습니다.</li>
              <li>테이블에서 셀을 선택하고 Ctrl+V (또는 Cmd+V)를 눌러 Excel에서 복사한 데이터를 붙여넣을 수 있습니다.</li>
              <li>셀을 직접 클릭하여 데이터를 편집할 수 있으며, 편집 시 '최종 업데이트' 필드가 자동으로 갱신됩니다.</li>
              <li>'선택 영역 복사' 버튼을 클릭하여 선택한 셀만 복사할 수도 있습니다.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 