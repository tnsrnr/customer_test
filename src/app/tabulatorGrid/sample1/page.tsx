'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Plus, Trash, Search, CalendarIcon, Filter, Download, RotateCcw } from 'lucide-react';
import TabulatorGrid, { TabulatorGridRef, DataType } from '@/components/common/TabulatorGrid';
import "tabulator-tables/dist/css/tabulator.min.css";
// luxon 임포트 (날짜 정렬 기능에 필요)
import { DateTime } from "luxon";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  email: string;
  phone: string;
  status: string;
}

interface SearchParams {
  id: string;
  name: string;
  department: string;
  position: string;
  salaryRange: string;
  status: string[];
  employmentType: string;
  joinPeriod: string;
  startDate: Date | null;
  endDate: Date | null;
  includeContractor: boolean;
}

// 부서와 직책 데이터 추출 및 중복 제거
const departmentMap = {
  "개발팀": ["개발자", "시니어 개발자", "백엔드 개발자", "프론트엔드 개발자", "모바일 개발자", "UI 개발자", "풀스택 개발자", "팀장", "앱 개발자"],
  "디자인팀": ["디자이너", "UX 디자이너", "UI 디자이너", "그래픽 디자이너", "제품 디자이너", "모션 디자이너", "콘텐츠 디자이너", "웹 디자이너"],
  "인사팀": ["매니저", "HR 매니저", "인사 담당자", "인사 매니저"],
  "마케팅팀": ["마케터", "시니어 마케터", "콘텐츠 마케터", "디지털 마케터"],
  "영업팀": ["영업 담당자", "영업 관리자", "매니저"],
  "재무팀": ["회계사", "재무 분석가"],
  "품질관리팀": ["QA 엔지니어", "테스트 엔지니어"],
  "인프라팀": ["DevOps 엔지니어", "네트워크 엔지니어", "시스템 관리자", "보안 전문가", "IT 지원"],
  "데이터팀": ["데이터 분석가", "데이터 사이언티스트", "데이터 엔지니어"],
  "기획팀": ["비즈니스 애널리스트", "전략 기획자", "프로젝트 매니저"],
  "고객지원팀": ["고객 지원"]
};

export default function TabulatorSpreadsheetExample() {
  const gridRef = useRef<TabulatorGridRef>(null);
  const [nextId, setNextId] = useState(300); // 새 행의 ID 시작값
  
  // 검색 조건 상태 관리
  const [searchParams, setSearchParams] = useState<SearchParams>({
    id: "",
    name: "",
    department: "",
    position: "",
    salaryRange: "",
    status: [],
    employmentType: "",
    joinPeriod: "",
    startDate: null,
    endDate: null,
    includeContractor: false
  });
  
  // 부서에 따른 직책 옵션
  const [positionOptions, setPositionOptions] = useState<string[]>([]);
  
  // 부서 변경 시 직책 옵션 업데이트
  useEffect(() => {
    if (searchParams.department && searchParams.department !== 'all') {
      setPositionOptions(departmentMap[searchParams.department as keyof typeof departmentMap] || []);
    } else {
      // 모든 직책 옵션 통합
      const allPositions = Object.values(departmentMap).flat();
      // 중복 제거 후 정렬
      const uniquePositions = Array.from(new Set(allPositions)).sort();
      setPositionOptions(uniquePositions);
    }
  }, [searchParams.department]);
  
  // 검색 조건 변경 핸들러
  const handleParamChange = (key: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 체크박스 핸들러
  const handleCheckboxChange = (checked: boolean, value: string) => {
    if (checked) {
      setSearchParams(prev => ({
        ...prev,
        status: [...prev.status, value]
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        status: prev.status.filter(item => item !== value)
      }));
    }
  };
  
  // 샘플 데이터
  const data: Employee[] = [
    { id: 1, name: "김철수", position: "개발자", department: "개발팀", salary: 5000000, startDate: "2020-03-15", email: "kim@example.com", phone: "010-1234-5678", status: "정규직" },
    { id: 2, name: "이영희", position: "디자이너", department: "디자인팀", salary: 4800000, startDate: "2021-05-20", email: "lee@example.com", phone: "010-2345-6789", status: "정규직" },
    { id: 3, name: "박준호", position: "매니저", department: "인사팀", salary: 6200000, startDate: "2018-11-10", email: "park@example.com", phone: "010-3456-7890", status: "정규직" },
    { id: 4, name: "정미영", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2019-07-22", email: "jung@example.com", phone: "010-4567-8901", status: "정규직" },
    { id: 5, name: "강동원", position: "마케터", department: "마케팅팀", salary: 4200000, startDate: "2022-01-15", email: "kang@example.com", phone: "010-5678-9012", status: "계약직" },
    { id: 6, name: "송지원", position: "UX 디자이너", department: "디자인팀", salary: 4600000, startDate: "2021-09-05", email: "song@example.com", phone: "010-6789-0123", status: "정규직" },
    { id: 7, name: "조민준", position: "백엔드 개발자", department: "개발팀", salary: 5100000, startDate: "2020-06-12", email: "cho@example.com", phone: "010-7890-1234", status: "정규직" },
    { id: 8, name: "윤서연", position: "프론트엔드 개발자", department: "개발팀", salary: 4900000, startDate: "2020-08-20", email: "yoon@example.com", phone: "010-8901-2345", status: "정규직" },
    { id: 9, name: "임지현", position: "HR 매니저", department: "인사팀", salary: 5800000, startDate: "2019-03-25", email: "lim@example.com", phone: "010-9012-3456", status: "정규직" },
    { id: 10, name: "한상우", position: "데이터 분석가", department: "데이터팀", salary: 5300000, startDate: "2020-11-08", email: "han@example.com", phone: "010-0123-4567", status: "정규직" },
    { id: 11, name: "오승현", position: "팀장", department: "개발팀", salary: 6500000, startDate: "2018-05-14", email: "oh@example.com", phone: "010-1122-3344", status: "정규직" },
    { id: 12, name: "신지은", position: "그래픽 디자이너", department: "디자인팀", salary: 4700000, startDate: "2021-07-30", email: "shin@example.com", phone: "010-2233-4455", status: "정규직" },
    { id: 13, name: "권도윤", position: "모바일 개발자", department: "개발팀", salary: 5200000, startDate: "2020-02-17", email: "kwon@example.com", phone: "010-3344-5566", status: "정규직" },
    { id: 14, name: "홍지영", position: "콘텐츠 마케터", department: "마케팅팀", salary: 4400000, startDate: "2022-03-10", email: "hong@example.com", phone: "010-4455-6677", status: "계약직" },
    { id: 15, name: "유승민", position: "QA 엔지니어", department: "품질관리팀", salary: 4800000, startDate: "2021-01-20", email: "yoo@example.com", phone: "010-5566-7788", status: "정규직" },
    { id: 16, name: "배은지", position: "UI 디자이너", department: "디자인팀", salary: 4500000, startDate: "2021-11-15", email: "bae@example.com", phone: "010-6677-8899", status: "정규직" },
    { id: 17, name: "황민석", position: "DevOps 엔지니어", department: "인프라팀", salary: 5600000, startDate: "2019-09-22", email: "hwang@example.com", phone: "010-7788-9900", status: "정규직" },
    { id: 18, name: "전유진", position: "영업 담당자", department: "영업팀", salary: 4300000, startDate: "2022-02-01", email: "jeon@example.com", phone: "010-8899-0011", status: "정규직" },
    { id: 19, name: "남궁혜원", position: "회계사", department: "재무팀", salary: 5400000, startDate: "2019-12-05", email: "nam@example.com", phone: "010-9900-1122", status: "정규직" },
    { id: 20, name: "서동현", position: "비즈니스 애널리스트", department: "기획팀", salary: 5100000, startDate: "2020-07-14", email: "seo@example.com", phone: "010-0011-2233", status: "정규직" },
    { id: 21, name: "안지훈", position: "풀스택 개발자", department: "개발팀", salary: 5300000, startDate: "2020-04-18", email: "ahn@example.com", phone: "010-1234-5679", status: "정규직" },
    { id: 22, name: "문세진", position: "제품 디자이너", department: "디자인팀", salary: 4700000, startDate: "2021-06-22", email: "moon@example.com", phone: "010-2345-6780", status: "정규직" },
    { id: 23, name: "고유나", position: "인사 담당자", department: "인사팀", salary: 4500000, startDate: "2021-10-11", email: "ko@example.com", phone: "010-3456-7891", status: "정규직" },
    { id: 24, name: "장하준", position: "시니어 마케터", department: "마케팅팀", salary: 5700000, startDate: "2019-05-08", email: "jang@example.com", phone: "010-4567-8902", status: "정규직" },
    { id: 25, name: "최다인", position: "데이터 사이언티스트", department: "데이터팀", salary: 5800000, startDate: "2019-08-15", email: "choi@example.com", phone: "010-5678-9013", status: "정규직" },
    { id: 26, name: "백승호", position: "네트워크 엔지니어", department: "인프라팀", salary: 5200000, startDate: "2020-09-07", email: "baek@example.com", phone: "010-6789-0124", status: "정규직" },
    { id: 27, name: "변미나", position: "전략 기획자", department: "기획팀", salary: 5400000, startDate: "2019-11-20", email: "byun@example.com", phone: "010-7890-1235", status: "정규직" },
    { id: 28, name: "노태우", position: "앱 개발자", department: "개발팀", salary: 5000000, startDate: "2020-10-15", email: "noh@example.com", phone: "010-8901-2346", status: "정규직" },
    { id: 29, name: "진서윤", position: "콘텐츠 디자이너", department: "디자인팀", salary: 4600000, startDate: "2021-04-12", email: "jin@example.com", phone: "010-9012-3457", status: "계약직" },
    { id: 30, name: "옥준서", position: "고객 지원", department: "고객지원팀", salary: 4200000, startDate: "2022-01-10", email: "ok@example.com", phone: "010-0123-4568", status: "정규직" },
    { id: 31, name: "배주혁", position: "개발자", department: "개발팀", salary: 4900000, startDate: "2020-12-01", email: "bae.j@example.com", phone: "010-1122-3345", status: "정규직" },
    { id: 32, name: "염지희", position: "UX 리서처", department: "디자인팀", salary: 4800000, startDate: "2021-03-15", email: "youm@example.com", phone: "010-2233-4456", status: "정규직" },
    { id: 33, name: "채원석", position: "시스템 관리자", department: "인프라팀", salary: 5100000, startDate: "2020-05-25", email: "chae@example.com", phone: "010-3344-5567", status: "정규직" },
    { id: 34, name: "탁명훈", position: "디지털 마케터", department: "마케팅팀", salary: 4700000, startDate: "2021-02-08", email: "tak@example.com", phone: "010-4455-6678", status: "계약직" },
    { id: 35, name: "허지윤", position: "웹 디자이너", department: "디자인팀", salary: 4500000, startDate: "2021-08-20", email: "heo@example.com", phone: "010-5566-7789", status: "정규직" },
    { id: 36, name: "노승준", position: "보안 전문가", department: "인프라팀", salary: 5900000, startDate: "2019-04-10", email: "roh@example.com", phone: "010-6677-8890", status: "정규직" },
    { id: 37, name: "하지민", position: "영업 관리자", department: "영업팀", salary: 5500000, startDate: "2019-10-15", email: "ha@example.com", phone: "010-7788-9901", status: "정규직" },
    { id: 38, name: "남궁준", position: "재무 분석가", department: "재무팀", salary: 5300000, startDate: "2020-01-20", email: "namk@example.com", phone: "010-8899-0012", status: "정규직" },
    { id: 39, name: "금지원", position: "인사 매니저", department: "인사팀", salary: 5600000, startDate: "2019-06-05", email: "keum@example.com", phone: "010-9900-1123", status: "정규직" },
    { id: 40, name: "방성훈", position: "테스트 엔지니어", department: "품질관리팀", salary: 4800000, startDate: "2021-01-05", email: "bang@example.com", phone: "010-0011-2234", status: "정규직" },
    { id: 41, name: "공서연", position: "UI 개발자", department: "개발팀", salary: 5100000, startDate: "2020-08-12", email: "kong@example.com", phone: "010-1234-5680", status: "정규직" },
    { id: 42, name: "석민재", position: "모션 디자이너", department: "디자인팀", salary: 4900000, startDate: "2020-11-22", email: "seok@example.com", phone: "010-2345-6781", status: "정규직" },
    { id: 43, name: "피현우", position: "IT 지원", department: "인프라팀", salary: 4400000, startDate: "2022-02-15", email: "pi@example.com", phone: "010-3456-7892", status: "계약직" },
    { id: 44, name: "엄현주", position: "프로젝트 매니저", department: "기획팀", salary: 5800000, startDate: "2019-07-10", email: "uhm@example.com", phone: "010-4567-8903", status: "정규직" },
    { id: 45, name: "복지훈", position: "데이터 엔지니어", department: "데이터팀", salary: 5500000, startDate: "2019-09-15", email: "bok@example.com", phone: "010-5678-9014", status: "정규직" },
    { id: 101, name: "김철수(B)", position: "개발자", department: "개발팀", salary: 5100000, startDate: "2021-03-15", email: "kimB@example.com", phone: "010-1234-6678", status: "정규직" },
    { id: 102, name: "이영희(B)", position: "디자이너", department: "디자인팀", salary: 4900000, startDate: "2022-05-20", email: "leeB@example.com", phone: "010-2345-7789", status: "정규직" },
    { id: 103, name: "박준호(B)", position: "매니저", department: "영업팀", salary: 6000000, startDate: "2019-02-10", email: "parkB@example.com", phone: "010-3456-8890", status: "정규직" },
    { id: 201, name: "김철수(C)", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2022-03-15", email: "kimC@example.com", phone: "010-1234-7678", status: "정규직" },
    { id: 202, name: "이영희(C)", position: "UX 디자이너", department: "디자인팀", salary: 5100000, startDate: "2023-05-20", email: "leeC@example.com", phone: "010-2345-8789", status: "정규직" }
  ];

  // 컬럼 정의 - 모든 필터 속성은 Tabulator에서 지원하는 [key: string]: any; 타입으로 처리됨
  const columns = [
    {  
      title: "", 
      field: "selected", 
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      headerSort: false,
      resizable: false,
      frozen: true,
      headerHozAlign: "center",
      hozAlign: "center",
      width: 30
    },
    { 
      title: "ID", 
      field: "id", 
      sorter: "number", 
      width: 60
    },
    { 
      title: "이름", 
      field: "name", 
      sorter: "string"
    },
    { 
      title: "직책", 
      field: "position", 
      sorter: "string"
    },
    { 
      title: "부서", 
      field: "department", 
      sorter: "string"
    },
    { 
      title: "급여", 
      field: "salary", 
      sorter: "number",
      formatter: "money",
      formatterParams: {
        thousand: ",",
        symbol: "₩",
        precision: 0
      }
    },
    { 
      title: "입사일", 
      field: "startDate", 
      sorter: function(a: any, b: any) {
        try {
          return DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis();
        } catch (e) {
          return 0; // 날짜 파싱 오류 시 순서 유지
        }
      }, 
      formatter: "datetime", 
      formatterParams: {
        inputFormat: "yyyy-MM-dd",
        outputFormat: "yyyy년 MM월 dd일",
        invalidPlaceholder: "(유효하지 않은 날짜)"
      }
    },
    { 
      title: "이메일", 
      field: "email", 
      sorter: "string"
    },
    { 
      title: "전화번호", 
      field: "phone", 
      sorter: "string"
    },
    { 
      title: "상태", 
      field: "status", 
      sorter: "string",
      formatter: function(cell: any) {
        const value = cell.getValue();
        let color = "";
        
        if (value === "정규직") {
          color = "bg-green-100 text-green-800";
        } else if (value === "계약직") {
          color = "bg-yellow-100 text-yellow-800";
        } else if (value === "수습") {
          color = "bg-blue-100 text-blue-800";
        }
        
        return `<span class="py-1 px-2 rounded-full text-xs font-medium ${color}">${value}</span>`;
      }
    }
  ] as any; // ColumnDefinitionType[] 타입 충돌 해결을 위한 캐스팅

  // 행 추가 함수
  const handleAddRow = () => {
    if (gridRef.current) {
      const table = gridRef.current.getTable();
      if (table) {
        const newRow: Employee = {
          id: nextId,
          name: "",
          position: "",
          department: "",
          salary: 0,
          startDate: new Date().toISOString().slice(0, 10),
          email: "",
          phone: "",
          status: "정규직"
        };
        
        table.addRow(newRow);
        setNextId(nextId + 1);
      }
    }
  };

  // 행 삭제 함수
  const handleDeleteRow = () => {
    if (gridRef.current) {
      const table = gridRef.current.getTable();
      if (table) {
        const selectedRows = table.getSelectedRows();
        
        if (selectedRows && selectedRows.length > 0) {
          selectedRows.forEach(row => row.delete());
          alert(`${selectedRows.length}개 행이 삭제되었습니다.`);
        } else {
          alert("삭제할 행을 선택해주세요.");
        }
      }
    }
  };

  // 데이터 저장 함수
  const handleSave = () => {
    if (gridRef.current) {
      const table = gridRef.current.getTable();
      if (table) {
        const allData = table.getData();
        console.log("저장된 데이터:", allData);
        alert("데이터가 저장되었습니다. (콘솔에서 확인 가능)");
        
        // 실제 구현에서는 여기서 API 호출하여 서버에 데이터 저장
      }
    }
  };

  // 데이터 조회 함수 - 검색 조건 적용
  const handleSearch = () => {
    if (gridRef.current) {
      const table = gridRef.current.getTable();
      if (table) {
        table.clearFilter(true);
        
        // 검색 조건에 따라 필터 적용
        const filters: any[] = [];
        
        if (searchParams.id) {
          filters.push({field: "id", type: "=", value: parseInt(searchParams.id)});
        }
        
        if (searchParams.name) {
          filters.push({field: "name", type: "like", value: searchParams.name});
        }
        
        if (searchParams.department && searchParams.department !== 'all') {
          filters.push({field: "department", type: "=", value: searchParams.department});
        }
        
        if (searchParams.position && searchParams.position !== 'all') {
          filters.push({field: "position", type: "=", value: searchParams.position});
        }
        
        if (searchParams.salaryRange && searchParams.salaryRange !== 'all') {
          const [min, max] = searchParams.salaryRange.split('-').map(n => parseInt(n.trim()));
          if (min) filters.push({field: "salary", type: ">=", value: min});
          if (max) filters.push({field: "salary", type: "<=", value: max});
        }
        
        if (searchParams.status.length > 0) {
          filters.push({field: "status", type: "in", value: searchParams.status});
        }
        
        if (searchParams.employmentType && searchParams.employmentType !== 'all') {
          filters.push({field: "status", type: "=", value: searchParams.employmentType});
        }
        
        // 날짜 범위 필터
        if (searchParams.startDate && searchParams.endDate) {
          const startDateStr = searchParams.startDate.toISOString().split('T')[0];
          const endDateStr = searchParams.endDate.toISOString().split('T')[0];
          
          // startDate 필드를 기준으로 >= 과 <= 필터를 별도로 적용
          filters.push({field: "startDate", type: ">=", value: startDateStr});
          filters.push({field: "startDate", type: "<=", value: endDateStr});
        }
        
        // 계약직 포함 옵션
        if (!searchParams.includeContractor) {
          filters.push({field: "status", type: "!=", value: "계약직"});
        }
        
        if (filters.length > 0) {
          table.setFilter(filters);
        }
        
        alert("검색 조건이 적용되었습니다.");
      }
    }
  };
  
  // 필터 초기화
  const handleResetFilters = () => {
    setSearchParams({
      id: "",
      name: "",
      department: "",
      position: "",
      salaryRange: "",
      status: [],
      employmentType: "",
      joinPeriod: "",
      startDate: null,
      endDate: null,
      includeContractor: false
    });
    
    if (gridRef.current?.getTable()) {
      gridRef.current.getTable()!.clearFilter(true);
      alert("검색 조건이 초기화되었습니다.");
    }
  };

  // 데이터 엑셀 내보내기
  const handleExport = () => {
    if (gridRef.current?.getTable()) {
      gridRef.current.getTable()!.download("xlsx", "직원목록.xlsx");
    }
  };

  // Tabulator 추가 옵션
  const additionalOptions = {
    movableColumns: true,
    layout: "fitColumns",
    renderVertical: "basic",
    placeholder: "데이터가 없습니다.",
    placeholderBackground: "white",
    dataLoaderLoading: "데이터 로딩중...",
    dataLoaderError: "데이터 로드 실패",
    width: "100%",
    pagination: true,
    paginationSize: 10,
    paginationInitialPage: 1,
    resizableColumns: true,
    responsiveLayout: "hide"
  };

  // 커스텀 데이터피커 스타일
  const CustomDatePickerInput = React.forwardRef<HTMLDivElement, { value?: string; onClick?: () => void }>(({ value, onClick }, ref) => (
    <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring cursor-pointer" onClick={onClick} ref={ref}>
      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
      {value || "날짜 선택"}
    </div>
  ));
  CustomDatePickerInput.displayName = "CustomDatePickerInput";
  
  // 급여 범위 옵션
  const salaryRanges = [
    { label: "전체", value: "all" },
    { label: "300만원 이하", value: "0-3000000" },
    { label: "300만원-400만원", value: "3000000-4000000" },
    { label: "400만원-500만원", value: "4000000-5000000" },
    { label: "500만원-600만원", value: "5000000-6000000" },
    { label: "600만원 이상", value: "6000000-100000000" }
  ];

  return (
    <div className="container-fluid w-full px-4 py-6">
      <Card className="mb-4 shadow-sm border-0 rounded-lg overflow-hidden">
        <CardContent className="p-4">
          {/* 검색 조건 Form - 디자인 일관성 유지하면서 한 줄에 2개씩 총 6개 검색 조건 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
            {/* 첫 번째 행 - ID(텍스트 입력) + 부서&직책 그룹 */}
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">ID</label>
              <Input 
                value={searchParams.id}
                onChange={(e) => handleParamChange("id", e.target.value)}
                placeholder="ID 입력"
                className="flex-1"
                type="number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="w-20 font-medium text-sm text-gray-700">부서</label>
                <Select value={searchParams.department} onValueChange={(value) => handleParamChange("department", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="부서 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {Object.keys(departmentMap).map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-20 font-medium text-sm text-gray-700">직책</label>
                <Select value={searchParams.position} onValueChange={(value) => handleParamChange("position", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="직책 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {positionOptions.map((position) => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 두 번째 행 - 이름(Like 검색) + 급여 범위(콤보박스) */}
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">이름</label>
              <Input 
                value={searchParams.name}
                onChange={(e) => handleParamChange("name", e.target.value)}
                placeholder="이름 검색"
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">급여 범위</label>
              <Select value={searchParams.salaryRange} onValueChange={(value) => handleParamChange("salaryRange", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="급여 범위 선택" />
                </SelectTrigger>
                <SelectContent>
                  {salaryRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* 세 번째 행 - 직원 상태(체크박스) + 입사일 기간(날짜 범위) */}
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">직원 상태</label>
              <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="status-regular" 
                    checked={searchParams.status.includes('정규직')}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, '정규직')
                    }
                  />
                  <Label htmlFor="status-regular" className="text-sm">정규직</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="status-contract" 
                    checked={searchParams.status.includes('계약직')}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, '계약직')
                    }
                  />
                  <Label htmlFor="status-contract" className="text-sm">계약직</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="status-intern" 
                    checked={searchParams.status.includes('수습')}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange(checked as boolean, '수습')
                    }
                  />
                  <Label htmlFor="status-intern" className="text-sm">수습</Label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 font-medium text-sm text-gray-700">입사일</label>
              <div className="flex-1 flex gap-2 items-center">
                <DatePicker
                  selected={searchParams.startDate}
                  onChange={(date) => handleParamChange("startDate", date)}
                  selectsStart
                  startDate={searchParams.startDate}
                  endDate={searchParams.endDate}
                  locale={ko}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="시작일"
                  customInput={<CustomDatePickerInput />}
                  className="flex-1"
                />
                <span className="text-sm">~</span>
                <DatePicker
                  selected={searchParams.endDate}
                  onChange={(date) => handleParamChange("endDate", date)}
                  selectsEnd
                  startDate={searchParams.startDate}
                  endDate={searchParams.endDate}
                  minDate={searchParams.startDate || undefined}
                  locale={ko}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="종료일"
                  customInput={<CustomDatePickerInput />}
                  className="flex-1"
                />
              </div>
            </div>
            
            {/* 네 번째 행 - 고용 형태(라디오 버튼) */}
            <div className="flex items-center gap-2 col-span-2">
              <label className="w-20 font-medium text-sm text-gray-700">고용 형태</label>
              <RadioGroup 
                value={searchParams.employmentType} 
                onValueChange={(value) => handleParamChange("employmentType", value)}
                className="flex space-x-4 flex-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="employment-all" />
                  <Label htmlFor="employment-all" className="text-sm">전체</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="정규직" id="employment-regular" />
                  <Label htmlFor="employment-regular" className="text-sm">정규직</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="계약직" id="employment-contract" />
                  <Label htmlFor="employment-contract" className="text-sm">계약직</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* 검색 버튼 그룹 */}
          <div className="flex justify-end gap-2 mb-1">
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              <RotateCcw className="h-4 w-4 mr-1" />
              초기화
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              엑셀 다운로드
            </Button>
            <Button variant="default" size="sm" onClick={handleSearch}>
              <Search className="h-4 w-4 mr-1" />
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-3 shadow-sm border-0 rounded-lg overflow-hidden w-full">
        <CardContent className="p-0">
          <TabulatorGrid
            ref={gridRef}
            data={data}
            columns={columns}
            height="450px"
            selectable={true}
            enableCellSelection={true}
            enableClipboard={true}
            className="bg-white w-full"
            additionalOptions={additionalOptions}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end items-center mt-2">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleAddRow}>
            <Plus className="h-4 w-4 mr-1" />
            행 추가
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeleteRow}>
            <Trash className="h-4 w-4 mr-1" />
            행 삭제
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            저장
          </Button>
        </div>
      </div>
    </div>
  );
} 