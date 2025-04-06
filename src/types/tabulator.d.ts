declare module 'tabulator-tables' {
  export interface CellComponent {
    getValue(): any;
    getOldValue(): any;
    getInitialValue(): any;
    getElement(): HTMLElement;
    getRow(): RowComponent;
    getColumn(): ColumnComponent;
    getData(): any;
    getField(): string;
    setValue(value: any, mutate?: boolean): void;
    checkHeight(): void;
    restoreInitialValue(): void;
    restoreOldValue(): void;
    validate(): boolean;
    edit(isBlock?: boolean): void;
    cancelEdit(): void;
    isEdited(): boolean;
  }

  export interface RowComponent {
    getData(): any;
    getElement(): HTMLElement;
    getPosition(position?: boolean): number;
    getCells(): CellComponent[];
    getCell(column: string | ColumnComponent): CellComponent;
    getTable(): Tabulator;
    delete(): Promise<void>;
    scrollTo(): Promise<void>;
    update(data: object): Promise<void>;
    select(): void;
    deselect(): void;
    toggleSelect(): void;
    isSelected(): boolean;
  }

  export interface ColumnComponent {
    getField(): string;
    getElement(): HTMLElement;
    getDefinition(): any;
    getTable(): Tabulator;
    getWidth(): number;
    isVisible(): boolean;
    show(): void;
    hide(): void;
    toggle(): void;
    delete(): Promise<void>;
    scrollTo(): Promise<void>;
    getSubColumns(): ColumnComponent[];
    getParentColumn(): ColumnComponent | false;
    headerFilterFocus(): void;
    setHeaderFilterValue(value: any): void;
    reloadHeaderFilter(): void;
  }

  export interface Tabulator {
    [key: string]: any;
  }

  export class TabulatorFull implements Tabulator {
    constructor(element: HTMLElement | string, options?: any);
    setData(data: any[]): Promise<void>;
    getData(): any[];
    on(event: string, callback: Function): void;
    download(fileType: string, fileName?: string, options?: any): void;
    print(options?: any): void;
    getSelectedData(): any[];
    selectRow(rows: any): void;
    deselectRow(rows?: any): void;
    updateData(data: any[]): Promise<any>;
    addData(data: any[], position?: boolean | string): Promise<any>;
    deleteRow(rows: any): Promise<any>;
    redraw(force?: boolean): void;
    clearData(): Promise<any>;
    getCalcResults(): any;
    setColumns(columns: any[]): void;
    getColumns(): any[];
    setSort(sorters: any[], dir?: string): void;
    setFilter(filter: any, type?: string, value?: any): void;
    setFilter(field: string, type: string, value: any): void;
    setFilter(field: Function, type?: string, value?: any): void;
    clearFilter(): void;
    clearFilter(includeHeaderFilters: boolean): void;
    addFilter(field: string, type: string, value: any): void;
    setHeaderFilterValue(field: string, value: any): void;
    setPage(page: number): void;
    setPageSize(size: number): void;
    getPage(): number;
    getPageMax(): number;
    resetHeaderFilter(): void;
    getHeaderFilters(): any[];
    clearHeaderFilter(): void;
    options(options: any): void;
    blockRedraw(): void;
    restoreRedraw(): void;
    destroy(): void;
  }
} 