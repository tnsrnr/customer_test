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
import { 
  ColDef, 
  GridOptions, 
  ValueGetterParams, 
  RowGroupingDisplayType 
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmployeeData {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  year: number;
  month: number;
  attendanceDays: number;
  lateDays: number;
  earlyLeaveDays: number;
  absentDays: number;
  vacationDays: number;
  workingHoursTotal: number;
}

export default function Sample2Page() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [rowData, setRowData] = useState<EmployeeData[]>([]);
  
  // AG Grid 열 정의 - 그룹화 및 집계 기능 포함
  const [columnDefs] = useState<ColDef<EmployeeData>[]>([
    { 
      field: 'department', 
      headerName: '부서', 
      sortable: true, 
      filter: true,
      enableRowGroup: true,
      rowGroup: true,
      hide: true
    },
    { 
      field: 'position', 
      headerName: '직급', 
      sortable: true, 
      filter: true,
      enableRowGroup: true
    },
    { field: 'employeeId', headerName: '사번', sortable: true, filter: true },
    { field: 'name', headerName: '이름', sortable: true, filter: true },
    { 
      field: 'year', 
      headerName: '년도', 
      sortable: true, 
      filter: true,
      enableRowGroup: true
    },
    { 
      field: 'month', 
      headerName: '월', 
      sortable: true, 
      filter: true,
      enableRowGroup: true
    },
    { 
      field: 'attendanceDays', 
      headerName: '출근일수', 
      sortable: true, 
      filter: true,
      aggFunc: 'sum'
    },
    { 
      field: 'lateDays', 
      headerName: '지각일수', 
      sortable: true, 
      filter: true,
      aggFunc: 'sum',
      cellStyle: (params) => params.value > 0 ? { color: '#d97706' } : {}
    },
    { 
      field: 'earlyLeaveDays', 
      headerName: '조퇴일수', 
      sortable: true, 
      filter: true, 
      aggFunc: 'sum',
      cellStyle: (params) => params.value > 0 ? { color: '#d97706' } : {}
    },
    { 
      field: 'absentDays', 
      headerName: '결근일수', 
      sortable: true, 
      filter: true,
      aggFunc: 'sum',
      cellStyle: (params) => params.value > 0 ? { color: '#dc2626' } : {}
    },
    { 
      field: 'vacationDays', 
      headerName: '휴가일수', 
      sortable: true, 
      filter: true,
      aggFunc: 'sum',
      cellStyle: (params) => params.value > 0 ? { color: '#2563eb' } : {}
    },
    { 
      field: 'workingHoursTotal', 
      headerName: '총 근무시간', 
      sortable: true, 
      filter: true,
      aggFunc: 'sum',
      valueFormatter: (params) => params.value ? `${params.value}시간` : '0시간'
    }
  ]);
  
  // AG Grid 기본 설정
  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    sortable: true,
    filter: true
  };
  
  const autoGroupColumnDef = {
    headerName: '부서/그룹',
    minWidth: 200,
    cellRendererParams: {
      suppressCount: false
    }
  };
  
  // 더미 데이터 생성
  useEffect(() => {
    const departments = ['개발팀', '마케팅팀', '인사팀', '영업팀', '회계팀'];
    const positions = ['사원', '대리', '과장', '차장', '부장'];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    const employeeData: EmployeeData[] = [];
    
    // 각 부서별로 더미 데이터 생성
    departments.forEach((dept, deptIndex) => {
      // 각 부서별 직원 수
      const numEmployees = Math.floor(Math.random() * 3) + 2; // 2-4명
      
      for (let i = 0; i < numEmployees; i++) {
        const employeeId = `EMP${deptIndex + 1}${i + 1}`.padEnd(6, '0');
        const position = positions[Math.floor(Math.random() * 3)]; // 랜덤 직급
        const name = `직원${deptIndex + 1}${i + 1}`;
        
        // 각 직원별 월별 데이터 생성
        months.forEach(month => {
          // 월별 랜덤 데이터
          const attendanceDays = Math.floor(Math.random() * 5) + 15; // 15-19일
          const lateDays = Math.floor(Math.random() * 3); // 0-2일
          const earlyLeaveDays = Math.floor(Math.random() * 2); // 0-1일
          const absentDays = Math.floor(Math.random() * 2); // 0-1일
          const vacationDays = Math.floor(Math.random() * 3); // 0-2일
          const workingHoursTotal = attendanceDays * 8 - (lateDays + earlyLeaveDays) * 2;
          
          employeeData.push({
            id: `${employeeId}-${month}`,
            employeeId,
            name,
            department: dept,
            position,
            year: 2023,
            month,
            attendanceDays,
            lateDays,
            earlyLeaveDays,
            absentDays,
            vacationDays,
            workingHoursTotal
          });
        });
      }
    });
    
    setRowData(employeeData);
  }, []);

  // 날짜 포맷 함수
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 부서별 집계 계산
  const departmentStats = rowData.reduce((acc, curr) => {
    const dept = curr.department;
    if (!acc[dept]) {
      acc[dept] = {
        attendanceDays: 0,
        lateDays: 0,
        earlyLeaveDays: 0,
        absentDays: 0,
        vacationDays: 0,
        employees: new Set()
      };
    }
    
    acc[dept].attendanceDays += curr.attendanceDays;
    acc[dept].lateDays += curr.lateDays;
    acc[dept].earlyLeaveDays += curr.earlyLeaveDays;
    acc[dept].absentDays += curr.absentDays;
    acc[dept].vacationDays += curr.vacationDays;
    acc[dept].employees.add(curr.employeeId);
    
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AG Grid 샘플 2</h1>
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

      {/* 날짜 표시 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <div className="text-lg font-medium px-3">
            {selectedDate.getFullYear()}년 요약 보고서
          </div>
        </div>
      </div>

      {/* 부서별 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(departmentStats).map(([dept, stats]) => (
          <Card key={dept}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">{dept}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">직원 수:</div>
                <div className="font-medium">{(stats.employees as Set<string>).size}명</div>
                
                <div className="text-muted-foreground">총 출근일:</div>
                <div className="font-medium">{stats.attendanceDays}일</div>
                
                <div className="text-muted-foreground">총 지각일:</div>
                <div className="font-medium text-amber-600">{stats.lateDays}일</div>
                
                <div className="text-muted-foreground">총 결근일:</div>
                <div className="font-medium text-red-600">{stats.absentDays}일</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 검색 필드 */}
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
      </div>

      {/* AG Grid 테이블 - 그룹화 및 집계 기능 */}
      <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          animateRows={true}
          groupDisplayType={'multipleColumns'}
          suppressAggFuncInHeader={true}
          suppressMenuHide={true}
          groupDefaultExpanded={1}
        />
      </div>

      {/* 요약 정보 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          총 {Object.values(departmentStats).reduce((total, dept) => total + (dept.employees as Set<string>).size, 0)}명의 직원, {rowData.length}개의 월별 기록
        </div>
      </div>
    </div>
  );
} 