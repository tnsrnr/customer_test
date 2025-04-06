"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Filter,
  FileDown,
  Columns,
  Calculator,
  BarChart4,
  Info,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Handsontable 관련 임포트
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// 모든 Handsontable 모듈 등록
registerAllModules();

// 데이터 타입 정의
interface EmployeeData {
  id: string;
  name: string;
  department: string;
  position: string;
  year: number;
  month: number;
  workDays: number;
  attendanceDays: number;
  lateDays: number;
  leaveEarlyDays: number;
  absentDays: number;
  vacationDays: number;
  attendanceRate: number;
}

export default function Handsontable3Page() {
  const [data, setData] = useState<EmployeeData[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    id: true,
    name: true,
    department: true,
    position: true,
    year: true,
    month: true,
    workDays: true,
    attendanceDays: true,
    lateDays: true,
    leaveEarlyDays: true,
    absentDays: true,
    vacationDays: true,
    attendanceRate: true,
  });
  
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const hotTableRef = useRef<any>(null);
  
  // 더미 데이터 생성
  useEffect(() => {
    generateDummyData();
  }, []);
  
  const generateDummyData = () => {
    const departments = ["개발팀", "인사팀", "마케팅팀", "영업팀", "경영지원팀"];
    const positions = ["사원", "대리", "과장", "차장", "부장"];
    const months = [1, 2, 3, 4, 5, 6];
    
    const dummyData: EmployeeData[] = [];
    
    // 각 부서와 직급 조합마다 직원 생성
    for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) {
      for (let posIndex = 0; posIndex < positions.length; posIndex++) {
        // 각 부서/직급 조합당 1~3명의 직원
        const employeeCount = Math.floor(Math.random() * 3) + 1;
        
        for (let empIndex = 0; empIndex < employeeCount; empIndex++) {
          // 직원 기본 정보
          const id = `EMP${(deptIndex * 100 + posIndex * 10 + empIndex).toString().padStart(3, '0')}`;
          const name = generateRandomName();
          const department = departments[deptIndex];
          const position = positions[posIndex];
          
          // 6개월치 데이터 생성
          for (let month of months) {
            // 월별 근태 데이터
            const workDays = 22; // 기본 근무일수 (월별로 다를 수 있음)
            
            // 결근, 지각, 조퇴, 휴가 랜덤 생성
            const lateDays = Math.floor(Math.random() * 4);
            const leaveEarlyDays = Math.floor(Math.random() * 3);
            const absentDays = Math.floor(Math.random() * 2);
            const vacationDays = Math.floor(Math.random() * 3);
            
            // 출근일수 계산 (결근과 휴가 제외)
            const attendanceDays = workDays - absentDays - vacationDays;
            
            // 출근율 계산 (휴가는 제외)
            const attendanceRate = parseFloat(((attendanceDays / (workDays - vacationDays)) * 100).toFixed(1));
            
            dummyData.push({
              id,
              name,
              department,
              position,
              year: 2023,
              month,
              workDays,
              attendanceDays,
              lateDays,
              leaveEarlyDays,
              absentDays,
              vacationDays,
              attendanceRate
            });
          }
        }
      }
    }
    
    setData(dummyData);
  };
  
  // 랜덤 이름 생성 함수
  const generateRandomName = () => {
    const firstNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
    const middleNames = ["민", "서", "지", "예", "현", "승", "준", "도", "수", "영"];
    const lastNames = ["준", "우", "희", "연", "민", "수", "진", "아", "원", "석"];
    
    return firstNames[Math.floor(Math.random() * firstNames.length)] +
           middleNames[Math.floor(Math.random() * middleNames.length)] +
           lastNames[Math.floor(Math.random() * lastNames.length)];
  };
  
  // 필터링된 데이터
  const filteredData = data.filter(item => {
    if (filterDepartment && item.department !== filterDepartment) {
      return false;
    }
    if (filterPosition && item.position !== filterPosition) {
      return false;
    }
    return true;
  });
  
  // 부서 목록
  const departments = Array.from(new Set(data.map(item => item.department)));
  
  // 직급 목록
  const positions = Array.from(new Set(data.map(item => item.position)));
  
  // 출근율 렌더러
  const rateRenderer = (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: any) => {
    td.innerHTML = `${value.toFixed(1)}%`;
    
    if (value < 80) {
      td.className = 'bg-red-100 text-red-800';
    } else if (value < 90) {
      td.className = 'bg-amber-100 text-amber-800';
    } else {
      td.className = 'bg-green-100 text-green-800';
    }
    
    return td;
  };
  
  // 컬럼 정의
  const allColumns = [
    { data: 'id', title: '사번', width: 80 },
    { data: 'name', title: '이름', width: 80 },
    { data: 'department', title: '부서', width: 90 },
    { data: 'position', title: '직급', width: 80 },
    { data: 'year', title: '년도', width: 60, type: 'numeric' },
    { data: 'month', title: '월', width: 50, type: 'numeric' },
    { data: 'workDays', title: '근무일수', width: 80, type: 'numeric' },
    { data: 'attendanceDays', title: '출근일수', width: 80, type: 'numeric' },
    { data: 'lateDays', title: '지각일수', width: 80, type: 'numeric' },
    { data: 'leaveEarlyDays', title: '조퇴일수', width: 80, type: 'numeric' },
    { data: 'absentDays', title: '결근일수', width: 80, type: 'numeric' },
    { data: 'vacationDays', title: '휴가일수', width: 80, type: 'numeric' },
    { data: 'attendanceRate', title: '출근율(%)', width: 100, type: 'numeric', renderer: rateRenderer }
  ];
  
  // 보이는 컬럼만 필터링
  const columns = allColumns.filter(col => visibleColumns[col.data]);
  
  // 테이블 설정
  const tableSettings = {
    licenseKey: 'non-commercial-and-evaluation',
    data: filteredData,
    columns: columns,
    rowHeaders: true,
    colHeaders: true,
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    width: '100%',
    height: 500,
    manualColumnResize: true,
    manualRowResize: false,
    stretchH: 'all' as 'all' | 'none' | 'last',
    hiddenColumns: {
      indicators: true
    },
    cell: [
      { row: 0, col: 0, className: 'htMiddle' }
    ],
    // 그룹화를 위한 콜백들
    afterGetColHeader: (col: number, TH: HTMLTableCellElement) => {
      if (col >= 0) {
        TH.className = 'htMiddle htCenter';
      }
    },
    beforeRender: (isForced: boolean) => {
      // 그룹화된 통계를 보여주는 로직은 복잡하여 여기서는 생략됩니다.
    },
    // 계산 기능 관련 콜백
    afterChange: (changes: any, source: string) => {
      if (source === 'edit') {
        // 출근율 재계산
        if (hotTableRef.current && hotTableRef.current.hotInstance) {
          const instance = hotTableRef.current.hotInstance;
          const rowsCount = instance.countRows();
          
          for (let row = 0; row < rowsCount; row++) {
            const workDays = instance.getDataAtRowProp(row, 'workDays') || 0;
            const absentDays = instance.getDataAtRowProp(row, 'absentDays') || 0;
            const vacationDays = instance.getDataAtRowProp(row, 'vacationDays') || 0;
            const attendanceDays = workDays - absentDays - vacationDays;
            
            instance.setDataAtRowProp(row, 'attendanceDays', attendanceDays);
            
            const attendanceRate = ((attendanceDays / (workDays - vacationDays)) * 100);
            instance.setDataAtRowProp(row, 'attendanceRate', parseFloat(attendanceRate.toFixed(1)));
          }
        }
      }
    }
  };
  
  // 컬럼 표시/숨기기 토글
  const toggleColumn = (columnName: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };
  
  // 필터 제거
  const clearFilters = () => {
    setFilterDepartment(null);
    setFilterPosition(null);
  };
  
  // 엑셀 다운로드
  const downloadExcel = () => {
    if (hotTableRef.current && hotTableRef.current.hotInstance) {
      const exportPlugin = hotTableRef.current.hotInstance.getPlugin('exportFile');
      exportPlugin.downloadFile('csv', {
        filename: '직원_근태_데이터',
        columnHeaders: true,
        rowHeaders: true,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Handsontable 샘플3 - 중첩 헤더</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/handsontable">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={downloadExcel}>
            <FileDown className="h-4 w-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">직원 근태 분석 표</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">부서 필터</label>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <Badge
                    key={dept}
                    variant={filterDepartment === dept ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterDepartment(filterDepartment === dept ? null : dept)}
                  >
                    {dept}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">직급 필터</label>
              <div className="flex flex-wrap gap-2">
                {positions.map(pos => (
                  <Badge
                    key={pos}
                    variant={filterPosition === pos ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterPosition(filterPosition === pos ? null : pos)}
                  >
                    {pos}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      필터 초기화
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>모든 필터를 제거합니다</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Columns className="h-4 w-4 mr-2" />
                          컬럼 표시
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>표시할 컬럼을 선택합니다</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>표시할 컬럼 선택</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {allColumns.map(column => (
                      <DropdownMenuItem 
                        key={column.data}
                        onClick={() => toggleColumn(column.data)}
                        className="flex items-center justify-between"
                      >
                        <span>{column.title}</span>
                        <div className={`w-4 h-4 border rounded ${visibleColumns[column.data] ? 'bg-primary border-primary' : 'border-gray-300'}`}></div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={generateDummyData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      데이터 새로고침
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>새로운 랜덤 데이터를 생성합니다</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 bg-blue-50 p-3 rounded-md">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">이 샘플에서 구현된 기능:</p>
                <ul className="list-disc list-inside mt-1 ml-1">
                  <li>필터링: 부서 및 직급별 필터링</li>
                  <li>컬럼 표시/숨기기: UI를 통한 동적 컬럼 제어</li>
                  <li>조건부 서식: 출근율에 따른 색상 변경</li>
                  <li>데이터 내보내기: CSV/엑셀 형식으로 내보내기</li>
                  <li>자동 계산: 수정 시 관련 셀 값 자동 계산</li>
                </ul>
              </div>
            </div>
          </div>
          
          <HotTable
            ref={hotTableRef}
            settings={tableSettings}
          />
        </CardContent>
      </Card>
    </div>
  );
} 