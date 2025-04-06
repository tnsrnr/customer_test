"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  MoveHorizontal,
  ArrowUpDown,
  RotateCcw,
  Move,
  Settings,
  GripVertical,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

interface ColumnDefinition {
  id: string;
  data: string;
  title: string;
  readOnly?: boolean;
  type?: string;
  renderer?: (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string, value: any, cellProperties: any) => HTMLTableCellElement;
}

// 페이징 옵션
type PageSize = 10 | 20 | 50 | 100;

export default function Handsontable5Page() {
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
  
  // 헤더 순서 관리를 위한 상태
  const [showColumnDialog, setShowColumnDialog] = useState<boolean>(false);
  const [columnsOrder, setColumnsOrder] = useState<ColumnDefinition[]>([]);
  const [columnResetKey, setColumnResetKey] = useState<number>(0);
  
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
    td.innerHTML = `${value}%`;
    
    if (value < 80) {
      td.className = 'bg-red-100 text-red-800';
    } else if (value < 90) {
      td.className = 'bg-amber-100 text-amber-800';
    } else {
      td.className = 'bg-green-100 text-green-800';
    }
    
    return td;
  };
  
  // 기본 컬럼 정의
  const defaultColumns: ColumnDefinition[] = [
    { id: 'col1', data: 'id', title: '사번' },
    { id: 'col2', data: 'name', title: '이름' },
    { id: 'col3', data: 'department', title: '부서' },
    { id: 'col4', data: 'position', title: '직급' },
    { id: 'col5', data: 'year', title: '년도' },
    { id: 'col6', data: 'month', title: '월' },
    { id: 'col7', data: 'workDays', title: '근무일수' },
    { id: 'col8', data: 'attendanceDays', title: '출근일수' },
    { id: 'col9', data: 'lateDays', title: '지각일수' },
    { id: 'col10', data: 'leaveEarlyDays', title: '조퇴일수' },
    { id: 'col11', data: 'absentDays', title: '결근일수' },
    { id: 'col12', data: 'vacationDays', title: '휴가일수' },
    { id: 'col13', data: 'attendanceRate', title: '출근율(%)', renderer: rateRenderer }
  ];
  
  // 컬럼 초기화 - 컴포넌트 마운트 시에도 실행
  useEffect(() => {
    setColumnsOrder([...defaultColumns]);
  }, [columnResetKey]);
  
  // 초기 컬럼 설정
  useEffect(() => {
    // 컴포넌트 마운트 시 한 번 실행되도록 빈 의존성 배열 사용
    setColumnsOrder([...defaultColumns]);
  }, []);
  
  // 보이는 컬럼만 필터링
  const columns = columnsOrder.filter(col => visibleColumns[col.data]);
  
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
    manualColumnMove: true,
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
    // 컬럼 이동 후 콜백
    afterColumnMove: (movedColumns: number[], finalIndex: number, dropIndex: number, movePossible: boolean) => {
      if (movePossible && hotTableRef.current && hotTableRef.current.hotInstance) {
        // 핸드손테이블의 현재 컬럼 순서를 반영
        const instance = hotTableRef.current.hotInstance;
        const currentColumns = [...columnsOrder];
        
        // 이동된 컬럼들 처리
        const movingColumns = movedColumns.map(index => currentColumns[index]);
        
        // 이동된 컬럼들 제거
        movedColumns.sort((a, b) => b - a); // 역순으로 정렬하여 인덱스 변경 방지
        movedColumns.forEach(index => {
          currentColumns.splice(index, 1);
        });
        
        // 새 위치에 이동된 컬럼들 삽입
        currentColumns.splice(finalIndex, 0, ...movingColumns);
        
        // 컬럼 순서 업데이트
        setColumnsOrder(currentColumns);
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
  
  // Dialog가 열릴 때 columnsOrder 설정
  const handleOpenColumnDialog = () => {
    // Dialog를 열 때 columnsOrder 재설정
    if (columnsOrder.length === 0) {
      setColumnsOrder([...defaultColumns]);
    }
    setShowColumnDialog(true);
  };
  
  // Dialog의 열림/닫힘 상태 변경 시 처리
  const handleDialogOpenChange = (open: boolean) => {
    // Dialog가 닫히는 경우
    if (!open) {
      setShowColumnDialog(false);
    }
  };
  
  // 열 순서 변경 버튼 클릭 핸들러
  const handleOrderButtonClick = () => {
    setShowColumnDialog(true);
  };
  
  // 드래그 종료 핸들러
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(columnsOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setColumnsOrder(items);
  };
  
  // 컬럼 초기화 버튼 핸들러
  const handleResetColumns = () => {
    setColumnResetKey(prev => prev + 1);
  };
  
  // 현재 페이지의 데이터 계산
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Handsontable 샘플5 - 헤더 이동</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/handsontable">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => downloadExcel(false)}>
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
                      {columnsOrder.map(column => (
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
                      <Button variant="outline" size="sm" onClick={handleOrderButtonClick}>
                        <MoveHorizontal className="h-4 w-4 mr-2" />
                        헤더 순서 변경
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>헤더를 직접 드래그하거나 다이얼로그에서 순서를 변경하세요</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
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
                  <li>컬럼 재정렬: 헤더를 직접 드래그하거나 다이얼로그에서 순서 변경</li>
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
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 ? handlePageChange(currentPage - 1) : undefined}
                    className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}
                  />
                </PaginationItem>
                
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                  </PaginationItem>
                )}
                
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                {getPaginationRange().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                {currentPage < totalPages - 1 && totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages ? handlePageChange(currentPage + 1) : undefined}
                    className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            
            <div className="text-sm text-muted-foreground">
              {totalPages > 0 ? `페이지 ${currentPage} / ${totalPages}` : '데이터 없음'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 헤더 순서 변경 다이얼로그 */}
      <Dialog open={showColumnDialog} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>헤더 순서 변경</DialogTitle>
            <DialogDescription>
              드래그 앤 드롭으로 헤더 순서를 변경할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="headersList">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {columnsOrder.map((column, index) => (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center p-3 bg-gray-50 rounded-md border"
                          >
                            <GripVertical className="h-4 w-4 mr-2 text-gray-400" />
                            {column.title}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="destructive" onClick={handleResetColumns}>
              초기화
            </Button>
            <Button type="button" onClick={() => setShowColumnDialog(false)}>
              적용
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 