'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TabulatorGrid, { TabulatorGridRef } from '@/components/common/TabulatorGrid';

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
  
  // 샘플 데이터
  const data: Employee[] = [
    // 기본 데이터 (세트 A) - 15개
    { id: 1, name: "김철수", position: "개발자", department: "개발팀", salary: 5000000, startDate: "2020-03-15", email: "kim@example.com", phone: "010-1234-5678", status: "정규직" },
    { id: 2, name: "이영희", position: "디자이너", department: "디자인팀", salary: 4800000, startDate: "2021-05-20", email: "lee@example.com", phone: "010-2345-6789", status: "정규직" },
    { id: 3, name: "박준호", position: "매니저", department: "인사팀", salary: 6200000, startDate: "2018-11-10", email: "park@example.com", phone: "010-3456-7890", status: "정규직" },
    { id: 4, name: "정미영", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2019-07-22", email: "jung@example.com", phone: "010-4567-8901", status: "정규직" },
    { id: 5, name: "강동원", position: "마케터", department: "마케팅팀", salary: 4200000, startDate: "2022-01-15", email: "kang@example.com", phone: "010-5678-9012", status: "계약직" },
    { id: 6, name: "한지민", position: "회계사", department: "재무팀", salary: 5900000, startDate: "2017-09-05", email: "han@example.com", phone: "010-6789-0123", status: "정규직" },
    { id: 7, name: "오세진", position: "주니어 개발자", department: "개발팀", salary: 3800000, startDate: "2022-06-10", email: "oh@example.com", phone: "010-7890-1234", status: "인턴" },
    { id: 8, name: "홍길동", position: "팀장", department: "경영진", salary: 8000000, startDate: "2015-04-01", email: "hong@example.com", phone: "010-8901-2345", status: "정규직" },
    { id: 9, name: "나은혜", position: "인사담당자", department: "인사팀", salary: 4500000, startDate: "2020-10-15", email: "na@example.com", phone: "010-9012-3456", status: "정규직" },
    { id: 10, name: "임지현", position: "프론트엔드 개발자", department: "개발팀", salary: 5100000, startDate: "2019-11-20", email: "lim@example.com", phone: "010-0123-4567", status: "정규직" },
    { id: 11, name: "최상철", position: "백엔드 개발자", department: "개발팀", salary: 5200000, startDate: "2019-08-15", email: "choi@example.com", phone: "010-1111-2222", status: "정규직" },
    { id: 12, name: "우현우", position: "데이터 분석가", department: "마케팅팀", salary: 5300000, startDate: "2020-02-10", email: "woo@example.com", phone: "010-2222-3333", status: "정규직" },
    { id: 13, name: "송지은", position: "그래픽 디자이너", department: "디자인팀", salary: 4700000, startDate: "2021-03-22", email: "song@example.com", phone: "010-3333-4444", status: "정규직" },
    { id: 14, name: "유재석", position: "영업 담당자", department: "영업팀", salary: 5400000, startDate: "2019-05-05", email: "yoo@example.com", phone: "010-4444-5555", status: "정규직" },
    { id: 15, name: "조현우", position: "QA 엔지니어", department: "개발팀", salary: 4800000, startDate: "2020-11-11", email: "cho@example.com", phone: "010-5555-6666", status: "정규직" },
    
    // 두 번째 세트 (세트 B) - 15개
    { id: 101, name: "김철수(B)", position: "개발자", department: "개발팀", salary: 5100000, startDate: "2021-03-15", email: "kimB@example.com", phone: "010-1234-6678", status: "정규직" },
    { id: 102, name: "이영희(B)", position: "디자이너", department: "디자인팀", salary: 4900000, startDate: "2022-05-20", email: "leeB@example.com", phone: "010-2345-7789", status: "정규직" },
    { id: 103, name: "박준호(B)", position: "매니저", department: "인사팀", salary: 6300000, startDate: "2019-11-10", email: "parkB@example.com", phone: "010-3456-8890", status: "정규직" },
    { id: 104, name: "정미영(B)", position: "시니어 개발자", department: "개발팀", salary: 5600000, startDate: "2020-07-22", email: "jungB@example.com", phone: "010-4567-9901", status: "정규직" },
    { id: 105, name: "강동원(B)", position: "마케터", department: "마케팅팀", salary: 4300000, startDate: "2023-01-15", email: "kangB@example.com", phone: "010-5678-0012", status: "계약직" },
    { id: 106, name: "한지민(B)", position: "회계사", department: "재무팀", salary: 6000000, startDate: "2018-09-05", email: "hanB@example.com", phone: "010-6789-1123", status: "정규직" },
    { id: 107, name: "오세진(B)", position: "주니어 개발자", department: "개발팀", salary: 3900000, startDate: "2023-06-10", email: "ohB@example.com", phone: "010-7890-2234", status: "인턴" },
    { id: 108, name: "홍길동(B)", position: "팀장", department: "경영진", salary: 8100000, startDate: "2016-04-01", email: "hongB@example.com", phone: "010-8901-3345", status: "정규직" },
    { id: 109, name: "나은혜(B)", position: "인사담당자", department: "인사팀", salary: 4600000, startDate: "2021-10-15", email: "naB@example.com", phone: "010-9012-4456", status: "정규직" },
    { id: 110, name: "임지현(B)", position: "프론트엔드 개발자", department: "개발팀", salary: 5200000, startDate: "2020-11-20", email: "limB@example.com", phone: "010-0123-5567", status: "정규직" },
    { id: 111, name: "최상철(B)", position: "백엔드 개발자", department: "개발팀", salary: 5300000, startDate: "2020-08-15", email: "choiB@example.com", phone: "010-1111-3222", status: "정규직" },
    { id: 112, name: "우현우(B)", position: "데이터 분석가", department: "마케팅팀", salary: 5400000, startDate: "2021-02-10", email: "wooB@example.com", phone: "010-2222-4333", status: "정규직" },
    { id: 113, name: "송지은(B)", position: "그래픽 디자이너", department: "디자인팀", salary: 4800000, startDate: "2022-03-22", email: "songB@example.com", phone: "010-3333-5444", status: "정규직" },
    { id: 114, name: "유재석(B)", position: "영업 담당자", department: "영업팀", salary: 5500000, startDate: "2020-05-05", email: "yooB@example.com", phone: "010-4444-6555", status: "정규직" },
    { id: 115, name: "조현우(B)", position: "QA 엔지니어", department: "개발팀", salary: 4900000, startDate: "2021-11-11", email: "choB@example.com", phone: "010-5555-7666", status: "정규직" },
    
    // 세 번째 세트 (세트 C) - 15개
    { id: 201, name: "김철수(C)", position: "시니어 개발자", department: "개발팀", salary: 5500000, startDate: "2022-03-15", email: "kimC@example.com", phone: "010-1234-7678", status: "정규직" },
    { id: 202, name: "이영희(C)", position: "UX 디자이너", department: "디자인팀", salary: 5100000, startDate: "2023-05-20", email: "leeC@example.com", phone: "010-2345-8789", status: "정규직" },
    { id: 203, name: "박준호(C)", position: "인사팀장", department: "인사팀", salary: 6800000, startDate: "2020-11-10", email: "parkC@example.com", phone: "010-3456-9890", status: "정규직" },
    { id: 204, name: "정미영(C)", position: "아키텍트", department: "개발팀", salary: 6200000, startDate: "2021-07-22", email: "jungC@example.com", phone: "010-4567-0901", status: "정규직" },
    { id: 205, name: "강동원(C)", position: "콘텐츠 제작자", department: "마케팅팀", salary: 4800000, startDate: "2024-01-15", email: "kangC@example.com", phone: "010-5678-1012", status: "계약직" },
    { id: 206, name: "한지민(C)", position: "재무팀장", department: "재무팀", salary: 6500000, startDate: "2019-09-05", email: "hanC@example.com", phone: "010-6789-2123", status: "정규직" },
    { id: 207, name: "오세진(C)", position: "프론트엔드 개발자", department: "개발팀", salary: 4500000, startDate: "2024-06-10", email: "ohC@example.com", phone: "010-7890-3234", status: "인턴" },
    { id: 208, name: "홍길동(C)", position: "이사", department: "경영진", salary: 8800000, startDate: "2017-04-01", email: "hongC@example.com", phone: "010-8901-4345", status: "정규직" },
    { id: 209, name: "나은혜(C)", position: "인사담당자", department: "인사팀", salary: 4900000, startDate: "2022-10-15", email: "naC@example.com", phone: "010-9012-5456", status: "정규직" },
    { id: 210, name: "임지현(C)", position: "리액트 개발자", department: "개발팀", salary: 5400000, startDate: "2021-11-20", email: "limC@example.com", phone: "010-0123-6567", status: "정규직" },
    { id: 211, name: "최상철(C)", position: "자바 개발자", department: "개발팀", salary: 5600000, startDate: "2021-08-15", email: "choiC@example.com", phone: "010-1111-4222", status: "정규직" },
    { id: 212, name: "우현우(C)", position: "AI 엔지니어", department: "개발팀", salary: 5900000, startDate: "2022-02-10", email: "wooC@example.com", phone: "010-2222-5333", status: "정규직" },
    { id: 213, name: "송지은(C)", position: "UI 디자이너", department: "디자인팀", salary: 5200000, startDate: "2023-03-22", email: "songC@example.com", phone: "010-3333-6444", status: "정규직" },
    { id: 214, name: "유재석(C)", position: "영업 관리자", department: "영업팀", salary: 6200000, startDate: "2021-05-05", email: "yooC@example.com", phone: "010-4444-7555", status: "정규직" },
    { id: 215, name: "조현우(C)", position: "테스트 리드", department: "개발팀", salary: 5500000, startDate: "2022-11-11", email: "choC@example.com", phone: "010-5555-8666", status: "정규직" },
  ];

  // 컬럼 정의
  const columns = [
    { title: "ID", field: "id", sorter: "number", width: 60 },
    { title: "이름", field: "name", sorter: "string" },
    { title: "직책", field: "position", sorter: "string" },
    { title: "부서", field: "department", sorter: "string" },
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
    { title: "입사일", field: "startDate", sorter: "date" },
    { title: "이메일", field: "email", sorter: "string" },
    { title: "전화번호", field: "phone", sorter: "string" },
    { title: "상태", field: "status", sorter: "string" }
  ];
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/gridtest/tabulator2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">스프레드시트 기능 예제</h1>
          <p className="text-gray-500 mt-1">셀 선택 및 복사 기능이 가능한 Tabulator 구현</p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex gap-2">
            <Button 
              onClick={() => gridRef.current?.copySelection()} 
              size="sm" 
              className="flex items-center"
            >
              선택 영역 복사
            </Button>
            <Button 
              onClick={() => gridRef.current?.clearSelection()} 
              size="sm" 
              variant="outline"
            >
              선택 초기화
            </Button>
          </div>
          
          <div className="border rounded">
            <TabulatorGrid
              ref={gridRef}
              data={data}
              columns={columns}
              height="500px"
              layout="fitColumns"
              pagination={true}
              paginationSize={20}
              paginationSizeSelector={[5, 10, 20, 50, 100]}
              selectable={true}
              selectableRange={true}
              selectableRangeColumns={true}
              selectableRangeRows={true}
              selectableRangeClearCells={true}
              enableClipboard={true}
              clipboardCopyStyled={false}
              editable={true}
              additionalOptions={{
                clipboardCopyConfig: {
                  rowHeaders: false,
                  columnHeaders: false,
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-muted p-4 rounded-md">
        <h3 className="text-lg font-medium mb-2">사용 방법</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>셀 영역 선택: 마우스로 드래그하여 선택합니다.</li>
          <li>데이터 복사: 선택 후 Ctrl+C 또는 '선택 영역 복사' 버튼을 클릭합니다.</li>
          <li>셀 편집: 해당 셀을 더블 클릭하여 편집 모드를 시작합니다.</li>
          <li>행/열 정렬: 열 헤더를 클릭하여 정렬할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
} 