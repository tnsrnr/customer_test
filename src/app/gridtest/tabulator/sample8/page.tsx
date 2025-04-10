'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileDown, 
  Filter, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  RefreshCw,
  Columns
} from 'lucide-react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { toast } from "sonner";
import "tabulator-tables/dist/css/tabulator.min.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// 페이징 옵션
type PageSize = 10 | 20 | 50 | 100;

export default function TabulatorSample8() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [allData, setAllData] = useState<EmployeeData[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeData[]>([]);
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
  
  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<PageSize>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  
  // 필터링 관련 상태
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterPosition, setFilterPosition] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // 더미 데이터 생성
  useEffect(() => {
    generateDummyData();
  }, []);
  
  // 필터링된 데이터가 변경될 때마다 페이지 카운트 업데이트
  useEffect(() => {
    updateFilteredData();
  }, [allData, filterDepartment, filterPosition, searchQuery]);
  
  // 총 페이지 수 계산
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize]);
  
  // 필터링된 데이터 업데이트
  const updateFilteredData = () => {
    let filtered = [...allData];
    
    // 부서 필터링
    if (filterDepartment && filterDepartment !== "all") {
      filtered = filtered.filter(item => item.department === filterDepartment);
    }
    
    // 직급 필터링
    if (filterPosition && filterPosition !== "all") {
      filtered = filtered.filter(item => item.position === filterPosition);
    }
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.id.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query) ||
        item.position.toLowerCase().includes(query)
      );
    }
    
    setFilteredData(filtered);
    
    // 페이지 범위를 벗어난 경우 첫 페이지로 이동
    if (currentPage > Math.ceil(filtered.length / pageSize)) {
      setCurrentPage(1);
    }
  };
  
  const generateDummyData = () => {
    const departments = ["개발팀", "인사팀", "마케팅팀", "영업팀", "경영지원팀"];
    const positions = ["사원", "대리", "과장", "차장", "부장"];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const years = [2022, 2023];
    
    const dummyData: EmployeeData[] = [];
    
    // 더 많은 데이터 생성 (약 500개 정도)
    for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) {
      for (let posIndex = 0; posIndex < positions.length; posIndex++) {
        // 각 부서/직급 조합당 직원 수 증가
        const employeeCount = Math.floor(Math.random() * 5) + 3;
        
        for (let empIndex = 0; empIndex < employeeCount; empIndex++) {
          // 직원 기본 정보
          const id = `EMP${(deptIndex * 100 + posIndex * 10 + empIndex).toString().padStart(3, '0')}`;
          const name = generateRandomName();
          const department = departments[deptIndex];
          const position = positions[posIndex];
          
          // 모든 월과 년도의 데이터 생성
          for (let year of years) {
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
                year,
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
    }
    
    setAllData(dummyData);
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
  
  // 부서 목록
  const departments = Array.from(new Set(allData.map(item => item.department)));
  
  // 직급 목록
  const positions = Array.from(new Set(allData.map(item => item.position)));
  
  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (tabulator) {
        tabulator.setPage(page);
      }
    }
  };
  
  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: string) => {
    const newSize = parseInt(size) as PageSize;
    setPageSize(newSize);
    if (tabulator) {
      tabulator.setPageSize(newSize);
    }
  };
  
  // 필터 초기화
  const clearFilters = () => {
    setFilterDepartment("all");
    setFilterPosition("all");
    setSearchQuery("");
    if (tabulator) {
      tabulator.clearFilter();
    }
  };
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tabulator) {
      if (searchQuery) {
        tabulator.setFilter("name", "like", searchQuery);
      } else {
        tabulator.clearFilter();
      }
    }
  };
  
  // 테이블 초기화
  useEffect(() => {
    if (tableRef.current && filteredData.length > 0) {
      const table = new Tabulator(tableRef.current, {
        data: filteredData,
        layout: "fitColumns",
        responsiveLayout: "hide",
        pagination: true,
        paginationSize: pageSize,
        paginationSizeSelector: [10, 20, 50, 100],
        paginationButtonCount: 5,
        columns: [
          { 
            title: "ID", 
            field: "id", 
            sorter: "string",
            headerFilter: true,
            visible: visibleColumns.id
          },
          { 
            title: "이름", 
            field: "name", 
            sorter: "string",
            headerFilter: true,
            visible: visibleColumns.name
          },
          { 
            title: "부서", 
            field: "department", 
            sorter: "string",
            headerFilter: true,
            visible: visibleColumns.department
          },
          { 
            title: "직급", 
            field: "position", 
            sorter: "string",
            headerFilter: true,
            visible: visibleColumns.position
          },
          { 
            title: "년도", 
            field: "year", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.year
          },
          { 
            title: "월", 
            field: "month", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.month
          },
          { 
            title: "근무일수", 
            field: "workDays", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.workDays
          },
          { 
            title: "출근일수", 
            field: "attendanceDays", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.attendanceDays
          },
          { 
            title: "지각", 
            field: "lateDays", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.lateDays
          },
          { 
            title: "조퇴", 
            field: "leaveEarlyDays", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.leaveEarlyDays
          },
          { 
            title: "결근", 
            field: "absentDays", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.absentDays
          },
          { 
            title: "휴가", 
            field: "vacationDays", 
            sorter: "number",
            headerFilter: true,
            visible: visibleColumns.vacationDays
          },
          { 
            title: "출근율", 
            field: "attendanceRate", 
            sorter: "number",
            headerFilter: true,
            formatter: function(cell) {
              const value = cell.getValue();
              let color = "green";
              if (value < 90) color = "red";
              else if (value < 95) color = "orange";
              return `<span style="color: ${color}">${value}%</span>`;
            },
            visible: visibleColumns.attendanceRate
          }
        ],
        selectable: true,
        selectableRangeMode: "click",
        selectableRollingSelection: true,
        selectablePersistence: false,
        clipboard: true,
        clipboardCopySelector: "active",
        clipboardCopyStyled: false,
        clipboardCopyConfig: {
          columnHeaders: true,
          rowGroups: false,
          columnCalcs: false,
        },
        dataChanged: function(data) {
          setFilteredData(data);
        },
        pageChanged: function(data) {
          setCurrentPage(data.page);
        },
        pageSizeChanged: function(size) {
          setPageSize(size as PageSize);
        }
      });
      
      setTabulator(table);
    }
  }, [filteredData, pageSize, visibleColumns]);
  
  // 컬럼 표시/숨김 토글
  const toggleColumn = (columnName: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Link href="/gridtest/tabulator">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle>근태 관리 시스템 (Tabulator)</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => clearFilters()}>
              <Filter className="h-4 w-4 mr-2" />
              필터 초기화
            </Button>
            <Button variant="outline" size="sm" onClick={() => tabulator?.download("csv", "근태관리.csv")}>
              <FileDown className="h-4 w-4 mr-2" />
              내보내기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* 검색 및 필터 영역 */}
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="flex space-x-2">
                  <Input
                    placeholder="이름, ID, 부서, 직급으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    검색
                  </Button>
                </div>
              </form>
              <Select value={filterDepartment || "all"} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPosition || "all"} onValueChange={setFilterPosition}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="직급 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Columns className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>표시할 컬럼</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(visibleColumns).map(([key, value]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => toggleColumn(key)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => {}}
                          className="mr-2"
                        />
                        {key}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* 테이블 */}
            <div ref={tableRef} className="tabulator-container" />
            
            {/* 페이지네이션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="mx-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="페이지 크기" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10개</SelectItem>
                  <SelectItem value="20">20개</SelectItem>
                  <SelectItem value="50">50개</SelectItem>
                  <SelectItem value="100">100개</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 