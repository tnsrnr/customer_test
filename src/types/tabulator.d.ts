declare module 'tabulator-tables' {
  export class TabulatorFull {
    constructor(element: HTMLElement | string, options?: any);
    setData(data: any[]): Promise<void>;
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
    setFilter(field: string | Function, type: string, value: any): void;
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