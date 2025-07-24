'use client';

import { useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { cn } from '@/lib/utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataTableProps {
  data: any[];
  columnDefs: ColDef[];
  className?: string;
  rowHeight?: number;
  headerHeight?: number;
}

export function DataTable({
  data,
  columnDefs,
  className,
  rowHeight = 40,
  headerHeight = 48,
}: DataTableProps) {
  const gridRef = useRef<any>(null);

  useEffect(() => {
    console.log('DataTable mounted', { data, columnDefs });
  }, [data, columnDefs]);

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current && gridRef.current.api) {
        gridRef.current.api.sizeColumnsToFit();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  return (
    <div
      className={cn("ag-theme-alpine w-full h-full", className)}
      style={{ height: '100%', width: '100%' }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={rowHeight}
        headerHeight={headerHeight}
        animateRows={true}
        enableCellTextSelection={true}
        suppressMovableColumns={true}
        domLayout="normal"
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
      />
    </div>
  );
} 