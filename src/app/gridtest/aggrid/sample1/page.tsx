"use client";

import { useState, useEffect } from "react";
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
  ArrowLeft
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  workingHours: string | null;
  status: "정상" | "지각" | "조퇴" | "결근" | "휴가";
  note?: string;
}

export default function Sample1Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [rowData, setRowData] = useState<AttendanceRecord[]>([]);
  
  // AG Grid 열 정의
  const [columnDefs] = useState<ColDef<AttendanceRecord>[]>([
    { field: 'employeeId', headerName: '사번', sortable: true, filter: true },
    { field: 'name', headerName: '이름', sortable: true, filter: true },
    { field: 'department', headerName: '부서', sortable: true, filter: true },
    { field: 'position', headerName: '직급', sortable: true, filter: true },
    { field: 'clockIn', headerName: '출근 시간', sortable: true, filter: true },
    { field: 'clockOut', headerName: '퇴근 시간', sortable: true, filter: true },
    { field: 'workingHours', headerName: '근무 시간', sortable: true, filter: true },
    { 
      field: 'status', 
      headerName: '상태', 
      sortable: true, 
      filter: true,
      cellRenderer: (params: any) => {
        const status = params.value;
        let className = '';
        
        switch(status) {
          case '정상':
            className = 'bg-green-100 text-green-800';
            break;
          case '지각':
          case '조퇴':
            className = 'bg-amber-100 text-amber-800';
            break;
          case '결근':
            className = 'bg-red-100 text-red-800';
            break;
          case '휴가':
            className = 'bg-blue-100 text-blue-800';
            break;
        }
        
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${className}">${status}</span>`;
      }
    },
    { field: 'note', headerName: '비고', sortable: true, filter: true }
  ]);
  
  // AG Grid 기본 설정
  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight',
    animateRows: true,
  };
  
  // 오늘 날짜 문자열 (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];
  
  // 더미 출퇴근 기록 데이터
  useEffect(() => {
    const attendanceRecords: AttendanceRecord[] = [
      { 
        id: "ATT-20230601-001", 
        employeeId: "EMP001", 
        name: "홍길동", 
        department: "개발팀", 
        position: "과장", 
        date: today,
        clockIn: "08:55:23", 
        clockOut: "18:10:05", 
        workingHours: "9:15", 
        status: "정상"
      },
      { 
        id: "ATT-20230601-002", 
        employeeId: "EMP002", 
        name: "김철수", 
        department: "마케팅팀", 
        position: "대리", 
        date: today,
        clockIn: "09:10:45", 
        clockOut: "18:05:12", 
        workingHours: "8:54", 
        status: "지각",
        note: "출근 버스 지연"
      },
      { 
        id: "ATT-20230601-003", 
        employeeId: "EMP003", 
        name: "이영희", 
        department: "인사팀", 
        position: "부장", 
        date: today,
        clockIn: "08:45:10", 
        clockOut: "17:30:22", 
        workingHours: "8:45", 
        status: "조퇴",
        note: "병원 진료"
      },
      { 
        id: "ATT-20230601-004", 
        employeeId: "EMP004", 
        name: "박민수", 
        department: "영업팀", 
        position: "사원", 
        date: today,
        clockIn: null, 
        clockOut: null, 
        workingHours: null, 
        status: "결근",
        note: "병가"
      },
      { 
        id: "ATT-20230601-005", 
        employeeId: "EMP005", 
        name: "정수연", 
        department: "개발팀", 
        position: "대리", 
        date: today,
        clockIn: null, 
        clockOut: null, 
        workingHours: null, 
        status: "휴가"
      },
      { 
        id: "ATT-20230601-006", 
        employeeId: "EMP006", 
        name: "송미란", 
        department: "회계팀", 
        position: "과장", 
        date: today,
        clockIn: "08:50:33", 
        clockOut: "18:05:44", 
        workingHours: "9:15", 
        status: "정상"
      },
      { 
        id: "ATT-20230601-007", 
        employeeId: "EMP007", 
        name: "최지수", 
        department: "회계팀", 
        position: "대리", 
        date: today,
        clockIn: "08:58:21", 
        clockOut: "18:02:10", 
        workingHours: "9:04", 
        status: "정상"
      },
      { 
        id: "ATT-20230601-008", 
        employeeId: "EMP008", 
        name: "한승우", 
        department: "개발팀", 
        position: "차장", 
        date: today,
        clockIn: "08:30:15", 
        clockOut: "18:30:05", 
        workingHours: "10:00", 
        status: "정상"
      },
    ];

    setRowData(attendanceRecords);
  }, [today]);

  // 상태별 직원 수 계산
  const countByStatus = rowData.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRecords = rowData.length;
  const normalCount = countByStatus["정상"] || 0;
  const lateCount = countByStatus["지각"] || 0;
  const earlyLeaveCount = countByStatus["조퇴"] || 0;
  const absentCount = countByStatus["결근"] || 0;
  const vacationCount = countByStatus["휴가"] || 0;

  // 날짜 포맷 함수
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AG Grid 샘플 1</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/aggrid">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                달력 보기
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            필터
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

      {/* 날짜 선택 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const prevDay = new Date(selectedDate);
              prevDay.setDate(prevDay.getDate() - 1);
              setSelectedDate(prevDay);
            }}
          >
            이전 날짜
          </Button>
          <div className="text-lg font-medium px-3">
            {formatDate(selectedDate)}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              const nextDay = new Date(selectedDate);
              nextDay.setDate(nextDay.getDate() + 1);
              setSelectedDate(nextDay);
            }}
          >
            다음 날짜
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSelectedDate(new Date())}
        >
          오늘
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">정상 출근</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{normalCount}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">지각</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lateCount}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">조퇴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{earlyLeaveCount}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">결근</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">휴가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{vacationCount}명</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="이름, 사번, 부서, 직급 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={selectedStatus === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus("all")}
          >
            전체
          </Button>
          <Button 
            variant={selectedStatus === "정상" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus("정상")}
          >
            정상 출근
          </Button>
          <Button 
            variant={selectedStatus === "지각" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus("지각")}
          >
            지각
          </Button>
          <Button 
            variant={selectedStatus === "조퇴" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus("조퇴")}
          >
            조퇴
          </Button>
          <Button 
            variant={selectedStatus === "결근" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus("결근")}
          >
            결근
          </Button>
          <Button 
            variant={selectedStatus === "휴가" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedStatus("휴가")}
          >
            휴가
          </Button>
        </div>
      </div>

      {/* AG Grid 테이블 */}
      <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          animateRows={true}
          domLayout={'autoHeight'}
        />
      </div>

      {/* 페이지네이션 정보 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          총 {rowData.length}명의 출퇴근 기록
        </div>
      </div>
    </div>
  );
} 