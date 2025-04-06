"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Filter, 
  Printer, 
  Calendar as CalendarIcon,
  Clock,
  Save,
  CheckCircle2,
  XCircle,
  ArrowLeft
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions, GridApi, CellValueChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface LeaveRequest {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  type: "연차" | "반차" | "병가" | "경조사" | "기타";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "대기" | "승인" | "반려";
  managerComment?: string;
}

// 편집 가능한 셀 렌더러
const StatusCellRenderer = (props: any) => {
  const [status, setStatus] = useState(props.value);
  
  const handleChange = (newStatus: "대기" | "승인" | "반려") => {
    setStatus(newStatus);
    props.setValue(newStatus);
  };
  
  let color = "";
  switch (status) {
    case "대기":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "승인":
      color = "bg-green-100 text-green-800";
      break;
    case "반려":
      color = "bg-red-100 text-red-800";
      break;
  }
  
  return (
    <div className="flex items-center gap-2">
      <Badge className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {status}
      </Badge>
      <div className="flex gap-1">
        <button 
          onClick={() => handleChange("승인")}
          className="p-1 rounded-full hover:bg-green-50"
          title="승인"
        >
          <CheckCircle2 size={16} className="text-green-600" />
        </button>
        <button 
          onClick={() => handleChange("반려")}
          className="p-1 rounded-full hover:bg-red-50"
          title="반려"
        >
          <XCircle size={16} className="text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default function Sample3Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [rowData, setRowData] = useState<LeaveRequest[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  
  const gridRef = useRef<AgGridReact>(null);
  
  // AG Grid 열 정의 - 편집 가능한 셀과 커스텀 셀 렌더러
  const [columnDefs] = useState<ColDef<LeaveRequest>[]>([
    { 
      field: 'employeeId', 
      headerName: '사번', 
      sortable: true, 
      filter: true,
      width: 100
    },
    { 
      field: 'name', 
      headerName: '이름', 
      sortable: true, 
      filter: true,
      width: 100
    },
    { 
      field: 'department', 
      headerName: '부서', 
      sortable: true, 
      filter: true,
      width: 100
    },
    { 
      field: 'position', 
      headerName: '직급', 
      sortable: true, 
      filter: true,
      width: 100
    },
    { 
      field: 'type', 
      headerName: '휴가 유형', 
      sortable: true, 
      filter: true,
      width: 120,
      cellClass: (params) => {
        switch(params.value) {
          case '연차': return 'text-blue-600';
          case '반차': return 'text-indigo-600';
          case '병가': return 'text-purple-600';
          case '경조사': return 'text-teal-600';
          default: return '';
        }
      }
    },
    { 
      field: 'startDate', 
      headerName: '시작일', 
      sortable: true, 
      filter: true,
      width: 120
    },
    { 
      field: 'endDate', 
      headerName: '종료일', 
      sortable: true, 
      filter: true,
      width: 120
    },
    { 
      field: 'days', 
      headerName: '일수', 
      sortable: true, 
      filter: true,
      width: 80
    },
    { 
      field: 'reason', 
      headerName: '사유', 
      sortable: true, 
      filter: true,
      width: 200
    },
    { 
      field: 'status', 
      headerName: '상태', 
      sortable: true, 
      filter: true,
      width: 150,
      cellRenderer: StatusCellRenderer,
      editable: true
    },
    { 
      field: 'managerComment', 
      headerName: '담당자 코멘트', 
      sortable: true, 
      filter: true,
      editable: true,
      width: 200
    }
  ]);
  
  // AG Grid 기본 설정
  const defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
    resizable: true
  };
  
  // 더미 데이터 생성
  useEffect(() => {
    const leaveTypes: ("연차" | "반차" | "병가" | "경조사" | "기타")[] = ["연차", "반차", "병가", "경조사", "기타"];
    const statuses: ("대기" | "승인" | "반려")[] = ["대기", "승인", "반려"];
    
    const leaveRequests: LeaveRequest[] = [
      {
        id: "L001",
        employeeId: "EMP001",
        name: "홍길동",
        department: "개발팀",
        position: "과장",
        type: "연차",
        startDate: "2023-05-02",
        endDate: "2023-05-03",
        days: 2,
        reason: "개인 사유",
        status: "대기"
      },
      {
        id: "L002",
        employeeId: "EMP002",
        name: "김철수",
        department: "마케팅팀",
        position: "대리",
        type: "병가",
        startDate: "2023-05-10",
        endDate: "2023-05-10",
        days: 1,
        reason: "병원 진료",
        status: "승인",
        managerComment: "병원 진단서 확인 완료"
      },
      {
        id: "L003",
        employeeId: "EMP003",
        name: "이영희",
        department: "인사팀",
        position: "부장",
        type: "경조사",
        startDate: "2023-05-15",
        endDate: "2023-05-16",
        days: 2,
        reason: "부친상",
        status: "승인",
        managerComment: "경조사 증빙 확인 완료"
      },
      {
        id: "L004",
        employeeId: "EMP004",
        name: "박민수",
        department: "영업팀",
        position: "사원",
        type: "반차",
        startDate: "2023-05-11",
        endDate: "2023-05-11",
        days: 0.5,
        reason: "개인 사유",
        status: "반려",
        managerComment: "업무 일정 충돌로 인한 반려"
      },
      {
        id: "L005",
        employeeId: "EMP005",
        name: "정수연",
        department: "개발팀",
        position: "대리",
        type: "연차",
        startDate: "2023-05-22",
        endDate: "2023-05-26",
        days: 5,
        reason: "가족 여행",
        status: "대기"
      },
      {
        id: "L006",
        employeeId: "EMP006",
        name: "송미란",
        department: "회계팀",
        position: "과장",
        type: "기타",
        startDate: "2023-05-29",
        endDate: "2023-05-30",
        days: 2,
        reason: "국가공인자격증 시험",
        status: "대기"
      },
      {
        id: "L007",
        employeeId: "EMP007",
        name: "최지수",
        department: "회계팀",
        position: "대리",
        type: "연차",
        startDate: "2023-06-01",
        endDate: "2023-06-01",
        days: 1,
        reason: "이사",
        status: "대기"
      },
      {
        id: "L008",
        employeeId: "EMP008",
        name: "한승우",
        department: "개발팀",
        position: "차장",
        type: "반차",
        startDate: "2023-06-07",
        endDate: "2023-06-07",
        days: 0.5,
        reason: "자녀 학교 행사",
        status: "승인",
        managerComment: "승인 완료"
      },
    ];
    
    setRowData(leaveRequests);
  }, []);

  // 셀 값 변경 시 호출되는 함수
  const onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log('셀 값 변경:', event);
    setUnsavedChanges(true);
  };
  
  // 변경사항 저장
  const saveChanges = () => {
    // 실제 구현에서는 API 호출 등을 통해 서버에 변경사항 저장
    console.log('저장된 데이터:', gridRef.current?.api.getRenderedNodes().map(node => node.data));
    setUnsavedChanges(false);
    alert('저장되었습니다.');
  };
  
  // 상태별 통계 계산
  const statusStats = rowData.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AG Grid 샘플 3</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/aggrid">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={saveChanges} disabled={!unsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            인쇄
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rowData.length}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{statusStats["대기"] || 0}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">승인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusStats["승인"] || 0}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">반려</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusStats["반려"] || 0}건</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 필드 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="이름, 사번, 부서, 사유 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (gridRef.current?.api) {
                gridRef.current.api.setQuickFilter(searchTerm);
              }
            }}
          >
            검색
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              if (gridRef.current?.api) {
                gridRef.current.api.setQuickFilter('');
              }
            }}
          >
            초기화
          </Button>
        </div>
      </div>

      {/* AG Grid 테이블 - 편집 가능한 셀 */}
      <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          onCellValueChanged={onCellValueChanged}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          enableCellTextSelection={true}
          copyHeadersToClipboard={true}
          enableRangeSelection={true}
          suppressCopyRowsToClipboard={false}
        />
      </div>

      {/* 안내 메시지 */}
      {unsavedChanges && (
        <div className="text-sm text-amber-600 font-medium">
          * 변경사항이 있습니다. 상단의 저장 버튼을 눌러 변경사항을 저장하세요.
        </div>
      )}

      {/* 복사 안내 메시지 */}
      <div className="text-sm text-muted-foreground">
        * 셀 드래그 후 Ctrl+C(또는 Cmd+C)로 클립보드에 복사할 수 있습니다. Excel이나 다른 스프레드시트에 붙여넣기 가능합니다.
      </div>

      {/* 페이지 정보 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          총 {rowData.length}건의 휴가 신청
        </div>
      </div>
    </div>
  );
} 