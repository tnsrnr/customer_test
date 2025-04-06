"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  Filter,
  Printer,
  Clock,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

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

// 샘플 데이터
const originalAttendanceData: AttendanceRecord[] = [
  { 
    id: "ATT-20230601-001", 
    employeeId: "EMP001", 
    name: "홍길동", 
    department: "개발팀", 
    position: "과장", 
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
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
    date: new Date().toISOString().split("T")[0],
    clockIn: "08:30:15", 
    clockOut: "18:30:05", 
    workingHours: "10:00", 
    status: "정상"
  },
];

// 부서 목록
const departments = ['전체', '개발팀', '마케팅팀', '인사팀', '영업팀', '회계팀'];

// 직급 목록
const positions = ['전체', '사원', '대리', '과장', '차장', '부장'];

// 상태 목록
const statuses = ['전체', '정상', '지각', '조퇴', '결근', '휴가'];

export default function AttendanceRecordsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState(originalAttendanceData);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    department: '전체',
    position: '전체',
    status: '전체',
    employeeId: '',
    employeeName: '',
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const [showTab, setShowTab] = useState<string>('전체');
  const [searchText, setSearchText] = useState('');

  // 통계 데이터 계산
  const [statusStats, setStatusStats] = useState({
    total: 8,
    normal: 4,
    late: 1,
    early: 1,
    absent: 1,
    vacation: 1,
  });

  // 필터 적용
  useEffect(() => {
    let filtered = [...originalAttendanceData];
    const newActiveFilters: string[] = [];

    if (filterOptions.department !== '전체') {
      filtered = filtered.filter(item => item.department === filterOptions.department);
      newActiveFilters.push(`부서: ${filterOptions.department}`);
    }

    if (filterOptions.position !== '전체') {
      filtered = filtered.filter(item => item.position === filterOptions.position);
      newActiveFilters.push(`직급: ${filterOptions.position}`);
    }

    if (filterOptions.status !== '전체') {
      filtered = filtered.filter(item => item.status === filterOptions.status);
      newActiveFilters.push(`상태: ${filterOptions.status}`);
    }

    if (filterOptions.employeeId) {
      filtered = filtered.filter(item => item.employeeId.includes(filterOptions.employeeId));
      newActiveFilters.push(`사번: ${filterOptions.employeeId}`);
    }

    if (filterOptions.employeeName) {
      filtered = filtered.filter(item => item.name.includes(filterOptions.employeeName));
      newActiveFilters.push(`이름: ${filterOptions.employeeName}`);
    }

    setAttendanceData(filtered);
    setActiveFilters(newActiveFilters);

    // 통계 업데이트
    const newStats = {
      total: filtered.length,
      normal: filtered.filter(item => item.status === '정상').length,
      late: filtered.filter(item => item.status === '지각').length,
      early: filtered.filter(item => item.status === '조퇴').length,
      absent: filtered.filter(item => item.status === '결근').length,
      vacation: filtered.filter(item => item.status === '휴가').length,
    };
    setStatusStats(newStats);
  }, [filterOptions]);

  // 필터 초기화
  const resetFilters = () => {
    setFilterOptions({
      department: '전체',
      position: '전체',
      status: '전체',
      employeeId: '',
      employeeName: '',
    });
    setOpenFilter(false);
  };

  // 한 필터 제거
  const removeFilter = (filter: string) => {
    const type = filter.split(': ')[0];
    const newFilterOptions = { ...filterOptions };

    switch (type) {
      case '부서':
        newFilterOptions.department = '전체';
        break;
      case '직급':
        newFilterOptions.position = '전체';
        break;
      case '상태':
        newFilterOptions.status = '전체';
        break;
      case '사번':
        newFilterOptions.employeeId = '';
        break;
      case '이름':
        newFilterOptions.employeeName = '';
        break;
      default:
        break;
    }

    setFilterOptions(newFilterOptions);
  };

  // 날짜 변경
  const changeDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setOpenCalendar(false);
    }
  };

  // 이전 날짜로 이동
  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  // 다음 날짜로 이동
  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  // 오늘 날짜로 이동
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // 파일 다운로드 (CSV 형식)
  const downloadCSV = () => {
    const headers = ['사번', '이름', '부서', '직급', '출근 시간', '퇴근 시간', '근무 시간', '상태', '비고'];
    const rows = attendanceData.map(record => [
      record.employeeId,
      record.name,
      record.department,
      record.position,
      record.clockIn,
      record.clockOut,
      record.workingHours,
      record.status,
      record.note
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `출퇴근기록_${format(selectedDate, 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 인쇄 기능
  const printTable = () => {
    window.print();
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(attendanceData.length / recordsPerPage);
  const currentRecords = attendanceData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // 페이지 변경
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 상태 탭 필터링
  const filterByStatus = (status: string) => {
    setShowTab(status);
    
    if (status === '전체') {
      // 전체 탭이면 다른 필터 조건만 적용
      const newOptions = { ...filterOptions, status: '전체' };
      setFilterOptions(newOptions);
    } else {
      // 특정 상태 탭이면 해당 상태로 필터링
      const newOptions = { ...filterOptions, status };
      setFilterOptions(newOptions);
    }
  };

  // 검색 기능
  const handleSearch = () => {
    // 검색어가 사번, 이름, 부서, 직급 중 하나라도 일치하면 표시
    let filtered = [...originalAttendanceData];
    
    if (searchText.trim()) {
      filtered = filtered.filter(item => 
        item.employeeId.includes(searchText) || 
        item.name.includes(searchText) || 
        item.department.includes(searchText) || 
        item.position.includes(searchText)
      );
    }
    
    setAttendanceData(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
        <h1 className="text-2xl font-bold">출퇴근 기록</h1>
        <div className="flex gap-2">
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="mr-2 h-4 w-4" />
                달력 보기
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-md" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={changeDate}
                initialFocus
                className="rounded-xl border"
              />
            </PopoverContent>
          </Popover>
          
          <Dialog open={openFilter} onOpenChange={setOpenFilter}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                필터
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">필터 설정</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label htmlFor="department" className="text-sm font-medium">부서</Label>
                  <Select
                    value={filterOptions.department}
                    onValueChange={(value) => setFilterOptions({...filterOptions, department: value})}
                  >
                    <SelectTrigger id="department" className="h-10 shadow-sm">
                      <SelectValue placeholder="부서 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="position" className="text-sm font-medium">직급</Label>
                  <Select
                    value={filterOptions.position}
                    onValueChange={(value) => setFilterOptions({...filterOptions, position: value})}
                  >
                    <SelectTrigger id="position" className="h-10 shadow-sm">
                      <SelectValue placeholder="직급 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-medium">상태</Label>
                  <Select
                    value={filterOptions.status}
                    onValueChange={(value) => setFilterOptions({...filterOptions, status: value})}
                  >
                    <SelectTrigger id="status" className="h-10 shadow-sm">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="employeeId" className="text-sm font-medium">사번</Label>
                  <Input
                    id="employeeId"
                    value={filterOptions.employeeId}
                    onChange={(e) => setFilterOptions({...filterOptions, employeeId: e.target.value})}
                    placeholder="사번 입력"
                    className="h-10 shadow-sm"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="employeeName" className="text-sm font-medium">이름</Label>
                  <Input
                    id="employeeName"
                    value={filterOptions.employeeName}
                    onChange={(e) => setFilterOptions({...filterOptions, employeeName: e.target.value})}
                    placeholder="이름 입력"
                    className="h-10 shadow-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetFilters} className="h-10 shadow-sm">
                  초기화
                </Button>
                <Button onClick={() => setOpenFilter(false)} className="h-10 shadow-sm">
                  적용
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={downloadCSV}>
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
          
          <Button variant="outline" size="sm" onClick={printTable}>
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
            onClick={goToPreviousDay}
          >
            이전 날짜
          </Button>
          <div className="text-lg font-medium px-3">
            {formatDate(selectedDate)}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToNextDay}
          >
            다음 날짜
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToToday}
          >
            오늘
          </Button>
        </div>
        
        {/* 활성화된 필터 태그 */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1 rounded-full text-sm shadow-sm">
                {filter}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 rounded-full" 
                  onClick={() => removeFilter(filter)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.total}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">정상 출근</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusStats.normal}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">지각</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusStats.late}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">조퇴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statusStats.early}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">결근</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusStats.absent}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">휴가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusStats.vacation}명</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름, 사번, 부서, 직급 검색..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={showTab === '전체' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => filterByStatus('전체')}
          >
            전체
          </Button>
          <Button 
            variant={showTab === '정상' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => filterByStatus('정상')}
          >
            정상 출근
          </Button>
          <Button 
            variant={showTab === '지각' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => filterByStatus('지각')}
          >
            지각
          </Button>
          <Button 
            variant={showTab === '조퇴' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => filterByStatus('조퇴')}
          >
            조퇴
          </Button>
          <Button 
            variant={showTab === '결근' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => filterByStatus('결근')}
          >
            결근
          </Button>
          <Button 
            variant={showTab === '휴가' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => filterByStatus('휴가')}
          >
            휴가
          </Button>
        </div>
      </div>

      {/* 출퇴근 기록 테이블 */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted border-b">
                <th className="py-3 px-4 text-left font-medium">사번</th>
                <th className="py-3 px-4 text-left font-medium">이름</th>
                <th className="py-3 px-4 text-left font-medium">부서</th>
                <th className="py-3 px-4 text-left font-medium">직급</th>
                <th className="py-3 px-4 text-left font-medium">출근 시간</th>
                <th className="py-3 px-4 text-left font-medium">퇴근 시간</th>
                <th className="py-3 px-4 text-left font-medium">근무 시간</th>
                <th className="py-3 px-4 text-left font-medium">상태</th>
                <th className="py-3 px-4 text-left font-medium">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentRecords.map((record) => (
                <tr key={record.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{record.employeeId}</td>
                  <td className="py-3 px-4 font-medium">{record.name}</td>
                  <td className="py-3 px-4">{record.department}</td>
                  <td className="py-3 px-4">{record.position}</td>
                  <td className="py-3 px-4">
                    {record.clockIn ? (
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        {record.clockIn}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {record.clockOut ? (
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        {record.clockOut}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{record.workingHours || '-'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        record.status === '정상' && 'bg-green-100 text-green-800',
                        record.status === '지각' && 'bg-amber-100 text-amber-800',
                        record.status === '조퇴' && 'bg-amber-100 text-amber-800',
                        record.status === '결근' && 'bg-red-100 text-red-800',
                        record.status === '휴가' && 'bg-blue-100 text-blue-800'
                      )}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{record.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentRecords.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground font-medium">
          총 {attendanceData.length}명의 출퇴근 기록
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-9 shadow-sm"
          >
            이전
          </Button>
          <span className="text-sm px-2">
            {currentPage} / {totalPages === 0 ? 1 : totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-9 shadow-sm"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
} 