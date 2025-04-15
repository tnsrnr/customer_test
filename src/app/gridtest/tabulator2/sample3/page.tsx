'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TabulatorGrid, { TabulatorGridRef, DataType } from '@/components/common/TabulatorGrid';
import "tabulator-tables/dist/css/tabulator.min.css";
// luxon 임포트 (날짜 정렬 기능에 필요)
import { DateTime } from "luxon";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  email: string;
  phone: string;
  status: string;
}

export default function TabulatorSpreadsheetExample() {
  const gridRef = useRef<TabulatorGridRef>(null);
  // 현재 적용된 필터 상태
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  
  // 샘플 데이터
  const data: Employee[] = [
    { id: 1, name: "김철수", position: "개발자", department: "개발팀", salary: 5000000, startDate: "2020-03-15", email: "kim@example.com", phone: "010-1234-5678", status: "정규직" },
    { id: 2, name: "이영희", position: "디자이너", department: "디자인팀", salary: 4800000, startDate: "2021-05-20", email: "lee@example.com", phone: "010-2345-6789", status: "정규직" },
    { id: 3, name: "박준호", position: "매니저", department: "인사팀", salary: 6200000, startDate: "2018-11-10", email: "park@example.com", phone: "010-3456-7890", status: "정규직" },
    { id: 4, name: "정미영", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2019-07-22", email: "jung@example.com", phone: "010-4567-8901", status: "정규직" },
    { id: 5, name: "강동원", position: "마케터", department: "마케팅팀", salary: 4200000, startDate: "2022-01-15", email: "kang@example.com", phone: "010-5678-9012", status: "계약직" },
    { id: 101, name: "김철수(B)", position: "개발자", department: "개발팀", salary: 5100000, startDate: "2021-03-15", email: "kimB@example.com", phone: "010-1234-6678", status: "정규직" },
    { id: 102, name: "이영희(B)", position: "디자이너", department: "디자인팀", salary: 4900000, startDate: "2022-05-20", email: "leeB@example.com", phone: "010-2345-7789", status: "정규직" },
    { id: 201, name: "김철수(C)", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2022-03-15", email: "kimC@example.com", phone: "010-1234-7678", status: "정규직" },
    { id: 202, name: "이영희(C)", position: "UX 디자이너", department: "디자인팀", salary: 5100000, startDate: "2023-05-20", email: "leeC@example.com", phone: "010-2345-8789", status: "정규직" }
  ];

  // 컬럼 정의 - 모든 필터 속성은 Tabulator에서 지원하는 [key: string]: any; 타입으로 처리됨
  const columns = [
    {  
      title: "", 
      field: "selected", 
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      headerSort: false,
      resizable: false,
      frozen: true,
      headerHozAlign: "center",
      hozAlign: "center",
      width: 30
    },
    { 
      title: "ID", 
      field: "id", 
      sorter: "number", 
      width: 60, 
      headerFilter: true,
      headerFilterFunc: "like",
      headerFilterPlaceholder: "ID 검색"
    },
    { 
      title: "이름", 
      field: "name", 
      sorter: "string", 
      headerFilter: true,
      headerFilterPlaceholder: "이름 검색",
      headerFilterLiveFilter: true
    },
    { 
      title: "직책", 
      field: "position", 
      sorter: "string", 
      headerFilter: true,
      headerFilterPlaceholder: "직책 검색"
    },
    { 
      title: "부서", 
      field: "department", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "부서"
    },
    { 
      title: "급여", 
      field: "salary", 
      sorter: "number",
      formatter: "money",
      formatterParams: {
        thousand: ",",
        symbol: "₩",
        precision: 0
      },
      headerFilter: "number" as any,
      headerFilterPlaceholder: "최소 금액",
      headerFilterFunc: ">="
    },
    { 
      title: "입사일", 
      field: "startDate", 
      sorter: function(a: any, b: any) {
        try {
          return DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
        } catch (e) {
          return 0; // 날짜 파싱 오류 시 순서 유지
        }
      }, 
      formatter: "datetime", 
      formatterParams: {
        inputFormat: "yyyy-MM-dd",
        outputFormat: "yyyy년 MM월 dd일",
        invalidPlaceholder: "(유효하지 않은 날짜)"
      },
      headerFilter: true,
      headerFilterPlaceholder: "날짜 검색"
    },
    { 
      title: "이메일", 
      field: "email", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "이메일 검색" 
    },
    { 
      title: "전화번호", 
      field: "phone", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "전화번호 검색"
    },
    { 
      title: "상태", 
      field: "status", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "상태",
      headerFilterParams: {
        values: { "정규직": "정규직", "계약직": "계약직", "수습": "수습" },
        clearable: true
      },
      formatter: function(cell: any) {
        const value = cell.getValue();
        let color = "";
        
        if (value === "정규직") {
          color = "bg-green-100 text-green-800";
        } else if (value === "계약직") {
          color = "bg-yellow-100 text-yellow-800";
        } else if (value === "수습") {
          color = "bg-blue-100 text-blue-800";
        }
        
        return `<span class="py-1 px-2 rounded-full text-xs font-medium ${color}">${value}</span>`;
      }
    }
  ] as any; // ColumnDefinitionType[] 타입 충돌 해결을 위한 캐스팅

  // Tabulator 추가 옵션
  const additionalOptions = {
    movableColumns: true,
    layout: "fitColumns",
    renderVertical: "basic",
    placeholder: "데이터가 없습니다.",
    placeholderBackground: "white",
    dataLoaderLoading: "데이터 로딩중...",
    dataLoaderError: "데이터 로드 실패",
    height: "100%",
    width: "100%",
    // 필터 이벤트 핸들러
    dataFiltered: function(filters: any) {
      setHasActiveFilters(filters.length > 0);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">고급 필터링 테이블</h1>
          <p className="text-gray-500 mt-1">필터 및 검색 기능이 강화된 Tabulator 예제</p>
        </div>
      </div>
      
      <div className="mb-2 text-sm text-gray-500">
        각 컬럼 헤더에 마우스를 올리면 필터 아이콘이 표시됩니다. 클릭하여 해당 컬럼을 필터링하세요.
      </div>
      
      <Card className="mb-6 shadow-md border-0">
        <CardContent className="pt-6 bg-white">
          <TabulatorGrid
            ref={gridRef}
            data={data}
            columns={columns}
            height="500px"
            selectable={true}
            selectableRollingSelection={false}
            enableCellSelection={true}
            enableClipboard={true}
            showSelectionControls={false}
            enableCellSelectionOnRowSelect={true}
            className="bg-white rounded overflow-hidden"
            additionalOptions={additionalOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
} 