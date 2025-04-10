'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCopy, Copy, Clipboard, X } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";

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
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [selectedData, setSelectedData] = useState<string>("");

  // 샘플 데이터
  const data: Employee[] = [
    { id: 1, name: "김철수", position: "개발자", department: "개발팀", salary: 5000000, startDate: "2020-03-15", email: "kim@example.com", phone: "010-1234-5678", status: "정규직" },
    { id: 2, name: "이영희", position: "디자이너", department: "디자인팀", salary: 4800000, startDate: "2021-05-20", email: "lee@example.com", phone: "010-2345-6789", status: "정규직" },
    { id: 3, name: "박준호", position: "매니저", department: "인사팀", salary: 6200000, startDate: "2018-11-10", email: "park@example.com", phone: "010-3456-7890", status: "정규직" },
    { id: 4, name: "정미영", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2019-07-22", email: "jung@example.com", phone: "010-4567-8901", status: "정규직" },
    { id: 5, name: "강동원", position: "마케터", department: "마케팅팀", salary: 4200000, startDate: "2022-01-15", email: "kang@example.com", phone: "010-5678-9012", status: "계약직" },
    { id: 6, name: "한지민", position: "회계사", department: "재무팀", salary: 5900000, startDate: "2017-09-05", email: "han@example.com", phone: "010-6789-0123", status: "정규직" },
    { id: 7, name: "오세진", position: "주니어 개발자", department: "개발팀", salary: 3800000, startDate: "2022-06-10", email: "oh@example.com", phone: "010-7890-1234", status: "인턴" },
    { id: 8, name: "홍길동", position: "팀장", department: "경영진", salary: 8000000, startDate: "2015-04-01", email: "hong@example.com", phone: "010-8901-2345", status: "정규직" },
    { id: 9, name: "나은혜", position: "인사담당자", department: "인사팀", salary: 4500000, startDate: "2020-10-15", email: "na@example.com", phone: "010-9012-3456", status: "정규직" },
    { id: 10, name: "임지현", position: "프론트엔드 개발자", department: "개발팀", salary: 5100000, startDate: "2019-11-20", email: "lim@example.com", phone: "010-0123-4567", status: "정규직" },
    { id: 11, name: "최상철", position: "백엔드 개발자", department: "개발팀", salary: 5200000, startDate: "2019-08-15", email: "choi@example.com", phone: "010-1111-2222", status: "정규직" },
    { id: 12, name: "우현우", position: "데이터 분석가", department: "마케팅팀", salary: 5300000, startDate: "2020-02-10", email: "woo@example.com", phone: "010-2222-3333", status: "정규직" },
  ];

  // 클립보드 데이터 읽기
  const onPasteCaptured = (event: React.ClipboardEvent) => {
    if (tabulator) {
      const clipboardData = event.clipboardData.getData('text');
      setSelectedData(`붙여넣기 데이터: ${clipboardData}`);
    }
  };

  // 선택한 셀 복사 함수
  const copySelectedCells = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("range");
        setSelectedData(`선택된 셀 범위가 복사되었습니다.`);
      } catch (err) {
        console.error("복사 오류:", err);
        setSelectedData(`복사 중 오류가 발생했습니다.`);
      }
    }
  };

  // 테이블 전체 복사 함수
  const copyEntireTable = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("table");
        setSelectedData(`전체 테이블 복사 (${data.length}행)`);
      } catch (err) {
        console.error("전체 테이블 복사 오류:", err);
      }
    }
  };
  
  // 현재 볼 수 있는 데이터만 복사
  const copyVisibleData = () => {
    if (tabulator) {
      try {
        // @ts-ignore
        tabulator.copyToClipboard("visible");
        setSelectedData(`현재 보이는 데이터 복사`);
      } catch (err) {
        console.error("보이는 데이터 복사 오류:", err);
      }
    }
  };

  // 선택한 셀 영역 초기화 함수
  const clearSelection = () => {
    if (tabulator) {
      try {
        // 셀 선택 초기화를 위한 다양한 접근 방식 시도
        
        // 1. API 방식 시도
        // @ts-ignore
        tabulator.deselectRow();
        // @ts-ignore
        if (typeof tabulator.clearCellSelection === 'function') {
          // @ts-ignore
          tabulator.clearCellSelection();
        }
        
        // 2. DOM 직접 조작
        if (tableRef.current) {
          // 선택된 셀 클래스 제거
          tableRef.current.querySelectorAll('.tabulator-cell.tabulator-selected').forEach(cell => {
            cell.classList.remove('tabulator-selected');
          });
          
          // 범위 선택 오버레이 제거
          tableRef.current.querySelectorAll('.tabulator-range-overlay').forEach(el => {
            el.remove();
          });
        }
        
        setSelectedData("선택 영역이 초기화되었습니다.");
      } catch (err) {
        console.error("선택 초기화 오류:", err);
      }
    }
  };
  
  // 전역 클릭 이벤트 핸들러
  const handleGlobalClick = useCallback((event: MouseEvent) => {
    // tabulator-table 또는 하위 요소를 클릭했는지 확인
    const isTableClick = event.target instanceof Node && 
      tableRef.current && 
      (tableRef.current.contains(event.target) || 
       // 테이블 셀 또는 선택 영역 클릭 시 무시
       (event.target as Element).closest('.tabulator-cell') || 
       (event.target as Element).closest('.tabulator-range-overlay'));
    
    // 테이블 외부 클릭 시 선택 영역 초기화
    if (!isTableClick) {
      clearSelection();
    }
  }, []);

  // 페이지 로드 및 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 5,
        height: "100%",
        
        // 범위 선택 관련 설정
        selectable: true,
        selectableRange: 1,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        selectableRangeClearCells: true,

        // 편집 관련 설정
        editTriggerEvent: "dblclick",
        
        // 클립보드 관련 설정
        clipboard: true,
        clipboardCopyStyled: false,
        clipboardCopyConfig: {
          rowHeaders: false,
          columnHeaders: false,
        },
        clipboardCopyRowRange: "range",
        clipboardPasteParser: "range",
        clipboardPasteAction: "range",

        // 행 헤더 설정
        rowHeader: {
          resizable: false, 
          frozen: true, 
          width: 40, 
          hozAlign: "center", 
          formatter: "rownum", 
          cssClass: "range-header-col", 
          editor: false
        },

        // 컬럼 기본 설정
        columnDefaults: {
          headerSort: true,
          headerHozAlign: "center",
          editor: "input",
          resizable: "header",
          width: 120,
        },
        
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 60, editor: false },
          { title: "이름", field: "name", sorter: "string", headerFilter: true },
          { title: "직책", field: "position", sorter: "string", headerFilter: true },
          { title: "부서", field: "department", sorter: "string", headerFilter: true },
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
          { title: "입사일", field: "startDate", sorter: "date", headerFilter: true },
          { title: "이메일", field: "email", sorter: "string" },
          { title: "전화번호", field: "phone", sorter: "string" },
          { title: "상태", field: "status", sorter: "string", headerFilter: true }
        ],
        
        // 셀 선택 완료 시 이벤트 - 디버깅용 로그 추가
        // @ts-ignore
        cellSelectionChanged: function(cells, selected) {
          console.log("셀 선택 변경:", cells?.length, selected);
          if (selected && cells && cells.length > 0) {
            setSelectedData(`선택된 셀: ${cells.length}개`);
          }
        },
      });
      
      setTabulator(table);
      
      // 명시적으로 전역 이벤트 리스너를 window에 등록
      window.addEventListener('mousedown', handleGlobalClick);
    }
    
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너와 테이블 정리
      window.removeEventListener('mousedown', handleGlobalClick);
      if (tabulator) {
        tabulator.destroy();
      }
    };
  }, [handleGlobalClick]);

  return (
    <div className="container mx-auto py-6" style={{ minHeight: '100vh' }} onClick={(e) => {
      // 컨테이너 직접 클릭 시 선택 초기화 (이벤트 버블링 방지)
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
          <h1 className="text-2xl font-bold">스프레드시트 기능</h1>
          <p className="text-gray-500 mt-1">셀 범위를 드래그하여 선택한 후 복사하세요. 셀을 더블클릭하면 편집 가능합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>셀 범위 선택 및 스프레드시트 기능</CardTitle>
            <div className="flex flex-wrap space-x-2 mt-2">
              <Button onClick={copySelectedCells} size="sm" className="mb-2">
                <Copy className="h-4 w-4 mr-2" />
                선택한 범위 복사
              </Button>
              <Button onClick={copyEntireTable} size="sm" variant="outline" className="mb-2">
                <ClipboardCopy className="h-4 w-4 mr-2" />
                전체 테이블 복사
              </Button>
              <Button onClick={copyVisibleData} size="sm" variant="outline" className="mb-2">
                <Clipboard className="h-4 w-4 mr-2" />
                보이는 데이터 복사
              </Button>
              <Button onClick={clearSelection} size="sm" variant="destructive" className="mb-2">
                <X className="h-4 w-4 mr-2" />
                선택 초기화
              </Button>
            </div>
            {selectedData && (
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedData}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <p className="mb-4 text-sm text-gray-500">
              <strong>사용법:</strong> 마우스로 셀 영역을 드래그하여 선택한 후 복사 버튼을 누르거나 Ctrl+C(Command+C)를 누르세요.
              다른 스프레드시트나 텍스트 편집기에 붙여넣기가 가능합니다. 셀을 더블클릭하여 편집할 수 있습니다.
              <br />
              <strong>선택 해제:</strong> 테이블 외부를 클릭하거나 선택 초기화 버튼을 누르면 선택 영역이 해제됩니다.
            </p>
            <div 
              ref={tableRef} 
              className="w-full h-[500px]" 
              onPaste={onPasteCaptured}
              tabIndex={0}
            ></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 