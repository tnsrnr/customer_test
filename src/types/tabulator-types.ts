import { ColumnDefinition, Options as TabulatorOptions } from 'tabulator-tables';

export interface TabulatorGridProps {
  // 기본 데이터 및 컬럼 설정
  data: any[];
  columns: ColumnDefinition[];
  
  // 그리드 설정
  height?: string | number;
  layout?: string;
  
  // 셀 선택 관련 설정
  selectable?: boolean;
  selectableRange?: boolean;
  selectableRangeColumns?: boolean;
  selectableRangeRows?: boolean;
  selectableRangeClearCells?: boolean;
  
  // 클립보드 관련 설정
  enableClipboard?: boolean;
  clipboardCopyStyled?: boolean;
  clipboardCopyConfig?: {
    rowHeaders?: boolean;
    columnHeaders?: boolean;
  };
  
  // 페이징 설정
  pagination?: boolean;
  paginationSize?: number;
  paginationSizeSelector?: number[];
  
  // 편집 관련 설정
  editable?: boolean;
  editTrigger?: string;
  
  // 이벤트 핸들러
  onCellSelectionChanged?: (message: string) => void;
  onClipboardCopied?: (message: string) => void;
  
  // 커스텀 UI
  showCopyButton?: boolean;
  showSelectionButtons?: boolean;
  
  // 추가 Tabulator 옵션
  additionalOptions?: Partial<TabulatorOptions>;
}

// 테이블 참조를 위한 인터페이스
export interface TabulatorGridRef {
  getTable: () => any; // Tabulator 인스턴스
  clearSelection: () => void;
  copySelection: () => void;
} 