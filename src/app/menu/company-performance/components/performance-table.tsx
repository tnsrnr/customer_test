'use client';

import { useEffect } from 'react';
import { DataTable } from "@/components/ui/data-table";
import { ColDef, ColGroupDef } from "ag-grid-community";

interface PerformanceData {
  구분: string;
  계획_매출액: number;
  계획_영업이익: number;
  계획_영업이익율: string;
  실적_매출액: number;
  실적_영업이익: number;
  실적_영업이익율: string;
  달성율_매출액: string;
  달성율_영업이익: string;
}

const columnDefs: (ColDef | ColGroupDef)[] = [
  { 
    field: '구분',
    headerName: '구분',
    width: 240, // 기존 120의 2배
    headerClass: 'text-center',
    cellStyle: { 
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // 가로 중앙 정렬
      textAlign: 'center'
    },
    pinned: 'left'
  },
  {
    headerName: '계획 (\'25년 5월 누적)',
    headerClass: 'bg-blue-50 text-center',
    children: [
      { 
        field: '계획_매출액',
        headerName: '매출액',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        valueFormatter: params => params.value?.toLocaleString(),
        cellStyle: { 
          backgroundColor: '#EFF6FF',
          textAlign: 'right' // 숫자 오른쪽 정렬
        }
      },
      { 
        field: '계획_영업이익',
        headerName: '영업이익',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        valueFormatter: params => params.value?.toLocaleString(),
        cellStyle: { 
          backgroundColor: '#EFF6FF',
          textAlign: 'right' // 숫자 오른쪽 정렬
        }
      },
      { 
        field: '계획_영업이익율',
        headerName: '영업이익율',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        cellStyle: { 
          backgroundColor: '#EFF6FF',
          textAlign: 'right' // 퍼센트 오른쪽 정렬
        }
      }
    ]
  },
  {
    headerName: '실적 (\'25년 5월 누적)',
    headerClass: 'bg-green-50 text-center',
    children: [
      { 
        field: '실적_매출액',
        headerName: '매출액',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        valueFormatter: params => params.value?.toLocaleString(),
        cellStyle: { 
          backgroundColor: '#F0FDF4',
          textAlign: 'right' // 숫자 오른쪽 정렬
        }
      },
      { 
        field: '실적_영업이익',
        headerName: '영업이익',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        valueFormatter: params => params.value?.toLocaleString(),
        cellStyle: params => ({
          backgroundColor: '#F0FDF4',
          color: params.value < 0 ? '#DC2626' : 'inherit',
          textAlign: 'right' // 숫자 오른쪽 정렬
        })
      },
      { 
        field: '실적_영업이익율',
        headerName: '영업이익율',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        cellStyle: params => ({
          backgroundColor: '#F0FDF4',
          color: params.value.startsWith('-') ? '#DC2626' : 'inherit',
          textAlign: 'right' // 퍼센트 오른쪽 정렬
        })
      }
    ]
  },
  {
    headerName: '달성율 (계획 比)',
    headerClass: 'bg-purple-50 text-center',
    children: [
      { 
        field: '달성율_매출액',
        headerName: '매출액',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        cellStyle: { 
          backgroundColor: '#F5F3FF',
          color: '#2563EB',
          fontWeight: 'bold',
          textAlign: 'right' // 숫자 오른쪽 정렬
        }
      },
      { 
        field: '달성율_영업이익',
        headerName: '영업이익',
        width: 200, // 기존 100의 2배
        headerClass: 'text-center',
        cellStyle: { 
          backgroundColor: '#F5F3FF',
          textAlign: 'right' // 숫자 오른쪽 정렬
        }
      }
    ]
  }
];

const data: PerformanceData[] = [
  {
    구분: '본사',
    계획_매출액: 1095,
    계획_영업이익: 37,
    계획_영업이익율: '3.4%',
    실적_매출액: 934,
    실적_영업이익: -9,
    실적_영업이익율: '-0.9%',
    달성율_매출액: '85%',
    달성율_영업이익: '적자'
  },
  {
    구분: '국내자회사',
    계획_매출액: 360,
    계획_영업이익: 11,
    계획_영업이익율: '3.1%',
    실적_매출액: 294,
    실적_영업이익: 3,
    실적_영업이익율: '0.9%',
    달성율_매출액: '82%',
    달성율_영업이익: '24%'
  },
  {
    구분: '해외자회사',
    계획_매출액: 2131,
    계획_영업이익: 46,
    계획_영업이익율: '2.1%',
    실적_매출액: 1392,
    실적_영업이익: 32,
    실적_영업이익율: '2.3%',
    달성율_매출액: '65%',
    달성율_영업이익: '70%'
  },
  {
    구분: '합계',
    계획_매출액: 3586,
    계획_영업이익: 94,
    계획_영업이익율: '2.6%',
    실적_매출액: 2619,
    실적_영업이익: 26,
    실적_영업이익율: '1.0%',
    달성율_매출액: '73%',
    달성율_영업이익: '28%'
  }
];

const minRowCount = 10; // 최소 10줄 보이게
const filledData = [
  ...data,
  ...Array(Math.max(0, minRowCount - data.length)).fill({
    구분: '',
    계획_매출액: '',
    계획_영업이익: '',
    계획_영업이익율: '',
    실적_매출액: '',
    실적_영업이익: '',
    실적_영업이익율: '',
    달성율_매출액: '',
    달성율_영업이익: ''
  })
];

export function PerformanceTable() {
  useEffect(() => {
    console.log('PerformanceTable mounted');
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <DataTable 
        data={filledData}
        columnDefs={columnDefs}
        rowHeight={45}
        headerHeight={40}
      />
    </div>
  );
} 