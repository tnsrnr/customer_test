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

  // 전역 참조 변수
  let currentTable: Tabulator | null = null;


  // 선택한 셀 영역 초기화 함수 (DOM 직접 조작 방식)
  const clearSelection = () => {
    console.log('셀 선택 해제 시도 - DOM 직접 조작');
    
    try {
      // 1. Tabulator API 호출 시도
      if (tabulator) {
        try {
          // @ts-ignore
          tabulator.deselectRow(); // 행 선택 해제
          
          // @ts-ignore
          if (tabulator.modules && tabulator.modules.selectRange) {
            // @ts-ignore
            tabulator.modules.selectRange.clearRange();
          }
          
          // @ts-ignore
          tabulator.element.dispatchEvent(new Event('rangeClear')); // 이벤트 발생
        } catch (apiErr) {
          console.log('Tabulator API 호출 실패:', apiErr);
        }
      }
      
      // 2. 선택된 셀 클래스 제거 (DOM 전용 방식)
      const selectedCells = document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected, .tabulator-range-selected');
      console.log('선택된 셀 개수:', selectedCells.length);
      selectedCells.forEach(el => {
        el.classList.remove('tabulator-selected');
        el.classList.remove('tabulator-range-selected');
      });
      
      // 3. 오버레이 요소 제거
      const overlays = document.querySelectorAll('.tabulator-range-overlay, .tabulator-cell-selecting, .tabulator-selected-ranges');
      console.log('오버레이 요소 개수:', overlays.length);
      overlays.forEach(el => {
        el.remove();
      });
      
      // 4. 전역 선택 객체 초기화
      if (document.getSelection) {
        document.getSelection()?.removeAllRanges();
      }
      
      // 5. 활성 요소에서 포커스 제거
      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      
      // 6. CSS 스타일로 강제 초기화
      const style = document.createElement('style');
      style.setAttribute('id', 'tabulator-reset-style');
      style.textContent = `
        .tabulator-selected, 
        .tabulator-cell.tabulator-selected, 
        .tabulator-row.tabulator-selected,
        .tabulator-range-selected { 
          background-color: transparent !important; 
          border: none !important;
          outline: none !important;
        }
        .tabulator-range-overlay, 
        .tabulator-cell-selecting,
        .tabulator-selected-ranges { 
          display: none !important;
          opacity: 0 !important; 
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(style);
      

      
      // 일정 시간 후 스타일 제거
      setTimeout(() => {
        const tempStyle = document.getElementById('tabulator-reset-style');
        if (tempStyle) {
          tempStyle.remove();
        }
        
        // 성공 여부 확인
        const remainingSelected = document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected');
        const remainingOverlays = document.querySelectorAll('.tabulator-range-overlay');
        console.log('선택 초기화 결과 - 남은 셀:', remainingSelected.length, '남은 오버레이:', remainingOverlays.length);
        
        // 강제로 다시 시도
        if (remainingSelected.length > 0 || remainingOverlays.length > 0) {
          remainingSelected.forEach(el => el.classList.remove('tabulator-selected'));
          remainingOverlays.forEach(el => el.remove());
        }
      }, 200);
    } catch (err) {
      console.error('선택 해제 중 오류:', err);
    }
  };



  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      console.log('테이블 초기화 시작');
      
      // 테이블 초기화
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        height: "500px",
        
        // 셀 선택 설정
        selectable: true,
        selectableRange: true,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        selectableRangeClearCells: true,
        
        // 클립보드 설정
        clipboard: true,
        clipboardCopyStyled: true,
        clipboardCopyRowRange: "selected",
        clipboardCopySelector: "range",
        
        // 초기화 완료 콜백
        tableBuilt: function() {
          console.log("테이블 빌드 완료");
          // 전역 변수에 저장 (중요)
          currentTable = table;
        },
        
   
        
        // 열 정의
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 60 },
          { title: "이름", field: "name", sorter: "string" },
          { title: "직책", field: "position", sorter: "string" },
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
          { title: "입사일", field: "startDate", sorter: "date" },
          { title: "이메일", field: "email", sorter: "string" },
          { title: "전화번호", field: "phone", sorter: "string" },
          { title: "상태", field: "status", sorter: "string" }
        ],
      });
      
      // 상태 업데이트 및 전역 참조 저장
      setTabulator(table);
      currentTable = table;
      
      // 문서 클릭 이벤트 리스너 추가 - 테이블 외부 클릭 시 선택 초기화
      const handleDocumentClick = (e: MouseEvent) => {
        const tableElement = tableRef.current;
        if (tableElement && !tableElement.contains(e.target as Node)) {
          console.log('문서 영역 클릭 감지 - 셀 선택 해제');
          clearSelection();
        }
      };

      
      // 이벤트 리스너 등록
      document.addEventListener('click', handleDocumentClick);
      
      // 클린업 함수
      return () => {
        if (tabulator) {
          tabulator.destroy();
        }
        document.removeEventListener('click', handleDocumentClick);//메모리 누수 방지
        currentTable = null;
      };
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
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

      <Card className="mb-6">
        <CardContent className="pt-6">
          {selectedData && (
            <div className="mb-4 text-sm text-muted-foreground">
              {selectedData}
            </div>
          )}
          <div 
            ref={tableRef} 
            className="w-full h-[500px]" 
            tabIndex={0}
          ></div>
        </CardContent>
      </Card>
    </div>
  );
} 