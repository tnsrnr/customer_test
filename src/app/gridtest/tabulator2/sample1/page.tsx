'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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

  // 콘솔 로그에 Tabulator 인스턴스 정보 출력
  useEffect(() => {
    if (tabulator) {
      console.log('Tabulator 인스턴스 정보:', tabulator);
      console.log('Tabulator 버전:', tabulator.version);
      // @ts-ignore
      console.log('Tabulator 모듈 목록:', Object.keys(tabulator.modules || {}));
      
      // 인스턴스 메서드 확인
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(tabulator));
      console.log('Tabulator 사용 가능한 메서드:', methods);
    }
  }, [tabulator]);

  // 셀 선택 해제 함수 (직접 DOM 접근 방식 추가)
  const clearSelection = () => {
    console.log('셀 선택 해제 시도 - 디버깅 시작 ========');
    
    // Tabulator API 공식 메서드 호출 (Tabulator 6.3 기준)
    if (tabulator) {
      console.log('tabulator 인스턴스 존재함');
      
      try {
        // 1. 공식 문서의 clearSelectionRange 메서드 확인
        // @ts-ignore
        console.log('clearSelectionRange 메서드 존재 여부:', typeof tabulator.clearSelectionRange === 'function');
        
        // @ts-ignore
        if (typeof tabulator.clearSelectionRange === 'function') {
          // @ts-ignore
          tabulator.clearSelectionRange();
          console.log('clearSelectionRange 메서드 호출됨');
        }
        
        // 2. selectRange 모듈에 직접 접근 시도
        // @ts-ignore
        console.log('tabulator.modules 존재 여부:', !!tabulator.modules);
        // @ts-ignore
        console.log('selectRange 모듈 존재 여부:', !!(tabulator.modules && tabulator.modules.selectRange));
        
        // @ts-ignore
        if (tabulator.modules && tabulator.modules.selectRange) {
          // @ts-ignore
          const selectRangeModule = tabulator.modules.selectRange;
          console.log('selectRange 모듈 메서드:', Object.getOwnPropertyNames(Object.getPrototypeOf(selectRangeModule)));
          
          // selectRange 모듈의 clearRange 메서드 호출
          if (typeof selectRangeModule.clearRange === 'function') {
            selectRangeModule.clearRange();
            console.log('selectRange.clearRange 메서드 호출됨');
          }
          
          // clearRange 메서드가 없으면 clear 메서드 시도
          else if (typeof selectRangeModule.clear === 'function') {
            selectRangeModule.clear();
            console.log('selectRange.clear 메서드 호출됨');
          } else {
            console.log('selectRange 모듈에 clearRange 또는 clear 메서드가 없음');
          }
        }
        
        // 3. 데이터 변경 이벤트를 발생시켜 선택 초기화 시도
        // @ts-ignore
        console.log('refreshFilter 메서드 존재 여부:', typeof tabulator.refreshFilter === 'function');
        // @ts-ignore
        if (typeof tabulator.refreshFilter === 'function') {
          // @ts-ignore
          tabulator.refreshFilter();
          console.log('refreshFilter 메서드 호출됨');
        }
        
        // 4. 활성 요소에서 포커스 제거
        if (document.activeElement) {
          (document.activeElement as HTMLElement).blur();
          console.log('activeElement에서 blur() 호출됨');
        }
        
        // 5. document.getSelection() 메서드로 선택 취소
        if (document.getSelection) {
          const selection = document.getSelection();
          console.log('현재 selection 객체:', selection);
          selection?.removeAllRanges();
          console.log('selection.removeAllRanges() 호출됨');
        }
        
        // 6. DOM 조작으로 선택된 셀 클래스 제거
        const selectedCells = document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected');
        console.log('선택된 셀 요소 개수:', selectedCells.length);
        selectedCells.forEach(el => {
          el.classList.remove('tabulator-selected');
        });
        
        // 7. 범위 오버레이 요소 제거
        const overlays = document.querySelectorAll('.tabulator-range-overlay, .tabulator-selected-ranges');
        console.log('오버레이 요소 개수:', overlays.length);
        overlays.forEach(el => {
          el.remove();
        });
        
        // 8. 정의된 CSS 스타일로 테이블 선택 영역 초기화
        const style = document.createElement('style');
        style.textContent = `
          .tabulator-selected { background-color: transparent !important; }
          .tabulator-range-overlay { display: none !important; }
          .tabulator-cell { outline: none !important; }
          .tabulator-range-selected { background-color: transparent !important; }
        `;
        document.head.appendChild(style);
        console.log('임시 스타일 요소 추가됨');
        
        // 잠시 후 스타일 제거
        setTimeout(() => {
          document.head.removeChild(style);
          console.log('임시 스타일 요소 제거됨');
        }, 100);
        
        // 추가: selectCell 메서드 확인
        // @ts-ignore
        console.log('getSelectedCells 메서드 존재 여부:', typeof tabulator.getSelectedCells === 'function');
        
        // @ts-ignore
        if (typeof tabulator.getSelectedCells === 'function') {
          try {
            // @ts-ignore
            const selectedCells = tabulator.getSelectedCells();
            console.log('API로 조회한 선택된 셀 개수:', selectedCells?.length || 0);
          } catch (e) {
            console.error('getSelectedCells 호출 오류:', e);
          }
        }
        
        // 추가: 선택 취소 후 DOM 상태 확인
        setTimeout(() => {
          const remainingSelected = document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected');
          const remainingOverlays = document.querySelectorAll('.tabulator-range-overlay, .tabulator-selected-ranges');
          console.log('선택 해제 후 - 남아있는 선택된 셀:', remainingSelected.length);
          console.log('선택 해제 후 - 남아있는 오버레이:', remainingOverlays.length);
          console.log('셀 선택 해제 시도 - 디버깅 종료 ========');
        }, 200);
      } catch (err) {
        console.error("Tabulator API 오류:", err);
      }
    } else {
      console.log('tabulator 인스턴스가 존재하지 않음');
    }
  };

  // 문서 클릭 이벤트 처리 - 특정 영역만 타겟팅
  useEffect(() => {
    // 클릭 이벤트 핸들러
    const handleClickOutside = (e: MouseEvent) => {
      // 테이블 영역 체크
      const isTableClicked = tableRef.current && tableRef.current.contains(e.target as Node);
      
      // 테이블 외부 클릭 시에만 선택 해제
      if (!isTableClicked) {
        console.log('테이블 외부 클릭 감지', '이벤트 타입:', e.type, '대상 요소:', e.target);
        clearSelection();
      }
    };
    
    // 문서 클릭 이벤트 리스너
    document.addEventListener('mousedown', handleClickOutside, true); // 캡처링 단계에서 실행 (맨 처음)
    document.addEventListener('click', handleClickOutside, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
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
        selectableRange: true,  // 'true'로 설정
        selectableRangeColumns: true,
        selectableRangeRows: true,
        
        // 중요: 선택 해제 관련 옵션 추가
        selectableRangeClearCells: true,
        
        // 이벤트 핸들러 추가
        cellSelected: function(cell) {
          console.log("셀 선택됨:", cell.getData(), cell.getField());
        },
        
        cellDeselected: function(cell) {
          console.log("셀 선택 해제됨:", cell.getData(), cell.getField());
        },
        
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
      
      // 기본 이벤트 리스너 추가
      table.on("tableBuilt", function() {
        console.log("테이블 구축 완료!");
        
        // 메서드 및 모듈 확인
        // @ts-ignore
        console.log('Tabulator 버전 확인:', table.version);
        // @ts-ignore
        console.log('모듈 목록:', Object.keys(table.modules || {}));
        console.log('사용 가능한 메서드:', Object.getOwnPropertyNames(Object.getPrototypeOf(table)));
      });
      
      // 선택 변경 이벤트 리스너 추가 (중요!)
      table.on("cellSelectionChanged", function(data, rows) {
        console.log("셀 선택 변경 감지:", data ? data.length : 0, "개 셀 선택됨");
      });
      
      // 초기화 직후 바로 이벤트 핸들러 추가
      const tableElement = tableRef.current;
      
      // 테이블 내부 이벤트 전파 중지 (기존 코드 수정)
      tableElement.addEventListener('click', (e) => {
        console.log('테이블 내부 클릭 - stopPropagation 실행');
        e.stopPropagation();
      }, true);
      
      // 윈도우 클릭 이벤트에서 clearSelectionRange 직접 호출 코드 수정
      window.addEventListener('click', (e) => {
        if (!tableElement.contains(e.target as Node)) {
          console.log('윈도우 클릭 감지 - clearSelectionRange 호출 시도');
          // @ts-ignore
          if (typeof table.clearSelectionRange === 'function') {
            // @ts-ignore
            table.clearSelectionRange();
            console.log('window 이벤트에서 clearSelectionRange 호출됨');
          } else {
            console.log('window 이벤트에서 clearSelectionRange 메서드 없음');
          }
        }
      }, true);
    }
    
    return () => {
      tabulator?.destroy();
    };
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
          <h1 className="text-2xl font-bold">기본 테이블 및 정렬</h1>
          <p className="text-gray-500 mt-1">열 헤더를 클릭하여 정렬할 수 있는 기본 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 text-sm text-gray-500">
            <strong>셀 선택:</strong> 셀을 드래그하여 범위를 선택할 수 있습니다. 마우스를 클릭하면 선택이 해제됩니다.
          </p>
          <div 
            ref={tableRef} 
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          ></div>
        </CardContent>
      </Card>
    </div>
  );
} 