'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Clipboard, FileDown, FileUp, RotateCw, Table2 } from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import "tabulator-tables/dist/css/tabulator.min.css";

// 데이터 타입 정의
interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  salary: number;
  hireDate: string;
  status: string;
}

export default function TabulatorClipboardExample() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [tableData, setTableData] = useState<Employee[]>([]);
  const [pasteData, setPasteData] = useState<string>("");
  
  // 샘플 데이터
  const initialData: Employee[] = [
    { id: 1, name: "김철수", department: "개발팀", position: "프론트엔드 개발자", email: "kim@example.com", phone: "010-1234-5678", salary: 4800000, hireDate: "2020-03-15", status: "재직" },
    { id: 2, name: "이영희", department: "마케팅팀", position: "마케팅 매니저", email: "lee@example.com", phone: "010-2345-6789", salary: 5200000, hireDate: "2019-06-22", status: "재직" },
    { id: 3, name: "박지훈", department: "인사팀", position: "인사 담당자", email: "park@example.com", phone: "010-3456-7890", salary: 4500000, hireDate: "2021-01-10", status: "휴직" },
    { id: 4, name: "최수진", department: "개발팀", position: "백엔드 개발자", email: "choi@example.com", phone: "010-4567-8901", salary: 5000000, hireDate: "2020-08-05", status: "재직" },
    { id: 5, name: "정민호", department: "영업팀", position: "영업 담당자", email: "jung@example.com", phone: "010-5678-9012", salary: 4200000, hireDate: "2022-02-15", status: "재직" },
    { id: 6, name: "강다은", department: "디자인팀", position: "UI/UX 디자이너", email: "kang@example.com", phone: "010-6789-0123", salary: 4700000, hireDate: "2021-05-20", status: "재직" },
    { id: 7, name: "윤성준", department: "개발팀", position: "시스템 엔지니어", email: "yoon@example.com", phone: "010-7890-1234", salary: 5300000, hireDate: "2019-11-08", status: "재직" },
    { id: 8, name: "한미영", department: "재무팀", position: "재무 분석가", email: "han@example.com", phone: "010-8901-2345", salary: 5500000, hireDate: "2018-12-01", status: "재직" },
  ];

  // 초기 데이터 설정
  useEffect(() => {
    setTableData(initialData);
  }, []);

  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current && tableData.length) {
      initTable();
    }
    
    return () => {
      if (tabulator) {
        tabulator.destroy();
      }
    }
  }, [tableData]);

  // 테이블 초기화 함수
  const initTable = () => {
    if (!tableRef.current) return;
    
    try {
      // 기존 테이블 제거
      if (tabulator) {
        tabulator.destroy();
      }
      
      // 새 테이블 생성
      const table = new Tabulator(tableRef.current, {
        data: tableData,
        layout: "fitColumns",
        pagination: true,
        paginationSize: 10,
        movableColumns: true,
        clipboard: true, // 클립보드 활성화
        clipboardCopyConfig: {
          columnHeaders: true, // 헤더 포함
          columnGroups: false,
          rowGroups: false,
          columnCalcs: false,
          dataTree: false,
          formatCells: true // 셀 포맷팅 포함
        },
        clipboardCopyRowRange: "all", // 모든 행 복사
        clipboardPasteParser: "table", // 테이블 형식으로 붙여넣기 해석
        clipboardPasteAction: "replace", // 붙여넣기 시 기존 데이터 대체
        columns: [
          { title: "ID", field: "id", sorter: "number", width: 70, headerSort: true, editor: "input" },
          { title: "이름", field: "name", sorter: "string", headerSort: true, editor: "input" },
          { title: "부서", field: "department", sorter: "string", headerSort: true, editor: "input" },
          { title: "직책", field: "position", sorter: "string", headerSort: true, editor: "input" },
          { title: "이메일", field: "email", sorter: "string", headerSort: true, editor: "input" },
          { title: "전화번호", field: "phone", sorter: "string", headerSort: true, editor: "input" },
          { 
            title: "급여", 
            field: "salary", 
            sorter: "number", 
            headerSort: true, 
            editor: "number",
            formatter: "money",
            formatterParams: {
              thousand: ",",
              symbol: "₩"
            }
          },
          { 
            title: "입사일", 
            field: "hireDate", 
            sorter: "date", 
            headerSort: true,
            editor: "date"
          },
          { 
            title: "상태", 
            field: "status", 
            sorter: "string", 
            headerSort: true,
            editor: "select",
            editorParams: {
              values: ["재직", "휴직", "퇴사"]
            },
            formatter: function(cell) {
              const value = cell.getValue();
              let className = "";
              
              if(value === "재직") className = "bg-green-100 text-green-800";
              else if(value === "휴직") className = "bg-yellow-100 text-yellow-800";
              else if(value === "퇴사") className = "bg-red-100 text-red-800";
              
              return `<span class="px-2 py-1 rounded-full text-xs font-medium ${className}">${value}</span>`;
            }
          }
        ],
        placeholder: "데이터가 없습니다"
      });
      
      // 클립보드 이벤트 리스너
      table.on("clipboardCopied", function(clipboard){
        toast.success("데이터가 클립보드에 복사되었습니다.", {
          description: "스프레드시트에 붙여넣기 할 수 있습니다.",
          duration: 3000
        });
      });
      
      table.on("clipboardPasted", function(clipboard, data){
        toast.success("데이터가 테이블에 붙여넣기 되었습니다.", {
          description: `${data.length}개 행이 추가되었습니다.`,
          duration: 3000
        });
      });
      
      // 테이블 데이터 변경 감지
      table.on("dataChanged", function(data){
        // 상태 업데이트
        setTableData(data);
      });
      
      setTabulator(table);
      
    } catch (error) {
      console.error("테이블 초기화 오류:", error);
      toast.error("테이블 초기화 중 오류가 발생했습니다.");
    }
  };

  // 전체 데이터 복사
  const copyAllData = () => {
    if (!tabulator) return;
    
    // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
    tabulator.copyToClipboard("all");
    
    toast.success("전체 데이터가 클립보드에 복사되었습니다.", {
      description: "스프레드시트에 붙여넣기 할 수 있습니다.",
      duration: 3000
    });
  };

  // 선택 데이터 복사
  const copySelectedData = () => {
    if (!tabulator) return;
    
    // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
    const selectedRows = tabulator.getSelectedRows();
    
    if (selectedRows.length === 0) {
      toast.warning("선택된 행이 없습니다.", {
        description: "먼저 행을 선택한 후 다시 시도해 주세요.",
        duration: 3000
      });
      return;
    }
    
    // @ts-ignore: Tabulator 인터페이스 정의 오류 우회
    tabulator.copyToClipboard("selected");
    
    toast.success(`${selectedRows.length}개 행이 클립보드에 복사되었습니다.`, {
      description: "스프레드시트에 붙여넣기 할 수 있습니다.",
      duration: 3000
    });
  };

  // 클립보드 데이터 테이블에 붙여넣기
  const pasteFromClipboard = async () => {
    if (!tabulator) return;
    
    try {
      const text = await navigator.clipboard.readText();
      
      if (!text) {
        toast.warning("클립보드에 텍스트 데이터가 없습니다.");
        return;
      }
      
      // 클립보드 데이터 저장 (디버깅용)
      setPasteData(text);
      
      // 테이블에 붙여넣기
      // @ts-ignore: string 타입을 데이터로 사용하는 것을 허용
      tabulator.setData(text);
      
    } catch (err) {
      console.error("클립보드 접근 오류:", err);
      toast.error("클립보드 데이터를 가져오지 못했습니다.", {
        description: "브라우저의 클립보드 접근 권한을 확인해 주세요.",
        duration: 3000
      });
    }
  };

  // 직접 붙여넣기 처리
  const handlePasteInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPasteData(value);
    
    if (!value.trim()) return;
    
    try {
      // TSV 형식 데이터 파싱 (엑셀에서 복사한 데이터 형식)
      const rows = value.trim().split('\n');
      const headers = rows[0].split('\t');
      
      const parsedData = rows.slice(1).map(row => {
        const values = row.split('\t');
        const rowData: any = {};
        
        headers.forEach((header, index) => {
          rowData[header.toLowerCase()] = values[index] || '';
        });
        
        return rowData;
      });
      
      if (parsedData.length > 0 && tabulator) {
        tabulator.setData(parsedData);
        
        toast.success(`${parsedData.length}개 행이 테이블에 추가되었습니다.`, {
          duration: 3000
        });
      }
    } catch (error) {
      console.error("데이터 파싱 오류:", error);
      toast.error("데이터 포맷이 올바르지 않습니다.");
    }
  };

  // 초기 데이터로 리셋
  const resetTable = () => {
    setTableData(initialData);
    setPasteData("");
    
    toast.info("테이블이 초기 상태로 리셋되었습니다.", {
      duration: 3000
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">엑셀 복사/붙여넣기</h1>
          <p className="text-gray-500 mt-1">스프레드시트와 데이터를 주고받을 수 있는 Tabulator 예제입니다.</p>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" onClick={copyAllData}>
              <Copy className="h-4 w-4 mr-2" />
              전체 복사
            </Button>
            <Button variant="outline" onClick={copySelectedData}>
              <Clipboard className="h-4 w-4 mr-2" />
              선택 복사
            </Button>
            <Button variant="outline" onClick={pasteFromClipboard}>
              <FileUp className="h-4 w-4 mr-2" />
              클립보드에서 붙여넣기
            </Button>
            <Button variant="outline" onClick={() => tabulator?.download("xlsx", "employee_data.xlsx")}>
              <FileDown className="h-4 w-4 mr-2" />
              엑셀 다운로드
            </Button>
            <Button variant="outline" onClick={resetTable} className="ml-auto">
              <RotateCw className="h-4 w-4 mr-2" />
              초기화
            </Button>
          </div>
          
          <div ref={tableRef} className="w-full mb-4"></div>
          
          <div className="mt-6 border-t pt-4">
            <Label htmlFor="paste-area" className="mb-2 block">
              엑셀에서 복사한 데이터를 아래에 직접 붙여넣기
            </Label>
            <textarea
              id="paste-area"
              className="w-full h-32 p-2 border rounded-md font-mono text-sm resize-none"
              placeholder="여기에 엑셀에서 복사한 데이터를 붙여넣으세요. (탭으로 구분된 데이터)"
              value={pasteData}
              onChange={handlePasteInput}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              데이터 형식 예시: '이름[탭]부서[탭]직책...' (헤더 포함)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm text-gray-500">
        <h3 className="font-medium mb-2">사용 방법</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="font-medium">복사하기:</span> '전체 복사' 또는 '선택 복사' 버튼을 클릭하여 데이터를 클립보드에 복사합니다.</li>
          <li><span className="font-medium">붙여넣기:</span> 엑셀에서 복사한 데이터를 '클립보드에서 붙여넣기' 버튼을 통해 또는 아래 텍스트 영역에 직접 붙여넣을 수 있습니다.</li>
          <li><span className="font-medium">다운로드:</span> '엑셀 다운로드' 버튼을 클릭하여 현재 테이블 데이터를 엑셀 파일로 다운로드합니다.</li>
          <li><span className="font-medium">편집:</span> 모든 셀은 직접 클릭하여 편집할 수 있습니다.</li>
          <li><span className="font-medium">초기화:</span> '초기화' 버튼을 클릭하여 테이블을 원래 상태로 되돌립니다.</li>
        </ul>
        <p className="mt-3"><Table2 className="inline h-4 w-4 mr-1" /> 참고: 복사/붙여넣기 기능은 브라우저 클립보드 접근 권한이 필요합니다.</p>
      </div>
    </div>
  );
} 