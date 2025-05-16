'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TabulatorGrid, { TabulatorGridRef, DataType } from '@/components/common/TabulatorGrid';
import "tabulator-tables/dist/css/tabulator.min.css";
// luxon 임포트 (날짜 정렬 기능에 필요)
import { DateTime } from "luxon";

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

export default function TabulatorSpreadsheetExample() {
  const gridRef = useRef<TabulatorGridRef>(null);
  // 현재 적용된 필터 상태
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  
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
      sorter: "string", 
      headerFilter: true,
      headerFilterPlaceholder: "이름 검색",
      headerFilterLiveFilter: true
    },
    { 
      title: "직책", 
      field: "position", 
      sorter: "string", 
      headerFilter: true,
      headerFilterPlaceholder: "직책 검색"
    },
    { 
      title: "부서", 
      field: "department", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "부서"
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
      },
      headerFilter: "number" as any,
      headerFilterPlaceholder: "최소 금액",
      headerFilterFunc: ">="
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
      },
      headerFilter: true,
      headerFilterPlaceholder: "날짜 검색"
    },
    { 
      title: "이메일", 
      field: "email", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "이메일 검색" 
    },
    { 
      title: "전화번호", 
      field: "phone", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "전화번호 검색"
    },
    { 
      title: "상태", 
      field: "status", 
      sorter: "string",
      headerFilter: true,
      headerFilterPlaceholder: "상태",
      headerFilterParams: {
        values: { "정규직": "정규직", "계약직": "계약직", "수습": "수습" },
        clearable: true
      },
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
    resizableColumns: true,
    responsiveLayout: "hide",
    // 필터 이벤트 핸들러
    dataFiltered: function(filters: any) {
      setHasActiveFilters(filters.length > 0);
    }
  };

  return (
    <div className="container-fluid w-full px-4 py-6">
      <Card className="mb-6 shadow-sm border-0 rounded-lg overflow-hidden w-full">
        <CardContent className="p-0">
          <TabulatorGrid
            ref={gridRef}
            data={data}
            columns={columns}
            height="calc(100vh - 200px)"
            minHeight="450px"
            selectable={true}
            selectableRollingSelection={false}
            enableCellSelection={true}
            enableClipboard={true}
            className="bg-white w-full"
            additionalOptions={additionalOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
} 