"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Save, ArrowLeft, FileDown } from "lucide-react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import Link from "next/link";
// CSS를 필요한 시점에만 로드하도록 수정
// import "tabulator-tables/dist/css/tabulator.min.css";

// 출석 기록 인터페이스 정의
interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  date: string;
  clockIn: string;
  clockOut: string;
  workingHours: string;
  status: string;
  note?: string;
}

// 출석 상태 타입
type AttendanceStatus = '정상' | '지각' | '조퇴' | '결근' | '휴가' | '전체';

export default function TabulatorSample() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("전체");
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableInstance, setTableInstance] = useState<any>(null);

  // 더미 데이터 생성
  const dummyData: AttendanceRecord[] = [
    { id: "1", employeeId: "E001", name: "김철수", department: "개발팀", position: "사원", date: "2023-06-01", clockIn: "09:00", clockOut: "18:00", workingHours: "8.0", status: "정상", note: "" },
    { id: "2", employeeId: "E002", name: "이영희", department: "인사팀", position: "주임", date: "2023-06-01", clockIn: "09:15", clockOut: "18:30", workingHours: "8.25", status: "지각", note: "교통 혼잡" },
    { id: "3", employeeId: "E003", name: "박민수", department: "마케팅팀", position: "대리", date: "2023-06-01", clockIn: "08:50", clockOut: "17:00", workingHours: "7.17", status: "조퇴", note: "병원 방문" },
    { id: "4", employeeId: "E004", name: "정수진", department: "개발팀", position: "과장", date: "2023-06-01", clockIn: "", clockOut: "", workingHours: "0.0", status: "휴가", note: "연차 사용" },
    { id: "5", employeeId: "E005", name: "홍길동", department: "영업팀", position: "차장", date: "2023-06-01", clockIn: "09:05", clockOut: "18:10", workingHours: "8.08", status: "정상", note: "" },
    { id: "6", employeeId: "E006", name: "강지영", department: "인사팀", position: "부장", date: "2023-06-01", clockIn: "", clockOut: "", workingHours: "0.0", status: "결근", note: "개인 사유" },
    { id: "7", employeeId: "E007", name: "윤태호", department: "마케팅팀", position: "사원", date: "2023-06-01", clockIn: "08:55", clockOut: "18:05", workingHours: "8.17", status: "정상", note: "" },
    { id: "8", employeeId: "E008", name: "임성민", department: "영업팀", position: "대리", date: "2023-06-01", clockIn: "09:30", clockOut: "18:00", workingHours: "7.5", status: "지각", note: "알람 미작동" },
    { id: "9", employeeId: "E009", name: "최재원", department: "개발팀", position: "사원", date: "2023-06-01", clockIn: "09:00", clockOut: "16:30", workingHours: "6.5", status: "조퇴", note: "가족 행사" },
    { id: "10", employeeId: "E010", name: "송민지", department: "인사팀", position: "주임", date: "2023-06-01", clockIn: "09:00", clockOut: "18:00", workingHours: "8.0", status: "정상", note: "" },
  ];

  // 출석 상태 목록
  const statuses: AttendanceStatus[] = ["전체", "정상", "지각", "조퇴", "결근", "휴가"];

  // Tabulator 초기화
  useEffect(() => {
    // CSS를 클라이언트 사이드에서만 로드
    try {
      require("tabulator-tables/dist/css/tabulator.min.css");
    } catch (e) {
      console.error('Tabulator CSS 로드 오류:', e);
    }
    
    if (tableRef.current) {
      try {
        // 근무시간 계산 함수
        const calculateWorkingHours = (cell: any) => {
          const row = cell.getRow();
          const clockIn = row.getData().clockIn;
          const clockOut = row.getData().clockOut;
          
          if (clockIn && clockOut) {
            const [inHour, inMin] = clockIn.split(':').map(Number);
            const [outHour, outMin] = clockOut.split(':').map(Number);
            
            const inTime = inHour + inMin / 60;
            const outTime = outHour + outMin / 60;
            const workingHours = (outTime - inTime).toFixed(2);
            
            return workingHours;
          }
          
          return row.getData().workingHours;
        };

        // 테이블 인스턴스 생성 - 타입 에러 방지를 위해 옵션을 any로 설정
        const tableOptions: any = {
          data: dummyData,
          layout: "fitColumns",
          responsiveLayout: "hide",
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
            formatCells: false
          },
          selectable: true, // 셀 선택 가능
          columns: [
            { title: "ID", field: "id", width: 70, headerSort: true },
            { title: "사번", field: "employeeId", width: 80, headerSort: true, editor: "input" },
            { title: "이름", field: "name", width: 100, headerSort: true, editor: "input" },
            { title: "부서", field: "department", width: 100, headerSort: true, editor: "input" },
            { title: "직급", field: "position", width: 80, headerSort: true, editor: "input" },
            { title: "날짜", field: "date", width: 100, headerSort: true, editor: "date" },
            { 
              title: "출근시간", 
              field: "clockIn", 
              width: 100, 
              headerSort: true, 
              editor: "input",
              cellEdited: function(cell) {
                // 출근시간이 변경되면 근무시간 재계산
                const workingHours = calculateWorkingHours(cell);
                cell.getRow().update({ workingHours: workingHours });
              }
            },
            { 
              title: "퇴근시간", 
              field: "clockOut", 
              width: 100, 
              headerSort: true, 
              editor: "input",
              cellEdited: function(cell) {
                // 퇴근시간이 변경되면 근무시간 재계산
                const workingHours = calculateWorkingHours(cell);
                cell.getRow().update({ workingHours: workingHours });
              }
            },
            { title: "근무시간", field: "workingHours", width: 100, headerSort: true },
            { 
              title: "상태", 
              field: "status", 
              width: 100, 
              headerSort: true,
              editor: "select",
              editorParams: {
                values: ["정상", "지각", "조퇴", "결근", "휴가"]
              },
              formatter: function(cell) {
                const value = cell.getValue();
                let className = "";
                
                switch(value) {
                  case "정상":
                    className = "text-green-600";
                    break;
                  case "지각":
                  case "조퇴":
                    className = "text-yellow-600";
                    break;
                  case "결근":
                    className = "text-red-600";
                    break;
                  case "휴가":
                    className = "text-blue-600";
                    break;
                }
                
                cell.getElement().classList.add(className);
                return value;
              }
            },
            { title: "비고", field: "note", width: 150, headerSort: true, editor: "input" }
          ]
        };

        const table = new Tabulator(tableRef.current, tableOptions);
        setTableInstance(table);

        return () => {
          // 메모리 누수 방지를 위한 클린업
          if (table) {
            table.destroy();
          }
        };
      } catch (error) {
        console.error("Tabulator 초기화 중 오류 발생:", error);
      }
    }
  }, []);

  // 데이터 필터링 함수
  const filterData = () => {
    if (!tableInstance) return;

    // 필터 초기화
    tableInstance.clearFilter();

    // 검색어가 있는 경우
    if (searchTerm) {
      tableInstance.setFilter([
        { field: "employeeId", type: "like", value: searchTerm },
        { field: "name", type: "like", value: searchTerm }
      ], "or");
    }

    // 상태 필터링
    if (selectedStatus !== "전체") {
      tableInstance.addFilter("status", "=", selectedStatus);
    }
  };

  // 변경사항 저장 함수
  const saveChanges = () => {
    if (!tableInstance) return;
    
    const data = tableInstance.getData();
    console.log("변경사항이 저장되었습니다:", data);
    alert("변경사항이 저장되었습니다!");
  };

  // CSV로 내보내기 함수
  const exportToCsv = () => {
    if (tableInstance) {
      tableInstance.download("csv", "attendance_records.csv");
    }
  };

  // 통계 계산
  const calculateStats = () => {
    if (!dummyData.length) return { total: 0, normal: 0, late: 0, early: 0, absent: 0, vacation: 0 };

    return {
      total: dummyData.length,
      normal: dummyData.filter(record => record.status === "정상").length,
      late: dummyData.filter(record => record.status === "지각").length,
      early: dummyData.filter(record => record.status === "조퇴").length,
      absent: dummyData.filter(record => record.status === "결근").length,
      vacation: dummyData.filter(record => record.status === "휴가").length
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tabulator 샘플</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gridtest/tabulator">
              <ArrowLeft className="mr-2 h-4 w-4" />
              돌아가기
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCsv}>
            <FileDown className="mr-2 h-4 w-4" />
            CSV 다운로드
          </Button>
        </div>
      </div>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">정상</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">지각</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">조퇴</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.early}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">결근</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm font-medium">휴가</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.vacation}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle>출근 기록 목록</CardTitle>
          <div className="flex flex-wrap justify-between gap-2 mt-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="사번 또는 이름으로 검색..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={filterData}>검색</Button>
            </div>
            <div className="flex items-center space-x-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={saveChanges}>
                <Save className="h-4 w-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={tableRef}
            className="w-full h-[600px]"
          />
        </CardContent>
      </Card>
    </div>
  );
} 