"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter,
  FileDown,
  Columns,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Info,
  RefreshCw,
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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

// 페이징 옵션
type PageSize = 10 | 20 | 50 | 100;

export default function Handsontable4Page() {
  const [allData, setAllData] = useState<EmployeeData[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeData[]>([]);
  const [pageData, setPageData] = useState<EmployeeData[]>([]);
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
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const hotTableRef = useRef<any>(null);
  
  // 더미 데이터 생성
  useEffect(() => {
    generateDummyData();
  }, []);
  
  // 필터링된 데이터가 변경될 때마다 페이지 카운트 업데이트
  useEffect(() => {
    updateFilteredData();
  }, [allData, filterDepartment, filterPosition, searchQuery]);
  
  // 필터링된 데이터 또는 페이지 변경시 현재 페이지 데이터 업데이트
  useEffect(() => {
    updatePageData();
  }, [filteredData, currentPage, pageSize]);
  
  // 총 페이지 수 계산
  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / pageSize));
  }, [filteredData, pageSize]);
  
  // 필터링된 데이터 업데이트
  const updateFilteredData = () => {
    let filtered = [...allData];
    
    // 부서 필터링
    if (filterDepartment) {
      filtered = filtered.filter(item => item.department === filterDepartment);
    }
    
    // 직급 필터링
    if (filterPosition) {
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
  
  // 현재 페이지 데이터 업데이트
  const updatePageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);
    setPageData(filteredData.slice(startIndex, endIndex));
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
    }
  };
  
  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: string) => {
    setPageSize(parseInt(size) as PageSize);
    setCurrentPage(1); // 페이지 크기 변경시 첫 페이지로 이동
  };
  
  // 출근율 렌더러
  const rateRenderer = (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string, value: number, cellProperties: any) => {
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
    data: pageData,
    columns: columns,
    rowHeaders: true,
    colHeaders: true,
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    width: '100%',
    height: 400,
    manualColumnResize: true,
    manualRowResize: false,
    stretchH: 'all' as 'all' | 'none' | 'last',
    hiddenColumns: {
      indicators: true
    },
    afterGetColHeader: (col: number, TH: HTMLTableCellElement) => {
      if (col >= 0) {
        TH.className = 'htMiddle htCenter';
      }
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
    setSearchQuery("");
    setCurrentPage(1);
  };
  
  // 엑셀 다운로드 - 현재 페이지 또는 전체 데이터
  const downloadExcel = (downloadAll: boolean = false) => {
    if (hotTableRef.current && hotTableRef.current.hotInstance) {
      const exportPlugin = hotTableRef.current.hotInstance.getPlugin('exportFile');
      
      if (downloadAll) {
        // 전체 데이터 다운로드 - 직접 데이터와 컬럼 헤더 지정
        const headers = columns.map(col => col.title);
        const dataForExport = filteredData.map(row => {
          const rowData: any = {};
          columns.forEach(col => {
            rowData[col.data] = row[col.data as keyof EmployeeData];
          });
          return rowData;
        });
        
        exportPlugin.downloadFile('csv', {
          filename: '직원_근태_데이터_전체',
          columnHeaders: true,
          rowHeaders: true,
          data: dataForExport,
          columnHeadersAsObjects: headers
        });
      } else {
        // 현재 페이지 데이터만 다운로드
        exportPlugin.downloadFile('csv', {
          filename: '직원_근태_데이터_현재페이지',
          columnHeaders: true,
          rowHeaders: true,
        });
      }
    }
  };
  
  // 페이지 범위 계산
  const getPaginationRange = () => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    const end = Math.min(totalPages, Math.max(currentPage + 2, 5));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  
  // 검색 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilteredData();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Handsontable 샘플4 - 고급 필터링</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/handsontable">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadExcel(false)}>
            <FileDown className="h-4 w-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">직원 근태 분석 표</CardTitle>
          
          <div className="flex flex-col space-y-4 mt-4">
            {/* 검색 영역 */}
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="사번, 이름, 부서명으로 검색"
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="outline" size="sm">
                  검색
                </Button>
              </form>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  총 {filteredData.length}개 항목 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)}
                </span>
                
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
                
                <DropdownMenu>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileDown className="h-4 w-4 mr-2" />
                            엑셀 다운로드
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>데이터를 엑셀 파일로 다운로드합니다</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => downloadExcel(false)}>
                      현재 페이지만 다운로드
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadExcel(true)}>
                      전체 데이터 다운로드
                    </DropdownMenuItem>
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
            
            {/* 필터 영역 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">부서 필터</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <Badge
                      key={dept}
                      variant={filterDepartment === dept ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFilterDepartment(filterDepartment === dept ? null : dept);
                        setCurrentPage(1);
                      }}
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
                      onClick={() => {
                        setFilterPosition(filterPosition === pos ? null : pos);
                        setCurrentPage(1);
                      }}
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
              </div>
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
                  <li>페이징 처리: 대용량 데이터의 효율적인 로딩</li>
                  <li>페이지 크기 조절: 한 페이지당 표시할 항목 수 설정</li>
                  <li>검색 기능: 사번, 이름, 부서명으로 검색</li>
                  <li>필터링: 부서 및 직급별 필터링</li>
                  <li>데이터 내보내기: 현재 페이지 또는 전체 데이터 CSV 형식으로 내보내기</li>
                </ul>
              </div>
            </div>
          </div>
          
          <HotTable
            ref={hotTableRef}
            settings={tableSettings}
          />
          
          {/* 페이징 컨트롤 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-muted-foreground">페이지당 항목:</label>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPaginationRange().map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {totalPages > 0 ? `페이지 ${currentPage} / ${totalPages}` : '데이터 없음'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 