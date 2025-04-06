"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Filter, 
  Printer, 
  Calendar as CalendarIcon,
  Save,
  Copy,
  Clipboard,
  Info,
  ArrowLeft,
  FileDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Handsontable 관련 임포트
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// 모든 Handsontable 모듈 등록
registerAllModules();

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
  status: string;
  note: string;
}

export default function Sample1() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  
  const hotTableRef = useRef<any>(null);
  
  // 컬럼 정의
  const columns = [
    { data: 'employeeId', title: '사번', readOnly: true },
    { data: 'name', title: '이름', readOnly: true },
    { data: 'department', title: '부서', readOnly: true },
    { data: 'position', title: '직급', readOnly: true },
    { data: 'date', title: '날짜', readOnly: true },
    { data: 'clockIn', title: '출근 시간' },
    { data: 'clockOut', title: '퇴근 시간' },
    { data: 'workingHours', title: '근무 시간', readOnly: true },
    { 
      data: 'status', 
      title: '상태',
      type: 'dropdown',
      source: ['정상', '지각', '조퇴', '결근', '휴가']
    },
    { data: 'note', title: '비고' }
  ];
  
  // 셀 타입 렌더러
  const statusCellRenderer = (instance: any, td: HTMLTableCellElement, row: number, col: number, prop: string, value: string, cellProperties: any) => {
    td.innerHTML = value || '';
    
    switch(value) {
      case '정상':
        td.className = 'bg-green-100 text-green-800';
        break;
      case '지각':
      case '조퇴':
        td.className = 'bg-amber-100 text-amber-800';
        break;
      case '결근':
        td.className = 'bg-red-100 text-red-800';
        break;
      case '휴가':
        td.className = 'bg-blue-100 text-blue-800';
        break;
      default:
        td.className = '';
    }
    
    return td;
  };
  
  // 테이블 설정
  const tableSettings = {
    licenseKey: 'non-commercial-and-evaluation',
    data: data,
    columns: columns,
    rowHeaders: true,
    colHeaders: true,
    contextMenu: ['copy', 'cut', 'paste'] as any,
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    minSpareRows: 0,
    width: '100%',
    height: 500,
    manualColumnResize: true,
    manualRowResize: true,
    stretchH: 'all' as 'all' | 'none' | 'last',
    afterChange: (changes: any, source: string) => {
      if (source !== 'loadData') {
        setUnsavedChanges(true);
        
        // 출퇴근 시간이 변경되면 근무 시간 자동 계산
        if (changes) {
          changes.forEach(([row, prop, oldValue, newValue]: [number, string, any, any]) => {
            if (prop === 'clockIn' || prop === 'clockOut') {
              const rowData = hotTableRef.current.hotInstance.getSourceDataAtRow(row);
              if (rowData.clockIn && rowData.clockOut) {
                const clockIn = rowData.clockIn.split(':');
                const clockOut = rowData.clockOut.split(':');
                
                if (clockIn.length === 2 && clockOut.length === 2) {
                  const inTime = new Date();
                  inTime.setHours(parseInt(clockIn[0]), parseInt(clockIn[1]), 0);
                  
                  const outTime = new Date();
                  outTime.setHours(parseInt(clockOut[0]), parseInt(clockOut[1]), 0);
                  
                  const diffMs = outTime.getTime() - inTime.getTime();
                  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                  
                  const workingHours = `${diffHrs}:${diffMins.toString().padStart(2, '0')}`;
                  hotTableRef.current.hotInstance.setDataAtRowProp(row, 'workingHours', workingHours);
                }
              }
            }
          });
        }
      }
    },
    cells: useCallback((row: number, col: number, prop: string | number) => {
      const cellProperties: any = {};
      const rowData = data[row] || {};
      
      // 특정 열에 대한 스타일 적용
      if (prop === 'status') {
        const status = rowData.status;
        
        if (status === '정상') {
          cellProperties.className = 'status-normal';
        } else if (status === '지각' || status === '조퇴') {
          cellProperties.className = 'status-warning';
        } else if (status === '결근') {
          cellProperties.className = 'status-absent';
        } else if (status === '휴가') {
          cellProperties.className = 'status-vacation';
        }
      }
      
      return cellProperties;
    }, [data])
  };
  
  // 더미 데이터 생성
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    
    const attendanceRecords: AttendanceRecord[] = [
      { 
        id: "ATT-20230601-001", 
        employeeId: "EMP001", 
        name: "홍길동", 
        department: "개발팀", 
        position: "과장", 
        date: today,
        clockIn: "08:55", 
        clockOut: "18:10", 
        workingHours: "9:15", 
        status: "정상",
        note: ""
      },
      { 
        id: "ATT-20230601-002", 
        employeeId: "EMP002", 
        name: "김철수", 
        department: "마케팅팀", 
        position: "대리", 
        date: today,
        clockIn: "09:10", 
        clockOut: "18:05", 
        workingHours: "8:55", 
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
        clockIn: "08:45", 
        clockOut: "17:30", 
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
        status: "휴가",
        note: ""
      },
      { 
        id: "ATT-20230601-006", 
        employeeId: "EMP006", 
        name: "송미란", 
        department: "회계팀", 
        position: "과장", 
        date: today,
        clockIn: "08:50", 
        clockOut: "18:05", 
        workingHours: "9:15", 
        status: "정상",
        note: ""
      },
      { 
        id: "ATT-20230601-007", 
        employeeId: "EMP007", 
        name: "최지수", 
        department: "회계팀", 
        position: "대리", 
        date: today,
        clockIn: "08:58", 
        clockOut: "18:02", 
        workingHours: "9:04", 
        status: "정상",
        note: ""
      },
      { 
        id: "ATT-20230601-008", 
        employeeId: "EMP008", 
        name: "한승우", 
        department: "개발팀", 
        position: "차장", 
        date: today,
        clockIn: "08:30", 
        clockOut: "18:30", 
        workingHours: "10:00", 
        status: "정상",
        note: ""
      },
    ];
    
    setData(attendanceRecords);
  }, []);

  // 상태별 통계 계산
  const statusStats = data.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 변경사항 저장
  const saveChanges = () => {
    // 실제 구현에서는 API 호출 등을 통해 서버에 변경사항 저장
    console.log('저장된 데이터:', hotTableRef.current.hotInstance.getData());
    setUnsavedChanges(false);
    alert('저장되었습니다.');
  };
  
  // 검색 기능
  const searchData = () => {
    if (hotTableRef.current && hotTableRef.current.hotInstance) {
      const searchResult = hotTableRef.current.hotInstance.getPlugin('search').query(searchTerm);
      console.log('검색 결과:', searchResult);
      
      // 첫 번째 결과로 이동
      if (searchResult.length > 0) {
        hotTableRef.current.hotInstance.selectCell(searchResult[0].row, searchResult[0].col);
        hotTableRef.current.hotInstance.scrollViewportTo(searchResult[0].row);
      }
    }
  };
  
  // 엑셀로 내보내기
  const exportToExcel = () => {
    const exportPlugin = hotTableRef.current.hotInstance.getPlugin('exportFile');
    exportPlugin.downloadFile('csv', {
      filename: '출퇴근_기록_' + new Date().toISOString().split('T')[0],
      columnHeaders: true,
      rowHeaders: true
    });
  };
  
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
        <h1 className="text-2xl font-bold">Handsontable 샘플1 - 기본 기능</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/handsontable">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={saveChanges} disabled={!unsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <FileDown className="mr-2 h-4 w-4" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 날짜 표시 */}
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">정상 출근</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusStats["정상"] || 0}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">지각</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{statusStats["지각"] || 0}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">결근</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusStats["결근"] || 0}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">휴가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusStats["휴가"] || 0}명</div>
          </CardContent>
        </Card>
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
            onKeyDown={e => e.key === 'Enter' && searchData()}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={searchData}
          >
            검색
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
            }}
          >
            초기화
          </Button>
          
          {/* 복사/붙여넣기 안내 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-2"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>셀이나 범위를 선택한 후:</p>
                <p>- Ctrl+C (Cmd+C): 복사</p>
                <p>- Ctrl+X (Cmd+X): 잘라내기</p>
                <p>- Ctrl+V (Cmd+V): 붙여넣기</p>
                <p>- 우클릭으로 컨텍스트 메뉴에서도 사용 가능</p>
                <p>- Excel에서 복사한 데이터도 바로 붙여넣기 가능</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Handsontable 그리드 */}
      <div className="border rounded-md overflow-hidden">
        <HotTable
          ref={hotTableRef}
          {...tableSettings}
        />
      </div>

      {/* 안내 메시지 */}
      {unsavedChanges && (
        <div className="text-sm text-amber-600 font-medium">
          * 변경사항이 있습니다. 상단의 저장 버튼을 눌러 변경사항을 저장하세요.
        </div>
      )}

      <div className="text-sm text-muted-foreground flex items-center">
        <Clipboard className="h-4 w-4 mr-2" />
        표를 복사하려면 셀을 드래그한 후 Ctrl+C(또는 Cmd+C)를 누르세요. Excel에서 복사한 데이터를 표에 붙여넣으려면 셀을 선택한 후 Ctrl+V(또는 Cmd+V)를 누르세요.
      </div>

      {/* 페이지 정보 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          총 {data.length}명의 출퇴근 기록
        </div>
      </div>
    </div>
  );
} 