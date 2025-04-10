'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

interface Person {
  id: number;
  name: string;
  age: number;
  gender: string;
  department: string;
  salary: number;
}

export default function TabulatorBasicExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);

  // 샘플 데이터
  const data: Person[] = [
    { id: 1, name: "김철수", age: 32, gender: "남성", department: "개발팀", salary: 5000000 },
    { id: 2, name: "이영희", age: 28, gender: "여성", department: "마케팅", salary: 4800000 },
    { id: 3, name: "박준호", age: 41, gender: "남성", department: "인사팀", salary: 6200000 },
    { id: 4, name: "정미영", age: 35, gender: "여성", department: "개발팀", salary: 5500000 },
    { id: 5, name: "강동원", age: 27, gender: "남성", department: "마케팅", salary: 4200000 },
    { id: 6, name: "한지민", age: 39, gender: "여성", department: "재무팀", salary: 5900000 },
    { id: 7, name: "오세진", age: 33, gender: "남성", department: "개발팀", salary: 5100000 },
    { id: 8, name: "홍길동", age: 45, gender: "남성", department: "경영진", salary: 8000000 },
  ];

  // 선택 영역 초기화 함수
  const clearSelection = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.deselectRow();
        
        // DOM 직접 조작으로 선택된 셀 클래스 제거
        if (tableRef.current) {
          tableRef.current.querySelectorAll('.tabulator-cell.tabulator-selected').forEach(cell => {
            cell.classList.remove('tabulator-selected');
          });
          
          tableRef.current.querySelectorAll('.tabulator-range-overlay').forEach(el => {
            el.remove();
          });
        }
      } catch (err) {
        console.error("선택 초기화 오류:", err);
      }
    }
  };
  
  // 전역 클릭 이벤트 핸들러
  const handleGlobalClick = useCallback((event: MouseEvent) => {
    const isTableClick = event.target instanceof Node && 
      tableRef.current && 
      (tableRef.current.contains(event.target) || 
       (event.target as Element).closest('.tabulator-cell') || 
       (event.target as Element).closest('.tabulator-range-overlay'));
    
    if (!isTableClick) {
      clearSelection();
    }
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 5,
        
        // 셀 선택 관련 설정 추가
        selectable: true,
        selectableRange: 1,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        selectableRangeClearCells: true,
        
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 80 },
          { title: "이름", field: "name", sorter: "string" },
          { title: "나이", field: "age", sorter: "number" },
          { title: "성별", field: "gender", sorter: "string" },
          { title: "부서", field: "department", sorter: "string" },
          { 
            title: "급여", 
            field: "salary", 
            sorter: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩",
              precision: 0
            }
          },
        ],
        locale: true,
        langs: {
          "ko-kr": {
            "pagination": {
              "first": "처음",
              "first_title": "첫 페이지",
              "last": "마지막",
              "last_title": "마지막 페이지",
              "prev": "이전",
              "prev_title": "이전 페이지",
              "next": "다음",
              "next_title": "다음 페이지",
            },
          },
        },
      });
      
      setTabulator(table);
      
      // 전역 이벤트 리스너 등록
      window.addEventListener('mousedown', handleGlobalClick);
    }
    
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      tabulator?.destroy();
    };
  }, [handleGlobalClick]);

  return (
    <div className="container mx-auto py-6" style={{ minHeight: '100vh' }} onClick={(e) => {
      // 컨테이너 직접 클릭 시 선택 초기화
      if (e.currentTarget === e.target) {
        e.stopPropagation();
        clearSelection();
      }
    }}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">기본 테이블 및 정렬</h1>
          <p className="text-gray-500 mt-1">열 헤더를 클릭하여 정렬할 수 있는 기본 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 text-sm text-gray-500">
            <strong>셀 선택:</strong> 셀을 드래그하여 범위를 선택할 수 있습니다. 테이블 외부를 클릭하면 선택이 해제됩니다.
          </p>
          <div ref={tableRef} className="w-full"></div>
        </CardContent>
      </Card>
    </div>
  );
} 