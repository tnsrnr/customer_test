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

export default function TabulatorClipboardExample() {
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

  // 선택한 셀 영역 초기화 함수 (직접 DOM 접근 방식 추가)
  const clearSelection = () => {
    console.log('샘플2: 셀 선택 해제 시도');
    
    // Tabulator API 공식 메서드 호출 (Tabulator 6.3 기준)
    if (tabulator) {
      try {
        // 1. 공식 문서의 clearSelectionRange 메서드 사용
        // @ts-ignore
        if (typeof tabulator.clearSelectionRange === 'function') {
          // @ts-ignore
          tabulator.clearSelectionRange();
          console.log('clearSelectionRange 메서드 호출됨');
        }
        
        // 2. selectRange 모듈에 직접 접근
        // @ts-ignore
        if (tabulator.modules && tabulator.modules.selectRange) {
          // @ts-ignore
          const selectRangeModule = tabulator.modules.selectRange;
          
          // selectRange 모듈의 clearRange 메서드 호출
          if (typeof selectRangeModule.clearRange === 'function') {
            selectRangeModule.clearRange();
            console.log('selectRange.clearRange 메서드 호출됨');
          }
          
          // clearRange 메서드가 없으면 clear 메서드 시도
          else if (typeof selectRangeModule.clear === 'function') {
            selectRangeModule.clear();
            console.log('selectRange.clear 메서드 호출됨');
          }
        }
        
        // 3. 데이터 변경 이벤트를 발생시켜 선택 초기화 시도
        // @ts-ignore
        tabulator.refreshFilter();
        
        // 4. 활성 요소에서 포커스 제거
        if (document.activeElement) {
          (document.activeElement as HTMLElement).blur();
        }
        
        // 5. document.getSelection() 메서드로 선택 취소
        if (document.getSelection) {
          const selection = document.getSelection();
          selection?.removeAllRanges();
        }
        
        // 6. DOM 조작으로 선택된 셀 클래스 제거
        document.querySelectorAll('.tabulator-selected, .tabulator-cell.tabulator-selected').forEach(el => {
          el.classList.remove('tabulator-selected');
        });
        
        // 7. 범위 오버레이 요소 제거
        document.querySelectorAll('.tabulator-range-overlay, .tabulator-selected-ranges').forEach(el => {
          el.remove();
        });
        
        // 8. 정의된 CSS 스타일로 테이블 선택 영역 초기화
        const style = document.createElement('style');
        style.textContent = `
          .tabulator-selected { background-color: transparent !important; }
          .tabulator-range-overlay { display: none !important; }
        `;
        document.head.appendChild(style);
        
        // 잠시 후 스타일 제거
        setTimeout(() => {
          document.head.removeChild(style);
        }, 100);
        
        setSelectedData("선택 영역이 초기화되었습니다.");
      } catch (err) {
        console.error("Tabulator API 오류:", err);
      }
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
        console.log('테이블 외부 클릭 감지 - 이벤트 정보:', e.type, e.target);
        clearSelection();
      }
    };
    
    // 문서 클릭 이벤트 리스너
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside); // click도 추가
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 선택한 셀 복사 함수 (이벤트 전파 중지)
  const copySelectedCells = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 중지
    
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

  // 테이블 전체 복사 함수 (이벤트 전파 중지)
  const copyEntireTable = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 중지
    
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
  
  // 현재 볼 수 있는 데이터만 복사 (이벤트 전파 중지)
  const copyVisibleData = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 중지
    
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

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current) {
      // console.log('Tabulator 옵션 확인:', tabulatorOptions);
      console.log('테이블 초기화 시작');
      
      // 테이블 초기화 - 이벤트 콜백 제거하고 간단하게 설정
      const table = new Tabulator(tableRef.current, {
        data: data,
        layout: "fitColumns",
        height: "500px",
        
        // 범위 선택 관련 설정
        selectable: true,
        selectableRange: true,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        
        // 선택 해제 옵션 추가 (핵심!)
        selectableRangeClearCells: true,
        
        // 클립보드 관련 설정
        clipboard: true,
        clipboardCopyStyled: true,
        clipboardCopyRowRange: "selected",
        
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
      
      console.log('테이블 생성 완료, 인스턴스:', table);
      
      // Tabulator 버전 확인
      // @ts-ignore
      console.log('Tabulator 버전:', table.version);
      
      // 모듈 및 메서드 확인
      // @ts-ignore
      if (table.modules) {
        // @ts-ignore
        console.log('Tabulator 모듈 목록:', Object.keys(table.modules));
      }
      
      // 기본 이벤트 설정
      table.on("tableBuilt", function() {
        console.log("테이블 구축 완료!");
      });
      
      // 셀 선택 변경 이벤트 
      table.on("cellSelectionChanged", function(data, rows) {
        const cells = data || [];
        console.log("셀 선택 변경 감지:", cells.length, "개 셀 선택됨");
      });
      
      // Tabulator 인스턴스 저장
      setTabulator(table);
      
      // 초기화 직후 바로 이벤트 핸들러 추가
      const tableElement = tableRef.current;
      
      // 테이블 내부 이벤트 전파 중지
      tableElement.addEventListener('click', (e) => {
        // e.stopPropagation();
      });
    }
    
    return () => {
      if (tabulator) {
        tabulator.destroy();
      }
    };
  }, []);

  return (
    <div className="container mx-auto py-6" style={{ minHeight: '100vh' }}>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">클립보드 기능</h1>
          <p className="text-gray-500 mt-1">셀 범위를 드래그하여 선택한 후 복사하세요. 셀을 더블클릭하면 편집 가능합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>셀 범위 선택 및 클립보드 기능</CardTitle>
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
              <Button onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }} size="sm" variant="destructive" className="mb-2">
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
              <strong>선택 해제:</strong> 테이블 바깥 영역을 클릭하면 선택이 해제됩니다.
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